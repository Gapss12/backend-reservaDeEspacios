# Sistema de Reservas para Espacios Comunitarios

## Descripción del Proyecto

Sistema backend desarrollado con **Arquitectura Onion** para la gestión de reservas de espacios comunitarios (salones, auditorios, canchas deportivas). Permite a usuarios registrados reservar espacios por día y hora específica, con sistema de notificaciones y panel administrativo.

## Arquitectura

### Estilo Arquitectónico: Onion Architecture

La aplicación implementa **Arquitectura Onion** (Cebolla) con las siguientes capas concéntricas:

\`\`\`
┌─────────────────────────────────────────┐
│           PRESENTATION LAYER            │
│    (Controllers, Routes, Middleware)    │
├─────────────────────────────────────────┤
│         INFRASTRUCTURE LAYER            │
│  (Repositories, Services, Database)     │
├─────────────────────────────────────────┤
│          APPLICATION LAYER              │
│    (Use Cases, DTOs, Mappers)          │
├─────────────────────────────────────────┤
│             CORE LAYER                  │
│   (Entities, Interfaces, Exceptions)   │
└─────────────────────────────────────────┘
\`\`\`

### Justificación de la Arquitectura

1. **Separación de Responsabilidades**: Cada capa tiene una responsabilidad específica y bien definida
2. **Inversión de Dependencias**: Las capas externas dependen de las internas, nunca al revés
3. **Testabilidad**: El core es independiente de frameworks y tecnologías externas
4. **Mantenibilidad**: Cambios en infraestructura no afectan la lógica de negocio
5. **Escalabilidad**: Fácil agregar nuevas funcionalidades sin afectar el código existente

## Tecnologías Utilizadas

- **Runtime**: Node.js con TypeScript
- **Framework Web**: Express.js
- **ORM**: Sequelize
- **Base de Datos**: PostgreSQL
- **Autenticación**: JWT + bcrypt
- **Validación**: Custom validation services

## Módulos del Sistema

### 1. Módulo de Usuarios
- **Responsabilidad**: Gestión de usuarios y autenticación
- **Casos de Uso**: Registro, login, gestión de perfiles
- **Endpoints**:
  - `POST /api/auth/register` - Registro de usuarios
  - `POST /api/auth/login` - Inicio de sesión
  - `GET /api/usuarios/perfil` - Obtener perfil

### 2. Módulo de Espacios
- **Responsabilidad**: Gestión de espacios disponibles
- **Casos de Uso**: CRUD de espacios, verificación de disponibilidad, calendario
- **Endpoints**:
  - `GET /api/espacios` - Listar espacios
  - `GET /api/espacios/:tipo` - Filtrar por tipo
  - `POST /api/espacios` - Crear espacio (admin)
  - `GET /api/espacios/disponibilidad` - Verificar disponibilidad
  - `GET /api/espacios/:id/calendario` - Obtener calendario del espacio

### 3. Módulo de Reservas
- **Responsabilidad**: Gestión del ciclo de vida de reservas
- **Casos de Uso**: Crear, listar, cancelar reservas
- **Endpoints**:
  - `POST /api/reservas` - Crear reserva
  - `GET /api/reservas/mis-reservas` - Mis reservas
  - `GET /api/reservas/fecha/:fecha` - Reservas por fecha (admin)
  - `DELETE /api/reservas/:id` - Cancelar reserva

### 4. Módulo de Notificaciones
- **Responsabilidad**: Comunicación con usuarios
- **Casos de Uso**: Confirmaciones, recordatorios
- **Implementación**: Email service (mock para desarrollo)

## Atributos de Calidad

### 1. Modularidad
- **Implementación**: Separación por módulos funcionales independientes
- **Beneficio**: Facilita mantenimiento y desarrollo en equipo
- **Medición**: Bajo acoplamiento entre módulos (< 3 dependencias por módulo)

### 2. Seguridad
- **Implementación**: 
  - Autenticación JWT con expiración
  - Contraseñas hasheadas con bcrypt (salt rounds: 10)
  - Middleware de autorización por roles
- **Beneficio**: Protección de datos y recursos
- **Medición**: 100% de endpoints críticos protegidos

### 3. Trazabilidad
- **Implementación**: 
  - Logs estructurados en cada capa
  - IDs únicos para seguimiento de operaciones
  - Manejo centralizado de excepciones
- **Beneficio**: Facilita debugging y monitoreo
- **Medición**: Logs en todas las operaciones críticas

### 4. Testabilidad
- **Implementación**: 
  - Inyección de dependencias
  - Interfaces para todos los servicios
  - Casos de uso independientes
- **Beneficio**: Facilita pruebas unitarias e integración
- **Medición**: > 80% cobertura de código en casos de uso críticos

## Decisiones Arquitectónicas (ADR)

### ADR-001: Adopción de Arquitectura Onion
- **Contexto**: Necesidad de estructura modular sin DDD completo
- **Decisión**: Implementar Onion Architecture con casos de uso encapsulados
- **Consecuencias**: 
  - ✅ Mayor testabilidad y flexibilidad
  - ✅ Separación clara de responsabilidades
  - ❌ Mayor complejidad inicial
  - ❌ Curva de aprendizaje para desarrolladores

### ADR-002: PostgreSQL como Base de Datos
- **Contexto**: Requisito de relaciones complejas entre entidades
- **Decisión**: PostgreSQL con Sequelize ORM
- **Consecuencias**:
  - ✅ Soporte robusto para relaciones y transacciones
  - ✅ Escalabilidad horizontal y vertical
  - ❌ Mayor complejidad de configuración
  - ❌ Dependencia de infraestructura específica

### ADR-003: JWT para Autenticación
- **Contexto**: Necesidad de autenticación stateless
- **Decisión**: JSON Web Tokens con expiración de 24h
- **Consecuencias**:
  - ✅ Escalabilidad (stateless)
  - ✅ Compatibilidad con SPAs y móviles
  - ❌ Dificultad para revocar tokens
  - ❌ Tamaño mayor que session IDs

### ADR-004: Modularidad por Funcionalidad
- **Contexto**: Requisito de módulos independientes
- **Decisión**: Separación por dominio funcional
- **Consecuencias**:
  - ✅ Facilita mantenimiento y escalabilidad
  - ✅ Desarrollo en paralelo por equipos
  - ❌ Posible duplicación de código
  - ❌ Complejidad en integraciones

## Trade-offs del Diseño

### 1. Complejidad vs Mantenibilidad
- **Trade-off**: Mayor complejidad inicial por mejor mantenibilidad a largo plazo
- **Decisión**: Priorizar mantenibilidad
- **Justificación**: Sistema destinado a crecer y evolucionar

### 2. Performance vs Flexibilidad
- **Trade-off**: Múltiples capas pueden impactar performance
- **Decisión**: Priorizar flexibilidad
- **Mitigación**: Optimizaciones en queries y caching futuro

### 3. Simplicidad vs Robustez
- **Trade-off**: Validaciones exhaustivas vs código simple
- **Decisión**: Priorizar robustez
- **Justificación**: Sistema crítico para gestión de recursos

### 4. Acoplamiento vs Cohesión
- **Trade-off**: Módulos muy independientes vs comunicación eficiente
- **Decisión**: Bajo acoplamiento con interfaces bien definidas
- **Mitigación**: Event-driven architecture para comunicación futura

## Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- PostgreSQL 12+
- npm o yarn

### Variables de Entorno
\`\`\`bash
DB_NAME=sistema_reservas
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
PORT=3000
JWT_SECRET=your-secret-key
\`\`\`

### Comandos de Desarrollo
\`\`\`bash
# Instalación
npm install

# Configurar base de datos
npm run db:setup
npm run db:seed

# Desarrollo
npm run dev

# Producción
npm run build
npm start
\`\`\`

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login

### Espacios (Usuarios)
- `GET /api/espacios` - Listar espacios
- `GET /api/espacios/:tipo` - Filtrar por tipo
- `GET /api/espacios/disponibilidad` - Verificar disponibilidad
- `GET /api/espacios/:id/calendario` - Calendario del espacio

### Espacios (Admin)
- `POST /api/espacios` - Crear espacio

### Reservas
- `POST /api/reservas` - Crear reserva
- `GET /api/reservas/mis-reservas` - Mis reservas
- `DELETE /api/reservas/:id` - Cancelar reserva

### Administración
- `GET /api/usuarios` - Listar usuarios (admin)
- `GET /api/reservas/fecha/:fecha` - Reservas por fecha (admin)

## Estructura del Proyecto

\`\`\`
src/
├── core/                    # Núcleo del dominio
│   ├── entities/           # Entidades del negocio
│   ├── interfaces/         # Contratos y abstracciones
│   └── exceptions/         # Excepciones del dominio
├── application/            # Capa de aplicación
│   ├── usecases/          # Casos de uso encapsulados
│   ├── dto/               # Data Transfer Objects
│   └── mappers/           # Mappers entre capas
├── infrastructure/        # Capa de infraestructura
│   ├── database/          # Modelos y repositorios
│   └── services/          # Servicios externos
└── presentation/          # Capa de presentación
    ├── controllers/       # Controladores HTTP
    ├── routes/           # Definición de rutas
    └── middleware/       # Middleware de Express
\`\`\`

## Próximas Mejoras

1. **Integración con Google Calendar**
2. **Sistema de notificaciones push**
3. **Cache con Redis**
4. **Métricas y monitoreo**
5. **API rate limiting**
6. **Documentación con Swagger**
