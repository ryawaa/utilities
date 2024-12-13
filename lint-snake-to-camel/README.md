# lint snake to camel case

this script automatically fixes camelcase issues in javascript files based on eslint output.

## description

this script does the following:

1. runs the project's lint command (`npm run lint`).
2. parses the lint output to identify files with camelcase issues.
3. for each file with issues:
   - reads the file content.
   - identifies snake_case identifiers that should be in camelcase.
   - replaces snake_case identifiers with their camelcase equivalents.
   - writes the modified content back to the file.

## usage

to use this script, make sure you have node.js installed and run:

```bash
node lint-snake-to-camel.js
```

## note

ensure that your project has a lint script defined in the `package.json` file, as this script relies on `npm run lint` to identify camelcase issues.
