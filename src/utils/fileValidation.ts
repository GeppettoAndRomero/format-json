/**
 * Accept-list for the "choose/drop a .json file" input path. `.json` is the
 * primary expected extension; a generic `text/*` MIME type (or `.txt`) is
 * also accepted since some OSes/editors report `.json` files that way, and
 * a JSON document is, after all, plain text — the actual validity check
 * happens later, when the content is parsed (`jsonEngine.ts`).
 */
const ALLOWED_EXTENSIONS = ['.json', '.txt'];
const ALLOWED_MIME_TYPES = ['application/json', 'text/json'];
const ALLOWED_MIME_PREFIX = 'text/';

export function isAcceptedJsonFile(file: File): boolean {
  const type = file.type.toLowerCase();
  if (type && (ALLOWED_MIME_TYPES.includes(type) || type.startsWith(ALLOWED_MIME_PREFIX))) return true;
  const dot = file.name.lastIndexOf('.');
  if (dot < 0) return false;
  return ALLOWED_EXTENSIONS.includes(file.name.slice(dot).toLowerCase());
}
