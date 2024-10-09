import { fromWhitespace, toWhitespace } from "./whitespace";

const TEST_STRINGS = [
  "Hello, world!",
  "This is a test string.",
  "This is a test string with a newline.\n",
  "This is a test string with a tab.\t",
  "This is a test string with a newline and a tab.\n\t",
  JSON.stringify({ test: "object", boolean: true, number: 42 }),
];

for (const original of TEST_STRINGS) {
  const encoded = toWhitespace(original);
  const decoded = fromWhitespace(encoded);

  console.log("\n\n\n==========");
  console.log(`Original: "${original}"`);
  console.log(`Encoded: "${encoded}" (length: ${encoded.length})`);
  console.log(
    `Decoded: "${decoded}" (${original === decoded ? "PASS" : "FAIL"})`
  );
  console.log("==========\n\n\n");
}
