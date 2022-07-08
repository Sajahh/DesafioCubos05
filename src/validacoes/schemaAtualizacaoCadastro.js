const yup = require('./configuracoes')

const regexCpf = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/
const regexTelefone = /^\([1-9]{2}\) 9[1-9]\d{3}-\d{4}$/

const schemaAtualizacaoUsuario = yup.object().shape({
  nome: yup.string().required(),
  email: yup.string().required().email(),
  senha: yup.string().nullable(),
  cpf: yup.string().nullable().matches(regexCpf, 'CPF invalido.'),
  telefone: yup.string().matches(regexTelefone, 'Telefone invalido.')
})

module.exports = schemaAtualizacaoUsuario
