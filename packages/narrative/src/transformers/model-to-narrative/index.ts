import ts from 'typescript';
import type { Model } from '../../index';
import { formatWithPrettier } from './formatting/prettier';
import { buildImports } from './generators/imports';
import { buildAllMetadataStatements } from './generators/metadata';
import { generateAllModulesCode } from './generators/module-code';
import type { GeneratedFile, GeneratedScenes } from './types';

/**
 * Converts a schema specification to TypeScript flow DSL code files.
 *
 * This function takes a complete schema specification and generates the corresponding
 * TypeScript code using the flow DSL, including imports, type definitions, builders,
 * and flow specifications. Each module in the model produces one output file.
 *
 * @param model The complete schema specification conforming to SpecsSchema
 * @returns Promise resolving to GeneratedScenes with files array
 */
export async function modelToNarrative(model: Model): Promise<GeneratedScenes> {
  const flowImport = '@onauto/narrative';
  const integrationImport = extractIntegrationImportFromModel(model);

  const moduleFiles = generateAllModulesCode(model, { flowImport, integrationImport });
  const metadataFile = generateMetadataFile(model, flowImport);
  const rawFiles = metadataFile ? [metadataFile, ...moduleFiles] : moduleFiles;

  const formattedFiles = await Promise.all(
    rawFiles.map(async (file) => ({
      path: file.path,
      code: await formatWithPrettier(file.code),
    })),
  );

  return { files: formattedFiles };
}

function generateMetadataFile(model: Model, flowImport: string): GeneratedFile | null {
  const result = buildAllMetadataStatements(ts, model);
  if (!result) return null;

  const f = ts.factory;
  const { statements, usedFunctions } = result;

  const imports = buildImports(ts, { flowImport, integrationImport: '' }, [], [], [], Array.from(usedFunctions));
  const allStatements: ts.Statement[] = [];
  if (imports.importFlowValues) allStatements.push(imports.importFlowValues);
  allStatements.push(...statements);

  const file = f.createSourceFile(allStatements, f.createToken(ts.SyntaxKind.EndOfFileToken), ts.NodeFlags.None);
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  return { path: 'model.narrative.ts', code: printer.printFile(file) };
}

function extractIntegrationImportFromModel(model: Model): string {
  if (model.integrations && model.integrations.length > 0) {
    return model.integrations[0].source;
  }
  return '';
}

export type { GeneratedScenes } from './types';
