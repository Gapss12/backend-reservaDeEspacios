import UsuarioModel from "./content/UsuarioModel"
import EspacioModel from "./content/EspacioModel"
import ReservaModel from "./content/ReservaModel"
import NotificacionModel from "./content/NotificacionModel"

// Establecer relaciones entre modelos
UsuarioModel.hasMany(ReservaModel, { foreignKey: "usuario_id" })
UsuarioModel.hasMany(NotificacionModel, { foreignKey: "usuario_id" })

EspacioModel.hasMany(ReservaModel, { foreignKey: "espacio_id" })

export { UsuarioModel, EspacioModel, ReservaModel, NotificacionModel }
