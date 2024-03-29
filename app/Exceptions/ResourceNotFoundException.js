'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class ResourceNotFoundException extends LogicalException {
  static invoke (message) {
    return new this(message || 'Not found', 404, 'E_RESOURCE_NOT_FOUND')
  }
  /**
     * Handle this exception by itself
     */
  async handle (error, { request, response }) {
    let json = {
      status: error.status,
      code: error.code,
      message: error.message
    }
    if (use('Env').get('NODE_ENV') === 'development') {
      json.traces = error.stack
    }
    return response.status(error.status).json(json)
  }
}

module.exports = ResourceNotFoundException
