const path = require('path')
const express = require('express')
const session = require('express-session')
const bcrypt = require('bcrypt')
const { db, initializeDatabase, nowIso } = require('./db')
const { BOARD_STATUSES, STATUS_META } = require('./constants')

initializeDatabase()

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'cardflow-mvp-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 8,
    },
  }),
)

app.use((req, _res, next) => {
  if (req.session.userId) {
    const user = db
      .prepare('SELECT id, name, username, role, is_active FROM users WHERE id = ?')
      .get(req.session.userId)
    if (user && user.is_active) {
      req.user = normalizeUser(user)
    } else {
      req.session.destroy(() => {})
    }
  }
  next()
})

app.use('/frontend', express.static(path.join(__dirname, '..', 'frontend')))
app.use('/assets', express.static(path.join(__dirname, '..', 'frontend', 'assets')))
app.use('/css', express.static(path.join(__dirname, '..', 'frontend', 'css')))
app.use('/js', express.static(path.join(__dirname, '..', 'frontend', 'js')))

function normalizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    role: user.role,
    is_active: Boolean(user.is_active),
  }
}

function respondError(res, status, message) {
  return res.status(status).json({ success: false, message })
}

function requireAuth(req, res, next) {
  if (!req.user) {
    return respondError(res, 401, 'Debes iniciar sesion para continuar.')
  }
  return next()
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return respondError(res, 403, 'Acceso solo para administradores.')
  }
  return next()
}

function getUserById(userId) {
  return db
    .prepare('SELECT id, name, username, role, is_active FROM users WHERE id = ?')
    .get(userId)
}

function getProjectById(projectId) {
  return db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId)
}

function canAccessProject(user, projectId) {
  if (!user) {
    return false
  }
  if (user.role === 'admin') {
    return true
  }
  const assignment = db
    .prepare('SELECT 1 FROM project_users WHERE project_id = ? AND user_id = ?')
    .get(projectId, user.id)
  return Boolean(assignment)
}

function ensureProjectAccess(req, res, next) {
  const projectId = Number(req.params.id || req.params.projectId)
  if (!Number.isInteger(projectId) || projectId <= 0) {
    return respondError(res, 400, 'Proyecto invalido.')
  }
  const project = getProjectById(projectId)
  if (!project) {
    return respondError(res, 404, 'Proyecto no encontrado.')
  }
  if (!canAccessProject(req.user, projectId)) {
    return respondError(res, 403, 'No tienes acceso a este proyecto.')
  }
  req.project = project
  return next()
}

function getCardById(cardId) {
  return db.prepare('SELECT * FROM cards WHERE id = ?').get(cardId)
}

function ensureCardAccess(req, res, next) {
  const cardId = Number(req.params.id)
  if (!Number.isInteger(cardId) || cardId <= 0) {
    return respondError(res, 400, 'Card invalida.')
  }
  const card = getCardById(cardId)
  if (!card) {
    return respondError(res, 404, 'Card no encontrada.')
  }
  if (!canAccessProject(req.user, card.project_id)) {
    return respondError(res, 403, 'No tienes acceso a esta card.')
  }
  req.card = card
  return next()
}

function serializeProject(project) {
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    created_by: project.created_by,
    is_active: Boolean(project.is_active),
    created_at: project.created_at,
    updated_at: project.updated_at,
  }
}

function serializeCard(card) {
  return {
    id: card.id,
    project_id: card.project_id,
    title: card.title,
    description: card.description,
    status: card.status,
    status_label: STATUS_META[card.status]?.label || card.status,
    created_by: card.created_by,
    assigned_user_id: card.assigned_user_id,
    position: card.position,
    is_archived: Boolean(card.is_archived),
    created_at: card.created_at,
    updated_at: card.updated_at,
  }
}

function serializeComment(comment) {
  return {
    id: comment.id,
    card_id: comment.card_id,
    user_id: comment.user_id,
    content: comment.content,
    is_archived: Boolean(comment.is_archived),
    created_at: comment.created_at,
    updated_at: comment.updated_at,
    archived_at: comment.archived_at,
    user_name: comment.user_name,
    username: comment.username,
  }
}

function getProjectMembers(projectId) {
  return db
    .prepare(
      `SELECT u.id, u.name, u.username, u.role, u.is_active
       FROM project_users pu
       INNER JOIN users u ON u.id = pu.user_id
       WHERE pu.project_id = ?
       ORDER BY u.name COLLATE NOCASE ASC`,
    )
    .all(projectId)
    .map(normalizeUser)
}

function getAssignableUser(projectId, userId) {
  if (userId === null || userId === undefined || userId === '') {
    return null
  }
  return db
    .prepare(
      `SELECT u.id, u.name, u.username, u.role, u.is_active
       FROM project_users pu
       INNER JOIN users u ON u.id = pu.user_id
       WHERE pu.project_id = ? AND pu.user_id = ?`,
    )
    .get(projectId, userId)
}

function getCommentHistory(cardId, archived) {
  return db
    .prepare(
      `SELECT c.*, u.name AS user_name, u.username
       FROM comments c
       INNER JOIN users u ON u.id = c.user_id
       WHERE c.card_id = ? AND c.is_archived = ?
       ORDER BY c.created_at DESC`,
    )
    .all(cardId, archived ? 1 : 0)
    .map(serializeComment)
}

app.post('/api/auth/login', (req, res) => {
  const username = String(req.body.username || '').trim().toLowerCase()
  const password = String(req.body.password || '')

  if (!username || !password) {
    return respondError(res, 400, 'Debes completar usuario y contrasena.')
  }

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username)
  if (!user) {
    return respondError(res, 401, 'Las credenciales no son validas.')
  }
  if (!user.is_active) {
    return respondError(res, 403, 'La cuenta se encuentra inactiva.')
  }
  const passwordIsValid = bcrypt.compareSync(password, user.password_hash)
  if (!passwordIsValid) {
    return respondError(res, 401, 'Las credenciales no son validas.')
  }

  req.session.userId = user.id
  return res.json({ success: true, user: normalizeUser(user) })
})

app.post('/api/auth/logout', requireAuth, (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true })
  })
})

app.get('/api/me', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Sin sesion activa.' })
  }
  return res.json({ success: true, user: req.user })
})

app.put('/api/me/password', requireAuth, (req, res) => {
  const currentPassword = String(req.body.current_password || '')
  const newPassword = String(req.body.new_password || '')
  const confirmNewPassword = String(req.body.confirm_new_password || '')

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return respondError(res, 400, 'Debes completar todos los campos de contrasena.')
  }
  if (newPassword !== confirmNewPassword) {
    return respondError(res, 400, 'La confirmacion de la nueva contrasena no coincide.')
  }

  const fullUser = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id)
  if (!bcrypt.compareSync(currentPassword, fullUser.password_hash)) {
    return respondError(res, 400, 'La contrasena actual es invalida.')
  }

  const updatedAt = nowIso()
  db.prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?').run(
    bcrypt.hashSync(newPassword, 10),
    updatedAt,
    req.user.id,
  )
  return res.json({ success: true, message: 'Contrasena actualizada correctamente.' })
})

app.get('/api/users', requireAuth, requireAdmin, (_req, res) => {
  const users = db
    .prepare(
      'SELECT id, name, username, role, is_active, created_at, updated_at FROM users ORDER BY name COLLATE NOCASE ASC',
    )
    .all()
    .map(normalizeUser)
  return res.json({ success: true, users })
})

app.post('/api/users', requireAuth, requireAdmin, (req, res) => {
  const name = String(req.body.name || '').trim()
  const username = String(req.body.username || '').trim().toLowerCase()
  const role = String(req.body.role || 'user').trim()
  const password = String(req.body.password || '')
  const isActive = req.body.is_active === false ? 0 : 1

  if (!name || !username || !password) {
    return respondError(res, 400, 'Nombre, usuario y contrasena son obligatorios.')
  }
  if (!['admin', 'user'].includes(role)) {
    return respondError(res, 400, 'Rol invalido.')
  }

  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username)
  if (existing) {
    return respondError(res, 409, 'El nombre de usuario ya existe.')
  }

  const timestamp = nowIso()
  const result = db
    .prepare(
      `INSERT INTO users (name, username, password_hash, role, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(name, username, bcrypt.hashSync(password, 10), role, isActive, timestamp, timestamp)

  const user = getUserById(result.lastInsertRowid)
  return res.status(201).json({ success: true, user: normalizeUser(user) })
})

app.put('/api/users/:id', requireAuth, requireAdmin, (req, res) => {
  const userId = Number(req.params.id)
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId)
  if (!user) {
    return respondError(res, 404, 'Usuario no encontrado.')
  }

  const name = String(req.body.name ?? user.name).trim()
  const username = String(req.body.username ?? user.username).trim().toLowerCase()
  const role = String(req.body.role ?? user.role)
  const isActive = req.body.is_active === undefined ? user.is_active : req.body.is_active ? 1 : 0

  if (!name || !username) {
    return respondError(res, 400, 'Nombre y usuario son obligatorios.')
  }
  if (!['admin', 'user'].includes(role)) {
    return respondError(res, 400, 'Rol invalido.')
  }

  const duplicate = db.prepare('SELECT id FROM users WHERE username = ? AND id != ?').get(username, userId)
  if (duplicate) {
    return respondError(res, 409, 'El nombre de usuario ya existe.')
  }

  db.prepare('UPDATE users SET name = ?, username = ?, role = ?, is_active = ?, updated_at = ? WHERE id = ?').run(
    name,
    username,
    role,
    isActive,
    nowIso(),
    userId,
  )

  return res.json({ success: true, user: normalizeUser(getUserById(userId)) })
})

app.get('/api/projects', requireAuth, (req, res) => {
  const statement =
    req.user.role === 'admin'
      ? db.prepare(
          `SELECT p.*, COUNT(DISTINCT pu.user_id) AS member_count, COUNT(DISTINCT c.id) AS card_count
           FROM projects p
           LEFT JOIN project_users pu ON pu.project_id = p.id
           LEFT JOIN cards c ON c.project_id = p.id
           GROUP BY p.id
           ORDER BY p.updated_at DESC`,
        )
      : db.prepare(
          `SELECT p.*, COUNT(DISTINCT pu2.user_id) AS member_count, COUNT(DISTINCT c.id) AS card_count
           FROM project_users pu
           INNER JOIN projects p ON p.id = pu.project_id
           LEFT JOIN project_users pu2 ON pu2.project_id = p.id
           LEFT JOIN cards c ON c.project_id = p.id
           WHERE pu.user_id = ?
           GROUP BY p.id
           ORDER BY p.updated_at DESC`,
        )

  const rows = req.user.role === 'admin' ? statement.all() : statement.all(req.user.id)
  const projects = rows.map((project) => ({
    ...serializeProject(project),
    member_count: project.member_count,
    card_count: project.card_count,
  }))

  return res.json({ success: true, projects })
})

app.post('/api/projects', requireAuth, requireAdmin, (req, res) => {
  const name = String(req.body.name || '').trim()
  const description = String(req.body.description || '').trim()
  const isActive = req.body.is_active === false ? 0 : 1

  if (!name) {
    return respondError(res, 400, 'El nombre del proyecto es obligatorio.')
  }

  const timestamp = nowIso()
  const result = db
    .prepare(
      `INSERT INTO projects (name, description, created_by, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(name, description, req.user.id, isActive, timestamp, timestamp)

  db.prepare('INSERT OR IGNORE INTO project_users (project_id, user_id, assigned_at) VALUES (?, ?, ?)').run(
    result.lastInsertRowid,
    req.user.id,
    timestamp,
  )

  return res.status(201).json({
    success: true,
    project: serializeProject(getProjectById(result.lastInsertRowid)),
  })
})

app.get('/api/projects/:id', requireAuth, ensureProjectAccess, (req, res) => {
  const members = getProjectMembers(req.project.id)
  return res.json({ success: true, project: serializeProject(req.project), members })
})

app.put('/api/projects/:id', requireAuth, requireAdmin, (req, res) => {
  const projectId = Number(req.params.id)
  const project = getProjectById(projectId)
  if (!project) {
    return respondError(res, 404, 'Proyecto no encontrado.')
  }

  const name = String(req.body.name ?? project.name).trim()
  const description = String(req.body.description ?? project.description).trim()
  const isActive = req.body.is_active === undefined ? project.is_active : req.body.is_active ? 1 : 0

  if (!name) {
    return respondError(res, 400, 'El nombre del proyecto es obligatorio.')
  }

  db.prepare('UPDATE projects SET name = ?, description = ?, is_active = ?, updated_at = ? WHERE id = ?').run(
    name,
    description,
    isActive,
    nowIso(),
    projectId,
  )

  return res.json({ success: true, project: serializeProject(getProjectById(projectId)) })
})

app.get('/api/projects/:id/users', requireAuth, requireAdmin, (req, res) => {
  const project = getProjectById(Number(req.params.id))
  if (!project) {
    return respondError(res, 404, 'Proyecto no encontrado.')
  }
  return res.json({ success: true, users: getProjectMembers(project.id) })
})

app.post('/api/projects/:id/users', requireAuth, requireAdmin, (req, res) => {
  const projectId = Number(req.params.id)
  const userId = Number(req.body.user_id)
  const project = getProjectById(projectId)
  const user = getUserById(userId)

  if (!project || !user) {
    return respondError(res, 404, 'Proyecto o usuario no encontrado.')
  }

  const existing = db.prepare('SELECT id FROM project_users WHERE project_id = ? AND user_id = ?').get(projectId, userId)
  if (existing) {
    return respondError(res, 409, 'El usuario ya pertenece a este proyecto.')
  }

  db.prepare('INSERT INTO project_users (project_id, user_id, assigned_at) VALUES (?, ?, ?)').run(
    projectId,
    userId,
    nowIso(),
  )

  return res.status(201).json({ success: true, users: getProjectMembers(projectId) })
})

app.delete('/api/projects/:id/users/:userId', requireAuth, requireAdmin, (req, res) => {
  const projectId = Number(req.params.id)
  const userId = Number(req.params.userId)
  const project = getProjectById(projectId)
  if (!project) {
    return respondError(res, 404, 'Proyecto no encontrado.')
  }

  db.prepare('DELETE FROM project_users WHERE project_id = ? AND user_id = ?').run(projectId, userId)

  db.prepare(
    'UPDATE cards SET assigned_user_id = NULL, updated_at = ? WHERE project_id = ? AND assigned_user_id = ?',
  ).run(nowIso(), projectId, userId)

  return res.json({ success: true, users: getProjectMembers(projectId) })
})

app.get('/api/projects/:id/board', requireAuth, ensureProjectAccess, (req, res) => {
  const members = getProjectMembers(req.project.id)
  const cards = db
    .prepare(
      `SELECT c.*, u.name AS assigned_user_name
       FROM cards c
       LEFT JOIN users u ON u.id = c.assigned_user_id
       WHERE c.project_id = ?
       ORDER BY c.status ASC, c.position ASC, c.updated_at DESC`,
    )
    .all(req.project.id)
    .map((card) => ({
      ...serializeCard(card),
      assigned_user_name: card.assigned_user_name,
    }))

  return res.json({
    success: true,
    project: serializeProject(req.project),
    members,
    statuses: BOARD_STATUSES.map((status) => ({
      value: status,
      label: STATUS_META[status].label,
      accent: STATUS_META[status].accent,
    })),
    cards,
  })
})

app.get('/api/projects/:id/cards', requireAuth, ensureProjectAccess, (req, res) => {
  const cards = db
    .prepare('SELECT * FROM cards WHERE project_id = ? ORDER BY position ASC, updated_at DESC')
    .all(req.project.id)
    .map(serializeCard)
  return res.json({ success: true, cards })
})

app.post('/api/projects/:id/cards', requireAuth, ensureProjectAccess, (req, res) => {
  if (!req.project.is_active) {
    return respondError(res, 400, 'El proyecto esta inactivo y no admite nuevas cards.')
  }

  const title = String(req.body.title || '').trim()
  const description = String(req.body.description || '').trim()
  const status = String(req.body.status || 'por_definir')
  const assignedUserId = req.body.assigned_user_id ?? null

  if (!title) {
    return respondError(res, 400, 'El titulo es obligatorio.')
  }
  if (!BOARD_STATUSES.includes(status)) {
    return respondError(res, 400, 'El estado seleccionado no es valido.')
  }

  if (assignedUserId && !getAssignableUser(req.project.id, Number(assignedUserId))) {
    return respondError(res, 400, 'El responsable debe pertenecer al proyecto.')
  }

  const maxPosition = db
    .prepare('SELECT COALESCE(MAX(position), 0) AS maxPosition FROM cards WHERE project_id = ? AND status = ?')
    .get(req.project.id, status).maxPosition

  const timestamp = nowIso()
  const result = db
    .prepare(
      `INSERT INTO cards (
        project_id, title, description, status, created_by, assigned_user_id, position, is_archived, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      req.project.id,
      title,
      description,
      status,
      req.user.id,
      assignedUserId ? Number(assignedUserId) : null,
      maxPosition + 1,
      status === 'archivados' ? 1 : 0,
      timestamp,
      timestamp,
    )

  return res.status(201).json({ success: true, card: serializeCard(getCardById(result.lastInsertRowid)) })
})

app.get('/api/cards/:id', requireAuth, ensureCardAccess, (req, res) => {
  const project = getProjectById(req.card.project_id)
  const members = getProjectMembers(project.id)
  return res.json({
    success: true,
    card: serializeCard(req.card),
    project: serializeProject(project),
    members,
    comments: getCommentHistory(req.card.id, false),
  })
})

app.put('/api/cards/:id', requireAuth, ensureCardAccess, (req, res) => {
  const title = String(req.body.title ?? req.card.title).trim()
  const description = String(req.body.description ?? req.card.description).trim()
  const status = String(req.body.status ?? req.card.status)
  const assignedUserId = req.body.assigned_user_id === '' ? null : req.body.assigned_user_id ?? req.card.assigned_user_id

  if (!title) {
    return respondError(res, 400, 'El titulo es obligatorio.')
  }
  if (!BOARD_STATUSES.includes(status)) {
    return respondError(res, 400, 'El estado seleccionado no es valido.')
  }
  if (assignedUserId && !getAssignableUser(req.card.project_id, Number(assignedUserId))) {
    return respondError(res, 400, 'El responsable debe pertenecer al proyecto.')
  }

  db.prepare(
    `UPDATE cards
     SET title = ?, description = ?, status = ?, assigned_user_id = ?, is_archived = ?, updated_at = ?
     WHERE id = ?`,
  ).run(
    title,
    description,
    status,
    assignedUserId ? Number(assignedUserId) : null,
    status === 'archivados' ? 1 : 0,
    nowIso(),
    req.card.id,
  )

  return res.json({ success: true, card: serializeCard(getCardById(req.card.id)) })
})

app.put('/api/cards/:id/status', requireAuth, ensureCardAccess, (req, res) => {
  const status = String(req.body.status || '')
  if (!BOARD_STATUSES.includes(status)) {
    return respondError(res, 400, 'El estado seleccionado no es valido.')
  }

  const maxPosition = db
    .prepare('SELECT COALESCE(MAX(position), 0) AS maxPosition FROM cards WHERE project_id = ? AND status = ?')
    .get(req.card.project_id, status).maxPosition

  db.prepare('UPDATE cards SET status = ?, position = ?, is_archived = ?, updated_at = ? WHERE id = ?').run(
    status,
    maxPosition + 1,
    status === 'archivados' ? 1 : 0,
    nowIso(),
    req.card.id,
  )

  return res.json({ success: true, card: serializeCard(getCardById(req.card.id)) })
})

app.get('/api/cards/:id/comments', requireAuth, ensureCardAccess, (req, res) => {
  return res.json({ success: true, comments: getCommentHistory(req.card.id, false) })
})

app.post('/api/cards/:id/comments', requireAuth, ensureCardAccess, (req, res) => {
  const content = String(req.body.content || '').trim()
  if (!content) {
    return respondError(res, 400, 'El comentario no puede estar vacio.')
  }

  const timestamp = nowIso()
  const result = db
    .prepare(
      `INSERT INTO comments (card_id, user_id, content, is_archived, created_at, updated_at, archived_at)
       VALUES (?, ?, ?, 0, ?, ?, NULL)`,
    )
    .run(req.card.id, req.user.id, content, timestamp, timestamp)

  const comment = db
    .prepare(
      `SELECT c.*, u.name AS user_name, u.username
       FROM comments c
       INNER JOIN users u ON u.id = c.user_id
       WHERE c.id = ?`,
    )
    .get(result.lastInsertRowid)
  return res.status(201).json({ success: true, comment: serializeComment(comment) })
})

app.put('/api/comments/:id/archive', requireAuth, (req, res) => {
  const commentId = Number(req.params.id)
  const comment = db.prepare('SELECT * FROM comments WHERE id = ?').get(commentId)
  if (!comment) {
    return respondError(res, 404, 'Comentario no encontrado.')
  }
  const card = getCardById(comment.card_id)
  if (!card || !canAccessProject(req.user, card.project_id)) {
    return respondError(res, 403, 'No tienes acceso a este comentario.')
  }

  db.prepare('UPDATE comments SET is_archived = 1, archived_at = ?, updated_at = ? WHERE id = ?').run(
    nowIso(),
    nowIso(),
    commentId,
  )
  return res.json({ success: true })
})

app.get('/api/cards/:id/comments/history', requireAuth, ensureCardAccess, (req, res) => {
  return res.json({ success: true, comments: getCommentHistory(req.card.id, true) })
})

app.get('/api/options/users', requireAuth, requireAdmin, (_req, res) => {
  const users = db
    .prepare('SELECT id, name, username, role, is_active FROM users ORDER BY name COLLATE NOCASE ASC')
    .all()
    .map(normalizeUser)
  return res.json({ success: true, users })
})

app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'))
})

if (process.argv.includes('--seed-only')) {
  console.log('Base de datos inicializada.')
  process.exit(0)
}

app.listen(PORT, () => {
  console.log(`CardFlow disponible en http://localhost:${PORT}`)
})
