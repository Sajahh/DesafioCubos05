const yup = require('./configuracoes')

const schemaEditarCobranca = yup.object().shape({
  descricao: yup.string().required(),
  status: yup.string().required(),
  valor: yup.number().required(),
  vencimento: yup.string().required()
})

module.exports = schemaEditarCobranca
