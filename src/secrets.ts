import { OPUrl, parseOPUrl } from './url.js';
import { item } from '@1password/op-js';
import { exportVariable, info, setOutput, setSecret } from '@actions/core';
import type { Inputs } from './main.js';

export function exportSecrets(inputs: Inputs) {
    for (let secret of inputs.secrets) {
        secret = secret.trim();

        // Skip empty lines or comments
        if (secret.length === 0 || secret.startsWith('#')) {
            continue;
        }

        if (secret.indexOf('op://') === 0) {
            const parsed = parseOPUrl(secret);

            if (parsed.field === '') {
                const vaultItem = item.get(parsed.item, {
                    vault: parsed.vault,
                });

                if (vaultItem.fields !== undefined) {
                    for (const field of vaultItem.fields) {
                        if (field.value === undefined) {
                            continue;
                        }

                        exportSecretToGHA(field.label, field.value, inputs);
                    }
                }
            } else {
                exportSecretToGHA(parsed.field, getValueByUrl(parsed), inputs);
            }
        } else {
            const parts = secret.split('=', 2);
            const parsed = parseOPUrl(parts[1]);

            if (parsed.field === '') {
                info(
                    `Skipping ${parsed.vault}/${parsed.item} because no field is set in url`,
                );
                continue;
            }

            exportSecretToGHA(parts[0], getValueByUrl(parsed), inputs);
        }
    }
}

function getValueByUrl(url: OPUrl): string {
    const vaultItem = item.get(url.item, {
        vault: url.vault,
        fields: {
            label: [url.field],
        },
    });

    // @ts-ignore
    return vaultItem.value;
}

export function exportSecretToGHA(name: string, value: string, inputs: Inputs) {
    info(`Exporting ${name} to GitHub Actions`);
    setOutput(name, value);
    if (inputs.mask) {
        setSecret(value);
    }
    if (inputs.export) {
        exportVariable(name, value);
    }
}
