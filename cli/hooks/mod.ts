import { AppActorContext } from "../context/AppContext.tsx";

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

export function useWelcome() {
  return AppActorContext.useSelector((a) => a.matches("welcome"));
}
