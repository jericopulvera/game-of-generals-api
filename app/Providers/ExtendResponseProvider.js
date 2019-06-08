const { ServiceProvider } = require('@adonisjs/fold')

class ExtendResponseProvider extends ServiceProvider {
  boot () {
    const Response = use('Adonis/Src/Response')

    Response.macro('validateFailed', function (errorMessages) {
      this.status(422).json({
        status: 422,
        code: 'E_VALIDATE_FAILED',
        message: 'Validation failed',
        errors: errorMessages
      })
    })

    Response.macro('apiSuccess', function (data, meta, message) {
      this.status(200).json({
        status: 200,
        message: message || 'Success',
        data: data,
        meta: meta
      })
    })

    Response.macro('apiSuccessToTable', function (data, meta, message) {
      const last_page =
                data.total <= data.per_page
                  ? 1
                  : Math.floor(data.total / data.per_page) +
                    (data.total % data.per_page ? 1 : 0)
      this.status(200).json({
        status: 200,
        message: message || 'Success',
        meta: meta,
        ...data
      })
    })

    Response.macro('apiCreated', function (item, meta) {
      this.status(201).json({
        status: 201,
        message: 'Created successfully',
        data: item,
        meta: meta
      })
    })

    Response.macro('apiUpdated', function (item, meta) {
      this.status(202).json({
        status: 202,
        message: 'Updated successfully',
        data: item,
        meta: meta
      })
    })

    Response.macro('apiDeleted', function (item, meta) {
      this.status(202).json({
        status: 202,
        message: 'Deleted successfully',
        data: null,
        meta: meta
      })
    })
  }
}

module.exports = ExtendResponseProvider
