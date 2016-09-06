import type fs from 'fs'
import type childProcess from 'child_process'

type ReadFileOptions = { encoding?: string | null, flag?: string }
type WriteFileOptions = { encoding?: string | null, mode?: number, flag?: string}

declare module 'mz/fs' {
  declare function mkdir (
    path: string | Buffer,
    mode?: number
  ) : Promise<void>

  declare function open (
    path: string | Buffer,
    flags: string | number,
    mode?: number
  ) : Promise<number>

  declare function readFile (
    path: string | Buffer | number,
    options?: ReadFileOptions
  ): Promise<Buffer>

  declare function stat (
    path: string | Buffer
  ) : Promise<fs.Stats>

  declare function writeFile (
    file: string | Buffer | number,
    data: string | Buffer,
    options?: WriteFileOptions
  ) : Promise<void>

  declare function appendFile (
    file: string | Buffer | number,
    data: string | Buffer,
    options?: WriteFileOptions
  ) : Promise<void>
}

declare module 'mz/child_process' {
  declare function spawn (
    command: string,
    args?: Array<string>,
    options?: {
      cwd?: string,
      env?: Object,
      argv0?: string,
      stdio?: string | Array<string>,
      detached?: boolean,
      uid?: number,
      gid?: number,
      shell?: boolean | string
    }
  ) : childProcess.ChildProcess
}
