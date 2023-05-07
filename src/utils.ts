export function addApiResponseOverridenNotice<T extends object>(data: T): T {
  return {
    notice: `API response overriden by dev-proxy!`,
    ...data,
  };
}

export function formatAsJson(data: unknown): string {
  return JSON.stringify(data, null, 2);
}

export function formatAsJsonWithNotice<T extends object>(data: T): string {
  return formatAsJson(addApiResponseOverridenNotice(data));
}
