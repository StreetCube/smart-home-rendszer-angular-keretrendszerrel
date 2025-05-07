export function filterEnum<T extends Record<string, number>>(
  enumObj: T,
  options: { include?: number[]; exclude?: number[] }
): Partial<T> {
  const { include, exclude } = options;

  return Object.fromEntries(
    Object.entries(enumObj).filter(([key, value]) => {
      if (typeof value !== 'number') return false;
      if (include) return include.includes(value);
      if (exclude) return !exclude.includes(value);
      return true;
    })
  ) as Partial<T>;
}
