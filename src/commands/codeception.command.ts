import * as vscode from 'vscode';
import { join as joinPath } from 'path';
import { CommandOptions } from '../interfaces';
import { SymbolNode, ScopeFinder } from '../helpers';

export class CodeceptionCommand {
    public lastOutput: string = '';
    public lastPos: string = '';

    private runAll: boolean;
    private runFile: boolean;
    private runMethod: boolean;

    public _methodName: string = '';

    private _scopeFinder: ScopeFinder | null = null;

    protected extConfiguration: vscode.WorkspaceConfiguration;

    constructor(options: CommandOptions = {}) {
        this.runAll = options.runAll || false;
        this.runFile = options.runFile || false;
        this.runMethod = options.runMethod || false;

        let editor = vscode.window.activeTextEditor;

        if (editor) {
            this._scopeFinder = new ScopeFinder(editor.document);
        }

        // Load extension configuration
        this.extConfiguration = vscode.workspace.getConfiguration('vscode-codeception');
    }

    run() {
        return `${this.binary} ${this.output}`;
    }

    /**
     * Create the command to actually run
     *
     * @return {string}
     */
    get output(): string {
        if (this.runAll) {
            this.lastOutput = `run${this.suffix}`;
        }

        if (this.runFile) {
            this.lastOutput = `run ${this.parseFile}${this.suffix}`;
        }

        // @TODO clean this up
        if (this.runMethod) {
            // the suffix and method name are appended elsewhere
            this.lastOutput = `run ${this.parseFile}:`;
        }

        return this.lastOutput;
    }

    /**
     * Parse the current file path
     * and return the appropriate command
     * 
     * @return string
     */
    get parseFile(): string {
        if (vscode.window.activeTextEditor) {
            // get the currently selected file
            const { fileName } = vscode.window.activeTextEditor.document;
            
            // split the file path by the tests directory
            const splitFilePath = fileName.split('/tests/').pop();

            if (splitFilePath) {
                // splitFilePath will now be '/api/unit/Test.php'
                // split by / and grab the first item: 'api'
                const testType = splitFilePath.split('/')[0];

                // construct the command by appending the test type
                // and the full path url
                // e.g: api tests/unit/Test.php
                return `${testType} tests/${splitFilePath}`;
            }
        }

        // could not parse the file url for some reason...
        vscode.window.showErrorMessage('Could not parse file url.');
        return '';
    }

    /**
     * Try to estimate the function name
     * 
     * @return Promise<string>
     */
    cursorMethodName(): Promise<string> {
        let editor = vscode.window.activeTextEditor;

        return new Promise((resolve, reject) => {
            if (editor && this._scopeFinder) {
                const pos: vscode.Position = editor.selection.start;
    
                if (!pos) {
                    return '';
                }
    
                let node: SymbolNode | null;
    
                setTimeout(async (token: vscode.CancellationToken) => {
                    if (token.isCancellationRequested) {
                        return;
                    }
                    if (!pos) {
                        return '';
                    }
                    let node: SymbolNode | null;
    
                    try {
                        if (this._scopeFinder) {
                            node = await this._scopeFinder.getScopeNode(pos);
    
                            if (node) {
                                resolve(node.getMethodName)
                            }
                        }
                    } catch (err) {
                        vscode.window.showErrorMessage(err);
                    }
                }, 32, this._scopeFinder._cancelToken.token);
            }
        });
    }

    /**
     * Get user's configured command suffix.
     *
     * @return {string}
     */
    get suffix(): string {
        let suffix = this.extConfiguration.get('commandSuffix') || '';

        if (suffix) {
            return ` ${suffix}`;
        }

        return '';
    }

    /**
     * Get the codeception bin file.
     *
     * @return string
     */
    get binary(): string {
        if (this.extConfiguration.get('codeceptBinary')) {
            return this.extConfiguration.get('codeceptBinary') || '';
        }

        return this._normalizePath(joinPath(vscode.workspace.rootPath || '', 'vendor', 'bin', 'codecept'));
    }

    /**
     * Normalize a path.
     *
     * @param  {string} path
     * @return {string} 
     */
    protected _normalizePath(path: string) {
        return path
            .replace(/\\/g, '/') // Convert backslashes from windows paths to forward slashes, otherwise the shell will ignore them.
            .replace(/ /g, '\\ '); // Escape spaces.
    }
}
