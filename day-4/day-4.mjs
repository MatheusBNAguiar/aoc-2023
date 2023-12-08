import { getArraySum } from "../utils/getArraySum.mjs";
import { getDayInput } from "../utils/getDayInput.mjs";

function getDayEntries(archiveString = "") {
  return archiveString.split("\n").reduce((acc, item) => {
    if (item) {
      const [_discard, id, entries] = item.split(/Card\s+(\d+):/);
      acc[Number(id)] = entries.split("|").map(str => str.trim());
    }
    return acc;
  }, {});
}

function getDayMatches([numberResult, numbersTaken]) {
  const takenList = numbersTaken.split(/\s+/gi);
  return numberResult.split(/\s+/gi).filter(item => takenList.includes(item)).length;
}

function getDayScore(entries) {
  const dayMatches = getDayMatches(entries);
  return dayMatches > 0 ? 2 ** (dayMatches - 1) : 0;
}

function getPart1Answer(entries) {
  const validResultsList = Object.entries(entries).map(([, entries]) => getDayScore(entries));
  return getArraySum(validResultsList);
}

function getPart2Answer(entries) {
  const validResultsList = Object.entries(entries).map(([day, entries]) => [day, getDayMatches(entries)]);
  const resultMapping = {};
  validResultsList.forEach(([key, correctResults], arrayIndex) => {
    resultMapping[key] = resultMapping[key] || 1;
    if (correctResults !== 0) {
      resultMapping[key] = resultMapping[key] || 1;
      for (let index = arrayIndex + 1; index <= arrayIndex + correctResults; index++) {
        resultMapping[validResultsList[index][0]] = (resultMapping[validResultsList[index][0]] || 1) + resultMapping[key];
      }
    }
  });

  return getArraySum(Object.values(resultMapping));
}

export default function getAnswer() {
  const fileResult = getDayInput(import.meta);
  const entries = getDayEntries(fileResult);

  return `Part 1: ${getPart1Answer(entries)} Part 2: ${getPart2Answer(entries)}`;
}
