export function generateUuids(count: number, uppercase: boolean): string[] {
  return Array.from({ length: count }, () => {
    const id = crypto.randomUUID();
    return uppercase ? id.toUpperCase() : id;
  });
}

export const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidUuidV4(uuid: string): boolean {
  return UUID_V4_REGEX.test(uuid);
}
