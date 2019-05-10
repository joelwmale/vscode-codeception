import * as vscode from 'vscode';
// import TestCodeLensProvider from './providers/testCodeLensProvider';
import Dispatcher from './commands/dispatcher';

// Last command executed
var lastCommand: any;

export function activate(context: vscode.ExtensionContext) {
    // Run all tests
    context.subscriptions.push(vscode.commands.registerCommand('vscode-codeception.run-all', async () => {
        executeCommand(Dispatcher({
            runAll: true,
        }));
    }));

    // Run all tests in the file
    context.subscriptions.push(vscode.commands.registerCommand('vscode-codeception.run-file', async () => {
        executeCommand(Dispatcher({
            runFile: true,
        }));
    }));

    // Register CodeLens provider
    // context.subscriptions.push(vscode.languages.registerCodeLensProvider({
    //     language: 'php',
    //     scheme: 'file'
    // }, new TestCodeLensProvider));
}

// this method is called when your extension is deactivated
export function deactivate() {}

/**
 * Get last command - used for testing purposes only.
 *
 * @return {any}
 */
export function _getLastCommand(): any {
    return lastCommand;
}

/**
 * Run a command.
 *
 * @param {any} command 
 */
async function executeCommand(command: any) {
    lastCommand = command;

    if (!vscode.window.activeTextEditor) {
        return vscode.window.showErrorMessage('VSCode Codeception: open a file to run this command');
    }

    // Create a new terminal
    const terminal = vscode.window.createTerminal(`VSCode Codeception`);

    // Show the terminal
    terminal.show();

    // Run the command
    terminal.sendText(command.run(), true);
}
