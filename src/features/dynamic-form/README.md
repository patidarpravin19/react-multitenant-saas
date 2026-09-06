# Dynamic Form Extension Guide

To add a new field type without modifying existing field implementations:

1. Add a new discriminated config interface in `src/types/form.ts`.
2. Create the field component under `fields/`.
3. Add its Zod builder case in `validation/schemaFactory.ts`.
4. Register the component in `registry/fieldRegistry.tsx`.
5. Add JSON/config entries wherever the form is configured.

For a larger application, the registry can be converted to dependency injection:
`createFieldRegistry([{ type, component, schemaBuilder }])`, allowing feature packages
to register fields at composition-root startup.
