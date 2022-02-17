/**
 * Config view engine for app
 * @param app from exactly express module
 * @param folder path express static
 */

const configViewEngine = (app, folder) => {
  app.set('view engine', 'pug')
  app.set('views', folder)
}

export default configViewEngine
