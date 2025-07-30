import type { ActorRefFrom, ActorSystem } from "xstate";
import { fileTreeMachine } from "./fileTree/fileTreeMachine.ts";
import { appMachine } from "./appMachine.ts";
import { lsActorLogic } from "./lsActorLogic.ts";
import { welcomeMachineLogic } from "./welcomeMachineLogic.ts";
import { langMachine } from "./lang/langMachine.ts";

// TODO must manually add systemIds everywhere something is used!
// TODO... "invoke" all actors on root app machine... in definition or in use

type System = {
  fileTree: ActorRefFrom<typeof fileTreeMachine>;
  app: ActorRefFrom<typeof appMachine>;
  ls: ActorRefFrom<typeof lsActorLogic>;
  welcome: ActorRefFrom<typeof welcomeMachineLogic>;
  lang: ActorRefFrom<typeof langMachine>;
};

// deno-lint-ignore no-explicit-any
export function getActor<TActorKey extends keyof System>(
  system: ActorSystem<any>,
  systemId: TActorKey,
) {
  return system.get(systemId) as System[TActorKey];
}
