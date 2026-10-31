export function notFoundMiddleware(req, res) {
  return res.status(404).json({
    statusCode: 404,
    message: 'Rota não encontrada.',
  })
}
