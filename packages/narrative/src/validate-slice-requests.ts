import { type DocumentNode, type OperationDefinitionNode, parse, type SelectionSetNode, type TypeNode } from 'graphql';
import { convertJsonAstToSdl } from './parse-graphql-request';
import type { CommandMoment, Model, QueryMoment } from './schema';
import { isInlineObject, isInlineObjectArray, parseInlineObjectFields } from './ts-type-helpers';

export interface MomentRequestValidationError {
  type:
    | 'request_parse_error'
    | 'mutation_wrong_operation_type'
    | 'mutation_missing_input_arg'
    | 'mutation_input_type_mismatch'
    | 'mutation_message_not_found'
    | 'query_wrong_operation_type'
    | 'query_state_not_found'
    | 'query_field_not_found'
    | 'query_nested_field_not_found';
  message: string;
  sceneName: string;
  momentName: string;
}

type ParseResult = { ok: true; operation: OperationDefinitionNode } | { ok: false; error: string };

function parseRequestSafe(request: string): ParseResult {
  const sdl = convertJsonAstToSdl(request);

  let ast: DocumentNode;
  try {
    ast = parse(sdl);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }

  const op = ast.definitions.find((d): d is OperationDefinitionNode => d.kind === 'OperationDefinition');

  if (!op) {
    return { ok: false, error: 'No operation found in request' };
  }

  if (!op.name) {
    return { ok: false, error: 'Operation must have a name' };
  }

  return { ok: true, operation: op };
}

function validateMoment(
  moment: CommandMoment | QueryMoment,
  model: Model,
  sceneName: string,
): MomentRequestValidationError[] {
  if (!moment.request || moment.request.trim() === '') return [];

  const momentName = moment.name;
  const parsed = parseRequestSafe(moment.request);

  if (!parsed.ok) {
    return [{ type: 'request_parse_error', message: parsed.error, sceneName, momentName }];
  }

  if (moment.type === 'command') {
    return validateMutationRequest(parsed.operation, model, sceneName, momentName);
  }
  return validateQueryRequest(parsed.operation, model, moment, sceneName, momentName);
}

export function validateMomentRequests(model: Model): MomentRequestValidationError[] {
  const errors: MomentRequestValidationError[] = [];

  for (const scene of model.scenes) {
    for (const moment of scene.moments) {
      if (moment.type !== 'command' && moment.type !== 'query') continue;
      errors.push(...validateMoment(moment, model, scene.name));
    }
  }

  return errors;
}

function unwrapType(typeNode: TypeNode): string {
  if (typeNode.kind === 'NamedType') return typeNode.name.value;
  return unwrapType(typeNode.type);
}

function validateMutationRequest(
  operation: OperationDefinitionNode,
  model: Model,
  sceneName: string,
  momentName: string,
): MomentRequestValidationError[] {
  const errors: MomentRequestValidationError[] = [];
  const operationName = operation.name!.value;

  if (operation.operation !== 'mutation') {
    errors.push({
      type: 'mutation_wrong_operation_type',
      message: `Command moment '${momentName}' request should be a mutation, but found ${operation.operation}`,
      sceneName,
      momentName,
    });
    return errors;
  }

  const inputVar = (operation.variableDefinitions ?? []).find((v) => v.variable.name.value === 'input');

  if (!inputVar) {
    errors.push({
      type: 'mutation_missing_input_arg',
      message: `Mutation '${operationName}' is missing required $input variable`,
      sceneName,
      momentName,
    });
    return errors;
  }

  const inputTypeName = unwrapType(inputVar.type);
  const expectedTypeName = `${operationName}Input`;

  if (inputTypeName !== expectedTypeName) {
    errors.push({
      type: 'mutation_input_type_mismatch',
      message: `Mutation '${operationName}' input type should be '${expectedTypeName}', but found '${inputTypeName}'`,
      sceneName,
      momentName,
    });
    return errors;
  }

  const commandExists = model.messages.some((m) => m.type === 'command' && m.name === operationName);

  if (!commandExists) {
    errors.push({
      type: 'mutation_message_not_found',
      message: `No command message '${operationName}' found in model.messages`,
      sceneName,
      momentName,
    });
  }

  return errors;
}

function extractInlineFieldNames(tsType: string): string[] {
  return parseInlineObjectFields(tsType).map((f) => f.name);
}

function resolveNestedFieldNames(fieldType: string, model: Model): string[] | null {
  const trimmed = fieldType.trim();
  if (isInlineObject(trimmed) || isInlineObjectArray(trimmed)) {
    return extractInlineFieldNames(trimmed);
  }
  const referencedMessage = model.messages.find((m) => m.name === trimmed);
  if (referencedMessage) {
    return referencedMessage.fields.map((f) => f.name);
  }
  return null;
}

interface SelectionField {
  name: string;
  children?: SelectionField[];
}

function extractSelections(selectionSet: SelectionSetNode): SelectionField[] {
  const fields: SelectionField[] = [];
  for (const sel of selectionSet.selections) {
    if (sel.kind !== 'Field') continue;
    if (sel.name.value === '__typename') continue;
    const field: SelectionField = { name: sel.name.value };
    if (sel.selectionSet) {
      field.children = extractSelections(sel.selectionSet);
    }
    fields.push(field);
  }
  return fields;
}

function validateQueryRequest(
  operation: OperationDefinitionNode,
  model: Model,
  moment: QueryMoment,
  sceneName: string,
  momentName: string,
): MomentRequestValidationError[] {
  const errors: MomentRequestValidationError[] = [];
  const operationName = operation.name!.value;

  if (operation.operation !== 'query') {
    errors.push({
      type: 'query_wrong_operation_type',
      message: `Query moment '${momentName}' request should be a query, but found ${operation.operation}`,
      sceneName,
      momentName,
    });
    return errors;
  }

  const targetName = moment.server?.data?.items?.[0]?.target?.name;
  if (!targetName) return errors;

  const stateMessage = model.messages.find((m) => m.type === 'state' && m.name === targetName);

  if (!stateMessage) {
    errors.push({
      type: 'query_state_not_found',
      message: `State '${targetName}' referenced by query '${operationName}' not found in model.messages`,
      sceneName,
      momentName,
    });
    return errors;
  }

  const rootSelection = operation.selectionSet.selections[0];
  if (!rootSelection || rootSelection.kind !== 'Field' || !rootSelection.selectionSet) return errors;

  const selectedFields = extractSelections(rootSelection.selectionSet);
  const stateFieldNames = new Set(stateMessage.fields.map((f) => f.name));

  for (const sel of selectedFields) {
    if (!stateFieldNames.has(sel.name)) {
      errors.push({
        type: 'query_field_not_found',
        message: `Field '${sel.name}' in query '${operationName}' not found on state '${targetName}'`,
        sceneName,
        momentName,
      });
      continue;
    }

    if (sel.children && sel.children.length > 0) {
      const stateField = stateMessage.fields.find((f) => f.name === sel.name);
      if (!stateField) continue;

      const nestedNames = resolveNestedFieldNames(stateField.type, model);
      if (nestedNames === null) continue;

      const nestedNameSet = new Set(nestedNames);
      for (const child of sel.children) {
        if (!nestedNameSet.has(child.name)) {
          errors.push({
            type: 'query_nested_field_not_found',
            message: `Nested field '${child.name}' in query '${operationName}' not found on type of '${sel.name}'`,
            sceneName,
            momentName,
          });
        }
      }
    }
  }

  return errors;
}
