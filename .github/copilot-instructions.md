# Copilot Instructions for Workspace

Guidelines for GitHub Copilot to ensure consistent, high-quality code generation across the portfolio project.

## Code Quality Standards

### Language: TypeScript / JavaScript

- **Use strict TypeScript:** Enable `noImplicitAny`, `strictNullChecks`
- **Prefer `const` and `let`:** Never use `var`
- **Naming conventions:**
  - Variables/functions: `camelCase`
  - Classes/Components: `PascalCase`
  - Constants: `UPPER_SNAKE_CASE`
  - Private members: `_privateProperty`
  - Interfaces/Types: `PascalCase`, prefix with `I` only for interfaces if distinguishing from classes

### Comments & Documentation

- **JSDoc for all exports:**
  ```typescript
  /**
   * Fetches user data by ID with error handling.
   * @param id - The user ID
   * @returns Promise<User | null> - User data or null if not found
   * @throws Will throw if network request fails
   */
  export async function getUser(id: string): Promise<User | null> {
    // implementation
  }
  ```
- **Inline comments for complex logic:** Explain WHY, not WHAT
- **No TODO/FIXME in merged code:** Complete the implementation or open an issue

### Error Handling

- **Use custom error classes:**
  ```typescript
  class AppError extends Error {
    constructor(public status: number, message: string) {
      super(message);
    }
  }
  ```
- **Never silent-catch:**
  ```typescript
  // ❌ Bad
  try {
    await fetchData();
  } catch (e) {
    // Silent failure
  }
  
  // ✅ Good
  try {
    await fetchData();
  } catch (error) {
    logger.error('Failed to fetch data', error);
    throw new AppError(500, 'Data fetch failed');
  }
  ```

---

## File Organization

### Project Structure
```
portfolio/
├── src/
│   ├── components/          # React components
│   ├── pages/               # Next.js pages (if applicable)
│   ├── lib/                 # Utilities and helpers
│   ├── services/            # Business logic
│   ├── types/               # TypeScript types/interfaces
│   └── styles/              # Global styles
├── public/                  # Static assets
│   └── presentations/       # HTML presentations
├── tests/                   # Test files (mirror src structure)
├── docs/                    # Documentation
└── .github/                 # GitHub configs
    └── copilot-instructions.md  # This file
```

### File Size Guidelines
- **Maximum 300 lines per component/file** - split into smaller modules
- **Maximum 50 lines per function** - consider breaking into smaller functions
- **Keep related logic together** - don't scatter across files

---

## Component Architecture

### React Components
```typescript
interface ComponentProps {
  title: string;
  onAction: () => void;
  isLoading?: boolean;
}

/**
 * Main component description.
 */
export function MyComponent({ title, onAction, isLoading }: ComponentProps) {
  return <div>{title}</div>;
}
```

### Hooks Guidelines
- **Custom hooks go in `src/lib/hooks/`**
- **Name hooks with `use` prefix:** `useAuth`, `useFetch`, `useLocalStorage`
- **Keep hooks focused:** One responsibility per hook

---

## API & Backend Standards

### Express Routes (if applicable)
```typescript
// ✅ Good route structure
app.get('/api/users/:id', async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    next(error); // Pass to error handler middleware
  }
});
```

### Request/Response Format
```typescript
// Standard success response
{
  "success": true,
  "data": { /* resource */ },
  "message": "optional message"
}

// Standard error response
{
  "success": false,
  "error": "Human-readable error message",
  "code": "ERROR_CODE_CONSTANT",
  "details": {} // optional additional info
}
```

### Validation
- **Use schema validators:** Consider `zod`, `joi`, or similar
- **Validate early:** Check input at route handler level
- **Return specific error messages:** Help consumers understand what went wrong

```typescript
import { z } from 'zod';

const UserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  age: z.number().int().positive(),
});

app.post('/api/users', (req, res) => {
  const result = UserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ 
      success: false, 
      error: 'Validation failed',
      details: result.error.errors 
    });
  }
  // Continue...
});
```

---

## Testing Standards

### Test File Organization
- **Location:** Mirror `src` structure in `tests/`
- **Naming:** `feature.test.ts` for unit tests
- **Integration tests:** `tests/integration/`

### Unit Tests
```typescript
describe('calculateTotal', () => {
  it('should calculate sum of item prices', () => {
    const items = [{ price: 10 }, { price: 20 }];
    expect(calculateTotal(items)).toBe(30);
  });

  it('should return 0 for empty cart', () => {
    expect(calculateTotal([])).toBe(0);
  });
});
```

### Test Coverage
- **Target: 80%+ coverage** for business logic
- **100% coverage for auth/security code**
- **Don't obsess over coverage of utilities** (especially UI helpers)

---

## Async & Promises

### Use async/await (not `.then()` chains)
```typescript
// ❌ Avoid
fetch('/api/user')
  .then(res => res.json())
  .then(data => console.log(data));

// ✅ Prefer
const data = await fetch('/api/user');
const json = await data.json();
console.log(json);
```

### Timeout Handling
```typescript
async function fetchWithTimeout(url: string, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    return response.json();
  } finally {
    clearTimeout(timeout);
  }
}
```

---

## Security Practices

### Never Hardcode Secrets
```typescript
// ❌ Bad
const apiKey = 'sk-1234567890';

// ✅ Good
const apiKey = process.env.API_KEY;
if (!apiKey) throw new Error('API_KEY not set');
```

### Input Sanitization
```typescript
// Always validate and sanitize user input
import DOMPurify from 'dompurify';

const cleanHtml = DOMPurify.sanitize(userProvidedHtml);
```

### SQL Injection Prevention
- **Always use parameterized queries:**
  ```typescript
  // ❌ Vulnerable
  db.query(`SELECT * FROM users WHERE id = ${userId}`);

  // ✅ Safe
  db.query('SELECT * FROM users WHERE id = $1', [userId]);
  ```

---

## Performance Guidelines

### Avoid N+1 Queries
```typescript
// ❌ N+1 problem
const users = await User.find();
for (const user of users) {
  user.posts = await Post.find({ userId: user.id }); // Loop queries!
}

// ✅ Optimized
const users = await User.find().populate('posts'); // Single query
```

### Lazy Load Large Data
```typescript
// ❌ Load everything upfront
const allProducts = await Product.find();

// ✅ Paginate
const products = await Product.find()
  .limit(20)
  .skip((page - 1) * 20)
  .sort({ createdAt: -1 });
```

### Cache Expensive Computations
```typescript
const cache = new Map();

function expensiveComputation(key: string) {
  if (cache.has(key)) return cache.get(key);
  
  const result = heavyCalculation();
  cache.set(key, result);
  return result;
}
```

---

## Common Tasks

### Task 1: Create a New API Endpoint
When writing a new endpoint, include:
1. **Input validation**
2. **Error handling**
3. **Response format** (success/error)
4. **Logging**
5. **Unit tests**

### Task 2: Write Database Query
Always include:
1. **Connection error handling**
2. **Query validation**
3. **Timeout handling**
4. **Logging for debugging**

### Task 3: Create React Component
Always include:
1. **TypeScript interface for props**
2. **JSDoc comment**
3. **Accessible markup** (ARIA labels)
4. **Unit tests** (at minimum 2-3 test cases)

---

## Anti-Patterns to Avoid

### ❌ Never Do This

| Anti-Pattern | Why | Alternative |
|--------------|-----|-------------|
| `console.log` in production code | Pollutes logs, unprofessional | Use logger (winston, pino, etc.) |
| Nested ternary operators | Unreadable, hard to debug | Use if/else or switch statements |
| Direct database calls in controllers | Violates separation of concerns | Use service layer |
| Global mutable state | Causes bugs in concurrent systems | Use immutability + React state |
| Ignoring error handling | Silent failures, hard to debug | Always try/catch and log |
| Inline event handlers in JSX | Recreates on every render | Define outside JSX |
| No prop validation in components | Runtime errors, confusing bugs | Use TypeScript + PropTypes |

---

## Git & Commits

### Commit Message Format
```
type: short description (50 chars max)

Optional longer explanation (wrap at 72 chars)
- Explain the WHY, not the WHAT
- List any side effects
- Reference issues: Fixes #123
```

**Types:** `feat`, `fix`, `refactor`, `docs`, `test`, `chore`

### Branch Naming
- Feature: `feature/user-authentication`
- Bug fix: `fix/infinite-loop-in-fetch`
- Refactor: `refactor/component-structure`

---

## When to Ask for Clarification

If requirements are ambiguous, ask:
- "Should this API be public or require authentication?"
- "What's the expected response format for errors?"
- "Should we cache this data? For how long?"
- "Is this performance-sensitive (renders 1000s of items)?"

---

## Code Review Checklist

Before accepting Copilot's suggestion, verify:
- [ ] Matches project architecture
- [ ] Follows naming conventions
- [ ] Has error handling
- [ ] Has JSDoc comments
- [ ] No hardcoded secrets
- [ ] No `console.log` (in production files)
- [ ] Tests exist (or will be added)
- [ ] Performance optimized
- [ ] Security considered

---

## Examples

### Example 1: Good Copilot Prompt
```
Create a function to fetch user data by ID.
Requirements:
- Use async/await
- Add 5-second timeout
- Return User type or null if 404
- Implement exponential backoff retry (max 3 attempts)
- Add JSDoc comments
```

### Example 2: Poor Copilot Prompt
```
Fetch user data
```

**Better:**
```
Create a function `fetchUser` that:
- Takes userId (string) as parameter
- Returns Promise<User | null>
- Handles timeout errors gracefully
- Includes JSDoc comments
```

---

## Resources

- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/)
- [Express.js Guides](https://expressjs.com/en/guide/routing.html)
- [React Documentation](https://react.dev)
- [Clean Code Principles](https://www.oreilly.com/library/view/clean-code-a/9780136083238/)

---

**Last Updated:** 2026-05-13  
**Owner:** Devendra Milmile  
**Apply to all Copilot suggestions** in this repository.
