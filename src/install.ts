import * as os from "os";
import {downloadTool, extractZip} from "@actions/tool-cache";
import {addPath, debug, info} from "@actions/core";
import {validateCli} from "@1password/op-js";

export async function installOPCli(): Promise<string> {
    try {
        await validateCli();
        info("op-cli already installed, skipping download");
        return "op"
    } catch (e) {
        debug("op-cli not found, installing");
    }

    const appUpdateResponse = await fetch('https://app-updates.agilebits.com/check/1/0/CLI2/en/2.0.0/N');
    const appUpdateJson = await appUpdateResponse.json() as { version: string};

    const downloadLink = getDownloadLink(appUpdateJson.version);

    info(`Downloading ${downloadLink}`);

    const downloadPath = await downloadTool(downloadLink);

    debug(`Downloaded to ${downloadPath}`);

    info('Extracting op-cli');
    const extPath = await extractZip(downloadPath);
    debug(`Extracted to ${extPath}`);

    addPath(extPath);

    return extPath;
}

function getDownloadLink(version: string) {
    let platform: string = os.platform();
    let arch = os.arch();

    // normalize arch
    if (arch === 'x64') {
        arch = 'amd64';
    }

    if (platform === 'win32') {
        platform = 'windows';
    }

    if (!['windows', 'darwin', 'linux'].includes(platform)) {
        throw new Error(`Unsupported platform: ${platform}`)
    }

    if (!['amd64', 'arm64'].includes(arch)) {
        throw new Error(`Unsupported architecture: ${arch}`)
    }

    return `https://cache.agilebits.com/dist/1P/op2/pkg/v${version}/op_${platform}_${arch}_v${version}.zip`;
}
