import { describe, expect, it } from 'vitest';
import { calculateWinner, isDraw } from './gameLogic';
import type { Squares } from './types';

const board = (cells: string): Squares =>
  [...cells].map(c => (c === '.' ? null : (c as 'X' | 'O')));

describe('calculateWinner', () => {
  it('returns null for an empty board', () => {
    expect(calculateWinner(board('.........'))).toBeNull();
  });

  it.each([
    ['a row', 'XXX' + 'OO.' + '...', 'X'],
    ['a column', 'OX.' + 'OX.' + 'O..', 'O'],
    ['a diagonal', 'XO.' + 'OX.' + '..X', 'X'],
    ['the anti-diagonal', 'XXO' + 'XO.' + 'O..', 'O'],
  ])('detects a win on %s', (_name, cells, expected) => {
    expect(calculateWinner(board(cells))).toBe(expected);
  });

  it('returns null when no line is complete', () => {
    expect(calculateWinner(board('XOX' + 'XOO' + 'OXX'))).toBeNull();
  });
});

describe('isDraw', () => {
  it('is true for a full board with no winner', () => {
    expect(isDraw(board('XOX' + 'XOO' + 'OXX'))).toBe(true);
  });

  it('is false while squares are still empty', () => {
    expect(isDraw(board('XO.' + '...' + '...'))).toBe(false);
  });

  it('is false for a full board with a winner', () => {
    expect(isDraw(board('XXX' + 'OOX' + 'XOO'))).toBe(false);
  });
});
