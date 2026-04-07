export interface IFileStore {
  write(path: string, data: Uint8Array): Promise<void>;
  read(path: string): Promise<Uint8Array | null>;
  exists(path: string): Promise<boolean>;
  listTree(
    root?: string,
    opts?: {
      followSymlinkDirs?: boolean;
      includeSizes?: boolean;
      pruneDirRegex?: RegExp;
    },
  ): Promise<Array<{ path: string; type: 'file' | 'dir'; size: number }>>;
  remove(path: string): Promise<void>;
}

export { InMemoryFileStore } from './InMemoryFileStore';
