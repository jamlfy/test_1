# Product Request System

Sistema de solicitudes de productos entre clientes y proveedores con interacción de ofertas.

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

| Implementado | Método | Ruta | Auth | Rol | Descripción |
|--------|-------|------|------|-----|-------------|
| Si | POST |  `/api/offers/:id` | JWT | PROVIDER | Crear oferta |
| Si | GET | `/api/offers/:id` | JWT | - | Listar ofertas |
| No | PATCH | `/api/offers/:id/accept` | JWT | CLIENT | Aceptar oferta |
| No | PATCH | `/api/offers/:id/reject` | JWT | CLIENT | Rechazar oferta |
| No | POST | `/api/offers/:id/counter` | JWT | CLIENT | Contraofertar |
| No | PATCH | `/api/offers/:id/respond-counter` | JWT | PROVIDER | Responder contraoferta |
| No | POST | `/api/auth/refresh` | No | - | Refresh token |
| No | POST | `/api/auth/change-password` | JWT | - | Cambiar contraseña |

## Seed (Datos de Prueba)

```bash
npm run db:seed
```

Credenciales generadas:

| Rol | Email | Password |
|-----|-------|----------|
| CLIENT | `cliente@test.com` | `client123` |
| PROVIDER | `proveedor@test.com` | `provider123` |


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

## Tecnologías

- **Runtime**: Node.js + TypeScript
- **Framework**: Express
- **ORM**: Prisma
- **DB**: SQLite (desarrollo) / PostgreSQL vía AWS RDS (producción)
- **Auth**: JWT + bcrypt
- **Validación**: Zod
- **Testing**: Jest + Supertest
