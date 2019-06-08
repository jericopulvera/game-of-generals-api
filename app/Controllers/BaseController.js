'use strict'

const _ = use('lodash')
const Helpers = use('Helpers')
const Env = use('Env')
const Jwt = use('Jwt')
const Hash = use('Hash')
const Config = use('Config')
const Validator = use('Validator')
const Cloudinary = use('Cloudinary')
const SocketIo = use('SocketIo')
const Mongoose = use('Mongoose')
const { ObjectId } = Mongoose.Types

// Others
const axios = require('axios')
const moment = require('moment')
const fs = require('fs')
let instance = null

class BaseController {
  static instance() {
    if (!instance) instance = new this()
    return instance
  }

  constructor() {
    this.ObjectId = ObjectId
    this.axios = axios
    this.moment = moment
    this._ = _
    this.fs = fs
    this.Env = Env
    this.Hash = Hash
    this.Config = Config
    this.Jwt = Jwt
    this.SocketIo = SocketIo
    this.Cloudinary = Cloudinary

    this.sanitizor = Validator.sanitizor
  }
}

_.forEach(
  use('Loader').load(`${Helpers.appRoot()}/app/Exceptions`),
  (value, key) => {
    BaseController.prototype[key] = value
  }
)
_.forEach(
  use('Loader').load(`${Helpers.appRoot()}/app/Models`),
  (value, key) => {
    BaseController.prototype[key] = value
  }
)

module.exports = BaseController
