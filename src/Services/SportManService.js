const { SportsMan, SportsInstitutions, HistorialCategorico, Categoria } = require("../db.js");
const { v1 } = require('uuid');
const { Op } = require('sequelize');
const { AES, enc } = require("crypto-ts");

class SportsManService {
  async createSportsMan(data) {
    try {
      const {
        body: { identification },
        user: {
          dataUser: { institutionName },
        },
      } = data;

      const res = await this.getSportsMan(identification);
      if (!res) {
        data.body.ID = v1();
        const institution = await this.getInstitucion(institutionName);
        const {
          dataValues: { ID },
        } = institution;

        const bodyRequest = data.body;
        bodyRequest.SportsInstitutionID = ID;
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

  async getAllSportsMen() {
    try {
      return await SportsMan.findAll();
    } catch (error) {
      console.error("Error al obtener todos los deportistas:", error);
      throw error;
    }
  }

  async getSportsMenWithFilters(filters) {
    try {
      const query = {
        where: {}
      };

      if (filters.Name) {
        query.where.name = { [Op.like]: `%${filters.Name}%` };
      }

      if (filters.category && filters.category.length > 0) {
        query.where.category = { [Op.in]: filters.category };
      }

      if (filters.gender && filters.gender.length > 0) {
        query.where.gender = { [Op.in]: filters.gender };
      }

      if (filters.typeIdentification && filters.typeIdentification.length > 0) {
        query.where.typeIdentification = { [Op.in]: filters.typeIdentification };
      }

      const sportsMen = await SportsMan.findAll(query);

      return sportsMen;
    } catch (error) {
      console.error("Error al obtener deportistas con filtros:", error);
      throw error;
    }
  }

  async updateSportsMan(data) {
    try {
      const existingSportsMan = await SportsMan.findByPk(data.ID);

      if (!existingSportsMan) {
        throw new Error("Deportista no encontrado");
      }

      // Comparar los cambios
      const changes = {};
      const categoryChanged = existingSportsMan.category !== data.category;

      if (categoryChanged) {
        // Actualizar fecha de finalización en la categoría anterior
        await HistorialCategorico.update(
          { FechaFin: new Date() },
          { where: { SportsManID: data.ID, CategoriumID: data.CategoriumID } }
        );

        // Insertar nuevo registro en HistorialCategoricos
        await HistorialCategorico.create({
          FechaInicio: new Date(),
          FechaFin: new Date(),
          CategoriumID: existingSportsMan.CategoriumID,
          SportsManID: data.ID,
        });

        changes.category = data.category;
      }

      // Actualizar datos del deportista
      const [rowsUpdated, [updatedSportsMan]] = await SportsMan.update(data, {
        where: { ID: data.ID },
        returning: true,
      });

      if (rowsUpdated === 0) {
        throw new Error("No se pudo actualizar el deportista");
      }

      return { ...updatedSportsMan.get(), changes };
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

  async getInstitucion(institutionName) {
    try {
      return await SportsInstitutions.findOne({
        where: { institutionName: institutionName },
      });
    } catch (error) {
      console.error("Error al obtener la institución:", error);
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
        body: { id }
      } = idCsportsman;

      const historiales = await HistorialCategorico.findAll({
        where: { SportsManID: id },
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