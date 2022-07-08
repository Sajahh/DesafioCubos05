const knex = require('../../BancoDeDados/conexao')
const bcrypt = require('bcrypt')
const schemaCadastroUsuario = require('../validacoes/schemaCadastroUsuario')
const schemaAtualizacaoUsuario = require('../validacoes/schemaAtualizacaoCadastro')

const cadastrarUsuario = async (req, res) => {
  const { nome, senha, email } = req.body

  try {
    await schemaCadastroUsuario.validate(req.body)

    const localizaUsuarioExistente = await knex('usuarios').where({ email }).first()

    if (localizaUsuarioExistente) {
      return res.status(400).json({ mensagem: 'o email informado já existe' })
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10)

    const usuario = await knex('usuarios').insert({
      nome,
      email,
      senha: senhaCriptografada
    })

    if (!usuario) {
      return res.status(400).json({ mensagem: 'O usuário não foi cadastrado' })
    }

    return res.status(200).json({ mensagem: 'O usuario foi cadastrado.' })
  } catch (error) {
    return res.status(400).json(error.message)
  }
}

const atualizarCadastro = async (req, res) => {
  const { nome, email, cpf, telefone } = req.body
  let { senha } = req.body
  const { id } = req.usuario

  if (!nome || !email) {
    return res.status(400).json({ mensagem: 'É obrigatório informar campo de nome, email' })
  }

  try {
    await schemaAtualizacaoUsuario.validate(req.body)

    const localizaUsuarioExistente = knex('usuarios').where({ id }).first()

    if (!localizaUsuarioExistente) {
      return res.status(404).json({ mensagem: 'usuário não encontrado' })
    }

    if (senha) {
      senha = await bcrypt.hash(senha, 10)
    }

    const usuario = await knex('usuarios').where({ email }).first()
    if (email !== req.usuario.email) {
      if (usuario) {
        res.status(404).json({ menssagem: 'O Email já existe' })
      }
    }

    const [cadastroAtualizado] = await knex('usuarios').where({ id }).update({
      nome,
      email,
      senha: senha || usuario.senha,
      cpf,
      telefone
    }).returning('*')
    const { senha: _, ...dadosUsuario } = cadastroAtualizado
    if (!cadastroAtualizado) {
      return res.status(404).json({ mensagem: 'O usuario não foi atualizado' })
    }
    return res.status(200).json({ mensagem: 'Usuario Atualizado com sucesso', usuario: dadosUsuario })
  } catch (error) {
    console.log(error)
    return res.status(400).json(error.message)
  }
}

module.exports = {
  cadastrarUsuario,
  atualizarCadastro
}
