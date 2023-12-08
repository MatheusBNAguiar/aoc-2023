import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function getDayInput(importMeta) {
  const filePath = `${path.dirname(fileURLToPath(importMeta.url))}/input.txt`;
  return fs.readFileSync(filePath).toString();
}
