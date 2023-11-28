import {describe, it, expect} from "bun:test";
import {parseOPUrl} from "../src/url.js";

describe("URL", () => {
    it('invalid url', () => {
        expect(() => parseOPUrl('foo')).toThrow(new Error("Invalid op string: foo"))
        expect(() => parseOPUrl('op://foo')).toThrow(new Error("Invalid op string: op://foo"))
    })

    it('only vault and item', () => {
        const parsed = parseOPUrl('op://foo/bar')

        expect(parsed.vault).toEqual('foo')
        expect(parsed.item).toEqual('bar')
        expect(parsed.field).toEqual('')
    })

    it('complete element', () => {
        const parsed = parseOPUrl('op://foo/bar/field')

        expect(parsed.vault).toEqual('foo')
        expect(parsed.item).toEqual('bar')
        expect(parsed.field).toEqual('field')
    })
});
