export function getLCMFromArray(numberArray) {
  function gcd(a, b) {
    for (let temp = b; b !== 0; ) {
      b = a % b;
      a = temp;
      temp = b;
    }
    return a;
  }

  return numberArray.reduce((a, b) => (a * b) / gcd(a, b), numberArray[0]);
}
