# CLAUDE.md

## Git commit conventions

Use semantic commit messages with emojis (see https://gist.github.com/alpteo/e93d754e5e09907c6362c4230fb66f87):

```
<emoji> <type>(<scope>)<space><branch-id if any>: <subject>
```

| Type     | Emoji |
| -------- | ----- |
| feat     | ✨    |
| fix      | 🐛    |
| docs     | 📝    |
| refactor | ♻️    |
| build    | 👷    |
| test     | ✅    |
| ci       | 💚    |
| style    | 🎨    |
| chore    | 🔧    |
| perf     | ⚡    |

Right after the scope's closing parenthesis, append the ticket/story identifier parsed from the current branch name (e.g. branch `A2-2360-US9-Landing-page-adjustments-for-final-release` → id `A2-2360`). Omit it entirely when the branch is a base branch: `main`, `master`, `staging`, or `dev`.

Example: `✨ feat(SEO) A2-2360: expand structured data and fix favicon branding`
