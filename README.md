# 1Password Load Secrets Action

[![GitHub stars](https://img.shields.io/github/stars/shyim/1password-load-secrets-action)](https://github.com/shyim/1password-load-secrets-action/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/shyim/1password-load-secrets-action)](https://github.com/shyim/1password-load-secrets-action/network)
[![GitHub issues](https://img.shields.io/github/issues/shyim/1password-load-secrets-action)](https://github.com/shyim/1password-load-secrets-action/issues)
[![GitHub license](https://img.shields.io/github/license/shyim/1password-load-secrets-action)](https://github.com/shyim/1password-load-secrets-action/blob/master/LICENSE.md)

## Introduction

This GitHub Action loads secrets from 1Password into your GitHub workflow environment.

This action allows you to securely manage your secrets for GitHub Actions using 1Password, ensuring sensitive information is not exposed in your repository.

## Features

- Securely load secrets from 1Password into GitHub Actions.
- Easy configuration and setup.
- Improved security for CI/CD workflows.

Differences to official 1Password Action:

- Supports latest GitHub runners
- Support for Windows
- Caching of op-cli download
- Multiple mapping of secrets to environment variables
- Exposing complete vault item as environment variable

## Installation

To use this action in your workflow, follow these steps:

1. Add this action to your GitHub Actions workflow.
2. Configure the necessary secrets and environment variables.

## Usage

```yaml
on: push
jobs:
  hello-world:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Load secret
        uses: shyim/1password-load-secrets-action@v1
        with:
          # export also as environment variable
          export: true
          # mask the secrets in the logs
          mask-secrets: true
          # secret mapping
          secrets: |
            SECRET=op://app-cicd/hello-world/secret
            SECRET_SECOND=op://app-cicd/hello-world/secret-second
        env:
          OP_SERVICE_ACCOUNT_TOKEN: ${{ secrets.OP_SERVICE_ACCOUNT_TOKEN }}

      - name: Print masked secret
        run: echo "Secret: $SECRET"
        # Prints: Secret: ***
```

Supported variations in secrets are:

- `NAME=op://vault/item/field` - Sets `NAME` with the value of that specific field
- `op://vault/item/field` - Sets `field` as environment variable, shorthand for the previous one
-`op://vault/item` - Sets all fields with values as environment variables

## Contributing

Contributions are welcome! If you would like to contribute to this project, please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## Acknowledgements

- Thanks to the contributors who have helped in developing and maintaining this action.
- Special thanks to 1Password for providing a secure platform for managing secrets.
- Also special thanks to ChatGPT for generating this README.

---

For more information, visit the [repository](https://github.com/shyim/1password-load-secrets-action).
