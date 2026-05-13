# GitHub Copilot Agents: Mastering Plan Mode

Advanced guide for using Copilot Agents (Edits) safely and effectively.

## Table of Contents

1. [What Are Agents?](#what-are-agents)
2. [Plan Mode Strategy](#plan-mode-strategy)
3. [Safety Principles](#safety-principles)
4. [Real-World Use Cases](#real-world-use-cases)
5. [Troubleshooting](#troubleshooting)
6. [Golden Rules](#golden-rules)

---

## What Are Agents?

### Agents vs. Inline Suggestions

| Feature | Inline Suggestions | Agents (Copilot Edits) |
|---------|-------------------|------------------------|
| **Scope** | Single file, single location | Multiple files simultaneously |
| **Speed** | Accept with Tab | Full workflow: plan → execute → review |
| **Control** | High (see suggestion immediately) | Medium (must review plan first) |
| **Use Case** | Boilerplate, quick scaffolding | Large refactors, multi-file changes |
| **Risk** | Low (one place) | Higher (affects many files) |

### Agent Capabilities

- 📁 **Modify multiple files** in a single operation
- 🔄 **Refactor across codebase** (e.g., rename variable everywhere)
- 🏗️ **Scaffold feature branches** (create 5+ files for new feature)
- 🗑️ **Delete files** intelligently
- 📝 **Update imports** automatically across the codebase

---

## Plan Mode Strategy ⭐ THE GOLDEN RULE

**Never let an Agent edit files without seeing a plan first.**

### Three-Phase Workflow

#### Phase 1: Plan (Approval Before Code)

**Ask Copilot to generate a plan:**

```
@workspace I need to refactor User authentication to use JWT instead of sessions.

BEFORE WRITING CODE, generate a detailed step-by-step plan:
1. List ALL files you will modify
2. For each file, describe WHAT changes and WHY
3. Explain any new dependencies
4. Flag any breaking changes

Do NOT write code yet. Just the plan in Markdown.
```

**Expected Output:**
```markdown
## Refactoring Plan: Session → JWT Authentication

### Files to Modify:
1. `src/middleware/auth.ts` - Replace session validation with JWT verification
2. `src/routes/login.ts` - Generate JWT instead of session cookie
3. `src/types/index.ts` - Update User type to remove sessionId
4. `package.json` - Add jsonwebtoken dependency
5. `.env.example` - Add JWT_SECRET

### Breaking Changes:
- Users will lose existing sessions on deployment
- Client must send `Authorization: Bearer <token>` header
- Token expiry = 24 hours (configurable)

### New Dependencies:
- jsonwebtoken ^9.0.0

### Step-by-Step Implementation:
1. Install jwt package
2. Add JWT_SECRET to .env
3. Update auth middleware
4. Update login route
5. Update type definitions
...
```

#### Phase 2: Review & Approve

**You review the plan:**

- ✅ Does it match your architecture?
- ✅ Are all affected files listed?
- ✅ Are there any missing considerations?
- ✅ Is the approach the one you want?

**If changes needed:**
```
I like the plan, but:
1. Don't modify `src/types/index.ts` - I'll handle that separately
2. Add a migration script to the plan for existing users
3. Make token expiry configurable via environment variable
```

#### Phase 3: Execute

**Once approved:**
```
Great! Now implement the plan exactly as written.
```

Copilot then writes all the code across all files.

### Plan Template

Use this template to ensure comprehensive plans:

```
# Refactoring Plan: [Feature Name]

## Overview
[One sentence summary]

## Files to Create/Modify/Delete
- [ ] src/file1.ts - description
- [ ] src/file2.ts - description
- [ ] tests/file1.test.ts - description

## Architecture Changes
- [Impact on system design]
- [New patterns introduced]
- [Breaking changes]

## Dependencies
- [New packages to install]
- [Version constraints]

## Step-by-Step Implementation
1. [Step 1]
2. [Step 2]
...

## Testing Strategy
- [Unit tests for]
- [Integration tests for]
- [Manual testing steps]

## Rollback Plan
[How to undo if something breaks]
```

---

## Safety Principles

### Before Agent Execution

#### 1. **Commit Your Current Work**

```bash
git add .
git commit -m "WIP: before agent refactoring"
```

**Why:** You can always `git diff` or `git revert` if something goes wrong.

#### 2. **Review the Entire Plan**

```
Question for Copilot:
@workspace Create a plan for [task], but specifically address:
- What are potential gotchas or edge cases?
- Are there any deprecated patterns we should avoid?
- Will this affect performance?
```

#### 3. **Check for Over-Modifications**

Agents sometimes want to "improve" files they don't need to modify.

```
Red Flag ⚠️: Plan includes files that don't need changes
Action: Remove those files from the plan before executing
```

#### 4. **Test Boundaries**

```
If Agent plan says "modify src/utils/helper.ts",
ask: "How many files import from helper.ts? 
      Will those files break after this change?"
```

### During Agent Execution

#### 1. **Watch the File Changes**

Copilot shows a diff of all changes before finalizing:

- ✅ Accept changes if correct
- ❌ Reject if anything looks wrong
- 🔄 Ask Copilot to fix specific issues

#### 2. **Don't Accept Partial Plans**

If the plan said 5 files but only 3 are modified:

```
Agent only modified 3 of 5 planned files. Why are 
src/services/auth.ts and tests/auth.test.ts missing?
```

### After Agent Execution

#### 1. **Run Your Full Test Suite**

```bash
npm test
npm run lint
npm run type-check
```

#### 2. **Manual Smoke Tests**

Test the feature end-to-end:
- Login flow
- API calls
- Error handling
- Edge cases

#### 3. **Code Review**

Even though Copilot wrote it, treat it like a PR from a junior dev:
- ✅ Check logic correctness
- ✅ Verify error handling
- ✅ Check for security issues
- ✅ Ensure performance

#### 4. **Git Inspection**

```bash
git diff HEAD~1    # See all changes
git status          # Any unexpected files?
git log --oneline   # Verify commit message
```

---

## Real-World Use Cases

### Use Case 1: Adding Redis Caching to API

#### The Plan Request

```
@workspace I want to add Redis caching to the Order service.

Requirements:
- Cache GET requests for 5 minutes
- Invalidate cache on POST/PUT/DELETE
- Add Redis client utility
- Update OrderService to use cache
- Add integration tests for cache behavior

Generate a detailed plan BEFORE coding.
```

#### Expected Plan

```markdown
## Adding Redis Caching to Orders

### Files:
1. `src/lib/redis.ts` - NEW: Initialize Redis client
2. `src/services/OrderService.ts` - Add cache check before DB query
3. `src/routes/orders.ts` - Invalidate cache on mutations
4. `docker-compose.yml` - Add Redis service
5. `.env.example` - Add REDIS_URL
6. `tests/integration/OrderService.test.ts` - Cache behavior tests

### Implementation Steps:
1. Create redis.ts client with error handling
2. Add cache-get method to OrderService.getOrder()
3. Add cache-invalidate to OrderService.create/update/delete
4. Add Redis service to docker-compose.yml
5. Write integration tests

### Breaking Changes: None
### Dependencies: redis@latest
```

#### Approval

```
Good plan! Execute now. Make sure cache invalidation 
also handles cascade deletes.
```

---

### Use Case 2: Extracting Component from Monolith

#### The Plan Request

```
@workspace I need to extract the "Product Filters" section 
from the Products page into a reusable component.

Current state: Everything is in src/pages/products.tsx (500 lines)
New structure: 
- Component: src/components/ProductFilters/
- Types: src/components/ProductFilters/types.ts
- Tests: src/components/ProductFilters/ProductFilters.test.tsx

Generate a plan.
```

#### Expected Plan

```markdown
## Extracting ProductFilters Component

### Files:
1. `src/components/ProductFilters/ProductFilters.tsx` - NEW
2. `src/components/ProductFilters/types.ts` - NEW
3. `src/components/ProductFilters/ProductFilters.test.tsx` - NEW
4. `src/pages/products.tsx` - MODIFY: import new component, remove old code
5. `src/components/ProductFilters/index.ts` - NEW: export component

### Steps:
1. Create ProductFilters folder
2. Extract filter state and handlers to component
3. Define TypeScript interfaces
4. Write component tests
5. Update products.tsx to use new component
6. Delete old filter code

### Testing:
- Unit tests for filter state changes
- Integration test: filters affect product list
```

---

### Use Case 3: Adding Error Boundary to React App

#### The Plan Request

```
@workspace Add error boundaries to the React app.

Current: No error boundaries
Target: 
- Global error boundary in App.tsx
- Route-level boundaries
- Fallback UI for errors

Generate plan.
```

---

## Troubleshooting

### Problem 1: Agent Modified Wrong Files

**Symptom:** Plan said 3 files, but Agent modified 5

```
Agent, you modified src/utils/logging.ts which wasn't in the plan.
Why? If you needed to change it, explain. Otherwise, revert it.
```

### Problem 2: Agent Introduced Breaking Changes

**Symptom:** Tests fail after agent execution

```
Agent modified the API response format but didn't update tests.
Review the changes in src/services/ and tests/.
Fix the test expectations to match new format.
```

### Problem 3: Incomplete Implementation

**Symptom:** Plan said "Add error handling" but Agent skipped it

```
The cache-miss scenario in redis.ts has no error handler.
If Redis is down, this will crash. Fix it.
```

### Problem 4: Performance Regression

**Symptom:** App is slow after Agent's changes

```
Agent, you refactored the data-fetching. 
The new version makes 3x more database queries than before.
Optimize using database joins or caching.
```

---

## Golden Rules

### 🥇 Rule 1: Always See the Plan First

**Never** let Agent modify files without a Markdown plan.

```
❌ Bad:
Agent, refactor the authentication system

✅ Good:
@workspace create a plan to refactor authentication.
Do NOT write code. Just list files and changes.
```

### 🥈 Rule 2: Commit Before Execution

```bash
git commit -am "Before agent execution"
```

You can always diff or revert.

### 🥉 Rule 3: Run Tests After

```bash
npm test
npm run lint
npm run type-check
```

Every agent execution must pass full test suite.

### 4️⃣ Rule 4: Review Every File

Even if Agent says "no changes to this file", spot-check:

```bash
git diff HEAD~1 src/middleware/
git diff HEAD~1 tests/
```

### 5️⃣ Rule 5: One Agent Per Task

```
❌ Bad:
"Refactor auth AND add caching AND extract components"

✅ Good:
1. Agent for auth refactoring (test, commit)
2. Agent for caching (test, commit)
3. Agent for extraction (test, commit)
```

Smaller PRs = easier to debug if something breaks.

### 6️⃣ Rule 6: Question Large Scopes

```
If plan modifies 10+ files, ask:
"Can we reduce scope? This seems large."
```

Large agents are hard to debug.

### 7️⃣ Rule 7: You Own Every Change

The Agent generated it, but **you** own it.

- You approved the plan
- You accepted the changes
- You passed it through review
- **You** are responsible for bugs

---

## Pre-Merge Checklist

Before merging an Agent-generated PR:

- [ ] Commit message describes changes
- [ ] Tests pass locally
- [ ] Linting passes
- [ ] Type checking passes
- [ ] Coverage didn't decrease
- [ ] Manual smoke tests pass
- [ ] Performance benchmarks OK
- [ ] No breaking changes (or documented)
- [ ] Rollback plan clear
- [ ] Code reviewed by teammate (if possible)

---

## Resources

- [GitHub Copilot Agents Documentation](https://github.com/features/copilot)
- [Git Workflows for Safe Rollbacks](https://git-scm.com/book/en/v2)
- [Code Review Best Practices](https://google.github.io/eng-practices/review/)

---

**Last Updated:** 2026-05-13  
**Author:** Devendra Milmile  
**Review Policy:** Always use Plan Mode
