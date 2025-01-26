function dateToDayDate(val: Date | number) {
  const date = new Date(val);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export { dateToDayDate };
