/* eslint-disable no-console */
import type { ActionsCore } from "@/core";
import type { InputOptions } from "@actions/core";

export const core: ActionsCore = {
  getInput: (name: string, _options?: InputOptions) => {
    switch (name) {
      case "matrix-step-name":
        return "matrix-step-name";
      case "matrix-key":
        return "matrix-key";
      case "outputs":
        return "outputs";
      default:
        return "";
    }
  },
  debug: (message: string) => {
    console.log(message);
  },
  setFailed: (message: string | Error) => {
    console.log(message);
  },
  setOutput: (name: string, value: any) => {
    console.log(name, value);
  },
};
