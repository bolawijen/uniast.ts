/**
 * Parser.ts — minimal streaming parser with plugin system.
 * Mirrors uniast Parser.zig: no built-in parse logic, just loops plugin.step().
 */

export type ParserState = (parser: Parser) => ParserState | undefined;

export interface ParserPlugin {
  /** Initial state function */
  state: ParserState;
  /** Called when a node is about to be appended; return falsy to skip */
  append?: (node: Record<string, unknown>) => boolean | void;
}

export class Parser {
  source: string;
  index = 0;
  plugin: ParserPlugin;

  constructor(source: string, plugin: ParserPlugin) {
    this.source = source;
    this.plugin = plugin;
    this.parse();
  }

  parse(): void {
    let state: ParserState = this.plugin.state;

    while (this.index < this.source.length) {
      state = state(this) || state;
    }
  }

  match(s: string): boolean {
    if (this.index + s.length > this.source.length) return false;
    if (s.length === 1) return this.source[this.index] === s;
    return this.source.slice(this.index, this.index + s.length) === s;
  }

  eat(s: string): boolean {
    if (this.match(s)) {
      this.index += s.length;
      return true;
    }
    return false;
  }

  need(s: string): void {
    if (!this.eat(s)) throw new Error(`Expected "${s}" at index ${this.index}`);
  }

  peek(): string | undefined {
    return this.index < this.source.length ? this.source[this.index] : undefined;
  }

  allowWhitespace(): void {
    while (this.peek()) {
      const c = this.peek()!;
      if (c === ' ' || c === '\t' || c === '\n' || c === '\r') this.index++;
      else break;
    }
  }

  readUntil(delimiter: string): string {
    const start = this.index;
    while (this.index < this.source.length && !this.match(delimiter)) {
      this.index++;
    }
    return this.source.slice(start, this.index);
  }

  readUntilChar(char: string): string {
    const start = this.index;
    while (this.index < this.source.length && this.source[this.index] !== char) {
      this.index++;
    }
    return this.source.slice(start, this.index);
  }

  readWord(): string {
    const start = this.index;
    while (this.index < this.source.length) {
      const c = this.source[this.index];
      const isAlpha = (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
      const isDigit = c >= '0' && c <= '9';
      if (isAlpha || c === '_' || (this.index > start && isDigit)) {
        this.index++;
      } else {
        break;
      }
    }
    return this.source.slice(start, this.index);
  }

  readIdentifier(): string {
    return this.readWord();
  }

  slice(start: number, end: number): string {
    return this.source.slice(start, end);
  }

  eatPunctuation(chars: string): string | null {
    if (this.index >= this.source.length) return null;
    const c = this.source[this.index];
    for (const p of chars) {
      if (c === p) {
        this.index++;
        return this.source[this.index - 1];
      }
    }
    return null;
  }
}
