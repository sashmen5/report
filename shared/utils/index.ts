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

function isEmpty(input: unknown): boolean {
  if (input == null) {
    return true;
  }

  if (Array.isArray(input) || isString(input)) {
    return input.length === 0;
  }

  if (input instanceof Map || input instanceof Set) {
    return input.size === 0;
  }

  if (input instanceof Object) {
    return Object.keys(input).length === 0;
  }

  for (const key in input) {
    if (Object.prototype.hasOwnProperty.call(input, key)) {
      return false;
    }
  }

  return true;
}

function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(callback: T, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    const p = new Promise<ReturnType<T> | Error>((resolve, reject) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        try {
          const output = callback(...args);
          resolve(output);
        } catch (err) {
          if (err instanceof Error) {
            reject(err);
          }

          reject(new Error('An error occurred'));
        }
      }, delay);
    });
    return p;
  };
}

function keyBy<T extends Record<string, any>, K extends keyof T>(array: T[], key: K): Record<T[K], T> {
  return array.reduce(
    (acc, item) => {
      const keyValue = item[key];
      if (keyValue !== undefined) {
        acc[keyValue] = item;
      }
      return acc;
    },
    {} as Record<T[K], T>,
  );
}

export { isString, isNumber, cleanEmptyParams, isEmpty, debounce, keyBy };
