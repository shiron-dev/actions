import type { InputOptions } from "@actions/core";

export interface ActionsCore {
  getInput: (name: string, options?: InputOptions) => string
  debug: (message: string) => void
  setFailed: (message: string | Error) => void
  setOutput: (name: string, value: any) => void
}
