import {
    getInput, getMultilineInput,
    setFailed
} from '@actions/core';
import {installOPCli} from "./install.js";
import {exportSecrets} from "./secrets.js";

export type Inputs = {
    secrets: string[],
    export: boolean,
    mask: boolean,
}

async function run() {
    const inputs: Inputs = {
        secrets: getMultilineInput("secrets"),
        export: getInput("export") === 'true',
        mask: getInput("mask-secrets") === 'true',
    }

    try {
        await installOPCli();
        exportSecrets(inputs)

        process.exit(0);
    } catch (error) {
        if (error instanceof Error) {
            setFailed(error.message);
        }

        setFailed('Error is not an instance of Error');
    }
}

run();
