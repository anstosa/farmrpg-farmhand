export const SEPERATOR = "-"; // U+200D ZERO WIDTH JOINER
export const ONE = "1"; // U+200B ZERO WIDTH SPACE
export const ZERO = "0"; // U+200C ZERO WIDTH NON-JOINER

// wrapper cannot be whitespace otherwise we get trimmed
export const WRAPPER = "🞗"; // U+128919 BLACK TINY DIAMOND

const toBinary = (input: number): string => (input >>> 0).toString(2);

export const toWhitespace = (input: string): string => {
  const encoded: string[] = [];
  for (let index = 0; index < input.length; index++) {
    const asNumber = input.codePointAt(index) ?? 0;
    const asBinary = toBinary(asNumber);
    const asWhitespace = asBinary.replaceAll("1", ONE).replaceAll("0", ZERO);
    encoded.push(asWhitespace);
  }
  return `${WRAPPER}${encoded.join(SEPERATOR)}${WRAPPER}`;
};

export const fromWhitespace = (whitespace: string): string => {
  let decoded = "";
  const codes = whitespace.replaceAll(WRAPPER, "").split(SEPERATOR);
  for (let index = 0; index < codes.length - 1; index++) {
    const asBinary = codes[index].replaceAll(ONE, "1").replaceAll(ZERO, "0");
    const asNumber = Number.parseInt(asBinary, 2);
    const asString = String.fromCodePoint(asNumber);
    decoded += asString;
  }
  return decoded;
};

export const findData = (input: string): string | undefined => {
  if (!input.includes(WRAPPER)) {
    return;
  }
  const match = input.match(
    new RegExp(`${WRAPPER}([${SEPERATOR}${ZERO}${ONE}])+${WRAPPER}`, "g")
  );
  if (!match) {
    console.error("CORRUPT SYNC DATA");
  }
  return match?.[0];
};

export const eraseData = (input: string): string => {
  return input.replaceAll(
    new RegExp(`${WRAPPER}|${SEPERATOR}|${ZERO}|${ONE}`, "g"),
    ""
  );
};
