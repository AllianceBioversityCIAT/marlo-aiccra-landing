import { describe, it, expect } from 'vitest';
import { greet, sum } from './example';

describe('greet', () => {
  it('returns a greeting message', () => {
    expect(greet('World')).toBe('Hello, World!');
  });
});

describe('sum', () => {
  it('adds two numbers correctly', () => {
    expect(sum(2, 3)).toBe(5);
  });

  it('handles negative numbers', () => {
    expect(sum(-1, 1)).toBe(0);
  });
});
