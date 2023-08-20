const { SportsMan } = require("../db.js")
const { v1 } = require('uuid');
const { Op } = require('sequelize');

class SportsManService {
  async createSportsMan(data) {
    const res = await this.getSportsMan(data.identification)
    if (!res) {
      data.ID = v1();
      return await SportsMan.create(data);
    }
    else {
      return "El deportista ya ha sido registrado anteriormente"
    }
  }

  async getAllSportsMen() {
    return await SportsMan.findAll();
  }

  async getSportsMenWithFilters(filters) {
    const query = {
      where: {}
    };
  
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

  async updateSportsMan(data) {
    const [rowsUpdated, [updatedSportsMan]] = await SportsMan.update(data.data, {
      where: { ID: data.ID },
      returning: true,
    });
    return rowsUpdated === 0 ? null : updatedSportsMan;
  }

  async deleteSportsMan(id) {
    const rowsDeleted = await SportsMan.destroy({
      where: { ID: id },
    });
    return rowsDeleted === 0 ? false : true;
  }
}

module.exports = new SportsManService();