## Hooking up Actors

| appMachine | | fileTreeMachine | | langActor |

one suggested pattern...

sendTo... https://stately.ai/docs/actions#send-parent-action sends events to
parent difference between 'observable'?

not sure interop between fromObservable()... createMachine() calls send parent
seems best for createMachine() api

how to implement update preview updates?

|-----------------|

| appMachine |
| ---------- |

appMachine subscribes to fileTreeMachine refactor fileTreeMachine to broadcast
to all subscribers?

|-----------------| |-----------| | fileTreeMachine | \ langActor |
|-----------------| \ --------|

langActor... subscribes to fileTreeMachine's "CurrentItem" events fileTree...
allow an invalid item to be selected... no so fileTreeMachine invokes langActor
to see if valid just call it renderActor?

so we've prevented invalid selections making to next sections in the file picker
only sent events if .sw (guard)

does fileTreeMachine spawn a preview?
