# Esmorzapp

Una PWA para registrar y consultar tus almuerzos valencianos (esmorzars).

## Stack Tecnológico

- **Vite 5+** - Build tool
- **React 18+** - UI Library
- **TypeScript** - Tipado estático
- **React Router v6** - Routing
- **vite-plugin-pwa** - PWA functionality
- **react-i18next** - Internacionalización (español/valenciano)
- **Tailwind CSS** - Estilos
- **Supabase** - Backend y base de datos

## Configuración Inicial

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
VITE_TALLY_FORM_URL=url_del_formulario_tally (opcional)
```

### 3. Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ejecuta las migraciones SQL en el orden correcto:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_storage_bucket.sql`

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### 5. Acceder desde móvil

1. Asegúrate de que tu móvil y ordenador estén en la misma red WiFi
2. Obtén tu IP local:
   - Mac/Linux: `ifconfig | grep "inet "`
   - Windows: `ipconfig`
3. Accede desde tu móvil: `http://[TU_IP_LOCAL]:5173`

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza el build de producción
- `npm run lint` - Ejecuta el linter

## Estructura del Proyecto

```
src/
├── components/     # Componentes React reutilizables
├── hooks/          # Custom hooks
├── i18n/           # Configuración de internacionalización
├── lib/            # Utilidades y configuraciones
├── pages/          # Páginas principales
├── routes/         # Configuración de rutas
└── types/          # TypeScript types
```

## Deploy

### Vercel

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en el dashboard de Vercel
3. El deploy se realizará automáticamente en cada push

### Netlify

1. Conecta tu repositorio a Netlify
2. Configura las variables de entorno
3. El deploy se realizará automáticamente

## Características

- ✅ Autenticación con email/password
- ✅ Registro de esmorzars con multi-step form
- ✅ Historial de esmorzars
- ✅ Estadísticas personales
- ✅ Internacionalización (español/valenciano)
- ✅ PWA con actualización automática
- ✅ Mobile-first design
- ✅ Offline support básico

## Licencia

MIT
