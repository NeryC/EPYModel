import { describe, it, expect } from 'vitest';
import {
  filterLines,
  hiddableLines,
  defaultVisibleLines,
  setNewSelectedLines,
} from '../index';

describe('hiddableLines', () => {
  it('returns an array of line items for a known type', () => {
    const lines = hiddableLines('reported');
    expect(Array.isArray(lines)).toBe(true);
  });

  it('respects the second-arg filter (toggle hiddable on/off)', () => {
    const onlyHiddable = hiddableLines('reported', true);
    const onlyNonHiddable = hiddableLines('reported', false);
    expect(Array.isArray(onlyHiddable)).toBe(true);
    expect(Array.isArray(onlyNonHiddable)).toBe(true);
    // The two partitions should be disjoint by `hiddable` flag
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(onlyHiddable.every((l: any) => l.hiddable === true)).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(onlyNonHiddable.every((l: any) => l.hiddable !== true)).toBe(true);
  });
});

describe('defaultVisibleLines', () => {
  it('returns lines that are hiddable AND default for a known type', () => {
    const lines = defaultVisibleLines('reported');
    expect(Array.isArray(lines)).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(lines.every((l: any) => l.hiddable === true && l.default === true)).toBe(true);
  });
});

describe('filterLines', () => {
  // Note: filterLines is INCLUSIVE in this codebase. It returns lines whose name
  // appears in the provided list (not excludes them).
  it('returns only lines whose name is in the allow list', () => {
    const allLines = hiddableLines('reported').concat(hiddableLines('reported', false));
    if (allLines.length === 0) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const firstName = (allLines[0] as any).name;
    const result = filterLines('reported', [firstName]);
    expect(result.length).toBeGreaterThan(0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(result.every((l: any) => l.name === firstName)).toBe(true);
  });

  it('returns empty array when no names match', () => {
    const result = filterLines('reported', ['__nonexistent_line__']);
    expect(result).toEqual([]);
  });
});

describe('setNewSelectedLines', () => {
  it('adds a line when not present', () => {
    const result = setNewSelectedLines([], { name: 'x', label: 'X' });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('x');
  });

  it('removes a line when already present (toggle behavior)', () => {
    const line = { name: 'x', label: 'X' };
    const result = setNewSelectedLines([line], line);
    expect(result).toHaveLength(0);
  });
});
