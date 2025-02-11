/* eslint-disable @typescript-eslint/no-explicit-any */
export const flattenNestedObject = (obj: Record<string, any>, prefix = ""): Record<string, any> => {
  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      // Recursively flatten nested objects
      Object.assign(acc, flattenNestedObject(value, newKey));
    } else {
      acc[newKey] = value;
    }
    return acc;
  }, {} as Record<string, any>);
};