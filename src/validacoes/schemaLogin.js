const yup = require('./configuracoes')

const schemaLogin = yup.object().shape({
  email: yup.string().email().required('Obrigatório email e senha'),
  senha: yup.string().min(5).required('Obrigatório email e senha')
})

module.exports = schemaLogin
