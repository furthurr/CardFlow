const fs = require('fs')
const path = require('path')
const bcrypt = require('bcrypt')
const Database = require('better-sqlite3')
const { BOARD_STATUSES } = require('./constants')

const databasePath = path.join(__dirname, '..', 'database', 'cardflow.sqlite')
const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql')

const db = new Database(databasePath)
db.pragma('foreign_keys = ON')

function nowIso() {
  return new Date().toISOString()
}

function runSchema() {
  const schema = fs.readFileSync(schemaPath, 'utf8')
  db.exec(schema)
}

function insertUsers() {
  const passwordHash = bcrypt.hashSync('temporal', 10)
  const insertUser = db.prepare(`
    INSERT INTO users (name, username, password_hash, role, is_active, created_at, updated_at)
    VALUES (@name, @username, @password_hash, @role, @is_active, @created_at, @updated_at)
  `)

  const timestamp = nowIso()
  ;[
    { name: 'Administrador', username: 'admin', role: 'admin' },
    { name: 'Anna', username: 'anna', role: 'user' },
    { name: 'Pedro', username: 'pedro', role: 'user' },
  ].forEach((user) => {
    insertUser.run({
      ...user,
      password_hash: passwordHash,
      is_active: 1,
      created_at: timestamp,
      updated_at: timestamp,
    })
  })
}

function insertDemoData() {
  const admin = db.prepare('SELECT id FROM users WHERE username = ?').get('admin')
  const anna = db.prepare('SELECT id FROM users WHERE username = ?').get('anna')
  const pedro = db.prepare('SELECT id FROM users WHERE username = ?').get('pedro')

  if (!admin || !anna || !pedro) {
    return
  }

  const insertProject = db.prepare(`
    INSERT INTO projects (name, description, created_by, is_active, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `)
  const insertAssignment = db.prepare(`
    INSERT INTO project_users (project_id, user_id, assigned_at)
    VALUES (?, ?, ?)
  `)
  const insertCard = db.prepare(`
    INSERT INTO cards (
      project_id, title, description, status, created_by, assigned_user_id, position, is_archived, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  const insertComment = db.prepare(`
    INSERT INTO comments (card_id, user_id, content, is_archived, created_at, updated_at, archived_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  const timestamp = nowIso()
  const project1 = insertProject.run(
    'Portal editorial premium',
    'Implementacion inicial del tablero para coordinar contenido, revisiones y entregas del equipo central.',
    admin.id,
    1,
    timestamp,
    timestamp,
  )
  const project2 = insertProject.run(
    'Operacion interna CardFlow',
    'Proyecto demo para probar gestion de usuarios, cards y comentarios archivados.',
    admin.id,
    1,
    timestamp,
    timestamp,
  )

  ;[
    [project1.lastInsertRowid, admin.id],
    [project1.lastInsertRowid, anna.id],
    [project2.lastInsertRowid, admin.id],
    [project2.lastInsertRowid, pedro.id],
  ].forEach(([projectId, userId]) => insertAssignment.run(projectId, userId, timestamp))

  const demoCards = [
    {
      projectId: project1.lastInsertRowid,
      title: 'Definir tono visual del lanzamiento',
      description: 'Aterrizar una guia rapida de tono y componentes base para el dashboard principal.',
      status: 'datos_importantes',
      createdBy: admin.id,
      assignedUserId: anna.id,
      position: 1,
    },
    {
      projectId: project1.lastInsertRowid,
      title: 'Escribir copy del acceso principal',
      description: 'Preparar microcopy para login, dashboard y estados vacios.',
      status: 'por_hacer',
      createdBy: anna.id,
      assignedUserId: anna.id,
      position: 1,
    },
    {
      projectId: project2.lastInsertRowid,
      title: 'Validar historico de comentarios',
      description: 'Probar archivado y consulta del historial desde el panel lateral de la card.',
      status: 'en_revision',
      createdBy: admin.id,
      assignedUserId: pedro.id,
      position: 1,
    },
  ]

  const insertedIds = demoCards.map((card, index) => {
    const result = insertCard.run(
      card.projectId,
      card.title,
      card.description,
      BOARD_STATUSES.includes(card.status) ? card.status : 'por_definir',
      card.createdBy,
      card.assignedUserId,
      card.position ?? index + 1,
      card.status === 'archivados' ? 1 : 0,
      timestamp,
      timestamp,
    )
    return result.lastInsertRowid
  })

  insertComment.run(
    insertedIds[0],
    admin.id,
    'Necesitamos que este lineamiento quede listo antes de abrir el proyecto al equipo.',
    0,
    timestamp,
    timestamp,
    null,
  )
  insertComment.run(
    insertedIds[2],
    pedro.id,
    'Ya probe el flujo y el historial responde bien con los comentarios archivados.',
    0,
    timestamp,
    timestamp,
    null,
  )
  insertComment.run(
    insertedIds[2],
    admin.id,
    'Comentario archivado de prueba para validar el historico.',
    1,
    timestamp,
    timestamp,
    timestamp,
  )
}

function seedDatabase() {
  const userCount = db.prepare('SELECT COUNT(*) AS count FROM users').get().count
  if (userCount > 0) {
    return false
  }

  const transaction = db.transaction(() => {
    insertUsers()
    insertDemoData()
  })

  transaction()
  return true
}

function initializeDatabase() {
  runSchema()
  return seedDatabase()
}

module.exports = {
  db,
  databasePath,
  initializeDatabase,
  nowIso,
}
