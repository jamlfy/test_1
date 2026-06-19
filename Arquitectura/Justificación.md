# Justificación de Decisiones Técnicas

## 1. ¿Por qué eligió la estructura arquitectónica propuesta?

### Arquitectura en Capas (Routes → Middleware → Controller → Service → Repository)

| Capa | Responsabilidad | Beneficio |
|------|----------------|-----------|
| **Routes** | Definir endpoints y conectar middleware | Separación clara de concerns |
| **Middleware** | Auth, roles, validación | Reutilizable, desacoplado de la lógica de negocio |
| **Controller** | Recibir request, llamar service, devolver response | Capa delgada que no contiene lógica |
| **Service** | Lógica de negocio, reglas, orquestación | Testeable de forma aislada |
| **Prisma** | Acceso a base de datos | Type-safety, migraciones, abstracción del motor SQL |

**Razones:**

- **Testabilidad**: cada capa se puede mockear y testear por separado. Los servicios se prueban sin HTTP, los controladores con Supertest.
- **Mantenibilidad**: un cambio en la DB (ej: migrar de PostgreSQL a MySQL) solo afecta la capa de Prisma, no los services.
- **Separación de concerns**: el middleware de autenticación no sabe cómo se crean solicitudes, el service de solicitudes no sabe cómo se validan tokens.
- **Escalabilidad del equipo**: cada developer puede trabajar en una capa diferente sin conflictos.

### Prisma como ORM

- **Type-safety nativo**: el cliente generado tiene tipos TypeScript completos. Un cambio en schema.prisma genera errores de compilación si el código no se adapta.
- **Migraciones declarativas**: `prisma migrate dev` genera migraciones SQL a partir del schema. Esto permite control de versiones de la DB y despliegues predecibles.
- **Soporte PostgreSQL nativo**: funciones como arrays, JSONB, enums nativos están soportados.
- **Fácil cambio a RDS**: solo cambiar `DATABASE_URL` en `.env`. Prisma Migrations funciona igual en local y en AWS.

## 2. ¿Cómo maneja el sistema la seguridad de las transacciones?

### Autenticación

| Mecanismo | Implementación |
|-----------|---------------|
| **Hashing de contraseñas** | bcryptjs con 10 salt rounds. bcrypt es resistente a ataques de fuerza bruta por su costo computacional ajustable. Nunca se almacenan contraseñas en texto plano. |
| **JWT (JSON Web Tokens)** | Algoritmo HS256. El token contiene `userId` y `role`. Firma verificada con `JWT_SECRET` en cada request. Expiración configurable (7d por defecto). |
| **Sin sesiones en servidor** | Al ser stateless, no hay session store que escalar. Cualquier instancia del API puede verificar cualquier token sin estado compartido. |

### Autorización por Roles

- Middleware `authorize('CLIENT')` o `authorize('PROVIDER')` aplicado por ruta.
- Se verifica `req.user.role` contra los roles permitidos.
- El cliente solo puede ver/modificar sus propias solicitudes (validación en service).
- El proveedor solo puede ver solicitudes activas (PENDING/OFFERED).

### Validación de Entrada

- **Zod** para validar cada request body, query y params en el middleware, antes de llegar al controller.
- Schemas tipados que generan errores descriptivos automáticos.
- Previene inyección de datos malformados, tipos incorrectos, y valores fuera de rango.

### Protecciones Adicionales (Señaladas)

| Medida | Estado | Descripción |
|--------|--------|-------------|
| Rate Limiting | Señalado | Límite de requests por IP/minuto para prevenir ataques de fuerza bruta |
| Helmet | Señalado | Headers HTTP de seguridad (CSP, X-Frame-Options, etc.) |
| CORS configurado | Funcional | Solo orígenes permitidos en producción |
| SQL Injection | No aplica | Prisma usa parameterized queries, previene SQL injection por diseño |

## 3. ¿Cómo manejaría el crecimiento del sistema si tuviera que escalar?

### Escalado Horizontal de la API

- La API es **stateless** (JWT, no sesiones en servidor). Esto permite agregar instancias detrás de un balanceador de carga sin configuración adicional.
- **AWS ECS Fargate**: contenedores serverless que escalan automáticamente según CPU/memoria.
- **Application Load Balancer (ALB)**: distribuye tráfico entre instancias, health checks, terminación SSL.
- **Auto Scaling**: reglas basadas en CPU > 70% o requests por segundo.

### Escalado de Base de Datos

| Estrategia | Implementación |
|------------|---------------|
| **Vertical Scaling** | RDS permite aumentar instancia (db.t3.large → db.r6g.xlarge) con cero o mínimo downtime |
| **Read Replicas** | Consultas de solo lectura (listar solicitudes, ver ofertas) pueden dirigirse a réplicas. Prisma soporta lectura/escritura separada con `@prisma/extension-read-replicas` |
| **Connection Pooling** | PgBouncer o RDS Proxy para manejar miles de conexiones concurrentes sin agotar los recursos de PostgreSQL |
| **Multi-AZ** | RDS Multi-AZ para alta disponibilidad: failover automático si la zona primaria falla |
| **Sharding** | Para escalado extremo: shard por `clientId` (solicitudes) o por región geográfica |

### Caching

- **Redis ElastiCache**: cachear solicitudes activas, ofertas de productos populares.
- **Estrategia**: cache-aside (TTL corto para datos transaccionales, más largo para consultas de solo lectura).

### Mejoras de Performance a Futuro

| Mejora | Descripción |
|--------|-------------|
| **Compresión** | `compression` middleware para respuestas Gzip |
| **Paginación** | `cursor-based pagination` con Prisma para listados grandes |
| **Índices compuestos** | En ProductRequest: `(clientId, status)`. En Offer: `(requestId, status)` |
| **API Gateway + Lambda** | Migrar a arquitectura serverless si el tráfico es muy variable |
| **Colas (SQS)** | Operaciones asíncronas (ej: notificar proveedores cuando un cliente crea solicitud) |

### Monitoreo y Observabilidad

- **CloudWatch**: logs, métricas (latencia p99, error rate, requests por segundo).
- **X-Ray**: tracing de requests a través de ALB → ECS → RDS para identificar cuellos de botella.
- **Alertas**: CloudWatch Alarms para CPU > 80%, error rate > 1%, latencia > 500ms.
