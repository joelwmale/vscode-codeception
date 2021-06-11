[![Build Status](https://travis-ci.org/joelwmale/vscode-codeception.svg?branch=master)](https://travis-ci.org/joelwmale/vscode-codeception)
[![Marketplace Version](https://vsmarketplacebadge.apphb.com/version-short/joelwmale.vscode-codeception.svg)](https://marketplace.visualstudio.com/items?itemName=joelwmale.vscode-codeception)

# 🚀 VSCode Codeception

Easily run your codeception tests from VSCode's command panel or with customisable shortcuts.

## Installation

[Download it from the Marketplace](https://marketplace.visualstudio.com/items?itemName=joelwmale.vscode-codeception) or search for **VSCode Codeception** in your VSCode editor extension panel.

## Features
- Run all tests
- Run a single file
- Run a single test

### Run all tests:
- Open the command menu: `Cmd+Shift+p`
- Select: `VSCode Codeception: Run All`

### Run a file of tests:
- Open a file
- Open the command menu: `Cmd+Shift+p`
- Select: `VSCode Codeception: Run File`

### Run a single test:
- Open a file
- Move your cursor to a test function
- Open the command menu: `Cmd+Shift+p`
- Select: `VSCode Codeception: Run Method`

## Custom Configuraton

These values can be configured in your user settings config.

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `vscode-codeception.commandSuffix` | string | `null` | Flags or arguments to be appended to the command run. E.g if you want to add `--debug` this is the correct place. |
| `vscode-codeception.codeceptBinary` | string | `null` | A custom path of the Codecept binary. By default it will be auto-discovered from the `vendor` folder. |

### How to use these values

Open your settings (or Workspace settings), switch to JSON and put them like this:

```
{
    "vscode-codeception.commandSuffix": null,
    "vscode-codeception.codeceptBinary": null,
}
```

## Roadmap: what's next?

This extension is in active development.

Current Roadmap:

- [ ] Re-run failures
- [ ] Run tests from within docker containers
