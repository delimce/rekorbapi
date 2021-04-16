const app = require('./server')

app.listen(process.env.SERVER_PORT, () => {
  console.log(`🚀  app listening at http://localhost:${process.env.SERVER_PORT}`)
})

