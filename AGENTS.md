# AI CODING AGENT GUIDELINES (SUNDAWA ENGINEERING STANDARDS)

Repositori ini mengikuti **SUNDAWA Code Setup Standards**. Setiap AI Assistant / Coding Agent WAJIB mematuhi ketentuan berikut:

1. **Boundary & Arsitektur (AI-01, AI-02):**
   - Pola Monorepo pnpm-workspace: Apps di `apps/*`, Reusable Libraries di `packages/*`.
   - Pola Feature-Driven modular di setiap Next.js app: Routing (`src/app`), Features/Vertical Slices (`src/features/*`), Shared UI Primitives (`@fuel-carbon/ui`).
   - Server Components by default; batasi `"use client"` hanya pada interaksi dinamis atau browser-only API.

2. **Database & Turso (LibSQL):**
   - Skema database sentral di `packages/db`.
   - Gunakan Drizzle ORM dengan driver `@libsql/client` (kompatibel dengan Turso Cloud dan local SQLite file:local.db).
   - Selalu sinkronkan skema melalui Drizzle Kit (`pnpm --filter @fuel-carbon/db db:push`).

3. **Integritas Keamanan & Otorisasi (SEC-07, BE-03):**
   - Dynamic RBAC 4-Layer (Middleware, Layout/Page, Server Actions, Dynamic UI Rendering).
   - Password hashing wajib menggunakan `bcryptjs`.
   - Jangan pernah menyisipkan kredensial asli ke dalam kode repo.

4. **UI & Styling:**
   - Gunakan **Tailwind CSS v4** dengan token desain Sundawa / Nawasanga Rimba.
   - Tanpa Shadcn/Radix kompleks; gunakan Shared UI Primitives terstandardisasi (`@fuel-carbon/ui`).
