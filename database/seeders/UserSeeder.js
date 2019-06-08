'use strict'

const Factory = require('../Factory')

class UserSeeder {
  async run() {
    await Factory.model('App/Models/User').create({
      name: 'Jerico Pulvera',
      email: 'jerico.pulvera01z@gmail.com',
      role: 'admin',
      imageUrl: 'https://avatars1.githubusercontent.com/u/23246308?s=50&v=4'
    })

    await Factory.model('App/Models/User').create({
      name: 'Sarina Corre',
      email: 'sarinaguintocorre@gmail.com',
      role: 'admin',
      imageUrl: 'https://avatars1.githubusercontent.com/u/23246308?s=50&v=4'
    })
  }
}

module.exports = UserSeeder
