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

// ── Double quote helpers ("...") ──

/** Read content between double quotes and consume the closing quote. */
export function readQuote(parser: Parser): string {
  if (!parser.eat('"')) throw new Error('Expected opening double quote');
  const start = parser.index;
  while (parser.index < parser.source.length) {
    if (parser.source[parser.index] === '\\') {
      parser.index += 2; // skip escape sequence
      continue;
    }
    if (parser.source[parser.index] === '"') break;
    parser.index++;
  }
  const content = parser.source.slice(start, parser.index);
  parser.eat('"') || (() => { throw new Error('Unterminated double-quoted string'); })();
  return content;
}

/** Eat content between double quotes if present; returns null if not a double quote. */
export function eatQuote(parser: Parser): string | null {
  if (!parser.match('"')) return null;
  return readQuote(parser);
}

/** Require double-quoted string; throws if missing. */
export function needQuote(parser: Parser): string {
  if (!parser.match('"')) throw new Error('Expected double-quoted string');
  return readQuote(parser);
}

// ── Single quote helpers ('...') ──

/** Read content between single quotes and consume the closing quote. */
export function readSingleQuote(parser: Parser): string {
  if (!parser.eat("'")) throw new Error("Expected opening single quote");
  const start = parser.index;
  while (parser.index < parser.source.length) {
    if (parser.source[parser.index] === '\\') {
      parser.index += 2;
      continue;
    }
    if (parser.source[parser.index] === "'") break;
    parser.index++;
  }
  const content = parser.source.slice(start, parser.index);
  parser.eat("'") || (() => { throw new Error("Unterminated single-quoted string"); })();
  return content;
}

/** Eat content between single quotes if present; returns null if not a single quote. */
export function eatSingleQuote(parser: Parser): string | null {
  if (!parser.match("'")) return null;
  return readSingleQuote(parser);
}

/** Require single-quoted string; throws if missing. */
export function needSingleQuote(parser: Parser): string {
  if (!parser.match("'")) throw new Error("Expected single-quoted string");
  return readSingleQuote(parser);
}
