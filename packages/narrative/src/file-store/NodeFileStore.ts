import type { Dirent } from 'node:fs';
import * as fsp from 'node:fs/promises';
import * as path from 'node:path';
import * as url from 'node:url';
import type { IFileStore } from './index';

const toPosix = (p: string) => p.replace(/\\/g, '/');

const toAbs = (p: string) => {
  if (!p) return process.cwd();
  if (p.startsWith('file://')) return url.fileURLToPath(p);
  return path.isAbsolute(p) ? p : path.resolve(p);
};

export class NodeFileStore implements IFileStore {
  async write(p: string, data: Uint8Array): Promise<void> {
    const abs = toAbs(p);
    await fsp.mkdir(path.dirname(abs), { recursive: true });
    await fsp.writeFile(abs, data);
  }

  async read(p: string): Promise<Uint8Array | null> {
    const abs = toAbs(p);
    try {
      const buf = await fsp.readFile(abs);
      return new Uint8Array(buf);
    } catch {
      return null;
    }
  }

  async remove(p: string): Promise<void> {
    await fsp.rm(toAbs(p), { force: true });
  }

  async exists(p: string): Promise<boolean> {
    const abs = toAbs(p);
    try {
      await fsp.access(abs);
      return true;
    } catch {
      return false;
    }
  }

  async listTree(
    root: string = '/',
    opts?: {
      followSymlinkDirs?: boolean;
      includeSizes?: boolean;
      pruneDirRegex?: RegExp;
    },
  ): Promise<Array<{ path: string; type: 'file' | 'dir'; size: number }>> {
    const followSymlinkDirs = opts?.followSymlinkDirs ?? true;
    const includeSizes = opts?.includeSizes ?? true;
    const pruneDirRegex = opts?.pruneDirRegex;

    const out: Array<{ path: string; type: 'file' | 'dir'; size: number }> = [];

    const shouldPrune = (posixPath: string): boolean => {
      return Boolean(pruneDirRegex?.test(posixPath));
    };

    const getFileSize = async (abs: string): Promise<number> => {
      if (!includeSizes) return 0;
      const st = await fsp.stat(abs).catch(() => null);
      return st?.size ?? 0;
    };

    const processRegularFile = async (abs: string, posixPath: string): Promise<void> => {
      const size = await getFileSize(abs);
      out.push({ path: posixPath, type: 'file', size });
    };

    const processSymlink = async (
      abs: string,
      posixPath: string,
      walk: (dir: string) => Promise<void>,
    ): Promise<void> => {
      const st = await fsp.stat(abs).catch(() => null);
      if (!st) return;

      if (st.isDirectory()) {
        if (followSymlinkDirs && !shouldPrune(posixPath)) {
          await walk(abs);
        }
      } else {
        const size = includeSizes ? st.size : 0;
        out.push({ path: posixPath, type: 'file', size });
      }
    };

    const processDirectory = async (
      abs: string,
      posixPath: string,
      walk: (dir: string) => Promise<void>,
    ): Promise<void> => {
      if (!shouldPrune(posixPath)) {
        await walk(abs);
      }
    };

    const walk = async (absDir: string): Promise<void> => {
      if (shouldPrune(toPosix(absDir))) return;

      let entries: Dirent[];
      try {
        entries = await fsp.readdir(absDir, { withFileTypes: true });
      } catch {
        return;
      }

      out.push({ path: toPosix(absDir), type: 'dir', size: 0 });

      for (const e of entries) {
        const abs = path.join(absDir, e.name);
        const posixPath = toPosix(abs);

        try {
          if (e.isDirectory()) {
            await processDirectory(abs, posixPath, walk);
          } else if (e.isSymbolicLink()) {
            await processSymlink(abs, posixPath, walk);
          } else {
            await processRegularFile(abs, posixPath);
          }
        } catch {
          // skip inaccessible entries
        }
      }
    };

    const absRoot = toAbs(root);
    await walk(absRoot);

    out.sort((a, b) => (a.type === b.type ? a.path.localeCompare(b.path) : a.type === 'dir' ? -1 : 1));
    return out;
  }
}
