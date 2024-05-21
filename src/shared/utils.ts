/**
 * Given an array with 0 or more elements, returns only the last element in a new array or empty array
 * Useful to restrict only one filter value at a time whenever uses updates the filter field
 * @param value The array to process
 * @returns Empty array or array with one element
 */
export const clampArrayWithNewValue = <T>(value: Array<T>) => {
  if (value.length === 0) {
    return value;
  }
  return [value[value.length - 1]];
};
