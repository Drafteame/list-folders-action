import core from "@actions/core";
import lodash from "lodash";

/**
 * Get action input with default value
 * @param {string} input input name to retrieve
 * @param {string} value string default value
 * @returns {string} The value of input, if is empty it return the default one
 */
export function getInput(input, value = "") {
  const inputValue = core.getInput(input);

  if (lodash.isEmpty(inputValue)) {
    return value;
  }

  return inputValue;
}

/**
 * Get action input as array
 * @param {string} input Input name to retrieve
 * @param {string} value Default value if input is empty
 * @param {string} sep Separator to split input string into array
 * @returns {string[]} Array of non-empty trimmed strings from input value, or default value if input is empty
 */
export function getArrayInput(input, value = [], sep = ",") {
  const inputValue = core.getInput(input);

  if (lodash.isEmpty(inputValue)) {
    return value;
  }

  return inputValue
    .split(sep)
    .map((item) => item.trim())
    .filter((item) => !lodash.isEmpty(item));
}

/**
 * Get action boolean input
 * @param {string} input input name to retrieve
 * @param {boolean} value boolean default value
 * @returns {boolean} The value of the input, if it is empty ir return the default one
 */
export function getBooleanInput(input, value = false) {
  const inputValue = core.getInput(input);

  if (lodash.isEmpty(inputValue)) {
    return value;
  }

  return inputValue.trim().toLowerCase() === "true";
}
