import { getDayInput } from "../utils/getDayInput.mjs";
import { getArraySum } from "../utils/getArraySum.mjs";

type Rule = [[string, string, number], string | Rule, string | Rule];
type RuleDict = { [key: string]: Rule };
type InputObject = { [key: string]: number };

function getConditionString(str): Rule {
  const columnIndex = str?.indexOf(":");
  if (columnIndex !== -1) {
    const commaIndex = str.indexOf(",");

    const condition = str.slice(0, columnIndex);
    const [conditionKey, conditionValue] = condition.split(/\<|\>/);
    const [conditionSymbol] = condition.match(/[\<|\>]/);
    return [[conditionKey, conditionSymbol, Number(conditionValue)], getConditionString(str.slice(columnIndex + 1, commaIndex)), getConditionString(str.slice(commaIndex + 1))];
  }
  return str;
}

function getConditionRules(rulesString): RuleDict {
  return rulesString
    .split("\n")
    .filter(Boolean)
    .map(str => str.replace("}", "").split("{"))
    .reduce((acc, [key, values]) => {
      acc[key] = getConditionString(values);
      return acc;
    }, {});
}

function getPart1Answer(inputs: Array<InputObject>, rulesObject: RuleDict) {
  const isConditionValid = (inputValue: InputObject, ruleArray: Rule) => {
    const [[conditionKey, conditionSymbol, conditionValue], ifCondition, elseCondition] = ruleArray;
    const clauseToEvaluate = (conditionSymbol === ">" ? inputValue[conditionKey] > conditionValue : inputValue[conditionKey] < conditionValue) ? ifCondition : elseCondition;
    if (Array.isArray(clauseToEvaluate)) {
      return isConditionValid(inputValue, clauseToEvaluate);
    }
    if (clauseToEvaluate === "A") {
      return true;
    }
    if (clauseToEvaluate === "R") {
      return false;
    }
    return isConditionValid(inputValue, rulesObject[clauseToEvaluate]);
  };

  return inputs.filter(input => isConditionValid(input, rulesObject["in"])).reduce((acc, item) => acc + getArraySum(Object.values(item)), 0);
}

function getPart2Answer(rulesObject) {
  const queue = [[{ x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] }, rulesObject["in"]]];
  const validatedItems = [] as Array<{ [key: string]: [number, number] }>;

  while (queue.length > 0) {
    //@ts-ignore: Ignore this
    const [intervalObject, ruleArray] = queue.shift();
    const [[conditionKey, conditionSymbol, conditionValue], ifCondition, elseCondition] = ruleArray;

    const evaluateGroup = (inputValue, condition) => {
      if (Array.isArray(condition)) {
        return queue.push([inputValue, condition]);
      } else {
        if (condition === "A") {
          validatedItems.push(inputValue);
          return;
        } else if (condition === "R") {
          return;
        }
        return queue.push([inputValue, rulesObject[condition]]);
      }
    };

    const baseObject = structuredClone(intervalObject);
    const [lowerBound, higherBound] = intervalObject[conditionKey];
    if (conditionSymbol === ">") {
      if (higherBound > conditionValue && lowerBound > conditionValue) {
        evaluateGroup(baseObject, ifCondition);
      } else if (higherBound > conditionValue && lowerBound < conditionValue) {
        evaluateGroup(Object.assign(baseObject, { [conditionKey]: [conditionValue + 1, higherBound] }), ifCondition);
        evaluateGroup(Object.assign(baseObject, { [conditionKey]: [lowerBound, conditionValue] }), elseCondition);
      } else {
        evaluateGroup(baseObject, elseCondition);
      }
    }
    if (conditionSymbol === "<") {
      if (lowerBound < conditionValue && higherBound < conditionValue) {
        evaluateGroup(baseObject, ifCondition);
      } else if (lowerBound < conditionValue && higherBound > conditionValue) {
        evaluateGroup(Object.assign(baseObject, { [conditionKey]: [lowerBound, conditionValue - 1] }), ifCondition);
        evaluateGroup(Object.assign(baseObject, { [conditionKey]: [conditionValue, higherBound] }), elseCondition);
      } else {
        evaluateGroup(baseObject, elseCondition);
      }
    }
  }

  return validatedItems.reduce((acc, items) => acc + Object.values(items).reduce((acc, [min, max]) => acc * (max - min + 1), 1), 0);
}

export default function getAnswer() {
  const [rules, inputs] = getDayInput(import.meta)
    .split("\n\n")
    .filter(Boolean);

  const inputList = inputs
    .split("\n")
    .filter(Boolean)
    .map(str => JSON.parse(str.replace(/\=/g, '":').replace(/\{/g, '{"').replace(/\,/g, ',"')));
  const rulesObject = getConditionRules(rules);

  return `Part 1: ${getPart1Answer(inputList, rulesObject)} Part 2: ${getPart2Answer(rulesObject)}`;
}

console.log(getAnswer());
