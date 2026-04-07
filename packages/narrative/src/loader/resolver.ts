import type { IFileStore } from '../file-store';
import { resolveAbsolute, resolveRelative } from './ts-utils';

export type Resolved =
  | { kind: 'vfs'; path: string }
  | { kind: 'mapped'; value: unknown }
  | { kind: 'external'; spec: string };

export async function resolveSpecifier(
  vfs: IFileStore,
  spec: string,
  parent: string,
  importMap: Record<string, unknown>,
): Promise<Resolved> {
  if (Object.hasOwn(importMap, spec)) {
    return { kind: 'mapped', value: importMap[spec] };
  }
  if (spec.startsWith('./') || spec.startsWith('../')) {
    const p = await resolveRelative(vfs, spec, parent);
    if (p != null) return { kind: 'vfs', path: p };
  } else if (spec.startsWith('/')) {
    const p = await resolveAbsolute(vfs, spec);
    if (p != null) return { kind: 'vfs', path: p };
  }
  return { kind: 'external', spec };
}
