/**
 * Short random class codes used by the no-login (Arcade / Portfolio) track.
 * Case-insensitive; excludes look-alike characters (0/O, 1/I/L) so a code is
 * easy to read off a whiteboard or hand out verbally.
 */
const CODE_CHARS = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const CODE_LENGTH = 6;

/** Routes the class-code entry page must never match, so a code can't collide with a real page. */
export const RESERVED_CODES = new Set([
  "login", "teacher", "courses", "api", "admin", "about", "contact",
]);

export function generateClassCode(): string {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

export function normalizeClassCode(input: string): string {
  return input.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function isReservedCode(code: string): boolean {
  return RESERVED_CODES.has(normalizeClassCode(code).toLowerCase());
}
