# Sistema de Reservas para Espacios Comunitarios

## Descripción del Proyecto

Sistema backend desarrollado con **Arquitectura Onion** para la gestión de reservas de espacios comunitarios (salones, auditorios, canchas deportivas). Permite a usuarios registrados reservar espacios por día y hora específica, con sistema de notificaciones (MOCK) y panel administrativo.


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
- **Implementación**: Email service (mock para desarrollo)

## Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- PostgreSQL 12+
- npm o yarn

### Variables de Entorno
```bash
DB_NAME=sistema_reservas
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
PORT=3000
JWT_SECRET=your-secret-key
```

### Comandos de Desarrollo
```bash
# Instalación
npm install

# Configurar base de datos
npm run db:seed

# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

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
```
┌─────────────────────────────────────────┐
│           PRESENTATION LAYER            │
│    (Controllers, Routes, Middleware)    │
├─────────────────────────────────────────┤
│         INFRASTRUCTURE LAYER            │
│  (Repositories, Services, Database)     │
├─────────────────────────────────────────┤
│          APPLICATION LAYER              │
│    (Use Cases, DTOs, Mappers)           │
├─────────────────────────────────────────┤
│             CORE LAYER                  │
│   (Entities, Interfaces, Exceptions)    │
└─────────────────────────────────────────┘
```

```
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
│   ├── persistence/          # Modelos y repositorios
│   └── services/          # Servicios externos
└── presentation/          # Capa de presentación
    ├── controllers/       # Controladores HTTP
    ├── routes/           # Definición de rutas
    └── middleware/       # Middleware de Express
```

## Próximas Mejoras

1. **Integración con Google Calendar**
2. **Sistema de notificaciones push**
