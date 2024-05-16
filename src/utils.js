/**
 * Checks if a given value is empty.
 *
 * @param {*} value - The value to check for emptiness.
 * @returns {boolean} - Returns true if the value is empty, false otherwise.
 */
export function isEmpty(value) {
  if (value == null || value == undefined) {
    // Handles null and undefined
    return true;
  }

  if (typeof value === "boolean") {
    // Boolean values are never empty
    return false;
  }

  if (typeof value === "number") {
    // Number values are never empty
    return false;
  }

  if (typeof value === "string") {
    // Check if the string is empty
    return value.trim().length === 0;
  }

  // For any other types, assume it's not empty
  return false;
}
