function colors(specifier: string): string[] {
  var n = (specifier.length / 6) | 0,
    colors = new Array(n),
    i = 0;
  while (i < n) colors[i] = '#' + specifier.slice(i * 6, ++i * 6);
  return colors;
}

const COLORS = {
  Dark2: colors('1b9e77d95f027570b3e7298a66a61ee6ab02a6761d666666'),
  Tableau10: colors('4e79a7f28e2ce1575976b7b259a14fedc949af7aa1ff9da79c755fbab0ab'),
};

export { COLORS };
