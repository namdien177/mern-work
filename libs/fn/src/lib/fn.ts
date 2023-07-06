export function isEmptyObject(obj: Record<string, unknown>) {
  for (const key in obj) {
    if (obj[key] !== undefined) {
      return false;
    }
  }
  return true;
}
