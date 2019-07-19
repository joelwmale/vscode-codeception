import * as vscode from 'vscode';
import Dispatcher from './dispatcher';
import { CodeceptionCommand } from './commands';

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

    // Run all tests in the file
    context.subscriptions.push(vscode.commands.registerCommand('vscode-codeception.run-method', async () => {
        const codeception = new CodeceptionCommand({ runMethod: true });

        codeception.cursorMethodName().then(methodName => {
            if (methodName === 'Global Scope') {
                vscode.window.showErrorMessage('Unable to determine cursor location. Please move your cursor and try again.');
                return;
            }

            // Build the command
            let command = `${codeception.run()}${methodName}${codeception.suffix}`;

            // Execute
            execute(command);
        });
    }));
}

// this method is called when your extension is deactivated
export function deactivate() { }

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

    execute(command.run());
}

/**
 * Run a command string.
 *
 * @param string command 
 */
async function execute(command: string) {
    if (!vscode.window.activeTextEditor) {
        return vscode.window.showErrorMessage('VSCode Codeception: open a file to run this command');
    }

    let activeTerminal: any = null;
    
    if (vscode.window.activeTerminal) {
        // Grab the current active terminal to close it later
        activeTerminal = vscode.window.activeTerminal;
    }

    // Create a new terminal
    const terminal = vscode.window.createTerminal(`VSCode Codeception`);

    // Show the terminal
    terminal.show();

    // If we had an active terminal
    if (activeTerminal) {
        // Dispose it
        activeTerminal.dispose();
    }

    // Run the command
    terminal.sendText(command, true);
}