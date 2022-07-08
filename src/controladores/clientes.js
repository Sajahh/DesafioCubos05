const knex = require('../../BancoDeDados/conexao')
const schemaAtualizacaoUsuario = require('../validacoes/schemaAtualizacaoCadastro')
const schemaCadastrarCliente = require('../validacoes/schemaCadastrarCliente')

const cadastrarCliente = async (req, res) => {
  const { usuario } = req
  const { email, cpf, telefone } = req.body

  try {
    await schemaCadastrarCliente.validate(req.body)

    const localizaEmailExistente = await knex('clientes').select('*').where({ email }).first()
    if (localizaEmailExistente) {
      return res.status(400).json({ mensagem: 'Email já cadastrado.' })
    }
    const localizaCpfExistente = await knex('clientes').select('*').where({ cpf }).first()
    if (localizaCpfExistente) {
      return res.status(400).json({ mensagem: 'CPF já cadastrado.' })
    }
    const localizaTelefoneExistente = await knex('clientes').select('*').where({ telefone }).first()

    if (localizaTelefoneExistente) {
      return res.status(400).json({ mensagem: 'Telefone já cadastrado.' })
    }
    const registroCliente = await knex('clientes').insert({ ...req.body, usuario_id: usuario.id })

    if (!registroCliente) {
      return res.status(400).json({ mensagem: 'Cliente não foi cadastrado' })
    }

    return res.status(200).json({ mensagem: 'Cliente cadastrado com sucesso' })
  } catch (error) {
    return res.status(400).json(error.message)
  }
}

const listarClientes = async (req, res) => {
  const { id } = req.usuario
  const clientes = await knex('clientes').where({ usuario_id: id })
  const cobrancas = await knex('cobrancas')
  clientes.forEach(cliente => {
    const cobranca = cobrancas.filter(cobranca => cobranca.id_cliente === cliente.id)
    cobranca.forEach(cobranca => {
      if (cobranca.status === 'Vencida') {
        cliente.status = 'Inadimplente'
      }
    })
  })
  return res.json(clientes)
}

const atualizarCliente = async (req, res) => {
  const { email, cpf, telefone } = req.body
  const { id } = req.params
  const { usuario } = req

  try {
    await schemaAtualizacaoUsuario.validate(req.body)

    const cliente = await knex('clientes').where({ id }).first()

    if (!cliente) {
      return res.status(404).json('Cliente não encontrado')
    }

    if (cliente.email) {
      const localizaEmailExistente = await knex('clientes').where({ email }).whereNot({ id }).first()
      if (localizaEmailExistente) {
        return res.status(400).json({ mensagem: 'Email já cadastrado' })
      }
    }
    if (cliente.telefone) {
      const localizaTelefoneExistente = await knex('clientes').where({ telefone }).whereNot({ id }).first()
      if (localizaTelefoneExistente) {
        return res.status(400).json({ mensagem: 'telefone já cadastrado' })
      }
    }

    if (cliente.cpf) {
      const localizaCpfExistente = await knex('clientes').where({ cpf }).whereNot({ id }).first()
      if (localizaCpfExistente) {
        return res.status(400).json({ mensagem: 'Cpf já cadastrado' })
      }
    }
    const [clienteAtualizado] = await knex('clientes').where({ id, usuario_id: usuario.id }).update(req.body).returning('*')

    if (!clienteAtualizado) {
      return res.status(404).json({ mensagem: 'O Cliente não foi atualizado' })
    }
    return res.status(200).json({ mensagem: 'Cliente Atualizado com sucesso', cliente: clienteAtualizado })
  } catch (error) {
    return res.status(400).json(error.message)
  }
}

const detalharCliente = async (req, res) => {
  const { usuario } = req
  const { id } = req.params
  try {
    const cliente = await knex('clientes').where({
      id,
      usuario_id: usuario.id
    }).first()
    if (!cliente) {
      return res.status(404).json('Cliente não encontrado')
    }
    return res.status(200).json(cliente)
  } catch (error) {
    return res.status(400).json(error.message)
  }
}

module.exports = {
  cadastrarCliente,
  listarClientes,
  atualizarCliente,
  detalharCliente
}
