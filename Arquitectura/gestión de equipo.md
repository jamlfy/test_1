# Gestión de Equipo Técnico

## 1. Organización de Sprints y Asignación de Tareas

### Metodología

**Scrum Ligero** con sprints de 1 semana. Para un equipo de 2-3 desarrolladores, un proceso pesado generaría más overhead que valor.

### Herramientas

- **GitHub Projects** (kanban): columnas Backlog -> To Do -> In Progress -> Review/Test -> Done.
- **GitHub Issues** para cada tarea con labels: `feature`, `bug`, `tech-debt`, `auth`, `requests`, `offers`.

### Roles dentro del equipo

| Rol | Responsabilidades |
|-----|-------------------|
| **Tech Lead** | Arquitectura, code review final, CI/CD, decisiones técnicas, desbloquear al equipo |
| **Backend Developer** | Auth module + Requests module + tests |
| **Backend Developer** | Offers module + integración + tests |

### Sprint 1 — Setup + Auth + Requests Base

| Issue | Asignado | Estimación | Descripción |
|-------|----------|------------|-------------|
| Setup proyecto Node/TS + Prisma + Express | Tech Lead | 2h | package.json, tsconfig, prisma schema, config |
| Middleware de autenticación JWT | Tech Lead | 3h | authenticate, authorize, errorHandler, validate |
| Módulo Auth: register + login + me | Dev 1 | 4h | service, controller, routes, schema, tests |
| Módulo Requests: CRUD básico | Dev 1 | 6h | service, controller, routes, schema, tests |
| Integración de rutas en main.ts | Tech Lead | 1h | Conectar todo, probar flujo completo |

### Sprint 2 — Offers + Documentación

| Issue | Asignado | Estimación | Descripción |
|-------|----------|------------|-------------|
| Módulo Offers: crear oferta + listar | Dev 2 | 4h | service, controller, routes, schema, tests |
| Seed de datos de prueba | Dev 2 | 2h | prisma/seed.ts con usuarios y solicitudes |
| Tests de integración | Dev 1 + Dev 2 | 4h | auth.test.ts, requests.test.ts, offers.test.ts |
| Documentación Arquitectura | Tech Lead | 3h | diagramas, justificación, gestión de equipo |
| README.md | Tech Lead | 1h | Instrucciones de ejecución |
| Endpoints señalados (Op2 + Op3) | Tech Lead | 1h | Rutas placeholder con 501 |

### Daily Standup (Max 15 min)

- ¿Qué hice ayer?
- ¿Qué voy a hacer hoy?
- ¿Hay algún bloqueo?

### Sprint Review (viernes 30 min)

- Demo de lo completado.
- Feedback del equipo.
- Ajustar backlog para el siguiente sprint.

## 2. Metodologías y Herramientas de Revisión de Código

### Política de Ramas

```
main            -> producción (protegida: requiere PR + 1 approve + checks pasan)
├── develop     -> integración continua
    ├── feature/auth-module-101
    ├── feature/requests-crud-102
    ├── feature/offers-103
    └── ...
```

### Proceso de Code Review

1. Developer crea rama desde `develop`: `feature/nombre-corto-[ticket]`
2. Al terminar, abre **Pull Request** hacia `develop`
3. Template de PR incluye:
   - Descripción del cambio
   - Screenshots o evidencia de pruebas
   - Checklist:
   - [ ] Código sigue el estilo del proyecto
   - [ ] Typescript strict mode sin errores
   - [ ] Tests pasan
   - [ ] Sin `console.log` ni código comentado
   - [ ] Manejo de errores implementado
4. **Al menos 1 approve** de otro developer antes de mergear
5. Tech Lead hace merge (puede revisar o delegar)

### Criterios de Revisión

| Aspecto | Qué revisar |
|---------|-------------|
| **Funcionalidad** | ¿Resuelve el problema? ¿Cubre edge cases? |
| **Seguridad** | ¿Validación de entrada? ¿Permisos correctos? |
| **Rendimiento** | ¿N+1 queries? ¿Índices necesarios? |
| **Legibilidad** | ¿Nombres claros? ¿Código autodocumentado? |
| **Testing** | ¿Tests cubren el cambio? ¿Casos de error? |
| **Consistencia** | ¿Sigue patrones del proyecto? ¿Misma estructura de archivos? |

### Convenciones

- **Commits**: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`). Ej: `feat: add product request creation endpoint`
- **Nomenclatura archivos**: kebab-case (`auth.service.ts`, `requests.routes.ts`)
- **Nomenclatura variables**: camelCase en TS, snake_case en DB (Prisma lo maneja automático)
- **Máximo 400 líneas por archivo**: si un archivo crece, dividir en varios

## 3. Procesos de CI/CD

1. Pipeline CI Soft — `.pre-commit`

- Test Unitarios

2. Pipeline CI (GitHub Actions) — `.github/workflows/ci.yml`

- Test Unitarios
- Test Integracion
- Test DB

3. Pipeline CD — `.github/workflows/deploy.yml` (para main)

Opcion 1
- Configuracion de AWS-CLI
- Publicacion Docker Image
- Desplegue en EC2

Opcion 2
- Configuracion kde AWS-CLI
- Publicacion en Lamdba

### Calidad Garantizada

| Etapa | Qué asegura |
|-------|-------------|
| **TypeScript check** | Tipos correctos, sin errores de compilación |
| **Tests** | Regresión cero, funcionalidades core funcionan |
| **Build** | La imagen Docker se construye correctamente/Se publica el Lambda correctamente |
| **Deploy** | Solo si CI pasa -> despliegue automático |

## 4. Temas Adicionales Relevantes

### Onboarding de nuevo developer

1. README.md con instrucciones paso a paso
2. Pair programming en primer PR para entender arquitectura
3. Documentación de API (Swagger/OpenAPI) para referencia rápida
4. Acceso a GitHub + AWS (IAM roles limitados)

### Comunicación

| Canal | Propósito |
|-------|-----------|
| GitHub Issues | Tareas, bugs, discusiones técnicas |
| Slack/Discord | Comunicación diaria, dudas rápidas |
| Weekly sync (30 min) | Planificación, blockers, decisiones |
| Documentación en repo | Decisiones de arquitectura en Justificación.md |

### Gestión de Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Developer bloqueado por decisión técnica | Tech Lead disponible para destrabar; decisión rápida > documentar después |
| Bug en producción | Feature flags para desactivar funcionalidades; rollback rápido con ECS |
| Dependencia no actualizada | Dependabot en GitHub para PRs automáticos de versiones |
| Pérdida de conocimiento | Documentación en repo, code reviews, pair programming |
| DB migration problemática | Prisma migrate deploy en CI primero; backup antes de migrar en producción |
