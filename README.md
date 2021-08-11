# Cellular Automata
This app was created for the purpose of investigating cellular automata in an interactive way.

# Upcoming features include (but are not limited to!):
* Adjustable grid size
* Adjustable animation speed
* Color-based designs (possibly)
* A complete component-based refactoring of the code using React, which will leverage the power of the virtual DOM to make larger grid sizes more feasible

# There's a bug!
You may notice after playing around with some interesting examples that some configurations will produce a boring (and incorrect) "alternating checkerboard" sort of pattern beginning at the sides and slowly overtaking the whole grid. This makes the interesting aspects of the automata disappear, and it's not supposed to happen. It's a relic of the way the program evaluates the state of the squares on the sides of the grid, and I have not found a solution as of yet. When I do, you can be sure I'll implement it!
