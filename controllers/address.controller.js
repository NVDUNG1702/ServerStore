const { Address } = require("../models/index");
const createError = require("http-errors");
const addressController = {
  get: async (req, res) => {
    try {
      const { uid } = req.body;
      const yourAddress = await Address.findAll({ where: { uid: uid } });

      if (!yourAddress) return createError(400, "please update location!");

      res.json({
        status: 200,
        data: [...yourAddress],
      });
    } catch (error) {
      res.json({
        status: 400,
        message: error.message,
      });
    }
  },

  createAddress: async (req, res) => {
    try {
      const { codeLocation, uid, detailLocation } = req.body;
      
      const newAddress = await Address.create({
        codeLocation,
        uid,
        detailLocation,
      });
      res.json({
        status: 200,
        data: newAddress,
      });
    } catch (error) {
      res.json({
        status: 501,
        message: error.message,
      });
    }
  },

  updateAddress: async (req, res)=>{
    
  }
};
