import { Model, DataTypes } from "sequelize"
import sequelize from "../config/database"

class UsuarioModel extends Model {
  public id!: number
  public nombre!: string
  public email!: string
  public password!: string
  public tipo!: "admin" | "usuario"
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

UsuarioModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM("admin", "usuario"),
      allowNull: false,
      defaultValue: "usuario",
    },
  },
  {
    sequelize,
    tableName: "usuarios",
    timestamps: true,
  },
)

export default UsuarioModel
