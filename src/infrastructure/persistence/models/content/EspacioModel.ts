import { Model, DataTypes } from "sequelize"
import {sequelize} from "../../database"

class EspacioModel extends Model {
  public id!: number
  public nombre!: string
  public tipo!: string
  public capacidad!: number
  public image_url!: string
  public disponible!: boolean
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

EspacioModel.init(
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
    tipo: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    capacidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/LYS32light_sitting_room.JPG/1200px-LYS32light_sitting_room.JPG",
    },
    disponible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "espacios",
    timestamps: true,
  },
)

export default EspacioModel
