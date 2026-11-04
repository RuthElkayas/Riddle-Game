// Helpers for the file-based databases.
// Each DB is a .txt file that holds an array of objects in JSON format.

import fs from "fs";

export function readArray(fileUrl) {
  if (!fs.existsSync(fileUrl)) {
    return [];
  }

  const content = fs.readFileSync(fileUrl, "utf-8");

  if (content.trim() === "") {
    return [];
  }

  // A broken file throws an error instead of returning an empty array,
  // so the next save does not overwrite the data that is still in it.
  let data;

  try {
    data = JSON.parse(content);
  } catch {
    throw new Error(`${fileUrl.pathname} does not contain valid JSON.`);
  }

  if (!Array.isArray(data)) {
    throw new Error(`${fileUrl.pathname} must contain an array.`);
  }

  return data;
}

export function writeArray(fileUrl, data) {
  fs.writeFileSync(fileUrl, JSON.stringify(data, null, 2) + "\n");
}

export function nextId(items) {
  return items.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1;
}
