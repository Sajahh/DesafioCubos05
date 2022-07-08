const yup = require('./configuracoes')

const schemaCadastrarCobranca = yup.object().shape({
  cliente_id: yup.number().required('ID do cliente é um campo obrigatório'),
  descricao: yup.string().required('Descrição é um campo obrigatório'),
  status: yup.string().required('Status é um campo obrigatório'),
  valor: yup.number().required('Valor é um campo obrigatório'),
  vencimento: yup.string().required('Vencimento da cobrança é um campo obrigatório')
})

module.exports = schemaCadastrarCobranca
