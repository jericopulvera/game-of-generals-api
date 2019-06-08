'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class UnauthorizeException extends LogicalException {
  static invoke (message) {
    return new this(message || 'Access forbidden', 403, 'E_UN_AUTHORIZED')
  }
  /**
     * Handle this exception by itself
     */
  async handle (error, { request, response }) {
    const json = {
      status: error.status,
      code: error.code,
      message: error.message,
      errors: error.errors
    }
    if (use('Env').get('NODE_ENV') === 'development') {
      json.traces = error.stack
    }
    return response.status(error.status).json(json)
  }
}

module.exports = UnauthorizeException
