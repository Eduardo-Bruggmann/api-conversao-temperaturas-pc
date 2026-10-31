import { AppError } from '../errors/AppError.js'

export function errorMiddleware(err, req, res, next) {
  if (err instanceof AppError)
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
    })

  if (err.type === 'entity.parse.failed')
    return res.status(400).json({
      statusCode: 400,
      message: 'JSON inválido no corpo da requisição.',
    })

  console.error('[Erro]:', err)

  return res.status(500).json({
    statusCode: 500,
    message: 'Erro interno do servidor.',
  })
}
