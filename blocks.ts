/**
 * blocks.ts — block/bracket helpers for the Parser.
 * Mirrors uniast blocks.zig: eat/need/match for (), {}, [].
 * All functions call basic.allowWhitespace before operating.
 */

import type { Parser } from './Parser.js';
import * as basic from './basic.js';

// ── eat: return true if bracket was consumed ──

export function eatOpenParen(parser: Parser): boolean {
  basic.allowWhitespace(parser);
  return parser.eat('(');
}

export function eatCloseParen(parser: Parser): boolean {
  basic.allowWhitespace(parser);
  return parser.eat(')');
}

export function eatOpenCurly(parser: Parser): boolean {
  basic.allowWhitespace(parser);
  return parser.eat('{');
}

export function eatCloseCurly(parser: Parser): boolean {
  basic.allowWhitespace(parser);
  return parser.eat('}');
}

export function eatOpenSquare(parser: Parser): boolean {
  basic.allowWhitespace(parser);
  return parser.eat('[');
}

export function eatCloseSquare(parser: Parser): boolean {
  basic.allowWhitespace(parser);
  return parser.eat(']');
}

// ── need: throw if bracket is missing ──

export function needOpenParen(parser: Parser): void {
  if (!eatOpenParen(parser)) throw new Error('Expected open parenthesis');
}

export function needCloseParen(parser: Parser): void {
  if (!eatCloseParen(parser)) throw new Error('Expected close parenthesis');
}

export function needOpenCurly(parser: Parser): void {
  if (!eatOpenCurly(parser)) throw new Error('Expected open curly brace');
}

export function needCloseCurly(parser: Parser): void {
  if (!eatCloseCurly(parser)) throw new Error('Expected close curly brace');
}

export function needOpenSquare(parser: Parser): void {
  if (!eatOpenSquare(parser)) throw new Error('Expected open square bracket');
}

export function needCloseSquare(parser: Parser): void {
  if (!eatCloseSquare(parser)) throw new Error('Expected close square bracket');
}

// ── match: check without consuming ──

export function matchOpen(parser: Parser): boolean {
  basic.allowWhitespace(parser);
  return parser.match('{');
}

export function matchClose(parser: Parser): boolean {
  basic.allowWhitespace(parser);
  return parser.match('}');
}
