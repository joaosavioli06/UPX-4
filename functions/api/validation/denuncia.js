const Joi = require("joi");

const localizacaoSchema = Joi.object({
  latitude: Joi.number().min(-90).max(90).required().messages({
    "number.base": "Latitude deve ser um número.",
    "number.min": "Latitude deve ser maior ou igual a -90.",
    "number.max": "Latitude deve ser menor ou igual a 90.",
  }),
  longitude: Joi.number().min(-180).max(180).required().messages({
    "number.base": "Longitude deve ser um número.",
    "number.min": "Longitude deve ser maior ou igual a -180.",
    "number.max": "Longitude deve ser menor ou igual a 180.",
  }),
});

const denunciaSchema = Joi.object({
  categoria: Joi.string().required().messages({
    "any.required": "A categoria da denúncia é obrigatória.",
    "string.base": "A categoria deve ser um texto.",
  }),
  descricao: Joi.string().min(10).required().messages({
    "any.required": "A descrição da denúncia é obrigatória.",
    "string.base": "A descrição deve ser um texto.",
    "string.min": "A descrição deve ter no mínimo 10 caracteres.",
  }),
  localizacao: localizacaoSchema.required().messages({
    "any.required":
    "A localização da denúncia (latitude e longitude) é obrigatória.",
  }),
  imagemUrl: Joi.string().allow("").uri().optional().messages({
    "string.uri": "A imagemUrl deve ser uma URL válida.",
  }),
}).unknown(false); // Não permite campos que não estejam definidos aqui

module.exports = denunciaSchema;
