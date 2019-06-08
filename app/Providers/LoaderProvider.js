'use strict'
const BaseProvider = use('App/Providers/BaseProvider')

const _this = {}

class LoaderProvider extends BaseProvider {
  register () {
    this.init()
    this.app.singleton('Providers/Loader', () => {
      return {
        load: dir => {
          const collectionName = dir.split('/')[dir.split('/').length - 1]
          if (!_this[collectionName]) {
            const collection = {}
            const temp = use('require-all')(dir)
            let subDirectory = value => {
              this._.forEach(value, (_value, key) => {
                if (typeof _value === 'function') {
                  collection[key] = _value
                } else {
                  subDirectory(_value)
                }
              })
            }
            this._.forEach(temp, (value, key) => {
              if (typeof value === 'function') {
                collection[key] = value
              } else {
                subDirectory(value)
              }
            })
            _this[collectionName] = collection
          }
          return _this[collectionName]
        }
      }
    })
  }
}

module.exports = LoaderProvider
