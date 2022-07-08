const yup = require('./configuracoes')

const regexCpf = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/
const regexTelefone = /^\([1-9]{2}\) 9[1-9]\d{3}-\d{4}$/
const regexCep = /^\d{5}-\d{3}$/

const schemaAtualizarCliente = yup.object().shape({
  nome: yup.string().required(),
  email: yup.string().email().required(),
  cpf: yup.string().required().matches(regexCpf, 'CPF invalido.'),
  telefone: yup.string().required().matches(regexTelefone, 'Telefone invalido.'),
  cep: yup.string().matches(regexCep, 'CEP invalido.'),
  logradouro: yup.string(),
  complemento: yup.string(),
  bairro: yup.string(),
  cidade: yup.string(),
  estado: yup.string().max(2)

})

module.exports = schemaAtualizarCliente
