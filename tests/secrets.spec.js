import * as core from "@actions/core";

import {describe, it, expect, spyOn, beforeEach, afterEach} from "bun:test";
import {exportSecrets, exportSecretToGHA} from "../src/secrets.js";
import {item} from "@1password/op-js";

describe("Secrets", () => {
    let exportVariable;
    let setOutput;
    let setSecret;
    let itemMock;

    beforeEach(() => {
        exportVariable = spyOn(core, 'exportVariable');
        setOutput = spyOn(core, 'setOutput');
        setSecret = spyOn(core, 'setSecret');
        itemMock = spyOn(item, 'get');
    });

    afterEach(() => {
        setSecret.mockClear()
        setOutput.mockClear()
        exportVariable.mockClear()
        itemMock.mockClear()
    });

    it("set variable", () => {
        exportSecretToGHA("foo", "bar", {mask: true, secrets: "", export: true})
        expect(process.env.foo).toEqual("bar")

        expect(exportVariable).toHaveBeenCalled();
        expect(exportVariable.mock.calls[0]).toEqual(['foo', 'bar'])

        expect(setOutput).toHaveBeenCalled();
        expect(setOutput.mock.calls[0]).toEqual(['foo', 'bar'])

        expect(setSecret).toHaveBeenCalled();
        expect(setSecret.mock.calls[0]).toEqual(['bar'])

        delete process.env.foo;
    })

    it('set only output', () => {
        exportSecretToGHA("foo", "bar", {mask: false, secrets: "", export: false})
        expect(process.env.foo).toBeUndefined()

        expect(exportVariable).not.toHaveBeenCalled();
        expect(setSecret).not.toHaveBeenCalled();

        expect(setOutput).toHaveBeenCalled();
        expect(setOutput.mock.calls[0]).toEqual(['foo', 'bar'])
    });

    it('set only output and mask', () => {
        exportSecretToGHA("foo", "bar", {mask: true, secrets: "", export: false})
        expect(process.env.foo).toBeUndefined()

        expect(exportVariable).not.toHaveBeenCalled();
        expect(setSecret).toHaveBeenCalled();
        expect(setSecret.mock.calls[0]).toEqual(['bar'])

        expect(setOutput).toHaveBeenCalled();
        expect(setOutput.mock.calls[0]).toEqual(['foo', 'bar'])
    });

    it('export secrets single', () => {
        itemMock.mockReturnValueOnce({value: "test"})

        exportSecrets({
            export: false,
            mask: false,
            secrets: ['op://foo/bar/foo']
        });

        expect(itemMock).toHaveBeenCalled();
        expect(setOutput).toHaveBeenCalled();
        expect(setOutput.mock.calls[0]).toEqual(['foo', 'test'])
    });

    it('export secrets single, empty lines, comments ignored', () => {
        itemMock.mockReturnValueOnce({value: "test"})

        exportSecrets({
            export: false,
            mask: false,
            secrets: [`#foo`, 'op://foo/bar/foo']
        });

        expect(itemMock).toHaveBeenCalled();
        expect(setOutput).toHaveBeenCalled();
        expect(setOutput.mock.calls[0]).toEqual(['foo', 'test'])
    });

    it('export use given env name', () => {
        itemMock.mockReturnValueOnce({value: "test"})

        exportSecrets({
            export: false,
            mask: false,
            secrets: [`NAME=op://foo/bar/foo`]
        });

        expect(itemMock).toHaveBeenCalled();
        expect(setOutput).toHaveBeenCalled();
        expect(setOutput.mock.calls[0]).toEqual(['NAME', 'test'])
    });

    it('export all fields', () => {
        itemMock.mockReturnValueOnce({
            fields: [
                {
                    label: "NAME",
                    value: "test"
                }
            ]
        })

        exportSecrets({
            export: false,
            mask: false,
            secrets: [`op://foo/bar`]
        });

        expect(itemMock).toHaveBeenCalled();
        expect(setOutput).toHaveBeenCalled();
        expect(setOutput.mock.calls[0]).toEqual(['NAME', 'test'])
    });

    it('export named, without field should be ignored', () => {
        exportSecrets({
            export: false,
            mask: false,
            secrets: [`NAME=op://foo/bar`]
        });

        expect(itemMock).not.toHaveBeenCalled();
        expect(setOutput).not.toHaveBeenCalled();
        expect(setSecret).not.toHaveBeenCalled();
    });
})
