export interface GeneratedFile {
  path: string;
  code: string;
}

export interface GeneratedScenes {
  files: GeneratedFile[];
}

export interface CrossModuleImport {
  fromPath: string;
  typeNames: string[];
}
