---
inclusion: always
---

# Project structure

```text
end-of-the-world-travel-agent/
├── .kiro/
│   └── steering/
│       ├── product.md
│       ├── tech.md
│       ├── structure.md
│       └── domain-safety.md
├── docs/
│   ├── architecture.md
│   └── mvp-roadmap.md
├── data/
│   └── examples/
│       └── puerto-williams.json
├── src/
│   ├── domain/
│   ├── application/
│   ├── ports/
│   ├── adapters/
│   └── ui/
├── tests/
├── .env.example
├── .gitignore
├── AGENTS.md
└── README.md
```

## Naming

- Files and folders: `kebab-case`, except language conventions requiring otherwise.
- TypeScript types and classes: `PascalCase`.
- Functions and variables: `camelCase`.
- Domain concepts use explicit geographic names; avoid ambiguous names such as `southPlace`.

## Placement rules

- Business rules belong in `src/domain`.
- Orchestration belongs in `src/application`.
- Provider contracts belong in `src/ports`.
- External implementations belong in `src/adapters`.
- UI components must not call model providers directly.
- Test fixtures must be clearly marked as examples and never presented as live operational data.

## Change strategy

Implement vertical slices. The first slice should cover one question type and one destination, preferably Puerto Williams, before adding generalized planning.