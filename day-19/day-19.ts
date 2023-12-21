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

function getPart2Answer(inputList, rulesObject) {}

export default function getAnswer() {
  const [rules, inputs] = getDayInput(import.meta)
    .split("\n\n")
    .filter(Boolean);

  const inputList = inputs
    .split("\n")
    .filter(Boolean)
    .map(str => JSON.parse(str.replace(/\=/g, '":').replace(/\{/g, '{"').replace(/\,/g, ',"')));
  const rulesObject = getConditionRules(rules);

  return `Part 1: ${getPart1Answer(inputList, rulesObject)} Part 2: ${getPart2Answer(inputList, rulesObject)}`;
}

console.log(getAnswer());
