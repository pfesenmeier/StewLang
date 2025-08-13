import { createActorContext } from "@xstate/react";
import { app } from "../actors/app.ts";

export const AppActorContext = createActorContext(app);

export function AppProvider(
  { children, cwd }: { children: React.ReactNode; cwd: string },
) {
  return (
    <AppActorContext.Provider
      options={{ input: { cwd } }}
    >
      {children}
    </AppActorContext.Provider>
  );
}
