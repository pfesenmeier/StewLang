import {
  ActorRef,
  type ActorRefFrom,
  type ActorSystem,
  EventObject,
  MachineContext,
  MachineSnapshot,
} from "xstate";

import { FileTreeContext, FileTreeEvents } from "./fileTree/fileTreeActor.ts";
import { appActor } from "./appActor.ts";
import { lsActor } from "./lsActor.ts";
import { welcomeActor } from "./welcomeActor.ts";
import { PreviewContext, PreviewEvents } from "./preview/previewActor.ts";

// used to prevent circular dependencies
type MachineActorRef<
  TContext extends MachineContext,
  TEvent extends EventObject,
> = ActorRef<
  // deno-lint-ignore no-explicit-any
  MachineSnapshot<TContext, any, any, any, any, any, any, any>,
  TEvent
>;

type System = {
  app: ActorRefFrom<typeof appActor>;
  fileTree: MachineActorRef<FileTreeContext, FileTreeEvents>;
  preview: MachineActorRef<PreviewContext, PreviewEvents>;
  welcome: ActorRefFrom<typeof welcomeActor>;
  ls: ActorRefFrom<typeof lsActor>;
};

export const systemIds: Record<keyof System, keyof System> = {
  app: "app",
  fileTree: "fileTree",
  preview: "preview",
  welcome: "welcome",
  ls: "ls",
};

export function getActor<TActorKey extends keyof System>(
  // deno-lint-ignore no-explicit-any
  system: ActorSystem<any>,
  systemId: TActorKey,
) {
  const ref = system.get(systemId);

  return ref as System[TActorKey];
}
