# StewLang

## TODO

- some point can introduce flags for output format

- default should be 2 columns
- color-coded by recipe
- grouped by dependencies
- (none)
- (only from group 1)
- (only from group 2)
- etc..
- what if recipes always had three (prep / cook / plate)?

this creates the default grouping...
then user can push steps up and down


- have variable scoping work as expected
- output a recipe in html? create "stages" ? where anything can be done in parallel?

A => B => C
B => D
E => F

- what's the algorithm? shove everything into first stage?
- then move up the bits that depend on something else?


- print out a tree?

## architecture

- creates an instance of Recipe.ts class (parser)
- resolve variables

- do need second class to output dependency tree?

## variables

- scoping ingredient names...
- each top-level ingredient is a global variable...
- each ingredient given a unique identifier... identifiers resolve to this id...

## future ideas

### full-blown templating

top level parameters (isVegetarian, isQuick), can use if statements to output
different results

### dependency trees

can complete some steps in any order, but must be do x before y, etc..

### declare ingredients in any order
