import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const filePath = `${path.dirname(fileURLToPath(import.meta.url))}/input.txt`;
const fileResult = fs.readFileSync(filePath).toString()

const finalResult = fileResult
  .replace(/[a-zA-Z]+/gi, "")
  .split("\n")
  .map((item) => Number(`${item.slice(0, 1)}${item.slice(-1)}`))
  .reduce((acc, item) => acc + item, 0)
console.log(finalResult)
