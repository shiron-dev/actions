import type { UploadArtifactOptions } from "@actions/artifact";
import type { Buffer } from "node:buffer";
import * as crypto from "node:crypto";
import * as fs from "node:fs";
import { DefaultArtifactClient } from "@actions/artifact";
import * as core from "@actions/core";
import * as yaml from "yaml";

const writeDir = "./matrix-output-dd7fd3220ec9";
const artifactPrefix = "matrix-output-dd7fd3220ec9";

async function run() {
  try {
    const step_name: string | undefined = core.getInput("matrix-step-name");
    const matrix_key: string | undefined = core.getInput("matrix-key");
    const outputs: string | undefined = core.getInput("outputs");

    core.debug("step_name:");
    core.debug(step_name || "undefined");

    core.debug("matrix_key:");
    core.debug(matrix_key || "undefined");

    core.debug("outputs:");
    core.debug(outputs || "undefined");

    function isEmptyInput(value: string | null | undefined): boolean {
      return value === null || value === undefined || value.trim() === "";
    }

    if (isEmptyInput(step_name) && !isEmptyInput(matrix_key)) {
      core.setFailed("`matrix-step-name` can not be empty when `matrix-key` specified");
      return;
    }

    if (!isEmptyInput(step_name) && isEmptyInput(matrix_key)) {
      core.setFailed("`matrix-key` can not be empty when `matrix-step-name` specified");
      return;
    }

    const matrix_mode: boolean = !isEmptyInput(step_name) && !isEmptyInput(matrix_key);

    let outputs_struct: Record<string, any> = {};
    if (!isEmptyInput(outputs)) {
      try {
        outputs_struct = yaml.parse(outputs as string);
      }
      catch (error: any) {
        const message = `Outputs should be valid YAML
---------------------
${outputs}
---------------------
${error}`;
        core.setFailed(message);
        return;
      }
    }

    Object.keys(outputs_struct).forEach((key) => {
      core.setOutput(key, outputs_struct[key]);
    });

    core.debug("outputs_struct:");
    core.debug(JSON.stringify(outputs_struct));

    core.debug("JSON.stringify(outputs_struct):");
    core.debug(JSON.stringify(outputs_struct));

    core.setOutput("result", JSON.stringify(outputs_struct));
    const artifact_content: Record<string, any> = isEmptyInput(matrix_key) ? outputs_struct : { [matrix_key as string]: outputs_struct };
    core.debug("artifact_content:");
    core.debug(JSON.stringify(artifact_content));

    if (!isEmptyInput(outputs) && matrix_mode) {
      // const artifact_content: Record<string, any> = isEmptyInput(matrix_key) ? outputs_struct : { [matrix_key as string]: outputs_struct };

      const filePath = `${writeDir}/${step_name}`;
      fs.mkdirSync(writeDir, { recursive: true });

      fs.writeFileSync(filePath, JSON.stringify(artifact_content));
      const fileBuffer: Buffer = fs.readFileSync(filePath);
      const hashSum: crypto.Hash = crypto.createHash("sha256");
      hashSum.update(fileBuffer);

      const hex: string = hashSum.digest("hex");

      const artifactClient: DefaultArtifactClient = new DefaultArtifactClient();
      const artifactName: string = `${artifactPrefix}-${hex}`;
      const files: string[] = [
        filePath,
      ];

      const rootDirectory: string = "."; // Also possible to use __dirname
      const options: UploadArtifactOptions = {
      };

      await artifactClient.uploadArtifact(artifactName, files, rootDirectory, options);
    }
  }
  catch (error: any) {
    core.setFailed(error.message);
  }
}

// eslint-disable-next-line antfu/no-top-level-await
await run();
