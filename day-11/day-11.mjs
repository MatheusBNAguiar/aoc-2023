import { getDayInput } from "../utils/getDayInput.mjs";
import { getArraySum } from "../utils/getArraySum.mjs";

function getEmptySpacesAndGalaxies(fileResult) {
  const fileArray = fileResult.split("\n").filter(Boolean);
  const lineQuantity = fileArray.length;
  const lineLength = fileArray[0].length;

  const xSet = new Set(
    Array(lineLength)
      .fill(1)
      .map((_, index) => index),
  );
  const ySet = new Set(
    Array(lineQuantity)
      .fill(1)
      .map((_, index) => index),
  );
  const galaxiesPosArray = [];

  for (let linePosition = 0; linePosition < fileArray.length; linePosition++) {
    const arrayLine = fileArray[linePosition].split("");
    let hasGalaxyOnLine = false;
    for (let charPosition = 0; charPosition < arrayLine.length; charPosition++) {
      const character = arrayLine[charPosition];
      if (character === "#") {
        hasGalaxyOnLine = true;
        galaxiesPosArray.push([linePosition, charPosition]);
        xSet.delete(charPosition);
      }
    }

    if (hasGalaxyOnLine) {
      ySet.delete(linePosition);
    }
  }

  return {
    emptyLines: Array.from(ySet),
    emptyColumns: Array.from(xSet),
    galaxiesPositions: galaxiesPosArray,
  };
}

function getQuantityToTranspose(positionArray, position) {
  return positionArray.filter(positionToTranspose => position > positionToTranspose).length;
}

function getPositionsAfterExpansion({ emptyLines, emptyColumns, galaxiesPositions }, expansions = 1) {
  return galaxiesPositions.map(([y, x]) => [y + getQuantityToTranspose(emptyLines, y) * expansions, x + getQuantityToTranspose(emptyColumns, x) * expansions]);
}

function getDistancesArray(expandedGalaxiesArray = []) {
  const distances = [];
  for (let firstGalaxyIndex = 0; firstGalaxyIndex < expandedGalaxiesArray.length; firstGalaxyIndex++) {
    const firstGalaxy = expandedGalaxiesArray[firstGalaxyIndex];

    for (let secondGalaxyIndex = firstGalaxyIndex + 1; secondGalaxyIndex < expandedGalaxiesArray.length; secondGalaxyIndex++) {
      const secondGalaxy = expandedGalaxiesArray[secondGalaxyIndex];
      distances.push(Math.abs(secondGalaxy[0] - firstGalaxy[0]) + Math.abs(secondGalaxy[1] - firstGalaxy[1]));
    }
  }

  return distances;
}

function getPart1Answer({ emptyLines, emptyColumns, galaxiesPositions }) {
  const expandedGalaxies = getPositionsAfterExpansion({ emptyLines, emptyColumns, galaxiesPositions });
  return getArraySum(getDistancesArray(expandedGalaxies));
}

function getPart2Answer({ emptyLines, emptyColumns, galaxiesPositions }) {
  const expandedGalaxies = getPositionsAfterExpansion({ emptyLines, emptyColumns, galaxiesPositions }, 1000000 - 1);
  return getArraySum(getDistancesArray(expandedGalaxies));
}

export default function getAnswer() {
  const fileResult = getDayInput(import.meta);
  const { emptyLines, emptyColumns, galaxiesPositions } = getEmptySpacesAndGalaxies(fileResult);
  return `Part 1: ${getPart1Answer({ emptyLines, emptyColumns, galaxiesPositions })} Part 2: ${getPart2Answer({ emptyLines, emptyColumns, galaxiesPositions })}`;
}
