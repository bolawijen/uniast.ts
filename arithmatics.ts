/**
 * arithmatics.ts — arithmetic operator helpers.
 * Eat/need/match for +, -, *, / at the current parser position.
 * All functions call basic.allowWhitespace before operating.
 */

import type { Parser } from './Parser.js';
import * as basic from './basic.js';

// ── Add (+) ──

export function eatAdd(parser: Parser): boolean {
  basic.allowWhitespace(parser);
  return parser.eat('+');
}

export function needAdd(parser: Parser): void {
  if (!eatAdd(parser)) throw new Error('Expected addition operator (+)');
}

export function matchAdd(parser: Parser): boolean {
  basic.allowWhitespace(parser);
  return parser.match('+');
}

// ── Subtract (-) ──

export function eatSubtract(parser: Parser): boolean {
  basic.allowWhitespace(parser);
  return parser.eat('-');
}

export function needSubtract(parser: Parser): void {
  if (!eatSubtract(parser)) throw new Error('Expected subtract operator (-)');
}

export function matchSubtract(parser: Parser): boolean {
  basic.allowWhitespace(parser);
  return parser.match('-');
}

// ── Multiply (*) ──

export function eatMultiply(parser: Parser): boolean {
  basic.allowWhitespace(parser);
  return parser.eat('*');
}

export function needMultiply(parser: Parser): void {
  if (!eatMultiply(parser)) throw new Error('Expected multiply operator (*)');
}

export function matchMultiply(parser: Parser): boolean {
  basic.allowWhitespace(parser);
  return parser.match('*');
}

// ── Divide (/) ──

export function eatDivide(parser: Parser): boolean {
  basic.allowWhitespace(parser);
  return parser.eat('/');
}

export function needDivide(parser: Parser): void {
  if (!eatDivide(parser)) throw new Error('Expected divide operator (/)');
}

export function matchDivide(parser: Parser): boolean {
  basic.allowWhitespace(parser);
  return parser.match('/');
}
