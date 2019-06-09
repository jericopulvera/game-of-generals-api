'use strict'

const BaseModel = use('MongooseModel')
const { Schema } = use('Mongoose')

const pieceSchema = Schema({
  strength: {
    type: Number,
    enum: [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] // Create On Collide Comparison Logic Later
  },
  position: {
    type: String,
    enum: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'] // Board positiom
  },
  positionNumber: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6, 7, 8]
  },
  isAlive: {
    type: Boolean,
    required: true,
    default: true
  },
  positionHistory: [
    {
      position: {
        type: String,
        enum: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
      },
      positionNumber: {
        type: Number,
        enum: [1, 2, 3, 4, 5, 6, 7, 8]
      }
    }
  ]
})

class Match extends BaseModel {
  static boot({ schema }) {}
  /**
   * Match's schema
   */
  static get schema() {
    return {
      white: {
        user: {
          type: Schema.Types.ObjectId
          // type: String
        },
        pieces: [pieceSchema]
      },
      black: {
        user: {
          type: Schema.Types.ObjectId
          // type: String
        },
        pieces: [pieceSchema]
      },
      createdBy: {
        type: Schema.Types.ObjectId,
        required: true
      },
      createdAt: {
        type: Date,
        required: true,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        required: true,
        default: Date.now
      },
      endedAt: {
        type: Date
      }
    }
  }
}

module.exports = Match.buildModel('Match')
