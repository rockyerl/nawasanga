# AI CODING AGENT GUIDELINES (SUNDAWA ENGINEERING STANDARDS)

Repositori ini mengikuti **SUNDAWA Code Setup Standards**. Setiap AI Assistant / Coding Agent WAJIB mematuhi ketentuan berikut:

1. **Boundary & Arsitektur (AI-01, AI-02):**
   - Pola Feature-Driven modular: Routing (`src/app`), Features/Vertical Slices (`src/features/*`), Shared UI Primitives (`src/shared`), dan Persistence (`src/db`).
   - Server Components by default; batasi `"use client"` hanya pada interaksi dinamis atau browser-only API.
   - Semua modul Client Portal, Internal Superadmin Backoffice, dan Public Landing terintegrasi dalam SATU aplikasi Next.js tunggal.

2. **Database & Turso (LibSQL):**
   - Skema database sentral di `src/db/schema.ts`.
   - Gunakan Drizzle ORM dengan driver `@libsql/client` (kompatibel dengan Turso Cloud dan local SQLite `file:local.db`).
   - Selalu sinkronkan skema melalui Drizzle Kit (`pnpm db:push`).
   - Seeder database dieksekusi melalui `pnpm db:seed`.

3. **Integritas Keamanan & Otorisasi (SEC-07, BE-03):**
   - Dynamic RBAC 4-Layer (Middleware, Layout/Page, Server Actions, Dynamic UI Rendering).
   - Password hashing wajib menggunakan `bcryptjs`.
   - Token otentikasi menggunakan JOSE JWT dengan payload role dan permissions.
   - Jangan pernah menyisipkan kredensial asli ke dalam kode repo.

4. **UI & Styling:**
   - Gunakan **Tailwind CSS v4** dengan token desain Sundawa / Nawasanga Rimba.
   - UI Primitives terstandardisasi di `src/shared/components` dan `src/components/ui`.
