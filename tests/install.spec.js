import {describe, it, expect} from "bun:test";
import {installOPCli} from "../src/install";
import { mkdtempSync, rmdirSync, existsSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import {validateCli} from "@1password/op-js";

describe("Install", () => {
    it('should install the cli, when not present', async () => {
        const tmpDir = mkdtempSync(join(tmpdir(), 'op-cli'));

        const previousPath = process.env.PATH;
        process.env.PATH = "/bin:/usr/bin"
        if (process.env.RUNNER_TEMP === undefined) {
            process.env.RUNNER_TEMP = tmpDir;
        }

        const exe = await installOPCli();
        expect(exe.startsWith(process.env.RUNNER_TEMP)).toBe(true);

        expect(existsSync(join(exe, "op"))).toBe(true);

        const exe2 = await installOPCli();
        expect(exe2).not.toBe(exe);

        rmdirSync(tmpDir, {recursive: true});

        process.env.PATH = previousPath
    });
});
