export const NAME_OVERRIDES: Record<string, string> = {
  "Gold Pea": "Gold Peas",
  "Gold Pepper": "Gold Peppers",
  "Mega Beet": "Mega Beet Seeds",
  "Mega Sunflower": "Mega Sunflower Seeds",
  "Mega Cotton": "Mega Cotton Seeds",
  Pea: "Peas",
  Pepper: "Peppers",
  Pine: "Pine Tree",
};

export const nameToSlug = (name: string): string => {
  let slug = NAME_OVERRIDES[name] ?? name;
  // delete item markings
  slug = slug.replaceAll("*", "");
  // trim whitespace
  slug = slug.trim();
  // lowercase
  slug = slug.toLowerCase();
  // replace punctuation and whitespace with hyphens
  slug = slug.replaceAll(/[^\da-z]/g, "-");
  return slug;
};
