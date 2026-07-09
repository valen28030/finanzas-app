# Finanzas App

App personal para controlar cuentas, movimientos, gastos fijos, coche, negocio, deudas y nomina.

## Desarrollo

```bash
npm install
npm run dev
```

## Publicacion

La app esta preparada para GitHub Pages. El workflow esta en `.github/workflows/deploy.yml`.

## Sincronizacion con Supabase

1. En Supabase, abre `SQL Editor`.
2. Ejecuta el contenido de `supabase/schema.sql`.
3. En GitHub, ve a `Settings > Secrets and variables > Actions > Variables`.
4. Crea estas variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Vuelve a ejecutar el workflow `Deploy GitHub Pages`.

Para desarrollo local, copia `.env.example` a `.env.local` y rellena los mismos valores.
