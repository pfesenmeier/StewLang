# Design

## Should stages be introduced as a language construct?

### Pros

- language would continue to work from the cli
- output of the app could be saved in stewlang files

### Cons

- new syntax

### Decision

no. The editor will create new top-level ingredients (stages) that just have sub-ingredients

## What is the difference between  a stage and a nested ingredient?

- I'm imagining stages have no steps, just ingredients
- Though, UI could be altered to include steps

becomes

stage1 (
  a
  b
  c
  d
)

if loaded from meals/ folder, load first level as stages
if loaded from recipes/ folder, load first level as ingredients

or do I need a "nest / unnest" button?
