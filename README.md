[![Build Status](https://travis-ci.org/joelwmale/vscode-codeception.svg?branch=master)](https://travis-ci.org/joelwmale/vscode-codeception)

# 🚀 VSCode Codeception

Run codeception tests quickly and easily from within VSCode with easy to remember shortcuts!

## Installation

[Download it from the Marketplace](https://marketplace.visualstudio.com/items?itemName=joelwmale.vscode-codeception) or search for **VSCode Codeception** in your VSCode editor extension panel.

## Features
- Run a single file
- Run all the tests

### Run a test file:
- Open the file and open the command menu with `cmd+shift+p` and select `VSCode Codeception: Run File`

### Run all the tests:
- Open the command menu: `Cmd+Shift+p`
- Select: `VSCode Codeception: Run All`

## Global configuration variables

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `vscode-codeception.commandSuffix` | string | `null` | Content (flags, arguments) to be appended to Codeception command. For example, if you want to use `--debug` this is the correct place. |
| `vscode-codeception.codeceptBinary` | string | `null` | A custom path of Codeception binary file. By default it will be auto-discovered from `vendor` folder. |

### How to use these values

Open your settings (or Workspace settings), switch to JSON and put them like this:

```
{
    "vscode-codeception.commandSuffix": null,
    "vscode-codeception.codeceptBinary": null,
}
```

## Roadmap: what's next?

This extension is under heavy development and will be updated regularly. 

This is what I plan to implement:

- Run a single test
- Panel on left sidebar to see suites and available tests
- Re-run failures
