// all that's left to do after a recipe is constructed is to resolve the variable references. -> point the @foo's to the foo.
// this "point" will be represented by... Environment<string, object>
// environment will be built up with ingredient declarations...
// since currently no way for ingredient to know about its parents
// 
// this will allow at runtime for any interpreter to... lookup an ingredient
// 
// for href's to work... ingredients will need unique identifier
// could generate one, or be based on location...
// maybe shove it into Environment class
// in react app, could generate a link to id of the ingredient
//
