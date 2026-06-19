# Product Request System

Sistema de solicitudes de productos entre clientes y proveedores con interacción de ofertas.

## Requisitos

- Node.js >= 18
- npm

> **Nota sobre la base de datos**: Por defecto usa **SQLite** (no requiere instalación externa).
> Para producción en **AWS RDS PostgreSQL**, cambiar `prisma/schema.prisma` y `.env` (ver sección "Migrar a PostgreSQL").

## Instalación

```bash
cp .env.example .env

# Instalar dependencias
npm install

# Generar cliente Prisma y ejecutar migraciones
npx prisma migrate dev --name init

# Generar DB con datos de prueba
npm run db:seed

# Iniciar servidor
npm run dev
```

## API Endpoints

### Autenticación

| Método | Ruta | Auth | Body | Descripción |
|--------|------|------|------|-------------|
| POST | `/api/auth/register` | No | `{ name, email, password, role }` | Registrar usuario |
| POST | `/api/auth/login` | No | `{ email, password }` | Iniciar sesión |
| GET | `/api/auth/me` | JWT | - | Obtener perfil actual |

### Solicitudes de Producto

| Método | Ruta | Auth | Rol | Descripción |
|--------|------|------|-----|-------------|
| POST | `/api/requests` | JWT | CLIENT | Crear solicitud |
| GET | `/api/requests` | JWT | - | Listar solicitudes |
| GET | `/api/requests/:id` | JWT | - | Detalle + ofertas |
| PATCH | `/api/requests/:id/cancel` | JWT | CLIENT | Cancelar solicitud |

### Ofertas

| Método | Ruta | Auth | Rol | Descripción |
|--------|------|------|-----|-------------|
| POST | `/api/offers/:id` | JWT | PROVIDER | Crear oferta |
| GET | `/api/offers/:id` | JWT | - | Listar ofertas |
| PATCH | `/api/offers/:id/accept` | JWT | CLIENT | Aceptar oferta |
| PATCH | `/api/offers/:id/reject` | JWT | CLIENT | Rechazar oferta |
| POST | `/api/offers/:id/counter` | JWT | CLIENT | Contraofertar |
| PATCH | `/api/offers/:id/respond-counter` | JWT | PROVIDER | Responder contraoferta |
| POST | `/api/auth/refresh` | No | - | Refresh token |
| POST | `/api/auth/change-password` | JWT | - | Cambiar contraseña |

## Seed (Datos de Prueba)

```bash
npm run db:seed
```

Credenciales generadas:

| Rol | Email | Password |
|-----|-------|----------|
| CLIENT | `cliente@test.com` | `client123` |
| PROVIDER | `proveedor@test.com` | `provider123` |

## Tests

```bash
npm test
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Iniciar servidor en modo desarrollo (hot-reload) |
| `npm run build` | Compilar TypeScript a JavaScript |
| `npm start` | Iniciar servidor en producción |
| `npm test` | Ejecutar tests |
| `npm run db:migrate` | Ejecutar migraciones de Prisma |
| `npm run db:seed` | Poblar DB con datos de prueba |

## Estructura del Proyecto

```
├── Arquitectura/          # Documentación de arquitectura
│   ├── diagrama-arquitectura.md
│   ├── Justificación.md
│   └── gestión de equipo.md
├── prisma/
│   ├── schema.prisma      # Modelo de datos
│   └── seed.ts            # Datos de prueba
├── src/
│   ├── main.ts            # Entry point
│   ├── config/            # Configuración (env, DB)
│   ├── middleware/         # Auth, roles, validación, errores
│   ├── modules/
│   │   ├── auth/          # Autenticación
│   │   ├── requests/      # Solicitudes de productos
│   │   └── offers/        # Ofertas
│   └── shared/            # Utilidades, tipos, errores
└── tests/                 # Tests unitarios y de integración
```

## Migrar a PostgreSQL / AWS RDS

```bash
npx prisma migrate dev --name init
npm run db:seed
```

> El código de la aplicación **no requiere cambios** al migrar de SQLite a PostgreSQL. Prisma abstrae las diferencias entre motores.

## Tecnologías

- **Runtime**: Node.js + TypeScript
- **Framework**: Express
- **ORM**: Prisma
- **DB**: SQLite (desarrollo) / PostgreSQL vía AWS RDS (producción)
- **Auth**: JWT + bcrypt
- **Validación**: Zod
- **Testing**: Jest + Supertest
