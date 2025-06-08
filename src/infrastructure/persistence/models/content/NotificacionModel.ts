import { Model, DataTypes } from "sequelize"
import {sequelize} from "../../database"
import UsuarioModel from "./UsuarioModel"

class NotificacionModel extends Model {
  public id!: number
  public usuario_id!: number
  public mensaje!: string
  public enviado!: boolean
  public fecha!: Date
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

NotificacionModel.init(
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
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    enviado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "notificaciones",
    timestamps: true,
  },
)

// Definir relaciones
NotificacionModel.belongsTo(UsuarioModel, { foreignKey: "usuario_id" })

export default NotificacionModel
