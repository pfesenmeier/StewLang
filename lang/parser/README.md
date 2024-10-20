# Stew Lang

## Examples

pbj (
  peanut-butter
  jelly
  bread
  - spread peanut-butter onto jelly, 
)

## Formal Grammer


leafs

program -> object* EOF;
object -> ingredient "(" (content delimiter)* ")"
content -> ingredient
content -> step
step -> '-' text
text -> identifier | word
word -> "a-z"...
## how is property access defined
identifier -> '@'word
delimiter -> newline | ','
newline -> ',' | '\n' | '\r\n'


ingredient -> [0-9]word* text
text -> word* identifier*
identifier -> "@"word | "@"word.ingredient
