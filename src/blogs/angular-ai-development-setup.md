---
title: "Teaching AI Coding Assistants to Write Modern Angular"
date: "2026-05-24"
summary: "A tool-agnostic setup for getting AI assistants (Claude Code, GitHub Copilot, Cursor or Codex) to write modern Angular. Covers AGENTS.md, specialized agents, prompt templates, skills, MCP servers, pre-commit hooks and the DDD folder structure that ties it together."
tags: ["Angular", "AI", "Claude Code", "GitHub Copilot", "MCP", "Cursor", "TypeScript", "Developer Tools"]
---

## Teaching AI Coding Assistants to Write Modern Angular

You asked your AI to generate an Angular component. It came back with this:

```typescript
@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
})
export class UserCardComponent implements OnInit {
  @Input() userId!: number;
  @Output() selected = new EventEmitter<User>();
  user: User | null = null;
  isLoading = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.isLoading = true;
    this.userService.getUser(this.userId).subscribe(user => {
      this.user = user;
      this.isLoading = false;
    });
  }
}
```

Technically correct. Ships. Passes code review. And it's **completely wrong for modern Angular**.

No `ChangeDetectionStrategy.OnPush`. Constructor injection instead of `inject()`. `@Input()` / `@Output()` decorators. A raw `.subscribe()` leaking memory. This is Angular circa 2019 — and your AI is churning it out confidently, at scale, across your entire codebase.

Here's the thing: **it's not the AI's fault.** The internet is overflowing with NgModule-based Angular code from Stack Overflow answers, old blog posts, and GitHub repos. That's what LLMs trained on. Without explicit guardrails, they'll keep doing it — regardless of which AI tool you use.

The fix is a **one-time configuration investment** — done properly it works across every AI tool on your team: Claude Code, GitHub Copilot, Cursor, Codex, or whatever ships next month. By the end of this guide, every AI in your workflow will produce this instead:

```typescript
@Component({
  selector: 'app-user-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isLoading()) {
      <app-spinner />
    } @else if (user()) {
      <div class="user-card" (click)="selected.emit(user()!)">
        <h3>{{ user()!.name }}</h3>
      </div>
    }
  `,
})
export class UserCardComponent {
  userId = input.required<number>();
  selected = output<User>();

  private userService = inject(UserService);

  user = toSignal(
    toObservable(this.userId).pipe(switchMap(id => this.userService.getUser(id))),
    { initialValue: null }
  );
  isLoading = computed(() => this.user() === null);
}
```

OnPush. `inject()`. Signals. No memory leaks. No legacy patterns. Let's build the setup.

---

## Why Most AI Setups Fail After a Week

The most common mistake is building an AI setup that's **locked to a single tool**. You write a `CLAUDE.md` for Claude Code, a separate `.github/copilot-instructions.md` for Copilot, and a `.cursorrules` for Cursor. Three files, three sources of truth, three times the maintenance — and the moment your colleague uses a different tool than you, the rules don't apply.

The better approach: put your canonical conventions in `.github/` — a directory that's already in every Angular repo, already tracked in git, and already readable by every AI tool on the market.

```
.github/
├── AGENTS.md                        ← The single source of truth
├── agents/                          ← Specialized AI agents
│   ├── angular-reviewer.agent.md
│   ├── feature-scaffolder.agent.md
│   ├── signal-store.agent.md
│   ├── unit-test-writer.agent.md
│   └── refactor-to-signals.agent.md
├── prompts/                         ← Reusable prompt templates
│   ├── code-review.prompt.md
│   ├── ngrx-store-crud.prompt.md
│   └── analyze-codebase-bugs.prompt.md
└── skills/                          ← Deep domain knowledge
    ├── project-architecture/SKILL.md
    └── vitest-angular-testing/SKILL.md
```

Every AI tool — Claude Code, Copilot, Cursor — picks up from this directory. You write the rules once. Everyone's AI follows them.

---

## Part 1: AGENTS.md — The Single Source of Truth

`AGENTS.md` is the master convention document for your entire project. It replaces the scattered approach of one file per AI tool. Claude Code loads it automatically. Copilot agents reference it via VS Code settings. Cursor picks it up as a global rule. One file. Every tool.

Create `AGENTS.md` at your project root and mirror it inside `.github/` — both locations ensure maximum compatibility:

```markdown
# Project Conventions — AI Agent Reference

## Tech Stack
- Angular 21 (standalone by default — no standalone: true needed)
- TypeScript 5.9 strict mode
- NgRx Signals (@ngrx/signals) for global state
- Angular Material 3
- Vitest 4 + Angular Testing Library (unit tests)
- Playwright 1.59 (E2E)
- ESLint 9 + Prettier 3 + Lefthook 2
- npm exclusively (never pnpm or yarn)

## Architecture: Domain-Driven Design

Feature folder structure — no exceptions:
src/app/features/<domain>/
├── feature/     # Smart container components (route-level, inject stores)
├── ui/          # Presentational components (OnPush, signals, NO store injection)
├── data/        # Models, HTTP services, NgRx Signal Stores
└── util/        # Pure helper functions, no side effects

### Rules that are absolute
- NO barrel files (no index.ts re-exports — ever)
- NO shared/ folder (feature boundaries enforce isolation)
- NO type suffixes in class names — TaskCard not TaskCardComponent,
  TaskApi not TaskApiService, TaskStore not TaskStoreClass
- Files: kebab-case (task-card.ts)
- Classes: PascalCase (TaskCard)
- Every ui/ component stays free of store dependencies

## The 6 Coding Rules. Zero Exceptions.

### 1 — No standalone: true (Angular 21 default)
Components are standalone by default in Angular 21.
Do NOT write standalone: true explicitly. Just omit it.

### 2 — inject() only. Constructor DI is banned.
\```typescript
// ✅
export class TaskApi {
  private http = inject(HttpClient);
}

// ❌ banned
export class TaskApi {
  constructor(private http: HttpClient) {}
}
\```

### 3 — input() / output() functions. Decorators are banned.
\```typescript
// ✅
export class TaskCard {
  task = input.required<Task>();
  deleted = output<number>();
}

// ❌ banned
export class TaskCard {
  @Input() task!: Task;
  @Output() deleted = new EventEmitter<number>();
}
\```

### 4 — @if / @for / @switch. Structural directives are banned.
\```html
<!-- ✅ -->
@if (isLoading()) { <app-spinner /> }
@for (task of tasks(); track task.id) { <app-task-card [task]="task" /> }
@empty { <p>No tasks found.</p> }

<!-- ❌ banned -->
<app-spinner *ngIf="isLoading"></app-spinner>
<app-task-card *ngFor="let task of tasks" [task]="task"></app-task-card>
\```

### 5 — OnPush on every component. Default is not good enough.
\```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,  // always
})
\```

### 6 — Signals for state. BehaviorSubject is banned.
\```typescript
// ✅ local state
isOpen = signal(false);
activeTasks = computed(() => this.tasks().filter(t => t.active));

// ❌ banned for state
isOpen$ = new BehaviorSubject(false);
\```

## After Generating Code
Always run: ng build
Fix ALL TypeScript and template errors before marking the task complete.

## What AI Must NEVER Generate
- standalone: true (redundant in Angular 21)
- NgModule class with declarations/imports/exports
- Constructor injection
- @Input() / @Output() decorators
- *ngIf / *ngFor / *ngSwitch structural directives
- BehaviorSubject for state
- index.ts barrel files
- .subscribe() in components without takeUntilDestroyed()
- any type (use unknown with type guards)
- shared/ folder
```

> **Why no barrel files?** `index.ts` re-exports look tidy but they force bundlers to load entire feature modules just to import a single function. They also create circular dependency traps and slow down TypeScript compilation on large projects. The reference workflow used by the Angular team itself bans them. Import directly from the source file — always.

---

## Part 2: Specialized Agents — One Job Each, Done Right

A single instruction file covering everything produces generic output. The solution is **specialized agents**: focused files that activate for specific tasks. Each one carries deep expertise for a narrow job.

Create these in `.github/agents/`:

### Agent: Angular Reviewer

**`.github/agents/angular-reviewer.agent.md`:**

```markdown
# Angular Code Reviewer

You perform systematic code review of Angular code. Check every file for:

## Critical Issues (block merge)
- Barrel files (index.ts with re-exports) — flag every occurrence
- Missing OnPush change detection on any component
- Constructor injection anywhere in the codebase
- @Input()/@Output() decorators (must be input()/output())
- *ngIf/*ngFor/*ngSwitch in any template
- BehaviorSubject used for component or feature state
- explicit standalone: true in Angular 21+ (redundant, remove it)
- Any use of `any` type

## Medium Issues (fix before next PR)
- Files exceeding 400 lines — flag for extraction
- Missing error handling in async operations
- Test files missing provideZonelessChangeDetection()
- Services in the wrong DDD layer (ui/ importing from data/ is fine;
  data/ importing from feature/ is forbidden)

## Low Issues (nice to have)
- Missing ARIA labels on interactive elements
- console.log() left in production code

## Output Format
Summary → Critical (file:line, issue, fix) → Medium → Low → Passing checks

## Handoff Rules
- If store refactoring is needed → delegate to signal-store agent
- If tests are missing → delegate to unit-test-writer agent
```

### Agent: Feature Scaffolder

**`.github/agents/feature-scaffolder.agent.md`:**

```markdown
# Feature Scaffolder

You generate complete DDD features for Angular 21 applications.

## Before Starting — Gather Requirements
1. Domain name (e.g., "tasks", "invoices")
2. Entity shape (fields and types)
3. Required views (list page, detail page, form?)
4. API endpoints (base URL and methods)
5. Whether global state is needed or local signals suffice

## Generation Order
1. Entity model in data/ (TypeScript interface, no class)
2. API service in data/ (inject HttpClient, return typed Observables)
3. NgRx Signal Store in data/ (signalStore with withEntities)
4. UI components in ui/ (presentational, OnPush, signals only)
5. Feature/page components in feature/ (smart, inject store)
6. Route config in <domain>.routes.ts (lazy loaded)
7. Unit tests with Vitest for store + service
8. Register route in app.routes.ts

## Non-Negotiable Patterns
- No standalone: true (Angular 21 default)
- inject() only — no constructor DI
- input()/output() — no decorators
- @if/@for in all templates
- OnPush on every component
- No barrel files
- Class names without type suffixes (TaskCard, TaskApi, TaskStore)
- Run ng build after scaffolding — fix errors before finishing
```

### Agent: Signal Store Creator

**`.github/agents/signal-store.agent.md`:**

```markdown
# NgRx Signal Store Creator

You build @ngrx/signals stores for Angular 21 features.

## Store Template
\```typescript
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { withEntities, setAllEntities, addEntity, updateEntity, removeEntity } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { inject } from '@angular/core';
import { pipe, switchMap, tap } from 'rxjs';

interface TaskState {
  isLoading: boolean;
  error: string | null;
  selectedId: number | null;
}

export const TaskStore = signalStore(
  { providedIn: 'root' },
  withEntities<Task>(),
  withState<TaskState>({ isLoading: false, error: null, selectedId: null }),
  withComputed(({ entities, selectedId }) => ({
    selectedTask: computed(() => entities().find(t => t.id === selectedId())),
    activeTasks: computed(() => entities().filter(t => t.active)),
  })),
  withMethods((store, api = inject(TaskApi)) => ({
    loadTasks: rxMethod<void>(pipe(
      tap(() => patchState(store, { isLoading: true, error: null })),
      switchMap(() => api.getAll().pipe(
        tapResponse({
          next: tasks => patchState(store, setAllEntities(tasks), { isLoading: false }),
          error: (err: Error) => patchState(store, { error: err.message, isLoading: false }),
        })
      ))
    )),
    addTask: rxMethod<Omit<Task, 'id'>>(pipe(
      switchMap(task => api.create(task).pipe(
        tapResponse({
          next: created => patchState(store, addEntity(created)),
          error: (err: Error) => patchState(store, { error: err.message }),
        })
      ))
    )),
    selectTask: (id: number) => patchState(store, { selectedId: id }),
  }))
);
\```

## Rules
- Never convert Observables to Promises inside store methods
- Always use atomic operations: addEntity, updateEntity, removeEntity
- patchState is the only way to mutate store state
- Computed signals live in withComputed, not withMethods
```

### Agent: Unit Test Writer

**`.github/agents/unit-test-writer.agent.md`:**

```markdown
# Unit Test Writer (Vitest + Angular)

You write unit tests for Angular 21 apps using Vitest.

## Critical: Zoneless Change Detection
Every TestBed config must include provideZonelessChangeDetection():

\```typescript
beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [MyComponent],
    providers: [
      provideZonelessChangeDetection(),  // REQUIRED
      provideHttpClient(),
      provideHttpClientTesting(),
    ],
  }).compileComponents();
});
\```

## Signal Input Testing Pattern
Signal inputs require setInput() — not direct property assignment:

\```typescript
it('renders task name', async () => {
  const fixture = TestBed.createComponent(TaskCard);
  fixture.componentRef.setInput('task', mockTask);  // correct
  await fixture.whenStable();

  expect(fixture.nativeElement.textContent).toContain(mockTask.name);
});
\```

## Coverage Targets
- Components: 80%+ branch coverage
- Services/APIs: 90%+ coverage (every HTTP path tested)
- Stores: 95%+ (all state transitions)
- Guards: 100% (all redirect paths)

## Test Structure
Follow Arrange → Act → Assert with strong typing throughout.
Use vi.fn() and vi.spyOn() for mocking — not jasmine spies.
\```typescript
describe('TaskStore', () => {
  it('loads tasks on loadTasks call', async () => {
    // Arrange
    const mockTasks: Task[] = [{ id: 1, name: 'Fix bug', active: true }];
    vi.spyOn(taskApi, 'getAll').mockReturnValue(of(mockTasks));

    // Act
    store.loadTasks();
    await TestBed.inject(ApplicationRef).whenStable();

    // Assert
    expect(store.entities()).toEqual(mockTasks);
    expect(store.isLoading()).toBe(false);
  });
});
\```
```

### Agent: Refactor to Signals

**`.github/agents/refactor-to-signals.agent.md`:**

```markdown
# Refactor to Angular Signals

You modernize Angular code to Angular 21+ patterns.

## Migration Checklist
- @Input() → input() or input.required()
- @Output() EventEmitter → output()
- @ViewChild → viewChild()
- *ngIf → @if, *ngFor → @for (add track), *ngSwitch → @switch
- BehaviorSubject state → signal()
- Observable-based derivations → computed()
- Constructor injection → inject()
- Observable subscriptions in components → toSignal() with takeUntilDestroyed()
- Remove explicit standalone: true (default in Angular 21)

## For @for — track is mandatory
\```html
<!-- ✅ -->
@for (item of items(); track item.id) { ... }

<!-- ❌ missing track -->
@for (item of items()) { ... }
\```

## Template access changes
- Before migration: {{ title }}
- After migration: {{ title() }}  ← don't forget the call signature

## Behavior-preserving rule
Only change what's listed above. Do not add features or
refactor logic during migration.
```

---

## Part 3: Reusable Prompt Templates

Specialized prompts in `.github/prompts/` give you one-liner invocations for complex repeatable tasks. These work in every AI tool — reference them in chat or attach them as context files.

### Prompt: Code Review

**`.github/prompts/code-review.prompt.md`:**

```markdown
# Code Review

Perform a systematic review of the staged changes.

## Steps
1. Run git diff --staged to see what changed
2. Check for linting issues: ng lint
3. Verify test coverage hasn't dropped

## Review Dimensions
Check against these criteria in order:

### Angular 21+ Patterns
- No standalone: true (redundant)
- OnPush on every new component
- inject() used — no constructor DI
- input()/output() — no @Input/@Output
- @if/@for/@switch — no structural directives
- No BehaviorSubject for state
- No barrel files (index.ts)
- No shared/ folder additions

### Architecture (DDD)
- New files in the right layer (feature/, ui/, data/, util/)
- ui/ components free of store dependencies
- Class names without type suffixes

### Type Safety
- No any type
- All function parameters and return types explicit
- Strict null checks respected

### Tests
- Every new component has a spec file
- provideZonelessChangeDetection() present in all TestBed configs
- Signal inputs tested with setInput()

## Output Format
**Summary** → **Critical** (file:line — issue — fix) →
**Warnings** → **Passing** (what looks good)
```

### Prompt: NgRx Signal Store CRUD

**`.github/prompts/ngrx-store-crud.prompt.md`:**

```markdown
# NgRx Signal Store CRUD Generator

Generate a complete CRUD-capable Signal Store for an entity.

## What I Need From You First
1. Entity name and TypeScript interface (fields + types)
2. API base URL (e.g., /api/tasks)
3. Which operations are needed (list, get-by-id, create, update, delete)
4. Any computed signals needed (e.g., active count, filtered subset)

## What You Will Generate (in order)
1. Entity model file in data/<entity>.model.ts
2. API service in data/<entity>.api.ts
3. Signal store in data/<entity>.store.ts with:
   - withEntities for collection management
   - withState for loading/error/selectedId
   - withComputed for derived signals
   - withMethods wrapping all API calls via rxMethod
4. Integration example showing how a feature/ component injects and uses the store

## Rules
- Never Promises inside rxMethod — use Observables throughout
- patchState only — never mutate store state directly
- tapResponse handles both success and error paths
- addEntity/updateEntity/removeEntity for atomic collection changes
```

### Prompt: Bug Analysis

**`.github/prompts/analyze-bugs.prompt.md`:**

```markdown
# Codebase Bug Analysis

Systematically find functional bugs in the current codebase.

## Methodology
1. Search for patterns known to cause Angular bugs:
   - Missing track in @for loops
   - Signals read outside reactive contexts (effect/computed/template)
   - Store state mutations bypassing patchState
   - Memory leaks: subscriptions without takeUntilDestroyed()
   - Async race conditions in rxMethod switchMap vs mergeMap vs concatMap
2. Validate findings against the actual code — no assumed bugs
3. Check if failing tests exist for the issue
4. Rank by severity: Critical → High → Medium → Low

## Output Per Bug
- Location (file:line)
- What's wrong
- How to reproduce
- Suggested fix
- Test that would catch it

## Quality Rule
If no functional bugs are found, explicitly state: "No functional bugs found."
Do not invent issues without code evidence.
```

---

## Part 4: Skills — Deep Domain Knowledge on Demand

Skills are detailed reference documents that agents consult for patterns too complex to fit in AGENTS.md. Unlike the instruction files above, skills are **pulled in on demand** — loaded when the task requires them, not injected into every conversation.

### Skills Lock File — Reproducible Across the Team

The real power of the skills system is the **lock file**. Like `package-lock.json` for npm, `skills-lock.json` pins external skills to a specific commit hash so every developer and every AI gets identical behaviour.

**`skills-lock.json`:**

```json
{
  "version": 1,
  "skills": {
    "angular-developer": {
      "source": "angular/angular",
      "sourceType": "github",
      "source_path": "skills/dev-skills/angular-developer/SKILL.md",
      "hash": "sha256-abc123..."
    },
    "ngrx-signals": {
      "source": "danielsogl/skills",
      "sourceType": "github",
      "source_path": "skills/ngrx-signals/SKILL.md",
      "hash": "sha256-def456..."
    }
  }
}
```

When the Angular team updates the official Angular developer skill, you opt in by updating the hash — just like bumping a package version.

### Project Architecture Skill

**`.github/skills/project-architecture/SKILL.md`:**

```markdown
# Project Architecture Reference

## Folder Structure

src/app/features/<domain>/
├── feature/   Smart components. Inject stores. Handle navigation.
├── ui/        Dumb components. Signals in, outputs out. No store injection.
├── data/      Models, HTTP, Signal Stores.
└── util/      Pure functions. No Angular imports. Easily testable.

## Dependency Flow (one direction only)
feature/ → ui/ and data/
data/ → util/
ui/ → util/
util/ → nothing

## Naming Without Suffixes
TaskCard (not TaskCardComponent)
TaskApi (not TaskApiService)
TaskStore (not TaskSignalStore)
provideTaskStore() (factory function for root-level provision)

## What Absolutely Does Not Exist in This Codebase
- src/app/shared/ folder
- Any index.ts file
- Any file named *.module.ts
- Any constructor(private ...)
```

### Vitest + Angular Testing Skill

**`.github/skills/vitest-angular-testing/SKILL.md`:**

```markdown
# Testing Reference: Vitest + Angular 21

## TestBed Setup (copy-paste template)
\```typescript
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [ComponentUnderTest],
    providers: [
      provideZonelessChangeDetection(),
      provideHttpClient(),
      provideHttpClientTesting(),
    ],
  }).compileComponents();
});
\```

## Testing Signal Inputs
\```typescript
const fixture = TestBed.createComponent(TaskCard);
fixture.componentRef.setInput('task', { id: 1, name: 'Test' });
await fixture.whenStable();
// now query the DOM
\```

## Async Patterns
- Promises: await directly
- Observables: subscribe with done callback
- Timers: vi.useFakeTimers() + vi.runAllTimers()
- Signal effects: fakeAsync() + tick()

## Mocking HTTP
\```typescript
const httpMock = TestBed.inject(HttpTestingController);
afterEach(() => httpMock.verify());

it('calls GET /api/tasks', () => {
  service.getAll().subscribe();
  const req = httpMock.expectOne('/api/tasks');
  expect(req.request.method).toBe('GET');
  req.flush([mockTask]);
});
\```
```

---

## Part 5: MCP Servers — Live Tools Instead of Frozen Knowledge

AI tools stop guessing and start knowing when you connect them to live services via **Model Context Protocol (MCP)**. Here's the stack that covers Angular development end to end.

### The Complete `.mcp.json`

```json
{
  "mcpServers": {
    "angular-cli": {
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp"]
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    },
    "eslint": {
      "command": "npx",
      "args": ["-y", "@eslint/mcp@latest"]
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "./src"
      ]
    },
    "git": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git", "."]
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequentialthinking"]
    }
  }
}
```

### What Each Server Does for You

| Server | What It Unlocks | The Killer Use Case |
| ------ | --------------- | ------------------- |
| `angular-cli` | Live Angular CLI — build, lint, generate, migrate | AI runs `ng build` after generating code and fixes errors immediately |
| `context7` | Current library documentation for any npm package | "Show me the Angular Material 3 badge API" — gets today's docs, not 2023 training data |
| `eslint` | Live ESLint analysis during generation | AI checks its own output against your rules before returning it |
| `playwright` | Real browser automation | AI opens your running app, tests it, and reports what it sees |
| `filesystem` | Direct project file access | Multi-file refactors without copy-pasting — AI reads and writes files directly |
| `git` | Full repository history | "Why was this pattern introduced?" — AI reads the actual commit |
| `sequential-thinking` | Explicit step-by-step reasoning | Complex migrations get planned before they get executed |

**The `context7` server deserves special attention.** Every Angular developer has experienced asking an AI about a library API and getting a confidently wrong answer. `context7` resolves this by fetching live documentation for any npm package on demand. Ask about Angular Material 3 component APIs, NgRx Signal Store methods, or anything else — it returns current documentation, not training data.

```
How do I use the Angular Material 3 progress indicator component?
```

Without `context7`: answer based on Material 2 training data, possibly wrong.
With `context7`: answer based on the actual current `@angular/material` documentation.

### Connecting MCP Servers: Quick Commands

```bash
# Verify Angular CLI version (19.2+ required for MCP)
ng version

# Add servers to Claude Code globally
claude mcp add angular-cli --transport stdio -- npx -y @angular/cli mcp
claude mcp add context7 --transport stdio -- npx -y @upstash/context7-mcp@latest
claude mcp add sequential-thinking \
  --transport stdio -- npx -y @modelcontextprotocol/server-sequentialthinking

# Verify all connected
claude mcp list
```

---

## Part 6: Tool-Specific Configuration

Your `.github/` folder is the universal foundation. Each AI tool then reads from it in its own way — with one small per-tool config file that points back to the canonical source.

### Claude Code: `CLAUDE.md`

Create `CLAUDE.md` at the project root with a single directive — don't duplicate content:

```markdown
# Claude Code Project Reference

Read .github/AGENTS.md for all project conventions.

## Claude-Specific Additions

### MCP Servers Available
- angular-cli: build, lint, generate, modernize
- context7: live npm documentation
- sequential-thinking: complex migration planning
- playwright: browser automation and testing

### Workflow
1. Before writing new code: check .github/AGENTS.md for conventions
2. After generating TypeScript/templates: run ng build via angular-cli MCP
3. For complex migrations: activate sequential-thinking MCP to plan first
4. After code generation: run ESLint via eslint MCP to self-check output
```

### GitHub Copilot: `.github/copilot-instructions.md`

```markdown
# GitHub Copilot Instructions

Read .github/AGENTS.md for all project conventions.

## Summary of Non-Negotiables
- No standalone: true (Angular 21 default — omit it)
- No NgModule, no constructor DI, no @Input/@Output decorators
- No *ngIf/*ngFor — use @if/@for
- OnPush change detection on every component
- No barrel files (no index.ts)
- No shared/ folder
- Signals for state, never BehaviorSubject

## Agent Discovery
Specialized agents are in .github/agents/*.agent.md
Prompt templates are in .github/prompts/*.prompt.md
Skills are in .github/skills/
```

### VS Code: `.vscode/settings.json`

The VS Code settings wire up GitHub Copilot's agent and skill discovery to your `.github/` folder:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "github.copilot.enable": {
    "*": true,
    "markdown": true,
    "yaml": true
  },
  "github.copilot.agents.defaultAgent": "AGENTS.md",
  "github.copilot.agents.supportedAgentDiscoveryLocations": [
    "agents.md",
    "AGENTS.md",
    ".github/agents/*.agent.md"
  ],
  "github.copilot.skills.locations": [
    ".github/skills",
    ".agents/skills"
  ],
  "github.copilot.advanced.ignoreInstructionFiles": true,
  "mcp": {
    "servers": {
      "angular-cli": {
        "type": "stdio",
        "command": "npx",
        "args": ["-y", "@angular/cli", "mcp"]
      },
      "context7": {
        "type": "stdio",
        "command": "npx",
        "args": ["-y", "@upstash/context7-mcp@latest"]
      }
    }
  }
}
```

`"github.copilot.agents.supportedAgentDiscoveryLocations"` is the key setting — it tells Copilot exactly where to find your specialized agent definitions. Without this, Copilot ignores everything in `.github/agents/`.

### Cursor: `.cursor/rules/angular-always.mdc`

```markdown
---
description: Core Angular 21 rules from AGENTS.md
alwaysApply: true
---

See .github/AGENTS.md for full project conventions.

## Quick Reference
- No standalone: true (Angular 21 default)
- inject() — no constructor DI
- input() / output() — no @Input/@Output decorators
- @if / @for / @switch — no structural directives
- OnPush on every component
- No barrel files, no index.ts, no shared/ folder
- Signals for state — BehaviorSubject is banned
- Class names without suffixes: TaskCard not TaskCardComponent
```

Cursor can also consume scoped rules for specific file patterns — add them in `.cursor/rules/` using the `.mdc` format with `globs` frontmatter when you need per-file-type behaviour.

---

## Part 7: Pre-commit Hooks — Enforce Standards Before They Hit Git

The best AI configuration in the world means nothing if developers bypass it with copy-paste and the code makes it into git. Pre-commit hooks are the last line of defense — they run automatically on every `git commit` and reject anything that doesn't meet your standards.

Use **Lefthook** — it's faster than Husky, has parallel execution built in, and the config lives in a single YAML file.

### Install Lefthook

```bash
npm install --save-dev lefthook
npx lefthook install
```

### `lefthook.yml`

```yaml
pre-commit:
  parallel: true
  commands:
    prettier:
      glob: "*.{js,ts,html,css,scss,md,json,yaml}"
      run: npx prettier --write {staged_files}
      stage_fixed: true

    eslint:
      glob: "*.{ts,html}"
      run: npx eslint --fix {staged_files}
      stage_fixed: true
      fail_text: "ESLint errors found. Fix them before committing."
```

`parallel: true` runs both hooks simultaneously — typically under 3 seconds even on large files. `stage_fixed: true` automatically re-stages files that Prettier or ESLint modified, so your commit includes the fixed version.

### What This Catches That AI Misses

| Check | Catches |
| ----- | ------- |
| ESLint + `@angular-eslint` | `@Input()` decorators, constructor injection, missing track in `@for` |
| ESLint + `@ngrx/eslint-plugin` | Direct state mutations, store misuse patterns |
| Prettier | Inconsistent formatting that slips past AI generation |

When Lefthook blocks a commit, the error message tells you exactly what to fix. No guessing.

---

## Part 8: The TypeScript Config That Catches What Everything Else Misses

Strict TypeScript is a multiplier on everything else in this guide. When the compiler enforces strict null checks and explicit return types, AI-generated code either compiles or it doesn't — ambiguity disappears.

**`tsconfig.json`:**

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "target": "ES2022",
    "module": "preserve",
    "strictTemplates": true,
    "strictInjectionParameters": true,
    "experimentalDecorators": true,
    "skipLibCheck": false
  }
}
```

`strictTemplates: true` is the hidden gem here. It runs TypeScript's strict type checker inside your Angular templates. Typos in template bindings, wrong signal call signatures, missing required inputs — all of them become compile errors instead of runtime surprises.

---

## Part 9: Prompt Engineering That Actually Works

Even with all the configuration above in place, the quality of individual prompts still matters. Here's the framework that produces production-ready Angular on the first attempt.

### The STAR Prompt Framework

**S**tack context → **T**ask → **A**cceptance criteria → **R**estrictions

```
[S] Angular 21, signals, OnPush, inject(), DDD structure

[T] Create a TaskSearchComponent in src/app/features/tasks/ui/
that lets users filter the task list by name and status.

[A] Acceptance criteria:
- Debounce name input by 300ms
- Status filter derived from computed() over unique statuses
- Zero subscriptions — toSignal() for any async
- @empty block for no results
- ARIA labels on form controls

[R] Restrictions:
- No @for without track
- No BehaviorSubject
- No index.ts created
- Class name: TaskSearch (not TaskSearchComponent)
```

### Scaffolding an Entire Feature

```
Using the feature-scaffolder agent conventions, create the tasks feature:

Entities: Task { id, name, status: 'todo'|'in-progress'|'done', assigneeId }
Views: task list page, task detail page, create/edit form
API: /api/tasks (GET, GET/:id, POST, PUT/:id, DELETE/:id)

Location: src/app/features/tasks/
Run ng build after each file. Report when the build is clean.
```

### Migrating a Legacy Feature to Signals

```
Using the refactor-to-signals agent, migrate src/app/features/legacy-orders/.

Use sequential-thinking MCP to plan before executing:
1. List every file and what needs to change
2. Process one file at a time
3. Run ng build after each file — fix errors before the next
4. Remove NgModule file last, after all components are migrated
5. Final ng build should be clean

Show before and after for each file with changes.
```

### Self-Reviewing Generated Code

```
Using the code-review prompt template in .github/prompts/code-review.prompt.md,
review the files I just generated in src/app/features/invoices/.

Use the eslint MCP to run the actual linter, not just eyeball the code.
Report critical issues first. For each issue: file, line, problem, fix.
```

---

## Part 10: The Complete Project Setup

Here's the entire file structure for an Angular project fully wired for AI-assisted development:

```
my-angular-app/
├── .github/
│   ├── AGENTS.md                          ← Universal AI convention file
│   ├── agents/
│   │   ├── angular-reviewer.agent.md
│   │   ├── feature-scaffolder.agent.md
│   │   ├── signal-store.agent.md
│   │   ├── unit-test-writer.agent.md
│   │   └── refactor-to-signals.agent.md
│   ├── prompts/
│   │   ├── code-review.prompt.md
│   │   ├── ngrx-store-crud.prompt.md
│   │   └── analyze-bugs.prompt.md
│   ├── skills/
│   │   ├── project-architecture/SKILL.md
│   │   └── vitest-angular-testing/SKILL.md
│   └── copilot-instructions.md            ← Copilot pointer to AGENTS.md
│
├── .cursor/
│   └── rules/
│       └── angular-always.mdc             ← Cursor pointer to AGENTS.md
│
├── .vscode/
│   ├── extensions.json
│   └── settings.json                      ← Agent/skill discovery + MCP wiring
│
├── .mcp.json                              ← MCP servers for all tools
├── AGENTS.md                              ← Mirror of .github/AGENTS.md
├── CLAUDE.md                              ← Claude Code pointer to AGENTS.md
├── skills-lock.json                       ← Locked external skill versions
├── lefthook.yml                           ← Pre-commit hooks
├── tsconfig.json                          ← Strict mode + strictTemplates
│
└── src/app/
    ├── core/                              ← Guards, interceptors, root config
    └── features/
        └── tasks/                         ← DDD feature example
            ├── data/
            │   ├── task.model.ts
            │   ├── task.api.ts
            │   └── task.store.ts
            ├── ui/
            │   ├── task-card/
            │   │   ├── task-card.ts
            │   │   └── task-card.spec.ts
            │   └── task-search/
            │       ├── task-search.ts
            │       └── task-search.spec.ts
            ├── feature/
            │   └── task-list-page/
            │       └── task-list-page.ts
            └── tasks.routes.ts
```

Notice what's missing: no `shared/` folder, no `index.ts` files anywhere, no `*.module.ts` files. That's not an accident.

### Bootstrap Script

```bash
# Create the entire AI config structure
mkdir -p .github/{agents,prompts,skills/project-architecture,skills/vitest-angular-testing}
mkdir -p .cursor/rules
mkdir -p .vscode

# Add MCP servers to Claude Code globally
claude mcp add angular-cli --transport stdio -- npx -y @angular/cli mcp
claude mcp add context7 --transport stdio -- npx -y @upstash/context7-mcp@latest
claude mcp add sequential-thinking \
  --transport stdio -- npx -y @modelcontextprotocol/server-sequentialthinking

# Install pre-commit hooks
npm install --save-dev lefthook
npx lefthook install

# Verify
claude mcp list
npx lefthook run pre-commit  # dry run with no staged files
```

---

## Before and After: The Same Request, Two Worlds

**Request:** *"Create a task list component that fetches tasks from an API"*

**Without this setup:**

```typescript
// NgModule required, constructor DI, @Input, *ngFor, subscribe leak
@Component({ selector: 'app-task-list', templateUrl: './task-list.html' })
export class TaskListComponent implements OnInit {
  @Input() showCompleted = false;
  tasks: Task[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.taskService.getTasks().subscribe(tasks => this.tasks = tasks);
  }
}
```

**With this setup:**

```typescript
// inject(), input(), signal, @for with track, toSignal, OnPush
// No standalone: true needed in Angular 21
@Component({
  selector: 'app-task-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isLoading()) {
      <app-skeleton-list />
    } @else {
      @for (task of visibleTasks(); track task.id) {
        <app-task-card [task]="task" />
      } @empty {
        <p class="empty">No tasks found.</p>
      }
    }
  `,
})
export class TaskList {
  showCompleted = input(false);

  private store = inject(TaskStore);

  private allTasks = this.store.entities;
  isLoading = this.store.isLoading;
  visibleTasks = computed(() =>
    this.showCompleted()
      ? this.allTasks()
      : this.allTasks().filter(t => t.status !== 'done')
  );
}
```

Notice the class is named `TaskList`, not `TaskListComponent`. No suffix. No `standalone: true`. No imports that a standalone array would need — the store is injected, not imported. This is what AGENTS.md produces when followed correctly.

---

## Common Mistakes to Fix Right Now

### "My AI still generates standalone: true"

Add this to AGENTS.md explicitly:

```markdown
## BANNED PATTERNS — Never generate these

❌ Do not write this in Angular 21:
standalone: true

✅ Just omit it. It's the default.
```

### "My AI creates a shared/ folder"

The pull toward `shared/` is strong — it feels tidy. But it creates coupling between features that should be independent. Add to AGENTS.md:

```markdown
## Architecture Violations — Block These

There is NO shared/ folder in this project.
If a component seems "shared," it belongs to the feature that owns it,
or it should be extracted into a new feature domain.
```

### "My AI creates index.ts barrel files"

```markdown
## Barrel Files — Absolutely Forbidden

There are NO index.ts files in this project.
Always import directly from the source file:
✅ import { TaskCard } from '../ui/task-card/task-card';
❌ import { TaskCard } from '../ui';
```

### "Copilot ignores my .github/agents/ folder"

Check `.vscode/settings.json` for the discovery config:

```json
{
  "github.copilot.agents.supportedAgentDiscoveryLocations": [
    "AGENTS.md",
    ".github/agents/*.agent.md"
  ]
}
```

Without this, Copilot only looks for its default instruction files.

---

## Tool Comparison at a Glance

| | Claude Code | GitHub Copilot | Cursor |
| --- | ----------- | -------------- | ------ |
| Reads AGENTS.md | ✅ automatic | ✅ via VS Code setting | ✅ via alwaysApply rule |
| Specialized agents | ✅ via skills | ✅ `.github/agents/*.agent.md` | ✅ via `.mdc` globs |
| Prompt templates | ✅ reference in chat | ✅ `#file:.github/prompts/…` | ✅ reference in chat |
| MCP servers | ✅ full support | ✅ VS Code only | ✅ full support |
| Angular MCP | ✅ `ng mcp` | ✅ `ng mcp` | ✅ `ng mcp` |
| context7 MCP | ✅ | ✅ | ✅ |
| Pre-commit hooks | Independent (Lefthook) | Independent (Lefthook) | Independent (Lefthook) |

Lefthook, TypeScript strict mode, and ESLint are **tool-independent**. They enforce your standards regardless of which AI generated the code. That's the safety net.

---

## Conclusion

The teams shipping the best Angular code with AI aren't using a better model. They've built better infrastructure around whatever model they use.

The setup in this guide takes a few hours end-to-end. In return:

- **Any AI tool** your team uses reads from the same `.github/` conventions
- **AGENTS.md** eliminates the "which tool wrote this?" inconsistency
- **Specialized agents** bring domain expertise to specific tasks without bloating the global context
- **MCP servers** give AI access to live documentation and your actual running app
- **Lefthook hooks** enforce standards at commit time — no AI-generated legacy pattern survives
- **DDD without barrel files** keeps your bundle lean and your feature boundaries honest

The Angular team is shipping `ng mcp`, `llms.txt`, and AI-aware schematics in every release. AI tooling for Angular is getting better fast. The developers who invest in proper configuration now will compound those improvements — because their AI gets smarter with every Angular update, not just every model release.

Start with `AGENTS.md`. Add the Angular MCP and `context7`. Write the feature-scaffolder agent for the feature type you build most often. Run it once. You'll have the rest built out before the week is over.

---

## Resources

- [Reference Repo: copilot-workflow-demo](https://github.com/danielsogl/copilot-workflow-demo) — Production-grade Angular AI workflow this guide is based on
- [Angular AI Development Guide](https://angular.dev/ai/develop-with-ai) — Official Angular AI/IDE setup
- [Angular MCP Server](https://angular.dev/ai/mcp) — Official `ng mcp` documentation
- [Angular llms.txt](https://angular.dev/context/llm-files/llms-full.txt) — AI-friendly Angular documentation
- [context7 MCP](https://github.com/upstash/context7) — Live npm documentation for any package
- [MCP Server Collection](https://github.com/modelcontextprotocol/servers) — Official MCP server implementations
- [NgRx Signal Store](https://ngrx.io/guide/signals) — Modern Angular state management
- [Lefthook](https://github.com/evilmartians/lefthook) — Fast parallel pre-commit hooks

---

*What's the most useful agent you've built for your Angular project? The community learns fastest from real configurations — share yours in the comments.*
