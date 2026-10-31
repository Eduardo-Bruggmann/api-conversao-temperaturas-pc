import * as medicaoRepository from '../repositories/medicaoRepository.js'
import { AppError } from '../errors/AppError.js'

const { insert, findAll, findById, findByClassificacao, update, remove } =
  medicaoRepository

const UNIDADES = ['celsius', 'fahrenheit', 'kelvin']
const ZERO_ABSOLUTO_CELSIUS = -273.15

const CLASSIFICACOES = {
  IDEAL: 'Temperatura Ideal',
  ACIMA_DO_IDEAL: 'Acima da Temperatura Ideal',
  CRITICO: 'Limite Crítico',
}

export async function createMedicao(dados) {
  const medicao = buildMedicao(dados)
  const { insertId } = await insert(medicao)
  return { id: insertId, ...medicao }
}

export async function findAllMedicoes() {
  return await findAll()
}

export async function findMedicoesIdeais() {
  return await findByClassificacao(CLASSIFICACOES.IDEAL)
}

export async function findMedicaoById(id) {
  return await findMedicaoOrFail(id)
}

export async function updateMedicao(id, dados) {
  const medicaoExistente = await findMedicaoOrFail(id)
  const medicao = buildMedicao(dados)
  await update(medicaoExistente.id, medicao)
  return { id: medicaoExistente.id, ...medicao }
}

export async function deleteMedicao(id) {
  const medicao = await findMedicaoOrFail(id)
  await remove(medicao.id)
}

async function findMedicaoOrFail(id) {
  const medicao = await findById(parseId(id))

  if (!medicao) throw new AppError('Medição não encontrada.', 404)

  return medicao
}

function parseId(id) {
  const idNumerico = Number(id)

  if (!Number.isInteger(idNumerico) || idNumerico <= 0)
    throw new AppError('ID inválido. Informe um número inteiro positivo.', 400)

  return idNumerico
}

// Valida os dados recebidos e devolve a medição pronta para ser salva,
// com o valor convertido e a classificação calculados
function buildMedicao(dados) {
  const {
    descricao,
    tipo,
    valor_original,
    unidade_original,
    unidade_convertida,
  } = dados ?? {}

  if (
    isBlank(descricao) ||
    isBlank(tipo) ||
    isBlank(valor_original) ||
    isBlank(unidade_original) ||
    isBlank(unidade_convertida)
  )
    throw new AppError(
      'Dados incompletos. Informe descricao, tipo, valor_original, unidade_original e unidade_convertida.',
      400,
    )

  validateTexto(descricao, 'descricao', 255)
  validateTexto(tipo, 'tipo', 50)

  const valorOriginal = parseValor(valor_original)
  const unidadeOriginal = parseUnidade(unidade_original)
  const unidadeConvertida = parseUnidade(unidade_convertida)

  const celsius = toCelsius(valorOriginal, unidadeOriginal)

  if (celsius < ZERO_ABSOLUTO_CELSIUS)
    throw new AppError('Temperatura abaixo do zero absoluto.', 400)

  const valorConvertido = Number(
    fromCelsius(celsius, unidadeConvertida).toFixed(2),
  )

  return {
    descricao: descricao.trim(),
    tipo: tipo.trim(),
    valor_original: valorOriginal,
    unidade_original: unidadeOriginal,
    valor_convertido: valorConvertido,
    unidade_convertida: unidadeConvertida,
    classificacao: classifyTemperatura(celsius),
  }
}

function isBlank(valor) {
  return (
    valor === undefined ||
    valor === null ||
    (typeof valor === 'string' && valor.trim() === '')
  )
}

function validateTexto(valor, campo, tamanhoMaximo) {
  if (typeof valor !== 'string')
    throw new AppError(`O campo '${campo}' deve ser um texto.`, 400)

  if (valor.trim().length > tamanhoMaximo)
    throw new AppError(
      `O campo '${campo}' deve ter no máximo ${tamanhoMaximo} caracteres.`,
      400,
    )
}

function parseValor(valor) {
  const valorNumerico =
    typeof valor === 'number' || typeof valor === 'string' ? Number(valor) : NaN

  if (!Number.isFinite(valorNumerico))
    throw new AppError(`O campo 'valor_original' deve ser um número.`, 400)

  return valorNumerico
}

function parseUnidade(unidade) {
  const unidadeNormalizada =
    typeof unidade === 'string' ? unidade.trim().toLowerCase() : ''

  if (!UNIDADES.includes(unidadeNormalizada))
    throw new AppError(
      `Unidade inválida. Utilize 'celsius', 'fahrenheit' ou 'kelvin'.`,
      400,
    )

  return unidadeNormalizada
}

function toCelsius(valor, unidade) {
  switch (unidade) {
    case 'celsius':
      return valor
    case 'fahrenheit':
      return ((valor - 32) * 5) / 9
    case 'kelvin':
      return valor - 273.15
  }
}

function fromCelsius(celsius, unidade) {
  switch (unidade) {
    case 'celsius':
      return celsius
    case 'fahrenheit':
      return (celsius * 9) / 5 + 32
    case 'kelvin':
      return celsius + 273.15
  }
}

function classifyTemperatura(celsius) {
  if (celsius < 80) return CLASSIFICACOES.IDEAL
  if (celsius <= 105) return CLASSIFICACOES.ACIMA_DO_IDEAL
  return CLASSIFICACOES.CRITICO
}
