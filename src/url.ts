export type OPUrl = {
    vault: string,
    item: string,
    field: string,
}

export function parseOPUrl(url: string): OPUrl {
    if (url.indexOf("op://") !== 0) {
        throw new Error(`Invalid op string: ${url}`)
    }

    const parts = url.substring(5).split("/", 4);

    if (parts.length == 2) {
        return {
            vault: parts[0],
            item: parts[1],
            field: ""
        }
    } else if (parts.length == 3) {
        return {
            vault: parts[0],
            item: parts[1],
            field: parts[2]
        }
    }

    throw new Error(`Invalid op string: ${url}`)
}
