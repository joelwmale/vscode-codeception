"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const path_1 = require("path");
class CodeceptionCommand {
    constructor(options = {}) {
        this.lastOutput = '';
        this.runAll = options.runAll || false;
        this.runFile = options.runFile || false;
        this.runClass = options.runClass || false;
        this.methodToTest = options.method || null;
        this.pathOfTests = options.uri || null;
        // Load extension configuration
        this.extConfiguration = vscode_1.workspace.getConfiguration('yet-phpunit');
    }
    run() {
        return this.output;
    }
    /**
     * Create the command to actually run
     *
     * @return {string}
     */
    get output() {
        if (this.runAll) {
            this.lastOutput = `${this.binary} run ${this.suffix}`;
        }
        if (this.runFile) {
            this.lastOutput = `${this.binary} run ${this.parseFile} ${this.suffix}`;
        }
        return this.lastOutput;
    }
    get parseFile() {
        if (vscode_1.window.activeTextEditor) {
            // get the currently selected file
            const { fileName } = vscode_1.window.activeTextEditor.document;
            // split the file name by the test directoy
            // @TODO maybe search for a bunch of test folder names
            // __test__, tests, etc.
            const subFileName = fileName.split('/tests/').pop();
            if (subFileName) {
                // subFileName will now be '/api/something'
                const testType = subFileName.split('/');
                // construct the command and return it
                return `${testType[0]} tests/${subFileName}`;
            }
        }
        return '';
    }
    /**
     * Get user's configured command suffix.
     *
     * @return {string}
     */
    get suffix() {
        console.log('getting suffix');
        let suffix = this.extConfiguration.get('commandSuffix') || '';
        return ' ' + suffix; // Add a space before the suffix
    }
    /**
     * Get the codeception bin file.
     *
     * @return string
     */
    get binary() {
        if (this.extConfiguration.get('codeceptBinary')) {
            return this.extConfiguration.get('codeceptBinary') || '';
        }
        return this._normalizePath(path_1.join(vscode_1.workspace.rootPath || '', 'vendor', 'bin', 'codecept'));
    }
    /**
     * Get the nearest method from the cursor position.
     *
     * @return {string}
     */
    get method() {
        // Return if user wants to test the full class (from CodeLens) or a path is provided
        if (this.runClass || this.pathOfTests !== null) {
            return '';
        }
        // If there's a method passed as arg from CodeLens, run it
        if (this.methodToTest !== null) {
            return this.methodToTest;
        }
        let line = vscode_1.window.activeTextEditor ? vscode_1.window.activeTextEditor.selection.active.line : 0;
        let method = '';
        while (line > 0) {
            const lineText = vscode_1.window.activeTextEditor ? vscode_1.window.activeTextEditor.document.lineAt(line).text : '';
            const match = lineText.match(/^\s*(?:public|private|protected)?\s*function\s*(\w+)\s*\(.*$/);
            if (match) {
                method = match[1];
                break;
            }
            line = line - 1;
        }
        return method;
    }
    /**
     * Normalize a path.
     *
     * @param  {string} path
     * @return {string}
     */
    _normalizePath(path) {
        return path
            .replace(/\\/g, '/') // Convert backslashes from windows paths to forward slashes, otherwise the shell will ignore them.
            .replace(/ /g, '\\ '); // Escape spaces.
    }
}
exports.CodeceptionCommand = CodeceptionCommand;
//# sourceMappingURL=codeception.js.map