const app = require('./server')
const logger = require('./modules/app/logger');

app.listen(process.env.SERVER_PORT, () => {
  logger.info(`Server listening on port ${process.env.SERVER_PORT}`);
  console.log(`🚀  app listening at http://localhost:${process.env.SERVER_PORT}`)
})

