export interface ThemeTypings {
  breakpoints: 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}
export type ResponsiveArray<T> = Array<T | null>;
export type ResponsiveObject<T> = Partial<
  Record<ThemeTypings['breakpoints'] | string, T>
>;
export type ResponsiveValue<T> = T | ResponsiveArray<T> | ResponsiveObject<T>;

export type FromResponsiveValue<T extends ResponsiveValue<any>> =
  T extends ResponsiveObject<infer F>
    ? F
    : T extends ResponsiveArray<infer F>
    ? F
    : T;

export const mapResponsive = <V extends ResponsiveValue<any>, O>(
  value: V,
  mapper: (value: FromResponsiveValue<V>) => O
): O =>
  mapper(
    Array.isArray(value) ? value[0] : 'base' in value ? value['base'] : value
  );
