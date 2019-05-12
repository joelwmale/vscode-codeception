import * as vscode from 'vscode';
import { SymbolKind } from 'vscode';

export class SymbolNode {
    parent?: SymbolNode;
    children: SymbolNode[];
    symbolInfo?: vscode.DocumentSymbol;
    _range?: vscode.Range;

    constructor(symbolinfo?: vscode.DocumentSymbol) {
        this.symbolInfo = symbolinfo;
        this.children = []
    }

    public static createSymbolTree(symbols: vscode.DocumentSymbol[]): SymbolNode {
        let root = new SymbolNode();

        let properRanges = symbols.find(sym => sym.range.start.line != sym.range.end.line) != null;

        SymbolNode._createSymbolTree(root, symbols);

        if (!properRanges) {
            root._range = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(1e10, 0)); // whole file
            root.computeChildRanges();
        }

        return root;
    }

    private static _createSymbolTree(parent: SymbolNode, symbols: vscode.DocumentSymbol[]) {
        symbols.forEach(sym => {
            let node = new SymbolNode(sym);
            parent.addNode(node);
            SymbolNode._createSymbolTree(node, sym.children);
        });
    }

    private computeChildRanges() {
        // Approximate ranges if we don't have real ones.

        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i];

            // start and end position ranges
            let start: vscode.Position | null = null;
            let end: vscode.Position | null = null;

            if (child.symbolInfo) {
                // start: at the first character of the symbol's line (keywords typically appear before a function name)
                start = new vscode.Position(child.symbolInfo.range.start.line, 0);
            }

            // end: either at the start of the node's next sibling (if any), or at the end of the node's parent
            if (i + 1 < this.children.length) {
                let currentChild = this.children[i + 1];
                if (currentChild && currentChild.symbolInfo) {
                    end = currentChild.symbolInfo.range.start;
                }
            } else {
                if (this._range) {
                    end = this._range.end;
                }
            }

            if (start && end) {
                child._range = new vscode.Range(start, end);
                child.computeChildRanges();
            }
        }
    }

    public get isRoot() {
        return !this.symbolInfo;
    }

    private get kind() {
        return this.symbolInfo ? this.symbolInfo.kind : SymbolKind.Null;
    }

    public get range() {
        if (this._range) {
            return this._range;
        }

        return this.symbolInfo ? this.symbolInfo.range : null;
    }

    public addNode(node: SymbolNode) {
        this.children.push(node);
        node.parent = this;
    }

    private containsNode(properRanges: Boolean, node: SymbolNode) {
        if (this.isRoot) {
            return true;
        } else if (properRanges && this.range && node.symbolInfo) {
            return this.range.contains(node.symbolInfo.range.end);
        } else {
            // No proper ranges, fallback to heuristics.
            // Assume no nested namespaces/classes/functions.

            switch (this.kind) {
                case SymbolKind.Namespace:
                    return node.kind != SymbolKind.Namespace;

                case SymbolKind.Class:
                case SymbolKind.Module:
                    return node.kind == SymbolKind.Function ||
                        node.kind == SymbolKind.Method ||
                        node.kind == SymbolKind.Constructor;

                default:        // Method | Function | Constructor
                    return false;
            }
        }
    }

    public containsPos(pos: vscode.Position) {
        if (this.isRoot) {
            return true;
        }

        if (this.range) {
            return this.range.contains(pos);
        }

        return false;
    }

    /**
     * Get the method name
     * 
     * @return string;
     */
    public get getMethodName(): string {
        if (this.isRoot) {
            return 'Global Scope';
        }

        let node: SymbolNode | undefined = this;

        let nameList: string[] = [];

        do {
            if (node.symbolInfo) {
                nameList.push(node.symbolInfo.name);
            }
            node = node.parent;
        } while (node && !node.isRoot);

        return nameList[0];
    }

    public *iterNodes(): Iterable<SymbolNode> {
        if (!this.isRoot) {
            yield this;
        }
        for (let child of this.children) {
            yield* child.iterNodes();
        }
    }

    public *iterNodesRevers(): Iterable<SymbolNode> {
        const len = this.children.length;
        for (let index = len - 1; index >= 0; index--) {
            yield* this.children[index].iterNodesRevers();
        }
        yield this;
    }
}