'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class ValidateErrorException extends LogicalException {
  static invoke (errors) {
    const error = new this('Validate failed', 422, 'E_VALIDATE_FAILED')
    error.errors = errors
    return error
  }

  static invokeUnique (field) {
    const error = new this('Validate failed', 422, 'E_VALIDATE_FAILED')
    error.errors = [{
      message: `unique validation failed on ${field}`,
      field: field,
      validation: 'unique'
    }]
    return error
  }

  static updateInvokeUnique (field) {
    const error = new this('Validate failed', 422, 'E_VALIDATE_FAILED')
    error.errors = [{
      message: `${field} already exist`,
      field: field,
      validation: 'unique'
    }]
    return error
  }

  static invokeInvalidField (field) {
    const error = new this('Validate failed', 422, 'E_VALIDATE_FAILED')
    error.errors = [{
      message: `invalid ${field}`,
      field: field,
      validation: 'invalid'
    }]
    return error
  }

  static invokeWhiteSpace (field) {
    const error = new this('Validate failed', 422, 'E_VALIDATE_FAILED')
    error.errors = [{
      message: `white space validation failed on ${field}`,
      field: field,
      validation: 'white space'
    }]
    return error
  }

  static invokeMobile (field) {
    const error = new this('Validate failed', 422, 'E_VALIDATE_FAILED')
    error.errors = [{
      message: `Invalid mobile number`,
      field: field,
      validation: 'mobile number'
    }]
    return error
  }

  static invokeAtleastOneField (field1, field2) {
    const error = new this('Validate failed', 422, 'E_VALIDATE_FAILED')
    error.errors = [{
      message: `Please provide either ${field1} or ${field2}`,
      field: field1,
      validation: 'validation failed'
    },
    {
      message: `Please provide either ${field1} or ${field2}`,
      field: field2,
      validation: 'validation failed'
    }]
    return error
  }

  static invokeWithMessage (message, field) {
    const error = new this('Validate failed', 422, 'E_VALIDATE_FAILED')
    error.errors = [{
      message: message,
      field: field,
      validation: 'validation failed'
    }]
    return error
  }

  async handle (error, { request, response, session }) {
    if (request.url().indexOf('/api/') === 0) {
      return response.validateFailed(error.errors)
    }

    session.withErrors(error.errors).flashAll()
    await session.commit()
    response.redirect('back')
  }
}

module.exports = ValidateErrorException
