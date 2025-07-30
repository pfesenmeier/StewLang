# Actor Hierarchy

## Current

App | FileTree | Welcome | Lang | Ls | | <=== lang IS the preview actor
ReadFiles | | |

## Desired

Ls and ReadFiles are stateless, the stateful actors can be "invoked" by the app
actor

App | FileTree | Welcome | Lang | Ls | | ReadFiles | | | |

replace use of sendTo({ context }) => context.actorRef with sendTo({ system })
=> getActor(system, 'actorName')

is it a kludge that we're sending events to specific actors? could have a
dictionary of keys that go to what actors?

remove '...logic'
