const { SportsMan } = require("../db.js")
const { v1 } = require('uuid');

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

  async getSportsMan(identification) {
    return await SportsMan.findOne ({
      where: { identification: identification }
    });
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