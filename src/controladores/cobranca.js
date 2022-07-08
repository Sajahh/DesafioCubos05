/* eslint-disable camelcase */
const knex = require('../../BancoDeDados/conexao')
const schemaCadastrarCobranca = require('../validacoes/schemaCadastroCobranca')
const schemaEditarCobranca = require('../validacoes/schemaEditarCobranca')
const schemaFiltrarCobranca = require('../validacoes/schemaFiltroCobranca')

const cadastrarCobranca = async (req, res) => {
  const { id } = req.usuario
  const { cliente_id, vencimento } = req.body
  const data = new Date(vencimento)
  try {
    await schemaCadastrarCobranca.validate(req.body)

    const clienteExiste = await knex('clientes').where({ id: cliente_id }).first()

    if (!clienteExiste) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado' })
    }

    const registroCobranca = await knex('cobrancas').insert({ ...req.body, vencimento: data, usuario_id: id })

    if (!registroCobranca) {
      return res.status(400).json({ mensagem: 'Cobrança não cadastrada' })
    }
    return res.status(200).json({ mensagem: 'Cobrança cadastrado com sucesso' })
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

const listarCobrancas = async (req, res) => {
  const { id } = req.usuario
  try {
    const cobrancas = await knex.select('co.*', 'cl.nome as nome')
      .from('cobrancas as co')
      .leftJoin('clientes as cl', 'co.cliente_id', 'cl.id')
      .where({ 'co.usuario_id': id })

    for (const cobranca of cobrancas) {
      if (cobranca.status !== 'Paga') {
        const dataHoje = new Date()
        const dataVencimento = new Date(cobranca.vencimento)
        if (+dataHoje > +dataVencimento) {
          cobranca.status = 'Vencida'
          await knex('cobrancas').where({ id: cobranca.id }).update({ status: cobranca.status })
        }
      }
      const data = new Date(cobranca.vencimento)
      cobranca.vencimento = data
    }
    return res.status(200).json(cobrancas)
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

const somasDasCobrancas = async (req, res) => {
  const { id } = req.usuario
  try {
    const totalVencida = await knex('cobrancas')
      .sum('valor')
      .where({ status: 'Vencida', usuario_id: id })
      .first()
    const totalPendente = await knex('cobrancas')
      .sum('valor')
      .where({ status: 'Pendente', usuario_id: id })
      .first()
    const totalPaga = await knex('cobrancas')
      .sum('valor')
      .where({ status: 'Paga', usuario_id: id })
      .first()

    return res.status(200).json({ totalVencida: totalVencida.sum, totalPaga: totalPaga.sum, totalPendente: totalPendente.sum })
  } catch (error) {
    return res.status(400).json({ mensage: 'Verificar valores informados' })
  }
}
const apagarCobranca = async (req, res) => {
  const { id } = req.params
  try {
    const cobranca = await knex('cobrancas').where({ id }).first()
    if (!cobranca) {
      return res.status(404).json({ mensagem: 'Cobrança não encontrada' })
    }
    await knex('cobrancas').where({ id }).del()
    return res.status(200).json({ mensagem: 'Cobrança apagada com sucesso' })
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

const detalharCobranca = async (req, res) => {
  const { id } = req.params

  try {
    const detalhe = await knex('cobrancas').where({ id }).first()
    if (!detalhe) {
      return res.status(404).json({ mensagem: 'Cobrança não encontrada' })
    }
    return res.status(200).json(detalhe)
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

const editarCobranca = async (req, res) => {
  const { descricao, status, valor, vencimento } = req.body

  try {
    await schemaEditarCobranca.validate(req.body)

    const cobranca = await knex('cobrancas').where({ id: req.params.id }).first()

    if (!cobranca) {
      return res.status(404).json({ mensagem: 'Cobrança não encontrada' })
    }

    const data = new Date(vencimento)
    await knex('cobrancas').where({ id: req.params.id }).update({ descricao, status, valor, vencimento: data })
    return res.status(200).json({ mensagem: 'Cobrança editada com sucesso' })
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

const filtrarCobranca = async (req, res) => {
  const { status, vencimento } = req.body
  try {
    await schemaFiltrarCobranca.validate(req.body)

    const filtrarCobrancas = await knex('items')
      .where('status', 'like', `%${status}%`)
      .orWhere('vencimento', 'like', `%${vencimento}%`)
    return res.status(200).json(filtrarCobrancas)
  } catch (error) {
    return res.status(500).json(error.message)
  }
}

module.exports = {
  cadastrarCobranca,
  listarCobrancas,
  apagarCobranca,
  somasDasCobrancas,
  detalharCobranca,
  editarCobranca,
  filtrarCobranca 
}
