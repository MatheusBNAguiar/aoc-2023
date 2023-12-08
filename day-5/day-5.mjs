import { getDayInput } from "../utils/getDayInput.mjs";

function getSeedMap() {
  const fileResult = getDayInput(import.meta).match(/.+\:([\s\d])+/gm);
  const regex = /.+\:([\s\d])+/gm;

  const baseMap = {};
  let m;
  while ((m = regex.exec(fileResult)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    // The result can be accessed through the `m`-variable.
    m.forEach(matchString => {
      if (matchString.trim()) {
        const mapKey = matchString
          .match(/[\D]+:/)[0]
          .replace(/\,|\:|map/gi, "")
          .trim();
        const values = matchString
          .match(/[\d|\s]+/gm)
          .map(str => str.trim().split("\n").filter(Boolean))
          .filter(item => item.length)[0];
        baseMap[mapKey] = values;
      }
    });
  }

  const { seeds, ...maps } = baseMap;

  const seedsArray = seeds[0].split(" ");
  const mapObject = Object.entries(maps).reduce((acc, [key, entries]) => {
    acc[key] = entries
      .map(a => a.split(" "))
      .sort((a, b) => Number(a[1]) - Number(b[1]))
      .map(([newInitLocation, init, offset]) => [Number(init), Number(offset) + Number(init) - 1, Number(newInitLocation)]);
    return acc;
  }, {});

  return { seedsArray, mapObject };
}

function getLocationFromSeed(seedValue, mapObject) {
  let finalValue = seedValue;
  Object.values(mapObject).forEach(mappedReferences => {
    const foundMapping = mappedReferences.find(([lowerBoundary, higherBoundary]) => finalValue >= lowerBoundary && finalValue <= higherBoundary);
    if (foundMapping) {
      const [lowerBoundary, _hb, offset] = foundMapping;
      finalValue = finalValue - lowerBoundary + offset;
    }
  });

  return finalValue;
}

function getMinimuValueFromTransposedLocations(seedArray, mapObject) {
  let referenceArray = seedArray;
  let minValue;
  referenceArray.forEach(seedValue => {
    const minimumOnInterval = getLocationFromSeed(seedValue, mapObject);
    minValue = Math.min(minValue || minimumOnInterval, minimumOnInterval);
  });
  return minValue;
}

function getPart1Answer({ seedsArray, mapObject }) {
  return getMinimuValueFromTransposedLocations(seedsArray.map(Number), mapObject);
}

function getPart2Answer({ seedsArray, mapObject }) {
  let minValue;
  let reference;

  seedsArray.map(Number).forEach((number, index) => {
    if (index % 2 === 0) {
      reference = number;
    } else {
      console.log(number, index);
      for (let offset = 0; offset < number; offset++) {
        const minimumOnInterval = getLocationFromSeed(reference + offset, mapObject);
        minValue = Math.min(minValue || minimumOnInterval, minimumOnInterval);
      }
    }
  }, []);

  return minValue;
}

// function getSplitIntervalsFromSingleInterval(singleInterval, groupedIntervals) {
//   const [sMin, sMax] = singleInterval;
//   const newIntervals = [];

//   const minBound = sMin;
//   const maxBound = sMax;

//   for (let intervalIndex = 0; intervalIndex < groupedIntervals.length; intervalIndex++) {
//     const oldInterval = groupedIntervals[intervalIndex];
//     const [intervalStart, intervalEnd, newInitLocation] = groupedIntervals[intervalIndex];
//     if (minBound < intervalEnd) {
//       if (minBound >)
//     }
//   }
// }

// function getPart2AnswerAlternative({ seedsArray, mapObject }) {
//   let reference;
//   const groupedSeeds = seedsArray.map(Number).reduce((acc, number, index) => {
//     if (index % 2 === 0) {
//       reference = number;
//     } else {
//       acc.push([reference, number])
//     }
//     return acc;
//   }, []).sort((a, b) => Number(a[0]) - Number(b[0]));

//   const minFromIntervals = Object.values(groupedSeeds.slice(0, 1)).map((singleInterval) => {
//     let [min, max] = singleInterval;
//     for (let index = 0; index < array.length; index++) {
//       const element = array[index];

//     }

//   })
// }

export default function getAnswer() {
  const { seedsArray, mapObject } = getSeedMap();

  return `Part 1: ${getPart1Answer({
    seedsArray,
    mapObject,
  })} Part 2: ${getPart2Answer({ seedsArray, mapObject })}`;
}
