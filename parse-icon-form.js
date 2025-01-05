// import fs from "fs";

const input = process.env.INPUT_ISSUE_BODY;

const parseIssueForm = (input, mapping) => {
  return input
    .split("###")
    .slice(1)
    .map((item) => item.trim().split("\n"))
    .map((rows) => {
      return {
        name: rows[0].trim(),
        value: rows.slice(1).join("\n").trim(),
      };
    })
    .map((item) => (item.value === "_No response_" ? { ...item, value: null } : item))
    .reduce((acc, item) => {
      const key = Object.entries(mapping).find(([key, value]) => value === item.name)?.[0];
      if (key) {
        acc[key] = item.value;
      }
      return acc;
    }, {});
};

const data = parseIssueForm(input, {
  name: "Icon name",
  icon: "Paste icon",
  type: "Icon type",
  categories: "Categories",
  aliases: "Aliases",
});

const parseMarkdownImageUrl = (value) => {
  const match = value.match(/!\[[^\]]+\]\((https:[^\)]+)\)/)[1] ?? null;
  if (!match) {
    throw new Error("Invalid image URL");
  }
  return match;
};

const icon = {
  name: data.name.toLowerCase(),
  type: data.type.toLowerCase() === "svg" ? "svg" : "png",
  icon: parseMarkdownImageUrl(data.icon),
  categories: data.categories ? data.categories.split(",").map((item) => item.trim()) : [],
  aliases: data.aliases ? data.aliases.split(",").map((item) => item.trim()) : [],
};

console.log(
  JSON.stringify(
    {
      base: icon.type,
      aliases: icon.aliases,
      categories: icon.categories,
      update: {
        timestamp: new Date().toISOString(),
        author: {
          id: Number(env.INPUT_ISSUE_AUTHOR_ID),
          name: env.INPUT_ISSUE_AUTHOR_LOGIN,
        },
      },
    },
    null,
    2
  )
);
/*
const iconBlob = await fetch(icon.icon).then((res) => res.blob());
fs.writeFileSync(`${icon.type}/${icon.name}.${icon.type}`, Buffer.from(await iconBlob.arrayBuffer()));
fs.writeFileSync(
  `meta/${icon.name}.json`,
  JSON.stringify(
    {
      base: icon.type,
      aliases: icon.aliases,
      categories: icon.categories,
      update: {
        timestamp: new Date().toISOString(),
        author: {
          id: 1,
          name: "user",
        },
      },
    },
    null,
    2
  )
);
*/
