export function memoize(func) {
  const stored = new Map();
  return (...args) => {
    const k = JSON.stringify(args);
    if (stored.has(k)) {
      return stored.get(k);
    }
    const result = func(...args);
    stored.set(k, result);
    return result;
  };
}
