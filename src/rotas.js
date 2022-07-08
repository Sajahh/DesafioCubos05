const express = require('express')
const { cadastrarCliente, listarClientes, atualizarCliente, detalharCliente } = require('./controladores/clientes')
const { login } = require('./controladores/login')
const { cadastrarUsuario, atualizarCadastro } = require('./controladores/usuario')
const { cadastrarCobranca, listarCobrancas, apagarCobranca, somasDasCobrancas, detalharCobranca, editarCobranca, filtrarCobranca } = require('./controladores/cobranca')
const verificaLogin = require('./filtros/verificacaoLogin')

const rotas = express()

rotas.post('/cadastro', cadastrarUsuario)

rotas.post('/login', login)

rotas.use(verificaLogin)

rotas.post('/clientes', cadastrarCliente)

rotas.get('/clientes', listarClientes)

rotas.put('/clientes/:id', atualizarCliente)

rotas.get('/clientes/:id', detalharCliente)

rotas.put('/usuario', atualizarCadastro)

rotas.post('/cobrancas', cadastrarCobranca)

rotas.get('/cobrancas', listarCobrancas)

rotas.get('/cobrancas/total', somasDasCobrancas)

rotas.delete('/cobrancas/:id', apagarCobranca)

rotas.get('/cobrancas/:id', detalharCobranca)

rotas.put('/cobrancas/:id', editarCobranca)

rotas.get('/cobrancas/filtro', filtrarCobranca)

module.exports = rotas
