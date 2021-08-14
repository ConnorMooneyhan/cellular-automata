// Const Variables
const grid = document.querySelector('#grid');
const startButton = document.querySelector('#start');
const stopButton = document.querySelector('#stop');
const resetButton = document.querySelector('#reset');
const gridBackground = 'white';
const fillColor = 'black';
const hoverColor = 'hsl(0, 0%, 85%)';
const toggles = document.querySelectorAll('.rule-toggle');
const favoritesList = document.querySelector('#favorites-list');
const favoriteAddButton = document.querySelector('#create-new-favorite div');
const newFavoriteInput = document.querySelector('#create-new-favorite input');
const capitalize = (str) => str[0].toUpperCase() + str.slice(1);

// Non-constant variables
let size = 35; // Grid side lengths
let timer = 0; // Will be assigned a setTimeout call to draw()
let speed = 0; // Milliseconds input for setTimeout

// Indicate whether a given config will fill the center
let fill111 = false;
let fill110 = false;
let fill101 = false;
let fill100 = false;
let fill011 = false;
let fill010 = false;
let fill001 = false;
let fill000 = false;
let rulesArray = [fill111, fill110, fill101, fill100, fill011, fill010, fill001, fill000];
function setRules() {
  fill111 = rulesArray[0];
  fill110 = rulesArray[1];
  fill101 = rulesArray[2];
  fill100 = rulesArray[3];
  fill011 = rulesArray[4];
  fill010 = rulesArray[5];
  fill001 = rulesArray[6];
  fill000 = rulesArray[7];
}

const startElement = size % 2 === 0 ? size ** 2 - size / 2 : (size ** 2 + 1) - ((size + 1) / 2);

// Define config checking function
// Boolean arguments, boolean returns; true === filled, false === empty
// Notation:
// left + bottom + middle
// 0 === empty, 1 === filled
function checkConfig(left, bottom, right) {
  if (left) {
    if (bottom) {
      if (right) { // 111
        return fill111;
      } else { // 110
        return fill110;
      }
    } else {
      if (right) { // 101
        return fill101;
      } else { // 100
        return fill100;
      }
    }
  } else {
    if (bottom) {
      if (right) { // 011
        return fill011;
      } else { //010
        return fill010;
      }
    } else {
      if (right) { // 001
        return fill001;
      } else { // 000
        return fill000;
      }
    }
  }
}

// Set up grid
grid.style.backgroundColor = gridBackground;
grid.style.gridTemplate = `repeat(${size}, 1fr) / repeat(${size}, 1fr)`; // Sizes grid
for (let i = 0; i < size ** 2; i++) { // Fills grid with children
  const e = document.createElement('div');
  grid.appendChild(e);
}

function initializeGrid() {
  for (let i = 1; i <= size ** 2; i++) {
    document.querySelector(`#grid :nth-child(${i})`).style.backgroundColor = 'transparent';
  }
  document.querySelector(`#grid :nth-child(${startElement})`).style.backgroundColor = fillColor;
}
function initializeFavorites() {
  for (let i = 0; i < localStorage.length; i++) {
    if (/^favorite-/.test(localStorage.key(i))) {
      createFavorite(localStorage.key(i).replace(/^favorite-/, '').replace(/-/g, ' ').split(' ').map(capitalize).join(' '));
    }
  }
}
initializeGrid();
initializeFavorites();

function removeFavorite(id) {
  localStorage.removeItem('favorite-' +document.querySelector('#' + id + ' .favorite-text').innerText.toLowerCase().trim().replace(/ /g, '-'));
  favoritesList.removeChild(document.getElementById(id));
}

function createFavorite(content) {
  const newFavorite = document.createElement('div');
  const innerDiv = document.createElement('div');
  const innerParagraph = document.createElement('p');
  const minusDiv = document.createElement('div');
  const minusText = document.createElement('p');
  
  newFavorite.setAttribute('class', 'favorites-item');
  newFavorite.setAttribute('id', content.toLowerCase().replace(/ /g, '-'));
  innerDiv.setAttribute('class', 'favorite-div');
  innerParagraph.setAttribute('class', 'favorite-text');
  minusDiv.setAttribute('class', 'minus-div');
  innerParagraph.innerText = content;
  minusText.innerText = '-';
  
  innerDiv.appendChild(innerParagraph);
  minusDiv.appendChild(minusText);
  newFavorite.appendChild(innerDiv);
  newFavorite.appendChild(minusDiv);
  favoritesList.appendChild(newFavorite);
  
  minusDiv.addEventListener('mouseup', () => {
    removeFavorite(newFavorite.id);
  });

  innerDiv.addEventListener('click', () => {
    console.log('Assigning new rules');
    rulesArray = JSON.parse(localStorage.getItem('favorite-' + innerParagraph.innerText.toLowerCase().trim().replace(/ /g, '-')));
    setRules();
    highlightRules();
  });
}

function addFavorite() {
  if (newFavoriteInput.value !== '') {
    createFavorite(newFavoriteInput.value);
    localStorage.setItem('favorite-' + newFavoriteInput.value.toLowerCase().trim().replace(/ /g, '-'), JSON.stringify(rulesArray));
    newFavoriteInput.value = "";
  }
}

function highlightRules() {
  for (let i = 0; i < toggles.length; i++) {
    if (rulesArray[i]) {
      toggles[i].toggleAttribute('selected');
      toggles[i].style.backgroundColor = hoverColor;
    } else {
      toggles[i].style.backgroundColor = 'transparent';
    }
  }
}

// Draw new state
function draw() {
  const filled = [];
  for (let i = 1; i <= size ** 2; i++) { // Encodes grid in a boolean array
    if (document.querySelector(`#grid :nth-child(${i})`).style.backgroundColor === fillColor) {
      filled.push(true);
    } else {
      filled.push(false);
    }
  }
  for (let i = 0; i < size ** 2; i++) { // Changes cells based on config
    const current = document.querySelector(`#grid :nth-child(${i + 1})`);
    let newState = [];
    let left = filled[i - 1];
    let right = filled[i + 1];
    let bottom = filled[i + size];

    // Taking care of edge cases (ha)
    if (i % size === 0) { // Sets left to undefined if on left edge
      left = undefined;
    } else if ((i + 1) % size === 0 || i === size ** 2 - 1) { // Sets right to undefined if on right edge
      right = undefined;
    }
    if (i + size === undefined) {
      bottom = undefined;
    }
    // Note: bottom will already be undefined on bottom edge since it will 
    // reference array indices that don't exist

    checkConfig(left, bottom, right) ? current.style.backgroundColor = fillColor : current.style.backgroundColor = 'transparent';
  }
  timer = setTimeout(draw, speed);
}

// Start
startButton.addEventListener('click', () => {
  if (!startButton.hasAttribute('data-running')) {
    startButton.toggleAttribute('data-running');
    timer = setTimeout(draw, 0);
  }
});

// Stop
stopButton.addEventListener('click', () => {
  if (startButton.hasAttribute('data-running')) {
    startButton.toggleAttribute('data-running');
    clearInterval(timer);
  }
});

// Reset
resetButton.addEventListener('click', () => {
  if (startButton.hasAttribute('data-running')) {
    startButton.toggleAttribute('data-running');
    clearInterval(timer);
  }
  initializeGrid();
});

// Toggle Rule
toggles.forEach((e, index) => {e.addEventListener('click', () => {
  if (!e.hasAttribute('selected')) {
    e.style.backgroundColor = hoverColor;
    rulesArray[index] = true;
  } else {
    e.style.backgroundColor = 'transparent';
    rulesArray[index] = false;
  }
  setRules();
  e.toggleAttribute('selected');
})});

// Mouseover Rule
toggles.forEach(e => {e.addEventListener('mouseover', () => {
  e.style.backgroundColor = hoverColor;
})});


// Mouseout Rule
toggles.forEach(e => {e.addEventListener('mouseout', () => {
  if (e.hasAttribute('selected')) {
    e.style.backgroundColor = hoverColor;
  } else {
    e.style.backgroundColor = 'transparent';
  }
})});

// Add new favorite
favoriteAddButton.addEventListener('click', addFavorite);
newFavoriteInput.addEventListener('keyup', (e) => {
  if (e.key === "Enter") {
    addFavorite();
  }
});