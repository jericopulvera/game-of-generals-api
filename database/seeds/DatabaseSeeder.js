"use strict";

/*
|--------------------------------------------------------------------------
| DatabaseSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const _ = use("lodash");

class DatabaseSeeder {
  async run() {
    await use("Mongoose").connection.dropDatabase();
    // await new this.UserSeeder().run()
    // await new this.MatchSeeder().run()
  }
}

_.forEach(
  use("Loader").load(`${use("Helpers").appRoot()}/database/seeders`),
  (value, key) => {
    DatabaseSeeder.prototype[key] = value;
  }
);

module.exports = DatabaseSeeder;
