import { UsuarioModel, EspacioModel } from "../infrastructure/persistence/models/index"
import { AuthService } from "../infrastructure/services/AuthService"

const seedData = async () => {
  try {
    const authService = new AuthService()

    // Crear usuarios de prueba con contraseñas hasheadas
    const adminPassword = await authService.hashPassword("admin123")
    const userPassword = await authService.hashPassword("user123")

    await UsuarioModel.bulkCreate([
      {
        nombre: "Administrador",
        email: "admin@example.com",
        password: adminPassword,
        tipo: "admin",
      },
      {
        nombre: "Usuario Regular",
        email: "usuario@example.com",
        password: userPassword,
        tipo: "usuario",
      },
    ])

    // Crear espacios de prueba
    await EspacioModel.bulkCreate([
      {
        nombre: "Salón Principal",
        tipo: "salon",
        capacidad: 100,
        disponible: true,
      },
      {
        nombre: "Auditorio",
        tipo: "auditorio",
        capacidad: 200,
        disponible: true,
      },
      {
        nombre: "Sala de Reuniones A",
        tipo: "sala",
        capacidad: 20,
        disponible: true,
      },
    ])

    console.log("Datos de prueba creados exitosamente")
    console.log("Usuarios creados:")
    console.log("- Admin: admin@example.com / admin123")
    console.log("- Usuario: usuario@example.com / user123")
  } catch (error) {
    console.error("Error seeding data:", error)
  }
}

export default seedData
