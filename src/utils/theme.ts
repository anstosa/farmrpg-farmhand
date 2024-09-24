export const important = (style: string): string => `${style} !important`;

export const applyStyles = (
  element: HTMLElement,
  styles: CSSStyleDeclaration
): void => {
  for (const [key, input] of Object.entries(styles)) {
    const [value, priority] = input.split("!");
    element.style.setProperty(key, value, priority);
  }
};

export const camelToKebab = (input: string): string =>
  input.replaceAll(
    /[A-Z]+(?![a-z])|[A-Z]/g,
    ($, ofs) => (ofs ? "-" : "") + $.toLowerCase()
  );

export const toCSS = (style: CSSStyleDeclaration): string =>
  Object.entries(style)
    .map(([key, value]) => `${camelToKebab(key)}: ${value}`)
    .join(";\n");

// links
export const LINK_GREEN = "#90EE90";
export const LINK_RED = "#ED143D";

// alerts
export const ALERT_YELLOW_BACKGROUND = "#351C04";
export const ALERT_YELLOW_BORDER = "#41260D";

// text
export const TEXT_WHITE = "#FFFFFF";
export const TEXT_GRAY = "#BBBBBB";
export const TEXT_ERROR = "#FF0000";
export const TEXT_WARNING = "#FFA500";
export const TEXT_SUCCESS = "#30D611";
export const TEXT_BLACK = "#000000";

// borders
export const BORDER_GRAY = "#393939";

// backgrounds
export const BACKGROUND_WHITE = "#FFFFFF";
export const BACKGROUND_BLACK = "#111111";
export const BACKGROUND_DARK = "#161718";

export const INPUT_PADDING = "9px 12px";
export const INPUT_BORDER = `2px solid ${BORDER_GRAY}`;
export const INPUT_STYLES = {
  background: important(BACKGROUND_DARK),
  border: important(INPUT_BORDER),
  borderRadius: important("0"),
  fontSize: important("14px"),
  boxShadow: important("none"),
  color: important(TEXT_WHITE),
  height: important("36px"),
  padding: important(INPUT_PADDING),
} as CSSStyleDeclaration;

// buttons
export const BUTTON_GREEN_BACKGROUND = "#003300";
export const BUTTON_GREEN_BORDER = "#006600";
export const BUTTON_GREEN_DARK_BACKGROUND = "#001900";
export const BUTTON_GREEN_DARK_BORDER = "#003300";
export const BUTTON_ORANGE_BACKGROUND = "#532A02";
export const BUTTON_ORANGE_BORDER = "#8B4A0D";
export const BUTTON_BLUE_BACKGROUND = "#101059";
export const BUTTON_BLUE_BORDER = "#19199B";
export const BUTTON_RED_BACKGROUND = "#330000";
export const BUTTON_RED_BORDER = "#660000";
export const BUTTON_PURPLE_BACKGROUND = "#3A204C";
export const BUTTON_PURPLE_BORDER = "#4A315C";
export const BUTTON_GRAY_BACKGROUND = "#444444";
export const BUTTON_GRAY_BORDER = "#666666";

const generateButton = (
  background: string,
  border: string
): CSSStyleDeclaration =>
  ({
    background: important(background),
    border: important(`2px solid ${border}`),
    borderRadius: important("0"),
    boxShadow: important("none"),
    color: important(TEXT_WHITE),
    fontSize: important("14px"),
    cursor: important("pointer"),
    lineHeight: important("1"),
    height: important("36px"),
    padding: important(INPUT_PADDING),
    width: important("auto"),
  } as CSSStyleDeclaration);
export const BUTTON_GREEN_STYLES = generateButton(
  BUTTON_GREEN_BACKGROUND,
  BUTTON_GREEN_BORDER
);
export const BUTTON_BLUE_STYLES = generateButton(
  BUTTON_BLUE_BACKGROUND,
  BUTTON_BLUE_BORDER
);
export const BUTTON_ORANGE_STYLES = generateButton(
  BUTTON_ORANGE_BACKGROUND,
  BUTTON_ORANGE_BORDER
);
export const BUTTON_GREEN_DARK_STYLES = generateButton(
  BUTTON_GREEN_DARK_BACKGROUND,
  BUTTON_GREEN_DARK_BORDER
);
export const BUTTON_RED_STYLES = generateButton(
  BUTTON_RED_BACKGROUND,
  BUTTON_RED_BORDER
);
export const BUTTON_PURPLE_STYLES = generateButton(
  BUTTON_PURPLE_BACKGROUND,
  BUTTON_PURPLE_BORDER
);
export const BUTTON_GRAY_STYLES = generateButton(
  BUTTON_GRAY_BACKGROUND,
  BUTTON_GRAY_BORDER
);
export const BUTTON_GRAY_DARK_STYLES = generateButton(BORDER_GRAY, BORDER_GRAY);
