import * as vscode from 'vscode';
import { SymbolKind } from 'vscode';
import { SymbolNode } from './symbol-node.helper';

const ScopeSymbolKind = [
    SymbolKind.Method,
    SymbolKind.Function,
    SymbolKind.Class,
    SymbolKind.Namespace,
    SymbolKind.Module,
    SymbolKind.Constructor,
    SymbolKind.Package
];

export class ScopeFinder {
    private _symbolRoot: SymbolNode = new SymbolNode;
    private _updated: boolean = false;
    public _cancelToken: vscode.CancellationTokenSource = new vscode.CancellationTokenSource;
    private static _dummyNode = new SymbolNode;

    constructor(private _doc: vscode.TextDocument) {
        this._updated = true;
    }

    public get dummyNode() {
        return ScopeFinder._dummyNode;
    }

    public get document() {
        return this._doc;
    }

    private getSymbols(): Thenable<vscode.DocumentSymbol[] | undefined> {
        return vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', this._doc.uri);
    }

    public async getScopeSymbols() {
        let symbols = await this.getSymbols();
        // Maybe the symbol provider just not ready
        if (!symbols) {
            return null;
        }
        let scopeSymbols = symbols.filter(sym => ScopeSymbolKind.indexOf(sym.kind) != -1);
        return scopeSymbols;
    }

    public update() {
        this._updated = true;
    }

    private async updateNode() {
        if (!this._updated) {
            return;
        }
        if (this._cancelToken) {
            this._cancelToken.cancel();
        }
        this._cancelToken = new vscode.CancellationTokenSource();
        let token = this._cancelToken.token;
        // FIXME: need update flag and CancellationToken both same time?
        this._updated = false;
        let symbols = await this.getScopeSymbols();
        if (token.isCancellationRequested) {
            console.log("CancellationRequested");
        }
        if (!symbols || symbols.length == 0) {
            this._updated = true;
            return;
        }
        this._symbolRoot = SymbolNode.createSymbolTree(symbols);
    }

    public async getScopeNode(pos: vscode.Position): Promise<SymbolNode | null> {
        await this.updateNode();

        // Return null if there are no symbols
        if (!this._symbolRoot) {
            return null;
        }

        let target: SymbolNode = new SymbolNode;

        for (let node of this._symbolRoot.iterNodesRevers()) {
            if (node.containsPos(pos)) {
                target = node;
                break;
            }
        }

        return target;
    }
}