const {
  Categoria
} = require("../db.js");
const { v1 } = require("uuid");

class CategoriaService {
  async createCategoria(data) {
    try {
      const {
        body: { name },
        user: {
          dataUser: { ID },
        },
      } = data;

      const res = await this.getCategoria(name);

      if (!res) {
        data.body.ID = v1();
        const bodyRequest = data.body;
        bodyRequest.SportsInstitutionID = ID;
        await Categoria.create(bodyRequest);
      } else {
        throw new Error("La Categoria ya ha sido registrado anteriormente");
      }
    } catch (error) {
      console.error("Error al crear el registro:", error);
      throw error;
    }
  }

  async getAllCategoria(request) {
    try {
      const {
        user: {
          dataUser: { ID },
        },
      } = request;

      return await Categoria.findAll({
        where: { SportsInstitutionID: ID },
      });
    } catch (error) {
      console.error("Error al obtener las Categorias:", error);
      throw error;
    }
  }

  async updateCategoria(dataUpdate) {
    const {
      body,
      user: {
        dataUser: { ID },
      },
    } = dataUpdate;

    try {
      const rowsUpdated = await Categoria.update(body, {
        where: { name: body.name, SportsInstitutionID: ID },
        returning: true,
      });

      if (rowsUpdated[0] === 0) {
        // No se actualizó ningún registro
        return null;
      }

      return "Categoria actualizado con éxito";
    } catch (error) {
      console.error("Error al actualizar el Categoria:", error);
      throw error;
    }
  }

  async getCategoria(name) {
    return await Categoria.findOne({
      where: { name: name },
    });
  }

}

module.exports = new CategoriaService();
