const { SportsMan, SportsInstitutions, HistorialCategorico,
Categoria} = require("../db.js")
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

    const res = await this.getSportsMan(identification)
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
    }
    else {
      return "El deportista ya ha sido registrado anteriormente"
    }
  } catch (error) {
    console.error("Error al crear el registro:", error);
    throw error;
  }
}

  async getAllSportsMen() {
    return await SportsMan.findAll();
  }

  async getSportsMenWithFilters(filters) {
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
  }

async  updateSportsMan(data) {
  const existingSportsMan = await SportsMan.findByPk(data.ID);

  if (!existingSportsMan) {
    return null; // Deportista no encontrado
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

  return rowsUpdated === 0 ? null : { ...updatedSportsMan.get(), changes };
}

  async deleteSportsMan(id) {
    const rowsDeleted = await SportsMan.destroy({
      where: { ID: id },
    });
    return rowsDeleted === 0 ? false : true;
  }

  async getInstitucion(institutionName) {
    return await SportsInstitutions.findOne({
      where: { institutionName: institutionName },
    });
  }
  async getSportsMan(identification) {
    return await SportsMan.findOne({
      where: { identification: identification },
    });
  }

  async getHistorialCategory(idCsportsman){
    const {
      body: { id }
    } = idCsportsman;
  
    const historiales = await HistorialCategorico.findAll({
      where: { SportsManID: id },
    });
  
    const historialesConNombres = await Promise.all(
      historiales.map(async (historial) => {
        const categoria = await Categoria.findOne({
          where: { ID : historial.CategoriumID },
        });
  
        const categoryName = categoria ? categoria.name : null;
  
        return {
          ...historial.toJSON(),
          categoryName: categoryName,
        };
      })
    );
  
    return historialesConNombres;
  }
  
}

module.exports = new SportsManService();