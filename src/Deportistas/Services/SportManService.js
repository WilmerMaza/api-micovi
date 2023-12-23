const {
  SportsMan,
  HistorialCategorico,
  Categoria,
} = require("../../db.js");
const { v1 } = require("uuid");
const { Op } = require("sequelize");
const {
  sportInstitution,
} = require("../../subirImagen/servicios/subirServicio.js");
const path = require("path");
const fs = require("fs");

class SportsManService {
  async createSportsMan(data) {
    try {
      const {
        body: { identification },
        user: {
          dataUser: { ID, SportsInstitutionID },
        },
      } = data;

      const IDSearch =
        SportsInstitutionID === undefined ? ID : SportsInstitutionID;

      const res = await this.getSportsMan(identification);
      if (!res) {
        data.body.ID = v1();

        const bodyRequest = data.body;
        bodyRequest.SportsInstitutionID = IDSearch;
        const deportis = await SportsMan.create(bodyRequest);
        await HistorialCategorico.create({
          SportsManID: data.body.ID,
          CategoriumID: data.body.CategoriumID,
          FechaInicio: new Date(),
          FechaFin: new Date(),
        });

        return "ok";
      } else {
        throw new Error("El deportista ya ha sido registrado anteriormente");
      }
    } catch (error) {
      console.error("Error al crear el registro:", error);
      throw error;
    }
  }

  async getAllSportsMen(req) {
    try {
      const {
        dataUser: { ID, SportsInstitutionID },
      } = req.user;
      const IDSearch =
        SportsInstitutionID === undefined ? ID : SportsInstitutionID;

      const sportsMen = await SportsMan.findAll({
        where: {
          SportsInstitutionID: IDSearch,
        },
      });

      return sportsMen;
    } catch (error) {
      console.error("Error al obtener todos los deportistas:", error);
      throw error;
    }
  }

  async getSportsMenWithFilters(req) {
    try {
      const {
        dataUser: { ID, SportsInstitutionID },
      } = req.user;
      const { body: filters } = req;
      const IDSearch =
        SportsInstitutionID === undefined ? ID : SportsInstitutionID;

      const query = {
        where: {
          SportsInstitutionID: IDSearch,
        },
      };

      if (filters.Name) {
        query.where.name = { [Op.like]: `%${filters.Name}%` };
      }

      if (filters.identificacion) {
        query.where.identification = {
          [Op.like]: `%${filters.identificacion}%`,
        };
      }

      if (filters.category && filters.category.length > 0) {
        query.where.category = { [Op.in]: filters.category };
      }

      if (filters.gender && filters.gender.length > 0) {
        query.where.gender = { [Op.in]: filters.gender };
      }

      if (filters.typeIdentification && filters.typeIdentification.length > 0) {
        query.where.typeIdentification = {
          [Op.in]: filters.typeIdentification,
        };
      }

      const sportsMen = await SportsMan.findAll(query);

      return sportsMen;
    } catch (error) {
      console.error("Error al obtener deportistas con filtros:", error);
      throw error;
    }
  }

  async updateSportsMan(request) {
    const { body } = request;
    try {
      const existingSportsMan = await SportsMan.findByPk(body.ID);

      if (!existingSportsMan) {
        throw new Error("Deportista no encontrado");
      }

      // Comparar los cambios
      const changes = {};
      const categoryChanged = existingSportsMan.category !== body.category;

      if (categoryChanged) {
        // Actualizar fecha de finalización en la categoría anterior
        await HistorialCategorico.update(
          { FechaFin: new Date() },
          { where: { SportsManID: body.ID, CategoriumID: body.CategoriumID } }
        );

        // Insertar nuevo registro en HistorialCategoricos
        await HistorialCategorico.create({
          FechaInicio: new Date(),
          FechaFin: new Date(),
          CategoriumID: body.CategoriumID,
          SportsManID: body.ID,
        });

        changes.category = body.category;
      }

      // Actualizar datos del deportista
      const [rowsUpdated, [updatedSportsMan]] = await SportsMan.update(body, {
        where: { ID: body.ID },
        returning: true,
      });

      if (rowsUpdated[0] === 0) {
        throw new Error("No se pudo actualizar el deportista");
      } else {
        const { deleteImg } = body;
        if (deleteImg !== "") {
          const nameInstitution = await sportInstitution(request);

          const baseDirectory = path.join(__dirname, "../..", "uploads");

          const userDirectory = path.join(baseDirectory, nameInstitution);

          const imagePath = path.join(userDirectory, deleteImg);
          try {
            fs.unlinkSync(imagePath);
          } catch (error) {
            return { ...updatedSportsMan.get(), changes }
          }
          
        }
        return { ...updatedSportsMan.get(), changes };
      }
    } catch (error) {
      console.error("Error al actualizar el deportista:", error);
      throw error;
    }
  }

  async deleteSportsMan(id) {
    try {
      const rowsDeleted = await SportsMan.destroy({
        where: { ID: id },
      });

      if (rowsDeleted === 0) {
        throw new Error("No se pudo eliminar el deportista");
      }

      return true;
    } catch (error) {
      console.error("Error al eliminar el deportista:", error);
      throw error;
    }
  }

  async getSportsMan(identification) {
    try {
      return await SportsMan.findOne({
        where: { identification: identification },
      });
    } catch (error) {
      console.error("Error al obtener el deportista:", error);
      throw error;
    }
  }

  async getHistorialCategory(idCsportsman) {
    try {
      const {
        body: { id },
      } = idCsportsman;

      const historiales = await HistorialCategorico.findAll({
        where: { SportsManID: id },
        order: [["createdAt", "DESC"]], // Ordenar por la columna 'createdAt' en orden descendente
      });

      const historialesConNombres = await Promise.all(
        historiales.map(async (historial) => {
          const categoria = await Categoria.findOne({
            where: { ID: historial.CategoriumID },
          });

          const categoryName = categoria ? categoria.name : null;

          return {
            ...historial.toJSON(),
            categoryName: categoryName,
          };
        })
      );

      return historialesConNombres;
    } catch (error) {
      console.error("Error al obtener el historial de categorías:", error);
      throw error;
    }
  }
}

module.exports = new SportsManService();
