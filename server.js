import { errorMiddleware } from './src/middlewares/errorMiddleware.js'
import { notFoundMiddleware } from './src/middlewares/notFoundMiddleware.js'
import { routes } from './src/routes/routes.js'
import express from 'express'

const server = express()

server.use(express.json())

server.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' })
})

server.use('/api', routes)

server.use(notFoundMiddleware)
server.use(errorMiddleware)

export { server }
