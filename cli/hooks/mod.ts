import { AppActorContext } from "../context/AppContext.tsx";

export function useSnapshot() {
  return AppActorContext.useSelector((sn) => sn);
}

export function usePreview() {
  return AppActorContext.useSelector(({ context }) => context.preview);
}

export function useSelected() {
  return AppActorContext.useSelector(({ context }) => context.selected);
}

export function useFileTree() {
  return AppActorContext.useSelector(({ context }) => context.fileTree);
}

export function useSend() {
  const ref = AppActorContext.useActorRef();

  return ref.send;
}

export function useAppState() {
  // do not destructure here
  return AppActorContext.useSelector((a) => {
    return {
      welcome: a.matches("welcome"),
      preview: a.matches({ firstStage: { ui: "previewing" } }),
      browsing: a.matches({ firstStage: { ui: "browsing" } }),
      selecting: a.matches({ firstStage: { ui: "selecting" } }),
      help: a.matches("help"),
    };
  });
}
