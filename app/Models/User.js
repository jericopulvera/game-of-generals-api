"use strict";

const BaseModel = use("MongooseModel");
const { Schema } = use("Mongoose");
const Hash = use("Hash");

class User extends BaseModel {
  static boot({ schema }) {
    this.addHook("preSave", async function(userInstance) {
      this.password = await Hash.make(this.password);
    });

    // schema.virtual('id').get(function () {
    //   return this._id.toHexString()
    // })

    // schema.set('toJSON', {
    //   virtuals: true
    // })
  }
  /**
   * User's schema
   */
  static get schema() {
    return {
      name: {
        type: String,
        required: true
      },
      fbId: {
        type: String,
        unique: true,
        index: true,
        sparse: true
      },
      imageUrl: {
        type: String
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      },
      role: {
        type: String,
        enum: ["admin", "user"],
        required: true
      }
    };
  }
}

module.exports = User.buildModel("User");
