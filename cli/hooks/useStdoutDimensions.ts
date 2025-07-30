import process from "node:process";
import { useEffect, useState } from "react";

// https://github.com/vadimdemedes/ink/issues/341#issuecomment-1312342431
export function useStdoutDimensions() {
  const { columns, rows } = process.stdout;
  const [size, setSize] = useState({ columns, rows });

  useEffect(() => {
    function onResize() {
      const { columns, rows } = Deno.consoleSize();
      setSize({ columns, rows });
    }

    Deno.addSignalListener("SIGWINCH", onResize);
    return () => {
      Deno.removeSignalListener("SIGWINCH", onResize);
    };
  }, []);

  return { columns: size.columns, rows: size.rows };
}
