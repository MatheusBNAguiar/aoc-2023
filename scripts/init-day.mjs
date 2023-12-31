import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { execSync } from "node:child_process";

const filePath = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const lastFolder = fs
  .readdirSync(filePath)
  .filter(path => path.match(/day\-\d/))
  .map(a => a.replace("day-", ""))
  .sort((a, b) => Number(b) - Number(a))[0];

const newFolder = Number(lastFolder) + 1;

execSync(`mkdir ${filePath}/day-${newFolder}`);
execSync(`cp -R ${filePath}/day-x/. ${filePath}/day-${newFolder}`);
execSync(`mv ${filePath}/day-${newFolder}/day-x.ts ${filePath}/day-${newFolder}/day-${newFolder}.ts`);
