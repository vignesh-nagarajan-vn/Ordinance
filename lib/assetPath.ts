// On Vercel the app is served from the domain root, so there is no base path
// prefix to apply. Kept as a thin helper so existing call sites stay unchanged
// and a prefix can be reintroduced later if the app moves to a sub-path host.
export const basePath = "";

export function asset(path: string): string {
  return `${basePath}${path}`;
}
