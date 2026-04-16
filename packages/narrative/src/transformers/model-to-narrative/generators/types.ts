import type tsNS from 'typescript';
import { typeFromString } from '../ast/emit-helpers';

type Message = {
  type: 'command' | 'event' | 'state' | 'query';
  name: string;
  fields: { name: string; type: string; required: boolean }[];
};

function factoryFor(kind: Message['type']): string {
  if (kind === 'command') return 'defineCommand';
  if (kind === 'event') return 'defineEvent';
  if (kind === 'state') return 'defineState';
  return 'defineQuery';
}

/**
 * Emit `const X = define<Kind><{...fields}>('X')` statements for each message.
 * Replaces the legacy `type X = Command<'X', {...}>` alias form so the emitted
 * file works with the new runtime-tagged DSL — the `.when(X, "sentence", data)`
 * call sites expect `X` to be a runtime value.
 */
export function buildTypeAliases(ts: typeof tsNS, messages: Message[], exportedTypes?: Set<string>): tsNS.Statement[] {
  const f = ts.factory;

  return messages.map((m) => {
    const dataTypeLiteral = f.createTypeLiteralNode(
      m.fields.map((fld) =>
        f.createPropertySignature(
          undefined,
          /^[A-Za-z_]\w*$/.test(fld.name) ? f.createIdentifier(fld.name) : f.createStringLiteral(fld.name, true),
          fld.required ? undefined : f.createToken(ts.SyntaxKind.QuestionToken),
          typeFromString(ts, f, fld.type),
        ),
      ),
    );

    const factoryCall = f.createCallExpression(
      f.createIdentifier(factoryFor(m.type)),
      [dataTypeLiteral],
      [f.createStringLiteral(m.name, true)],
    );

    const declaration = f.createVariableDeclaration(
      f.createIdentifier(m.name),
      undefined,
      undefined,
      factoryCall,
    );

    const modifiers = exportedTypes?.has(m.name) ? [f.createModifier(ts.SyntaxKind.ExportKeyword)] : undefined;

    return f.createVariableStatement(modifiers, f.createVariableDeclarationList([declaration], ts.NodeFlags.Const));
  });
}
