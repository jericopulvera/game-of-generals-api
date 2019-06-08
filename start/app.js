'use strict'

const Helpers = use('Helpers')

/*
|--------------------------------------------------------------------------
| Providers
|--------------------------------------------------------------------------
|
| Providers are building blocks for your Adonis app. Anytime you install
| a new Adonis specific package, chances are you will register the
| provider here.
|
*/
const providers = [
  '@adonisjs/framework/providers/AppProvider',
  '@adonisjs/bodyparser/providers/BodyParserProvider',
  '@adonisjs/cors/providers/CorsProvider',
  '@adonisjs/vow/providers/VowProvider',
  '@adonisjs/auth/providers/AuthProvider',
  '@adonisjs/lucid/providers/LucidProvider',
  'adonis-mongoose-model/providers/MongooseProvider',
  '@adonisjs/validator/providers/ValidatorProvider',
  'adonis-4-cloudinary/provider/Cloudinary',
  // 'adonis-throttle/providers/ThrottleProvider',

  // CUSTOM PROVIDERS
  Helpers.appRoot('app/Providers/LoaderProvider'),
  Helpers.appRoot('app/Providers/ExtendResponseProvider'),
  Helpers.appRoot('app/Providers/JwtProvider'),
  Helpers.appRoot('app/Providers/SocketIo')
]

/*
|--------------------------------------------------------------------------
| Ace Providers
|--------------------------------------------------------------------------
|
| Ace providers are required only when running ace commands. For example
| Providers for migrations, tests etc.
|
*/
const aceProviders = ['@adonisjs/lucid/providers/MigrationsProvider']

/*
|--------------------------------------------------------------------------
| Aliases
|--------------------------------------------------------------------------
|
| Aliases are short unique names for IoC container bindings. You are free
| to create your own aliases.
|
| For example:
|   { Route: 'Adonis/Src/Route' }
|
*/
const aliases = {
  Jwt: 'Providers/Jwt',
  Loader: 'Providers/Loader',
  Utility: 'Providers/Utility',
  SocketIo: 'Providers/SocketIo',
  Cloudinary: 'Adonis/Addons/AdonisCloudinary'
  // Throttle: 'Adonis/Addons/Throttle'
}

/*
|--------------------------------------------------------------------------
| Commands
|--------------------------------------------------------------------------
|
| Here you store ace commands for your package
|
*/
const commands = []

module.exports = { providers, aceProviders, aliases, commands }
