import * as medicaoService from '../services/medicaoService.js'

const {
  createMedicao,
  findAllMedicoes,
  findMedicoesIdeais,
  findMedicaoById,
  updateMedicao,
  deleteMedicao,
} = medicaoService

export async function index(req, res) {
  const medicoes = await findAllMedicoes()
  res.status(200).json(medicoes)
}

export async function indexIdeais(req, res) {
  const medicoes = await findMedicoesIdeais()
  res.status(200).json(medicoes)
}

export async function show(req, res) {
  const { id } = req.params
  const medicao = await findMedicaoById(id)
  res.status(200).json(medicao)
}

export async function store(req, res) {
  const medicao = req.body
  const novaMedicao = await createMedicao(medicao)
  res.status(201).json(novaMedicao)
}

export async function update(req, res) {
  const { id } = req.params
  const medicao = req.body
  const medicaoAtualizada = await updateMedicao(id, medicao)
  res.status(200).json(medicaoAtualizada)
}

export async function destroy(req, res) {
  const { id } = req.params
  await deleteMedicao(id)
  res.status(204).send()
}
