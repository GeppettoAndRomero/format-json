import { describe, it, expect } from 'vitest';
import { isAcceptedJsonFile } from '@/utils/fileValidation';

const f = (name: string, type = ''): File => ({ name, type } as unknown as File);

describe('isAcceptedJsonFile', () => {
  it('accepts .json regardless of case', () => {
    expect(isAcceptedJsonFile(f('data.JSON'))).toBe(true);
  });

  it('accepts .txt', () => {
    expect(isAcceptedJsonFile(f('data.txt'))).toBe(true);
  });

  it('accepts an application/json mime type regardless of extension', () => {
    expect(isAcceptedJsonFile(f('data', 'application/json'))).toBe(true);
  });

  it('accepts any text/* mime type regardless of extension', () => {
    expect(isAcceptedJsonFile(f('data', 'text/plain'))).toBe(true);
  });

  it('rejects an unsupported extension with no accepted mime type', () => {
    expect(isAcceptedJsonFile(f('photo.png', 'image/png'))).toBe(false);
  });

  it('rejects a file with no extension and no mime type', () => {
    expect(isAcceptedJsonFile(f('README'))).toBe(false);
  });
});
