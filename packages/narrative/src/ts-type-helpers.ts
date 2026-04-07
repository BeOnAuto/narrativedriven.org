export function isInlineObject(ts: string): boolean {
  return /^\{[\s\S]*\}$/.test((ts ?? '').trim());
}

export function isInlineObjectArray(ts: string): boolean {
  const t = (ts ?? '').trim();
  return /^Array<\{[\s\S]*\}>$/.test(t) || /^\{[\s\S]*\}\[\]$/.test(t);
}

function extractObjectBody(tsType: string): string | null {
  const t = tsType.trim();
  let inner: string;
  if (t.startsWith('Array<{') && t.endsWith('}>')) {
    inner = t.slice(6, -1);
  } else if (t.endsWith('[]')) {
    inner = t.slice(0, -2).trim();
  } else {
    inner = t;
  }
  const match = inner.match(/^\{([\s\S]*)\}$/);
  return match ? match[1] : null;
}

function splitFieldsRespectingNesting(body: string): string[] {
  const fields: string[] = [];
  let current = '';
  let depth = 0;
  for (const char of body) {
    if (char === '<' || char === '{') depth++;
    if (char === '>' || char === '}') depth--;
    if ((char === ';' || char === ',') && depth === 0) {
      const trimmed = current.trim();
      if (trimmed) fields.push(trimmed);
      current = '';
      continue;
    }
    current += char;
  }
  const trimmed = current.trim();
  if (trimmed) fields.push(trimmed);
  return fields;
}

function isValidTsIdentifier(name: string): boolean {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name);
}

export function parseInlineObjectFields(tsType: string): Array<{ name: string; tsType: string }> {
  const body = extractObjectBody(tsType);
  if (body === null) return [];
  const rawFields = splitFieldsRespectingNesting(body);
  return rawFields
    .map((f) => {
      const colonIdx = f.indexOf(':');
      if (colonIdx === -1) return null;
      const name = f.slice(0, colonIdx).trim();
      const type = f.slice(colonIdx + 1).trim();
      if (!name || !type) return null;
      if (!isValidTsIdentifier(name)) return null;
      return { name, tsType: type };
    })
    .filter((f): f is { name: string; tsType: string } => f !== null);
}
