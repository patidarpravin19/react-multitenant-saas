# React Multi-Tenant SaaS Starter

Production-oriented React + TypeScript architecture demonstrating:

- Runtime multi-tenant branding with CSS custom properties
- Light/dark theme context
- Collapsible application shell
- Accessible header/sidebar/footer
- Dynamic JSON-configured forms
- React Hook Form + Zod validation
- Extensible field component registry
- Strict TypeScript without `any` or `ts-ignore`
- Tailwind CSS runtime tenant tokens

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Architecture

```text
src/
├─ components/
│  ├─ layout/
│  │  ├─ AppShell.tsx
│  │  ├─ Header.tsx
│  │  ├─ Sidebar.tsx
│  │  └─ Footer.tsx
│  └─ ui/
│     ├─ Button.tsx
│     └─ FormFieldShell.tsx
├─ config/
│  └─ tenant.ts
├─ context/
│  ├─ TenantContext.tsx
│  └─ ThemeContext.tsx
├─ features/
│  └─ dynamic-form/
│     ├─ config/
│     │  └─ profileFormConfig.ts
│     ├─ fields/
│     │  ├─ fieldTypes.ts
│     │  ├─ TextField.tsx
│     │  ├─ EmailField.tsx
│     │  ├─ SelectField.tsx
│     │  └─ CheckboxField.tsx
│     ├─ registry/
│     │  └─ fieldRegistry.tsx
│     ├─ validation/
│     │  └─ schemaFactory.ts
│     └─ DynamicForm.tsx
├─ lib/
│  └─ color.ts
├─ styles/
│  └─ index.css
├─ types/
│  ├─ form.ts
│  └─ tenant.ts
├─ App.tsx
└─ main.tsx
```

## Production extension points

- Replace `src/config/tenant.ts` with tenant bootstrap data fetched before app render.
- Add API client/repository infrastructure under `src/services` or `src/lib/http`.
- Add routing under `src/app/router`.
- Add auth under `src/features/auth`.
- Add server-state management (for example TanStack Query) only for remote state.
- Keep UI state in local component/context state unless cross-feature sharing requires more.
- Keep domain-specific components inside their feature folders.
