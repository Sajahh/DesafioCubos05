const knex = require('../../BancoDeDados/conexao')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const schemaLogin = require('../validacoes/schemaLogin')

const login = async (req, res) => {
  const { email, senha } = req.body

  try {
    await schemaLogin.validate(req.body)
    const usuario = await knex('usuarios').where({ email }).first()

    if (!usuario) {
      return res.status(404).json({ mensagem: 'usuário não encontrado' })
    }
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)

    if (!senhaCorreta) {
      return res.status(400).json({ mensagem: 'Email e senha não conferem' })
    }

    const dadosTokenUsuario = {
      id: usuario.id,
      nome: usuario.nome
    }

    const token = jwt.sign(dadosTokenUsuario, process.env.SENHA_JWT, { expiresIn: '7d' })

    const { senha: _, ...dadosUsuario } = usuario

    return res.status(200).json({
      usuario: dadosUsuario,
      token
    })
  } catch (error) {
    return res.status(400).json(error.message)
  }
}

module.exports = {
  login
}
