import { SEPARATOR, join, relative } from "@std/path";

export type ActorInput<T> = {
  input: T
}

const root = Deno.build.os === "windows" ? "C:\\" : "/"

export function splitPath(path: string) {

  const relpath = relative(root, path)

  const relpathlist =  relpath.split(SEPARATOR)

  return [root, ...relpathlist]
}

export function joinPath(path: string[]) {
  const first = path.at(0)

  if (!first) return ""
  
  return join(first, ...path.slice(1))
}
