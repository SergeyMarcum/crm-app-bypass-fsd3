# Comprehensive Function Documentation Rules

These rules ensure that all code generated or modified by humans or AI adheres to a high standard of documentation, making the codebase clear, maintainable, and easy for both developers and AI to navigate. The primary focus is on **consistent and thorough function documentation** across all languages and modules.

---

## 1. Scope and When Documentation Is Required

Documentation is **mandatory** for:

- Every public or externally visible function, method, class, interface, and module.
- Any non-trivial internal helper (multiple branches, loops, error handling, I/O, or side effects).
- Any function that is reused in more than one place.
- Any function that manipulates shared state, interacts with external systems, or implements critical business logic.

Documentation is **recommended** but not strictly mandatory for:

- Very small, self-explanatory local helpers within a single file (e.g. `isEmpty`, `toLowerCaseSafe`) when the name fully describes the behavior and there are no side effects or edge cases.

If in doubt, **document it**.

---

## 2. Language-Specific Standards

Use the appropriate, widely accepted standard for each language:

- **JavaScript/TypeScript**: JSDoc.
- **Python**: reStructuredText (reST) or Google-style docstrings, according to project conventions.
- **PHP**: PHPDoc.
- **Java**: Javadoc.
- **Ruby**: RDoc or YARD (follow existing project convention).
- **Other languages**: Use the dominant community standard or, if not available, mirror the structure defined in section 3.

All code in the repository MUST use one of these styles consistently per language.

---

## 3. Required Documentation Fields for Functions and Methods

For **every function or method**, include the following sections in the documentation block (translated to the language’s doc style):

## 3.1 Description

- A clear, one- to two-sentence explanation of **what** the function does.
- Include **context or purpose** if not obvious (e.g. “Used in the checkout flow to calculate discounts”).
- If the behavior is non-obvious (e.g. caching, retries, side effects), mention it at a high level.

## 3.2 Parameters

For each parameter:

- Name and **type** (if applicable).
- Short description of its role.
- Constraints and expectations, such as:
  - Value range (e.g. “Must be a positive integer”).
  - Shape / structure (e.g. “Array of `{ id: string; name: string }` objects”).
  - Units (e.g. “Timeout in milliseconds”).
- Whether it is **required** or **optional**.
- Default value or behavior when omitted.

## 3.3 Return Value

- Return type and a description of what it represents.
- Any special cases:
  - When it may return `null`, `undefined`, `None`, or a sentinel value.
  - When it returns a promise / future / observable, clarify what is resolved/rejected.

## 3.4 Errors and Exceptions

- List all **intentional** errors/exceptions the function may raise/throw and under what conditions.
- If applicable, document:
  - Validation errors.
  - Network or I/O errors surfaced to callers.
  - Custom error types.

## 3.5 Side Effects

- Explicitly note any side effects, such as:
  - Writing to a database or cache.
  - Modifying global or shared state.
  - Logging, sending metrics, emitting events.
  - Performing network calls, file I/O, or external API calls.

If the function is **pure** (no side effects), stating this is optional but encouraged for critical utilities.

## 3.6 Concurrency, Performance, and Limits (If Applicable)

For functions sensitive to performance or concurrency:

- Describe **time or space complexity** in simple terms when it matters (e.g. “Runs in O(n log n) time”).
- Mention **thread-safety** or **reentrancy** guarantees or lack thereof.
- Clarify **limits or quotas**:
  - Maximum input size for reliable performance.
  - Rate limits or throttling behavior.

## 3.7 Security, Privacy, and Compliance (If Applicable)

If a function handles sensitive data or affects security:

- Mention if it processes **PII**, authentication tokens, or secrets.
- Note relevant security expectations (e.g. “Never logs raw passwords”, “Hashes tokens before storage”).
- Call out any **authorization** or **authentication** assumptions (e.g. “Caller must verify access rights before calling”).

## 3.8 Examples

- Provide at least one **usage example** for:
  - Functions with non-trivial logic.
  - Public APIs intended for reuse.
- Cover at least:
  - A typical “happy path”.
  - One edge case if it is important (e.g. empty input, `null` parameter).
- Ensure examples are **runnable** or very close to runnable in the target language.

## 3.9 Deprecation

If the function is deprecated:

- Mark it explicitly with the language’s deprecation tag/annotation.
- Include:
  - Since when it is deprecated (version or date).
  - The recommended alternative and migration notes.
  - Planned removal version, if known.

---

## 4. Documentation for Classes, Modules, and Types

## 4.1 Classes

For each class:

- High-level description of the class’s role and when to use it.
- Description of important constructor parameters and their constraints.
- Documentation for:
  - All public methods (using the function rules above).
  - Any methods intended for subclassing/overriding.
- Note lifecycle expectations (e.g. “Call `close()` to release resources”).

## 4.2 Modules / Packages

For modules or packages:

- A brief summary of what the module provides.
- Any key concepts or patterns (e.g. “Implements the repository pattern for user persistence”).
- References to main entry points or primary functions.

## 4.3 Types, Interfaces, and Enums

For shared types:

- One-sentence description of what the type represents.
- Field-level documentation for non-obvious fields.
- For enums, clarify what each value means and any special semantics.

---

## 5. Style and Consistency Guidelines

- Use **clear and concise** language; avoid slang, jargon, and vague phrases like “handles data” or “does stuff”.
- Use **present tense** and **imperative** style where appropriate:
  - “Returns the list of active users.”
  - “Validate the input configuration.”
- Avoid duplicating what is already obvious from the name or type unless there is added nuance.
- Keep formatting (headings, bullets, code fences) consistent within the project.
- If updating existing code:
  - Update the **documentation together with the implementation**.
  - Do not leave outdated descriptions, parameter lists, or examples.

---

## 6. AI-Specific Rules

When AI tools generate or modify code:

- AI must **not remove** existing documentation blocks unless they are clearly incorrect and replaced with improved documentation.
- If the behavior, parameters, or return values change, AI must **update the documentation in the same change**.
- AI should:
  - Reuse existing phrasing and style where consistent with these rules.
  - Prefer extending existing docs over rewriting them entirely, to preserve history and intent.
- AI must check for **similar existing functions** before introducing new ones and:
  - Reuse/extending existing utilities where possible.
  - Reference related functions in the docs (e.g. “See also `normalizeUserName`”).

---

## 7. Example: JavaScript/TypeScript JSDoc

```ts
/**
 * Filter an array of objects to keep only unique items based on a specified key.
 * Commonly used to deduplicate records returned from database queries or APIs.
 *
 * @param {Array<object>} items - The array of objects to filter. Must be an array.
 * @param {string} key - The key on each object used to determine uniqueness.
 * @returns {Array<object>} A new array containing only the first occurrence of each unique key value.
 *
 * @throws {TypeError} If `items` is not an array or `key` is not a string.
 *
 * @example
 * const users = [
 *   { id: 1, name: 'Alice' },
 *   { id: 2, name: 'Bob' },
 *   { id: 2, name: 'Charlie' },
 * ];
 *
 * const uniqueUsers = filterUniqueItems(users, 'id');
 * // Result: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
 */
function filterUniqueItems(items, key) {
  if (!Array.isArray(items)) throw new TypeError("items must be an array");
  if (typeof key !== "string") throw new TypeError("key must be a string");

  const seen = new Set();
  const result = [];

  for (const item of items) {
    const value = item[key];
    if (seen.has(value)) continue;
    seen.add(value);
    result.push(item);
  }

  return result;
}
```

---

## 8. Documentation Quality Checklist

Before considering documentation complete for a function, confirm:

- Description clearly explains **what** it does and, if needed, **why**.
- All parameters are listed with types, constraints, and optionality.
- Return value is fully described, including `null`/`undefined` cases.
- Errors, side effects, and external interactions are documented.
- Any security, privacy, performance, concurrency, or limit considerations are noted.
- At least one example is present for non-trivial or public functions.
- Deprecation (if applicable) is clearly marked with guidance.
- Documentation and implementation are **in sync**.

Добавить в последующие

Проверьте источники
