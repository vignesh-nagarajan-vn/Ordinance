export const basePath =
  process.env.NODE_ENV === "production" ? "/Ordinance" : "";

export function asset(path: string): string {
  return `${basePath}${path}`;
}
