import { render as renderInk } from "ink";
import App from "./components/App.tsx";

export function render(rootDir: string) {
  Deno.addSignalListener("SIGINT", () => {
    Deno.exit();
  });

  // Add a timeout to prevent process exiting immediately.
  setTimeout(() => {}, 5000);

  renderInk(
    <App rootDir={rootDir}></App>,
  );
}

/* TODO
* 1. Read a directory
* 2. Present a select
* 3. XState ??
* => select files, preview files
* => order recipe steps
* => group recipe steps
* => export recipe, open in browser?
*
*/

// console.log("file", file);
// const Counter = () => {
//   const [counter, setCounter] = useState(0);
//
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCounter((previousCounter) => previousCounter + 1);
//     }, 100);
//
//     return () => {
//       clearInterval(timer);
//     };
//   }, []);
//
//   return <Text color="green">{counter} tests passed</Text>;
// };
//
// render(<Counter />);
