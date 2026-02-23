# AI Coding Agent Development Guide

**Project Context:** Next.js (SSR) + Supabase + Vercel
**Goal:** Produce clean, structured, scalable, and debuggable code.

---

# 1. Core Engineering Principles

## 1.1 Clarity Over Cleverness

* Prefer explicit logic over compact one-liners.
* Avoid premature optimization.
* Make intent obvious from reading the code.

## 1.2 Single Responsibility

Each module must do one thing well:

* API routes → request handling only
* Services → database interaction only
* UI components → rendering only
* Utils → pure helper logic

## 1.3 Predictable Structure

Follow consistent naming, folder organization, and patterns across the codebase.

---

# 2. Project Structure Standard

Use a domain-driven structure.

```
/app
  /api
  /services
  /booking
  /contact
  /portfolio

/components
  /ui
  /forms
  /booking

/lib
  supabaseClient.ts
  validationSchemas.ts

/services
  booking.service.ts
  service.service.ts
  contact.service.ts

/types
  booking.types.ts
  service.types.ts

/utils
  priceCalculator.ts
  availabilityChecker.ts
```

Rules:

* No database queries inside UI components.
* No business logic inside API routes.
* All external calls isolated in services layer.

---

# 3. Coding Standards

## 3.1 Type Safety (Mandatory)

* Use TypeScript strictly.
* Avoid `any`.
* Create explicit types for:

  * Booking payload
  * Service entity
  * API responses

Example:

```ts
export interface CreateBookingPayload {
  customerName: string;
  email: string;
  phone?: string;
  eventDate: string;
  eventTime: string;
  clients: BookingClient[];
}
```

---

## 3.2 Function Design

Every function must:

* Have a clear name
* Have a single responsibility
* Return predictable output
* Throw meaningful errors

Bad:

```ts
async function doStuff(data) { ... }
```

Good:

```ts
async function createBooking(payload: CreateBookingPayload): Promise<BookingResult>
```

---

# 4. API Design Guidelines

## 4.1 Thin Controllers

API routes should:

1. Validate input
2. Call service
3. Return response

Never:

* Write raw SQL inside API route
* Mix validation + DB + transformation in same file

Example:

```ts
export async function POST(req: Request) {
  const body = await req.json();
  const validated = bookingSchema.parse(body);
  const result = await bookingService.createBooking(validated);
  return Response.json(result);
}
```

---

## 4.2 Consistent Response Shape

All APIs must return:

```ts
{
  success: boolean;
  data?: T;
  error?: string;
}
```

---

# 5. Database Layer Rules

## 5.1 Service Layer Pattern

Each domain must have a service file.

Example:

```
booking.service.ts
```

Responsibilities:

* DB interaction
* Transaction handling
* Business logic
* Slot validation

---

## 5.2 Use Transactions for Booking

Booking creation must:

* Insert booking
* Insert clients
* Insert booking services

If any step fails → rollback.

Never allow partial writes.

---

## 5.3 Avoid Query Duplication

If logic is reused:

* Move to service layer
* Or utility function

---

# 6. Validation & Error Handling

## 6.1 Use Zod for All Inputs

Validate:

* API inputs
* Critical internal transformations

Never trust client input.

---

## 6.2 Error Handling Pattern

Use structured errors:

```ts
class BookingConflictError extends Error {}
class ValidationError extends Error {}
```

In API:

```ts
try {
  ...
} catch (error) {
  if (error instanceof BookingConflictError) {
    return Response.json({ success: false, error: "Slot unavailable" }, { status: 409 });
  }
}
```

Never expose raw DB errors.

---

# 7. Logging Standards

## 7.1 Structured Logs Only

Bad:

```ts
console.log("Error happened");
```

Good:

```ts
console.error({
  context: "createBooking",
  error: error.message,
  payload
});
```

## 7.2 Never Log

* Supabase keys
* Sensitive customer data
* Full payment details

---

# 8. SSR & SEO Best Practices

* Fetch critical content server-side.
* Use dynamic metadata.
* Avoid client-only rendering for SEO pages.
* Preload critical images.
* Generate sitemap automatically.

---

# 9. State Management Guidelines

For booking cart:

* Use React Context or Zustand.
* Keep booking state normalized:

Bad:

```
clients: [{ services: [...] }]
```

Better:

```
clients: []
services: []
clientServiceMap: []
```

Keep data easy to validate and persist.

---

# 10. Code Formatting Rules

* Max function length: ~40 lines
* Max nesting depth: 3 levels
* No deeply nested conditionals
* Extract helpers instead of nesting

---

# 11. Naming Conventions

| Type       | Convention       |
| ---------- | ---------------- |
| Files      | kebab-case       |
| Components | PascalCase       |
| Variables  | camelCase        |
| DB columns | snake_case       |
| Interfaces | PascalCase       |
| Constants  | UPPER_SNAKE_CASE |

---

# 12. Performance Guidelines

* Always index foreign keys.
* Avoid fetching entire tables.
* Use pagination for admin views.
* Lazy load non-critical components.
* Optimize images before upload.

---

# 13. Security Rules

* Enable RLS on all tables.
* Public role → insert only.
* Admin role → read/update/delete.
* Never expose service role key to frontend.
* Sanitize text fields.

---

# 14. Testing Strategy for AI Agent

Before marking feature complete:

### Validate:

* Single service booking
* Multiple service booking
* 10+ clients booking
* Duplicate slot attempt
* Invalid email input
* Missing required fields

---

# 15. Commit & Versioning Rules

Each commit must:

* Solve one logical unit
* Have descriptive message

Format:

```
feat(booking): add multi-client booking logic
fix(api): handle slot conflict error
refactor(service): extract availability check
```

---

# 16. What the AI Must Never Do

* Write untyped code
* Mix UI + DB logic
* Hardcode business values
* Skip validation
* Write duplicate logic
* Leave console debugging in production
* Create tightly coupled modules

---

# 17. Code Quality Checklist (Pre-Completion)

Before finishing any feature, verify:

* [ ] Types defined
* [ ] Validation implemented
* [ ] Errors handled
* [ ] Logs structured
* [ ] No duplication
* [ ] DB queries optimized
* [ ] RLS compatible
* [ ] Response format consistent
* [ ] No unused variables
* [ ] No console.debug left

---

# 18. Long-Term Maintainability Rules

* Prefer composition over inheritance.
* Keep business rules centralized.
* Avoid global mutable state.
* Keep domain logic isolated from framework specifics.
* Design so payment integration can plug in later.

---

# 19. Architecture Mindset for the AI

When implementing anything, always ask:

1. Is this scalable?
2. Is this debuggable?
3. Is this testable?
4. Is this readable by another engineer?
5. Can this be reused?

If answer is “no” → refactor before completion.