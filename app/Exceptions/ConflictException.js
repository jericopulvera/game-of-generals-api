'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class ConflictException extends LogicalException {
  static invoke (message) {
    return new this(message || 'Conflict', 409, 'E_CONFLICT')
  }
  /**
     * Handle this exception by itself
     */
  // handle () {}

  async handle (error, { request, response }) {
    const json = {
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

module.exports = ConflictException
