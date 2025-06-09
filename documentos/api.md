# Documentación de API - Sistema de Reservas

## Autenticación

Todas las rutas protegidas requieren el header:
```
Authorization: Bearer <jwt_token>
```

## Endpoints Públicos

### POST /api/auth/register
Registrar nuevo usuario

**Request Body:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "tipo": "usuario"
}
```

**Response (201):**
```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "tipo": "usuario"
}
```

### POST /api/auth/login
Iniciar sesión

**Request Body:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "tipo": "usuario"
  }
}
```

## Endpoints de Espacios

### GET /api/espacios
Listar todos los espacios disponibles

**Response (200):**
```json
[
  {
    "id": 1,
    "nombre": "Salón Principal",
    "tipo": "salon",
    "capacidad": 100,
    "disponible": true
  }
]
```

### GET /api/espacios/disponibilidad
Verificar disponibilidad de un espacio

**Query Parameters:**
- `espacio_id`: ID del espacio
- `fecha`: Fecha en formato YYYY-MM-DD
- `hora_inicio`: Hora en formato HH:MM
- `hora_fin`: Hora en formato HH:MM

**Response (200):**
```json
{
  "disponible": true,
  "espacio": {
    "id": 1,
    "nombre": "Salón Principal",
    "tipo": "salon",
    "capacidad": 100
  },
  "fecha": "2024-01-15",
  "hora_inicio": "10:00",
  "hora_fin": "12:00"
}
```

### GET /api/espacios/:id/calendario
Obtener calendario de un espacio

**Query Parameters:**
- `fecha_inicio`: Fecha inicio en formato YYYY-MM-DD
- `fecha_fin`: Fecha fin en formato YYYY-MM-DD

**Response (200):**
```json
{
  "espacio": {
    "id": 1,
    "nombre": "Salón Principal",
    "tipo": "salon",
    "capacidad": 100
  },
  "periodo": {
    "fecha_inicio": "2024-01-01",
    "fecha_fin": "2024-01-31"
  },
  "reservas": [
    {
      "id": 1,
      "fecha": "2024-01-15",
      "hora_inicio": "10:00",
      "hora_fin": "12:00",
      "estado": "confirmada",
      "usuario": {
        "id": 1,
        "nombre": "Juan Pérez"
      }
    }
  ],
  "dias_disponibles": ["2024-01-16", "2024-01-17"],
  "dias_ocupados": ["2024-01-15"]
}
```

## Endpoints de Reservas

### POST /api/reservas
Crear nueva reserva (requiere autenticación)

**Request Body:**
```json
{
  "usuario_id": 1,
  "espacio_id": 1,
  "fecha": "2025-06-15", //la fecha debe ser un dia posterior a la actual.
  "hora_inicio": "10:00",
  "hora_fin": "12:00"
}
```

**Response (201):**
```json
{
  "id": 1,
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com"
  },
  "espacio": {
    "id": 1,
    "nombre": "Salón Principal",
    "tipo": "salon"
  },
  "fecha": "2024-01-15",
  "hora_inicio": "10:00",
  "hora_fin": "12:00",
  "estado": "pendiente"
}
```

### GET /api/reservas/mis-reservas
Obtener reservas del usuario autenticado

**Response (200):**
```json
[
  {
    "id": 1,
    "usuario": {
      "id": 1,
      "nombre": "Juan Pérez",
      "email": "juan@example.com"
    },
    "espacio": {
      "id": 1,
      "nombre": "Salón Principal",
      "tipo": "salon"
    },
    "fecha": "2024-01-15",
    "hora_inicio": "10:00",
    "hora_fin": "12:00",
    "estado": "confirmada"
  }
]
```

## Códigos de Error

- `400` - Bad Request (datos inválidos)
- `401` - Unauthorized (no autenticado)
- `403` - Forbidden (sin permisos)
- `404` - Not Found (recurso no encontrado)
- `409` - Conflict (regla de negocio violada)
- `500` - Internal Server Error
