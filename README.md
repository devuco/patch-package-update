# patch-package-update

## Overview

`patch-package-update` is a command-line tool to apply patches to updated libraries automatically using `patch-package`. It simplifies the process of maintaining custom patches across library updates.

## Features

Automatically applies patches to updated versions of libraries.
Simplifies the workflow of using patch-package with version updates.

## Installation

You can use npx to run patch-package-update without installing it globally. However, if you prefer to install it globally, you can do so via npm.

#### Note: If you have added "patch-package" in the "scripts" section of your package.json under "postinstall", please remove it before running this command. You can add it back later.

### Using npx (recommended)

```bash
npx patch-package-update --package-name <package-name> --current-version <current-version> --update-version <update-version>
```

### Global Installation (optional)

```bash
npm install -g patch-package-update
```

## Command Options

- --package-name: The name of the package you want to update and patch.
- --current-version: The current version of the package you are using.
- --update-version: The new version of the package you want to update to.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
