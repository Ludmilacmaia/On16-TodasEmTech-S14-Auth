const Users = require("../models/usersModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const SECRET = process.env.SECRET

const create = (req, res) => {
    const senhaComHash = bcrypt.hashSync(req.body.senha, 10)
    req.body.senha = senhaComHash

    const user = new Users(req.body)
    user.save(function (err) {
      if (err) {
        res.status(500).send({message: err.message})
      }
      res.status(201).send(user)
    })
  }

  const getAll = (req, res) => {
    Users.find(function (err, users) {
      if (err) {
        res.status(500).send({message: err.message})
      }
      res.status(201).send(users)
    })
  }

  const deleteById = async (req, res) => {
    try {

      const { id } = req.params
      await Users.findByIdAndDelete(id)

      res.status(200).json({message: ` id ${id} foi deletado com sucesso`})
    } catch (error) {
      console.error(error)
      res.status(500).json({message: error.message})
    }
  }

  const login = (req, res) => {
    Users.findOne({email: req.body.email}, function (error, user) {
      if (error) {
        return res.status(500).send({message: 'erro'})
      }
      if (!user) {
        res.status(404).send(`email não encontrado: ${req.body.email}`)
      }

      const passwordValid = bcrypt.compareSync(req.body.senha, user.senha)

      if (!passwordValid) {
        res.status(403).send('Senha não é válida')
      }

      const token = jwt.sign({email: req.body.email}, SECRET)
       return res.status(200).send(token)
    })

  }

  module.exports = {
    create,
    getAll,
    deleteById,
    login
  }
