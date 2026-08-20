# Contributing to `Crypto-DEX`

## Setting up the project

- [Fork](https://github.com/Asit0007/Crypto-DEX/fork) this project and clone
  your fork:

```sh
git clone https://github.com/<your-username>/Crypto-DEX.git
cd Crypto-DEX
npm install
```

Use an editor with ESLint and Prettier plugins — the repo ships configs for
both, and a `lint-staged` pre-commit hook formats staged files automatically.

## Pull requests

1. Create your branch from `main`.
2. Make sure `npm run lint:check` and `npm run build` pass — CI runs both on
   every PR.
3. Keep PRs focused; one topic per PR.

## Known issues

Bugs are tracked in
[GitHub issues](https://github.com/Asit0007/Crypto-DEX/issues). Before filing
a new one, check whether it already exists.

## Coding style

Follow the [Coding Style](CODING_STYLE.md), and see `.claude/skills/` for the
project's design-system and Tailwind conventions.

## License

By contributing to Crypto-DEX, you agree that your contributions will be
licensed under its [MIT license](LICENSE).
