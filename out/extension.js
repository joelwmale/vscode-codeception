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
// import TestCodeLensProvider from './providers/testCodeLensProvider';
const dispatcher_1 = require("./commands/dispatcher");
// Last command executed
var lastCommand;
function activate(context) {
    // Run all tests
    context.subscriptions.push(vscode.commands.registerCommand('vscode-codeception.run-all', () => __awaiter(this, void 0, void 0, function* () {
        console.log('running all tests');
        executeCommand(dispatcher_1.default({
            runAll: true,
        }));
    })));
    // Run all tests in the file
    context.subscriptions.push(vscode.commands.registerCommand('vscode-codeception.run-file', () => __awaiter(this, void 0, void 0, function* () {
        console.log('running all tests in file');
        executeCommand(dispatcher_1.default({
            runFile: true,
        }));
    })));
    // Register CodeLens provider
    // context.subscriptions.push(vscode.languages.registerCodeLensProvider({
    //     language: 'php',
    //     scheme: 'file'
    // }, new TestCodeLensProvider));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
/**
 * Get last command - used for testing purposes only.
 *
 * @return {any}
 */
function _getLastCommand() {
    return lastCommand;
}
exports._getLastCommand = _getLastCommand;
/**
 * Run a command.
 *
 * @param {any} command
 */
function executeCommand(command) {
    return __awaiter(this, void 0, void 0, function* () {
        const commandToRun = command.run();
        if (!vscode.window.activeTextEditor) {
            return vscode.window.showErrorMessage('VSCode Codeception: open a file to run this command');
        }
        // Create a new terminal
        const terminal = vscode.window.createTerminal(`VSCode Codeception`);
        // Show the terminal
        terminal.show();
        // Run the command
        lastCommand = commandToRun;
        terminal.sendText(command.run(), true);
    });
}
//# sourceMappingURL=extension.js.map