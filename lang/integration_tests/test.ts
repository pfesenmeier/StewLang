import { assertEquals } from "jsr:@std/assert";
import { extname, format } from "jsr:@std/path";
import { StewLang } from "../mod.ts";

Deno.test("expect input to match output", async () => {
  const lang = new StewLang();

  for await (const testCase of getTestCases()) {
    console.log("testing " + testCase.name);
    const result = lang.read(testCase.input!)
    console.log('stringifying')
    const actual = JSON.stringify(result)
    console.log('done')

    assertEquals(testCase.input, "fobar");
    assertEquals(actual, testCase.expected);
  }
});

async function* getTestCases() {
  const testCaseFolder = format({
    root: import.meta.dirname,
    dir: "test_cases",
  });

  const testCases: Record<string, { input?: string; expected?: string }> = {};
  for await (const { name } of Deno.readDir(testCaseFolder)) {
    const base = name.slice(0, name.indexOf("."));

    const ext = extname(name);

    const full_path = format({
      root: testCaseFolder,
      name,
    });
    const contents = await Deno.readTextFile(full_path);

    console.log(contents);
    console.log(ext);

    if (!testCases[base]) {
      testCases[base] = {};
    }

    if (ext === ".sw") {
      testCases[base].input = contents;
    } else if (ext === ".json") {
      testCases[base].expected = contents;
    }

    console.log(testCases);
    if (testCases[base].input && testCases[base].expected) {
      yield { ...testCases[base], name: base };
    }
  }
}
