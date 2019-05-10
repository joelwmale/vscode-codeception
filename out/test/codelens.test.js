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
const vscode = require("vscode");
const path_1 = require("path");
describe('Yet Another PHPUnit CodeLens Test', () => {
    const configuration = vscode.workspace.getConfiguration('yet-phpunit');
    let workspaceRootPath = vscode.workspace.rootPath || '';
    // Fix CI tests path
    if (!workspaceRootPath.endsWith('/project-stub')) {
        workspaceRootPath = path_1.join(workspaceRootPath, 'project-stub');
    }
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        // Reset the test/project-stub/.vscode/settings.json settings for each test.
        // This allows us to test config options in tests and not harm other tests.
        yield configuration.update('commandSuffix', null);
        yield configuration.update('codeceptBinary', null);
        yield configuration.update('codelens', true);
    }));
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        // Reset the test/project-stub/.vscode/settings.json settings for each test.
        // This allows us to test config options in tests and not harm other tests.
        yield configuration.update('commandSuffix', null);
        yield configuration.update('codeceptBinary', null);
        yield configuration.update('codelens', true);
    }));
    // it('Does not show CodeLens if disabled', async () => {
    //     // Update settings
    //     await configuration.update('codelens', false);
    //     const codeLensProvider = new TestCodeLensProvider;
    //     const document = await vscode.workspace.openTextDocument(pathJoin(workspaceRootPath, 'tests', 'CodeLensTest.php'));
    //     // Retrieve fetched test by provider
    //     const fetchedTests = await codeLensProvider.provideCodeLenses(document);
    //     assert.strictEqual(fetchedTests.length, 0);
    // });
    // it('Detect methods with test prefix or decorator', async () => {
    //     const codeLensProvider = new TestCodeLensProvider;
    //     const document = await vscode.workspace.openTextDocument(pathJoin(workspaceRootPath, 'tests', 'CodeLensTest.php'));
    //     // Retrieve fetched test by provider
    //     const fetchedTests = await codeLensProvider.provideCodeLenses(document);
    //     assert.strictEqual(fetchedTests.length, 4); // 3 methods + the last one is the class
    // });
    // it('Allows to run the class tests', async () => {
    //     const codeLensProvider = new TestCodeLensProvider;
    //     const document = await vscode.workspace.openTextDocument(pathJoin(workspaceRootPath, 'tests', 'CodeLensTest.php'));
    //     // Retrieve fetched test by provider
    //     const fetchedTests = await codeLensProvider.provideCodeLenses(document);
    //     // Retrieve last, we append class at the end
    //     const lastCodeLens: vscode.CodeLens = fetchedTests[fetchedTests.length - 1];
    //     assert.strictEqual(fetchedTests.length, 4); // 3 methods + the last one is the class
    //     // @ts-ignore
    //     assert.strictEqual(lastCodeLens.command.title, codeLensProvider.CLASS_TEST_LABEL);
    //     // @ts-ignore
    //     assert.ok(lastCodeLens.command.arguments[0] === null);
    //     // @ts-ignore
    //     assert.ok(lastCodeLens.command.arguments[1]);
    // });
});
//# sourceMappingURL=codelens.test.js.map