import express from 'express'
import * as medicaoController from '../controllers/medicaoController.js'

const { index, indexIdeais, show, store, update, destroy } = medicaoController

const routes = express.Router()

routes.get('/medicao/temperatura-ideal', indexIdeais)

routes.post('/medicao', store)
routes.get('/medicao', index)
routes.get('/medicao/:id', show)
routes.put('/medicao/:id', update)
routes.delete('/medicao/:id', destroy)

export { routes }
