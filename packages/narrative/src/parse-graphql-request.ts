import { type OperationDefinitionNode, parse, print, type TypeNode } from 'graphql';

export interface ParsedArg {
  name: string;
  tsType: string;
  graphqlType: string;
  nullable: boolean;
}

export interface ParsedGraphQlOperation {
  operationName: string;
  args: ParsedArg[];
}

function getTypeName(typeNode: TypeNode): { graphqlType: string; nullable: boolean; isArray: boolean } {
  if (typeNode.kind === 'NamedType') {
    return { graphqlType: typeNode.name.value, nullable: true, isArray: false };
  } else if (typeNode.kind === 'NonNullType') {
    const inner = getTypeName(typeNode.type);
    return { ...inner, nullable: false };
  } else {
    const inner = getTypeName(typeNode.type);
    return { graphqlType: inner.graphqlType, nullable: true, isArray: true };
  }
}

function graphqlToTs(type: string): string {
  switch (type) {
    case 'String':
      return 'string';
    case 'Int':
    case 'Float':
    case 'Number':
      return 'number';
    case 'Boolean':
      return 'boolean';
    case 'Date':
      return 'Date';
    default:
      return type;
  }
}

export function convertJsonAstToSdl(request: string): string {
  if (request.startsWith('{') && request.includes('"kind"')) {
    try {
      const ast = JSON.parse(request) as unknown;
      if (typeof ast === 'object' && ast !== null && 'kind' in ast && ast.kind === 'Document') {
        return print(ast as Parameters<typeof print>[0]);
      }
    } catch {
      // If parsing fails, assume it's already a GraphQL string
    }
  }
  return request;
}

export function parseGraphQlRequest(request: string): ParsedGraphQlOperation {
  const sdlRequest = convertJsonAstToSdl(request);

  const ast = parse(sdlRequest);
  const op = ast.definitions.find(
    (d): d is OperationDefinitionNode =>
      d.kind === 'OperationDefinition' && (d.operation === 'query' || d.operation === 'mutation'),
  );

  if (!op) throw new Error('No query or mutation operation found');

  const operationName = op.name?.value;
  if (operationName == null) throw new Error('Operation must have a name');

  const args: ParsedArg[] = (op.variableDefinitions ?? []).map((def) => {
    const varName = def.variable.name.value;
    const { graphqlType, nullable, isArray } = getTypeName(def.type);
    return {
      name: varName,
      graphqlType,
      tsType: isArray ? `${graphqlToTs(graphqlType)}[]` : graphqlToTs(graphqlType),
      nullable,
    };
  });

  const field = op.selectionSet.selections[0];
  if (field?.kind !== 'Field' || !field.name.value) {
    throw new Error('Selection must be a field');
  }

  return {
    operationName: field.name.value,
    args,
  };
}

export function parseMomentRequest(moment: {
  request?: string;
  [key: string]: unknown;
}): ParsedGraphQlOperation | undefined {
  if (moment.request == null) return undefined;
  return parseGraphQlRequest(moment.request);
}
