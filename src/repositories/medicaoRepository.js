import { database } from '../database/connection.js'

export async function insert(medicao) {
  const {
    descricao,
    tipo,
    valor_original,
    unidade_original,
    valor_convertido,
    unidade_convertida,
    classificacao,
  } = medicao

  const [result] = await database.execute(
    `INSERT INTO medicoes (
        descricao,
        tipo,
        valor_original,
        unidade_original,
        valor_convertido,
        unidade_convertida,
        classificacao
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      descricao,
      tipo,
      valor_original,
      unidade_original,
      valor_convertido,
      unidade_convertida,
      classificacao,
    ],
  )
  return result
}

export async function findAll() {
  const [rows] = await database.execute('SELECT * FROM medicoes')
  return rows
}

export async function findById(id) {
  const [rows] = await database.execute('SELECT * FROM medicoes WHERE id = ?', [
    id,
  ])
  return rows[0] ?? null
}

export async function findByClassificacao(classificacao) {
  const [rows] = await database.execute(
    'SELECT * FROM medicoes WHERE classificacao = ?',
    [classificacao],
  )
  return rows
}

export async function update(id, medicao) {
  const {
    descricao,
    tipo,
    valor_original,
    unidade_original,
    valor_convertido,
    unidade_convertida,
    classificacao,
  } = medicao

  const [result] = await database.execute(
    `UPDATE medicoes SET
        descricao = ?,
        tipo = ?,
        valor_original = ?,
        unidade_original = ?,
        valor_convertido = ?,
        unidade_convertida = ?,
        classificacao = ?
    WHERE id = ?`,
    [
      descricao,
      tipo,
      valor_original,
      unidade_original,
      valor_convertido,
      unidade_convertida,
      classificacao,
      id,
    ],
  )
  return result
}

export async function remove(id) {
  const [result] = await database.execute(
    'DELETE FROM medicoes WHERE id = ?',
    [id],
  )
  return result
}
