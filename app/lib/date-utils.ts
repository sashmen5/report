function dateToDayDate(val?: Date | number | string) {
  if (!val) {
    return '';
  }
  const date = new Date(val);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function formatDate(val?: Date | number | string | null): string {
  if (!val) {
    return '';
  }
  const date = new Date(val);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

export { dateToDayDate, formatDate };
