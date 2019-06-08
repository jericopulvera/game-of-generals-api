'use strict'

const BaseModel = use('MongooseModel')
const { Schema } = use('Mongoose')

class Conversation extends BaseModel {
  static boot ({ schema }) {}
  /**
   * Conversation's schema
   */
  static get schema () {
    return {
      participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      lastMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message'
      }
    }
  }
}

module.exports = Conversation.buildModel('Conversation')
