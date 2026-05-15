import { Injectable } from '@angular/core';

export type TextFieldKey = 'title' | 'institution' | 'authorName' | 'doi';

type Strategy = (v: string) => string;

const trim      = (v: string) => v.trim();
const collapse  = (v: string) => v.replace(/\s+/g, ' ');
const upper     = (v: string) => v.toUpperCase();
const pipe      = (...fns: Strategy[]): Strategy => (v) => fns.reduce((acc, fn) => fn(acc), v);

const STRATEGIES: Record<TextFieldKey, Strategy> = {
  title:       pipe(trim, collapse, upper),
  institution: pipe(trim, collapse, upper),
  authorName:  pipe(trim, collapse, upper),
  doi:         pipe(trim, collapse),
};

export abstract class TextNormalizer {
  abstract normalize(value: string, field: TextFieldKey): string;
}

@Injectable({ providedIn: 'root' })
export class TextNormalizerService extends TextNormalizer {
  override normalize(value: string, field: TextFieldKey): string {
    return (STRATEGIES[field] ?? trim)(value ?? '');
  }
}
