function isString(str: unknown): str is string {
  return typeof str === 'string';
}

function isNumber(input: unknown): input is number {
  return typeof input === 'number' || input instanceof Number;
}

const cleanEmptyParams = <T extends Record<string, unknown>>(search: T) => {
  const newSearch = { ...search };
  Object.keys(newSearch).forEach(key => {
    const value = newSearch[key];
    if (value === undefined || value === '' || (isNumber(value) && isNaN(value))) {
      delete newSearch[key];
    }
  });

  return newSearch;
};

export { isString, isNumber, cleanEmptyParams };
