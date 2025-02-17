# Grammars

## Lexical Grammar

ALPHA -> "a" ... "z" | "A" ... "Z" ;
DIGIT -> "0" ... "9" | "." | "/" ;
NEWLINE -> "\n" | "\r\n"

## Syntax Grammar

ref -> '@' ALPHA ("-" ALPHA+)*
step -> "-" (ALPHA+ | DIGIT+)+ 
steps -> (step NEWLINE)* step NEWLINE?
ingredient_decl -> DIGIT* (ALPHA+)+
ingredient -> ingredient_decl ( "(" NEWLINE? (ingredient NEWLINE)* ingredient? (NEWLINE steps)? ")" )? NEWLINE

# good v2 ingredient declarations
chips -- just a name
ground beef -- name with spaces
8 carrots -- amount and name
2 lb celery -- amount unit name

# bad v2 declarations
8 tsp. black pepper -- bad symbol
8g black pepper -- bad amount
7 -- no name  

# good ingredient with sub

foo ()
foo (
  bar
)
foo ( bar )
foo ( bar 
baz
)
foo bar (
  8 in bar baz ( - boom bam bong )
)

# bad
foo ( bar baz) -- would be interpretted as one sub-ingredient
foo ( bar - baz) -- bad symbol
foo ( bar ) baz -- need newline between ingredients
bar (
  boom ( ban bar )
)

# good refs 

foo bar
baz (
  - move @foo-bar 
)

# good meta

name = Thai Fried Rice
serves = 10

# bad meta

$title = Thai Fried Rice -- invalid symbol
recipe title = Foobar -- must be one word

# comments 

-- this is a comment
