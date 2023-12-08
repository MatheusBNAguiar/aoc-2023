import { getArraySum } from "../utils/getArraySum.mjs";
import { getDayInput } from "../utils/getDayInput.mjs";

function getGameEntries(archiveString = "") {
  return archiveString.split("\n").reduce((acc, item) => {
    if (item) {
      const [_discard, id, entries] = item.split(/Game (\d+): /);
      acc[Number(id)] = entries.split(";").map(item =>
        item
          .trim()
          .match(/(\d+ \w+)/gm)
          .reduce((acc, item) => {
            const [quantity, index] = item.split(" ");
            acc[index] = Number(quantity);
            return acc;
          }, {}),
      );
    }
    return acc;
  }, {});
}

function getFeasibleGames(entries = {}, availableMap = {}) {
  return Object.entries(entries).reduce((acc, [id, entries]) => {
    const entryThatDoesNotMatch = entries.find(entry => Boolean(Object.entries(entry).find(([color, quantity]) => availableMap[color] === undefined || availableMap[color] < quantity)));
    if (!entryThatDoesNotMatch) {
      return acc.concat(id);
    }
    return acc;
  }, []);
}

function getPowerOnMinimumBalls(entries) {
  return Object.entries(entries).reduce((acc, [id, entries]) => {
    const minimumMap = {};
    entries.forEach(ballsMap => {
      for (const ballKey in ballsMap) {
        const ballValue = ballsMap[ballKey];
        minimumMap[ballKey] = Math.max(minimumMap[ballKey] || 0, ballValue);
      }
    });
    acc[id] = Object.values(minimumMap).reduce((acc, number) => acc * number, 1);

    return acc;
  }, {});
}

export default function getAnswer(red, green, blue) {
  const fileResult = getDayInput(import.meta);
  const entries = getGameEntries(fileResult);

  const feasibleGames = getFeasibleGames(entries, { red, green, blue });
  const minimumBallRequired = getPowerOnMinimumBalls(entries, {
    red,
    green,
    blue,
  });

  return `Sum is ${getArraySum(feasibleGames)} and power sum is: ${getArraySum(Object.values(minimumBallRequired))}`;
}
