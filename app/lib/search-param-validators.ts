function bool(val: unknown) {
  return val === true ? true : undefined;
}

function string(val: unknown) {
  return typeof val === 'string' ? val : undefined;
}

function number(val: unknown) {
  return typeof val === 'number' ? val : undefined;
}

function array(val: unknown) {
  return Array.isArray(val) ? val : undefined;
}

const searchParamsValidate = {
  bool,
  string,
  number,
  array,
};

export { searchParamsValidate };
