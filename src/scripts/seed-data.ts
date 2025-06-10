import { Sequelize } from 'sequelize';
import { UsuarioModel, EspacioModel } from "../infrastructure/persistence/models/index";
import { AuthService } from "../infrastructure/services/AuthService";
import { sequelize } from '../infrastructure/persistence/database';

const seedData = async () => {
  try {
    // Verificar conexión a la base de datos
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente');

    // Sincronizar modelos (crear tablas si no existen)
    await sequelize.sync({ force: false });
    console.log('Modelos sincronizados');

    const authService = new AuthService();

    // Crear usuarios de prueba con contraseñas hasheadas
    const adminPassword = await authService.hashPassword("admin123");
    const userPassword = await authService.hashPassword("user123");

    // Usar transacción para asegurar integridad de datos
    await sequelize.transaction(async (transaction) => {
      // Crear usuarios
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
      ], { transaction });

      // Crear espacios
      await EspacioModel.bulkCreate([
        {
          nombre: "Salón Principal",
          tipo: "salon",
          capacidad: 100,
          image_url:"https://www.revistacasaviva.es/wp-content/uploads/2024/02/1-Salon-parquet-Mini-Imperial-Nude-papel-pintado-Skins-Nature-Ayame-Lavender-Antic-Colonial-Porcelanosa.jpg",
          disponible: true,
        },
        {
          nombre: "Auditorio",
          tipo: "auditorio",
          capacidad: 200,
          image_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Sala_de_cine.jpg/1200px-Sala_de_cine.jpg",
          disponible: true,
        },
        {
          nombre: "Sala de Reuniones A",
          tipo: "sala",
          capacidad: 20,
          image_url:"https://upload.wikimedia.org/wikipedia/commons/8/85/Conference_table.jpg",
          disponible: true,
        },
      ], { transaction });
    });

    console.log("\nDatos de prueba creados exitosamente");
    console.log("====================================");
    console.log("Credenciales de acceso:");
    console.log("------------------------------------");
    console.log("Admin:".padEnd(15), "admin@example.com");
    console.log("Contraseña:".padEnd(15), "admin123");
    console.log("------------------------------------");
    console.log("Usuario:".padEnd(15), "usuario@example.com");
    console.log("Contraseña:".padEnd(15), "user123");
    console.log("====================================");
    
    process.exit(0); 
  } catch (error) {
    console.error("\nError en el seed de datos:");
    console.error("------------------------------------");
    console.error(error);
    console.error("------------------------------------");
    process.exit(1); 
  }
}

seedData();