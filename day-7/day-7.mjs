import { getDayInput } from '../utils/getDayInput.mjs';

const CARD_SORTED_BY_MOST_TO_LEAST_STRENGTH = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'].reverse()
const CARD_SORTED_BY_MOST_TO_LEAST_STRENGTH_WITH_JOKER = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'].reverse()

const PATTERN_SCORE_MAPPING = ['5', '41', '32', '311', '221', '2111', '11111'].reverse();

function getCardStringScore(cardString) {
  return CARD_SORTED_BY_MOST_TO_LEAST_STRENGTH.indexOf(cardString) + 1;
}

function getCardStringWithJokerScore(cardString) {
  return CARD_SORTED_BY_MOST_TO_LEAST_STRENGTH_WITH_JOKER.indexOf(cardString) + 1;
}

function getPatternScore(pattern) {
  return PATTERN_SCORE_MAPPING.indexOf(pattern) + 1;
}

function getClusterScore(cardsString) {
  return cardsString.split('').reduce((acc, character) => {
    acc[character] = (acc[character] || 0) + 1;
    return acc;
  }, {});
}

function getCardsCombinationScore(cardsString) {
  const groupedCards = getClusterScore(cardsString);
  const cardsReceived = Object.values(groupedCards).sort((a, b) => Number(b) - Number(a)).join('');
  return getPatternScore(cardsReceived);
}

function getCardsCombinationScoreWithJoker(cardsString) {
  if (cardsString === 'JJJJJ') {
    return getPatternScore('5');
  }
  const groupedCards = getClusterScore(cardsString);

  let cardsReceived = Object.entries(groupedCards).sort((a, b) => Number(b[1]) - Number(a[1]));

  const jokerOnGroupIndex = cardsReceived.findIndex(([key]) => key === 'J');
  if (jokerOnGroupIndex !== -1) {
    const jokerQuantity = Number(cardsReceived[jokerOnGroupIndex][1]);

    cardsReceived = cardsReceived.filter((_value, index) => index !== jokerOnGroupIndex)
    cardsReceived[0][1] = Number(cardsReceived[0][1]) + jokerQuantity;
  }

  return getPatternScore(String(cardsReceived.map(([_key, score]) => score).join('')));
}

function getPart1Answer(cardRankGroup) {
  return cardRankGroup
    .map(([cardString, rank]) => [getCardsCombinationScore(cardString), cardString, rank])
    .sort((a, b) => {
      const cardsScoreDiff = a[0] - b[0];
      if (cardsScoreDiff === 0) {
        let cardStringDiff = 0;
        for (let cardIndex = 0; cardIndex < a[1].length && cardStringDiff === 0; cardIndex++) {
          cardStringDiff = getCardStringScore(a[1][cardIndex]) - getCardStringScore(b[1][cardIndex]);
        }
        return cardStringDiff;
      }
      return cardsScoreDiff;
    })
    .reduce((acc, [_sc, _str, rank], index) => acc + rank * (index + 1), 0);
}

function getPart2Answer(cardRankGroup) {
  return cardRankGroup
    .map(([cardString, rank]) => [getCardsCombinationScoreWithJoker(cardString), cardString, Number(rank)])
    .sort((a, b) => {
      const cardsScoreDiff = a[0] - b[0];
      if (cardsScoreDiff === 0) {
        let cardStringDiff = 0;
        for (let cardIndex = 0; cardIndex < a[1].length && cardStringDiff === 0; cardIndex++) {
          cardStringDiff = getCardStringWithJokerScore(a[1][cardIndex]) - getCardStringWithJokerScore(b[1][cardIndex]);
        }
        return cardStringDiff;
      }
      return cardsScoreDiff;
    })
    .reduce((acc, [_sc, _str, rank], index) => acc + rank * (index + 1), 0);
}

export default function getAnswer() {
  const fileResult = getDayInput(import.meta)
  const cardRankGroup = fileResult.split('\n')
    .filter(Boolean)
    .map((string) => string.split(' '));

  return `Part 1: ${getPart1Answer(cardRankGroup)} Part 2: ${getPart2Answer(cardRankGroup)}`
}
