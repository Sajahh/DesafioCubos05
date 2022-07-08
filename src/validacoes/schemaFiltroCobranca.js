const yup = require('./configuracoes')

const schemaFiltrarCobranca = yup.object().shape({
  status: yup.string(),
  vencimento: yup.string()
})

module.exports = schemaFiltrarCobranca
