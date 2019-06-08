'use strict'

const BaseModel = use('MongooseModel')
const { Schema } = use('Mongoose')

class Message extends BaseModel {
  static boot ({ schema }) {}
  /**
   * Message's schema
   */
  static get schema () {
    return {
      conversation: {
        type: Schema.Types.ObjectId,
        ref: 'Convertsation',
        default: null
      },
      // author: {
      //   type: Schema.Types.ObjectId,
      //   ref: 'User',
      //   default: null
      // },
      author: {
        type: String
      },
      type: {
        type: String,
        enum: ['file', 'text', 'emoji'],
        default: 'text'
      },
      data: {
        nonce: { type: String },
        text: {
          type: String
        },
        emoji: {
          type: String
        },
        file: {
          name: {
            type: String
          },
          url: {
            type: String,
            default: ''
          }
        },
        meta: {
          type: String
        }
      }
    }
  }
}

module.exports = Message.buildModel('Message')
