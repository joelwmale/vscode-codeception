"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const vscode = require("vscode");
const path_1 = require("path");
const extension_1 = require("../extension");
const waitToAssertInSeconds = 5;
// This is a little helper function to promisify setTimeout, so we can 'await' setTimeout.
function timeout(seconds, callback) {
    return new Promise(resolve => {
        setTimeout(() => {
            callback();
            resolve();
        }, seconds * 5);
    });
}
describe('VSCode Codeception Test Suite', () => {
    const configuration = vscode.workspace.getConfiguration('yet-phpunit');
    let workspaceRootPath = vscode.workspace.rootPath || '';
    // Fix CI tests path
    if (!workspaceRootPath.endsWith('/project-stub')) {
        workspaceRootPath = path_1.join(workspaceRootPath, 'src', 'test', 'project-stub');
    }
    console.log('hi');
    console.log(workspaceRootPath);
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        // Reset the test/project-stub/.vscode/settings.json settings for each test.
        // This allows us to test config options in tests and not harm other tests.
        yield configuration.update('commandSuffix', null);
        yield configuration.update('codeceptBinary', null);
    }));
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        // Reset the test/project-stub/.vscode/settings.json settings for each test.
        // This allows us to test config options in tests and not harm other tests.
        yield configuration.update('commandSuffix', null);
        yield configuration.update('codeceptBinary', null);
    }));
    it('Can test a file', () => __awaiter(this, void 0, void 0, function* () {
        const document = yield vscode.workspace.openTextDocument(path_1.join(workspaceRootPath, 'tests', 'SampleTest.php'));
        yield vscode.window.showTextDocument(document);
        yield vscode.commands.executeCommand('vscode-codeception.run-file');
        yield timeout(waitToAssertInSeconds, () => {
            assert.ok(extension_1._getLastCommand().method === '');
        });
    }));
});
//# sourceMappingURL=extension.test.js.map