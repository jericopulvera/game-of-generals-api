'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

const _ = use('lodash')

// Exceptions
const ResourceNotFoundException = use(
  'App/Exceptions/ResourceNotFoundException'
)
const UploadErorrException = use('App/Exceptions/UploadErorrException')
const ValidateErrorException = use('App/Exceptions/ValidateErrorException')

class BaseProvider extends ServiceProvider {
  init () {
    this._ = _

    // Exceptions
    this.ResourceNotFoundException = ResourceNotFoundException
    this.UploadErorrException = UploadErorrException
    this.ValidateErrorException = ValidateErrorException
  }
}

module.exports = BaseProvider
