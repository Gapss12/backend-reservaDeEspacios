import { Model, DataTypes } from "sequelize"
import sequelize from "../../config/database"
import UsuarioModel from "./UsuarioModel"
import EspacioModel from "./EspacioModel"

class ReservaModel extends Model {
  public id!: number
  public usuario_id!: number
  public espacio_id!: number
  public fecha!: Date
  public hora_inicio!: string
  public hora_fin!: string
  public estado!: "pendiente" | "confirmada" | "cancelada"
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

ReservaModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UsuarioModel,
        key: "id",
      },
    },
    espacio_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: EspacioModel,
        key: "id",
      },
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    hora_inicio: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
    hora_fin: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM("pendiente", "confirmada", "cancelada"),
      allowNull: false,
      defaultValue: "pendiente",
    },
  },
  {
    sequelize,
    tableName: "reservas",
    timestamps: true,
  },
)

// Definir relaciones
ReservaModel.belongsTo(UsuarioModel, { foreignKey: "usuario_id" })
ReservaModel.belongsTo(EspacioModel, { foreignKey: "espacio_id" })

export default ReservaModel
