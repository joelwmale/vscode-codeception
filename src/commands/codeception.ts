import { workspace, window, WorkspaceConfiguration }  from 'vscode';
import { join as joinPath } from 'path';
import { CommandOptions } from '../types/commandOptions';

export class CodeceptionCommand {
    public lastOutput: string = '';

    private runAll: boolean;
    private runFile: boolean;

    private runClass: boolean;
    private methodToTest: string | null;
    private pathOfTests: string | null;

    protected extConfiguration: WorkspaceConfiguration;

    constructor (options: CommandOptions = {}) {
        this.runAll = options.runAll || false;
        this.runFile = options.runFile || false;

        this.runClass = options.runClass || false;
        this.methodToTest = options.method || null;
        this.pathOfTests = options.uri || null;

        // Load extension configuration
        this.extConfiguration = workspace.getConfiguration('vscode-codeception');
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
            this.lastOutput = `run${this.suffix ? ' ' + this.suffix : ''}`;
        }

        if (this.runFile) {
            this.lastOutput = `run ${this.parseFile}${this.suffix ? ' ' + this.suffix : ''}`;
        }

        return this.lastOutput;
    }

    get parseFile(): string {
        if (window.activeTextEditor) {
            // get the currently selected file
            const { fileName } = window.activeTextEditor.document;

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
    get suffix(): string {
        let suffix = this.extConfiguration.get('commandSuffix') || '';

        return ' ' + suffix; // Add a space before the suffix
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

        return this._normalizePath(joinPath(workspace.rootPath || '', 'vendor', 'bin', 'codecept'));
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
