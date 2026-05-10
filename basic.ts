/**
 * basic.ts — core parser utility functions.
 * Standalone helpers that take a parser instance, mirroring uniast basic.zig.
 */

import type { Parser } from './Parser.js';

/** Skip whitespace at current position. */
export function allowWhitespace(parser: Parser): void {
  while (parser.peek()) {
    const c = parser.peek()!;
    if (c === ' ' || c === '\t' || c === '\n' || c === '\r') parser.index++;
    else break;
  }
}

/** Require whitespace at current position, then skip it. */
export function needWhitespace(parser: Parser): void {
  if (parser.peek() === undefined || !/\s/.test(parser.source[parser.index])) {
    throw new Error('Expected whitespace');
  }
  allowWhitespace(parser);
}

/** Read an alphanumeric word from current position. */
export function readWord(parser: Parser): string {
  const start = parser.index;
  while (parser.index < parser.source.length) {
    const ch = parser.source[parser.index];
    if (
      (ch >= 'a' && ch <= 'z') ||
      (ch >= 'A' && ch <= 'Z') ||
      ch === '_' ||
      (parser.index > start && ch >= '0' && ch <= '9')
    ) {
      parser.index++;
    } else {
      break;
    }
  }
  return parser.source.slice(start, parser.index);
}

/** Read an identifier (alphanumeric + underscore). */
export function readIdentifier(parser: Parser): string {
  return readWord(parser);
}

/** Eat a punctuation character if it matches one of the given chars. */
export function eatPunctuation(parser: Parser, chars: string): string | null {
  if (parser.index >= parser.source.length) return null;
  const c = parser.source[parser.index];
  for (const p of chars) {
    if (c === p) {
      parser.index++;
      return parser.source.slice(parser.index - 1, parser.index);
    }
  }
  return null;
}
