const state = {
  user: null,
  flash: null,
  modal: null,
}

const app = document.getElementById('app')

const statusLabels = {
  datos_importantes: 'Datos importantes',
  por_definir: 'Por definir',
  por_hacer: 'Por hacer',
  haciendo: 'Haciendo',
  en_revision: 'En revision',
  finalizados: 'Finalizados',
  archivados: 'Archivados',
}

function initials(name) {
  return String(name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function formatDate(value) {
  if (!value) return 'Sin fecha'
  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })
  const data = await response.json().catch(() => ({ success: false, message: 'Respuesta invalida.' }))
  if (!response.ok || data.success === false) {
    throw new Error(data.message || 'Ocurrio un error inesperado.')
  }
  return data
}

function setFlash(type, message) {
  state.flash = message ? { type, message } : null
  render()
}

function navigate(route) {
  window.location.hash = route
}

function currentRoute() {
  return window.location.hash.replace(/^#/, '') || '/dashboard'
}

function matchRoute(pattern, route) {
  const patternParts = pattern.split('/').filter(Boolean)
  const routeParts = route.split('/').filter(Boolean)
  if (patternParts.length !== routeParts.length) return null
  const params = {}
  for (let i = 0; i < patternParts.length; i += 1) {
    const patternPart = patternParts[i]
    const routePart = routeParts[i]
    if (patternPart.startsWith(':')) {
      params[patternPart.slice(1)] = routePart
    } else if (patternPart !== routePart) {
      return null
    }
  }
  return params
}

function protectedShell(content, actions = '') {
  return `
    <div class="app-shell">
      <header class="topbar">
        <div class="brand">
          <div class="brand-mark">CF</div>
          <div class="brand-copy">
            <small>Portal de gestion visual</small>
            <strong>CardFlow</strong>
          </div>
        </div>
        <div class="topbar-actions">
          ${actions}
          <div class="topbar-user">
            <strong>${escapeHtml(state.user.name)}</strong>
            <span>@${escapeHtml(state.user.username)} · ${state.user.role === 'admin' ? 'Administrador' : 'Usuario'}</span>
          </div>
          <button class="button button-secondary" data-action="logout">Salir</button>
        </div>
      </header>
      <main class="view">
        ${state.flash ? `<div class="flash flash-${state.flash.type}">${escapeHtml(state.flash.message)}</div>` : ''}
        ${content}
      </main>
    </div>
    ${renderModal()}
  `
}

function renderModal() {
  if (!state.modal) return ''
  return state.modal
}

function hero(title, description, actions = '') {
  return `
    <section class="hero">
      <div class="header-split">
        <div>
          <div class="eyebrow">CardFlow</div>
          <h1>${escapeHtml(title)}</h1>
          <p>${escapeHtml(description)}</p>
        </div>
        <div class="view-actions">${actions}</div>
      </div>
    </section>
  `
}

function loginView() {
  return `
    <div class="auth-layout">
      <section class="auth-card">
        ${state.flash ? `<div class="flash flash-${state.flash.type}">${escapeHtml(state.flash.message)}</div>` : ''}
        <div class="auth-card-header">
          <div class="brand">
            <div class="brand-mark">CF</div>
            <div class="brand-copy">
              <small>MVP estricto en espanol</small>
              <strong>CardFlow</strong>
            </div>
          </div>
          <h1 class="page-title">Bienvenido</h1>
          <p>Ingresa con tu usuario y contrasena para acceder a tus proyectos asignados.</p>
        </div>
        <form id="login-form" class="grid">
          <div class="field">
            <label for="username">Usuario</label>
            <input class="input" id="username" name="username" placeholder="admin" required>
          </div>
          <div class="field">
            <label for="password">Contrasena</label>
            <input class="input" id="password" name="password" type="password" placeholder="temporal" required>
          </div>
          <div class="auth-card-actions">
            <button class="button button-primary" type="submit">Iniciar sesion</button>
          </div>
        </form>
        <div class="login-note">
          <strong>Usuarios demo</strong>
          <p class="muted"><code>admin</code>, <code>anna</code> y <code>pedro</code> comparten la contrasena temporal <code>temporal</code>.</p>
        </div>
      </section>
    </div>
  `
}

async function dashboardView() {
  const data = await api('/api/projects')
  const adminActions =
    state.user.role === 'admin'
      ? `
        <button class="button button-primary" data-route="/projects/new">Crear proyecto</button>
        <button class="button button-secondary" data-route="/users">Administracion de usuarios</button>
        <button class="button button-secondary" data-route="/profile">Mi cuenta</button>
      `
      : `<button class="button button-secondary" data-route="/profile">Mi cuenta</button>`

  const metrics = `
    <section class="stats-grid">
      <article class="metric-card">
        <div class="eyebrow">Proyectos visibles</div>
        <strong>${data.projects.length}</strong>
      </article>
      <article class="metric-card">
        <div class="eyebrow">Rol actual</div>
        <strong>${state.user.role === 'admin' ? 'Admin' : 'User'}</strong>
      </article>
      <article class="metric-card">
        <div class="eyebrow">Acceso</div>
        <strong>${state.user.role === 'admin' ? 'Completo' : 'Asignado'}</strong>
      </article>
    </section>
  `

  const projects = data.projects.length
    ? `<section class="dashboard-grid">${data.projects
        .map(
          (project) => `
          <article class="project-card">
            <div class="header-split">
              <div>
                <div class="eyebrow">${project.is_active ? 'Activo' : 'Inactivo'}</div>
                <h3>${escapeHtml(project.name)}</h3>
              </div>
              <span class="pill">${project.card_count} cards</span>
            </div>
            <p>${escapeHtml(project.description || 'Sin descripcion')}</p>
            <div class="helper-row">
              <span>${project.member_count} miembros</span>
              <span>Actualizado ${formatDate(project.updated_at)}</span>
            </div>
            <div class="panel-actions">
              <button class="button button-primary" data-route="/projects/${project.id}/board">Entrar</button>
              ${state.user.role === 'admin' ? `<button class="button button-secondary" data-route="/projects/${project.id}/manage">Gestionar</button>` : ''}
            </div>
          </article>
        `,
        )
        .join('')}</section>`
    : `
      <div class="empty-state">
        <h3>No hay proyectos visibles</h3>
        <p>${
          state.user.role === 'admin'
            ? 'Crea el primer proyecto para empezar a organizar el trabajo.'
            : 'Todavia no tienes proyectos asignados. Pide acceso a un administrador.'
        }</p>
      </div>
    `

  return protectedShell(
    `
      ${hero('Proyectos', 'Gestiona tus iniciativas, entra al tablero correcto y mantén claro el acceso por rol.', adminActions)}
      ${metrics}
      ${projects}
    `,
  )
}

async function createProjectView() {
  if (state.user.role !== 'admin') {
    navigate('/dashboard')
    return ''
  }
  return protectedShell(`
    ${hero('Crear proyecto', 'Registra un proyecto nuevo con la informacion minima del MVP.', '<button class="button button-secondary" data-route="/dashboard">Volver</button>')}
    <section class="panel">
      <form id="create-project-form" class="grid">
        <div class="field">
          <label for="project-name">Nombre</label>
          <input class="input" id="project-name" name="name" required>
        </div>
        <div class="field">
          <label for="project-description">Descripcion</label>
          <textarea class="textarea" id="project-description" name="description"></textarea>
        </div>
        <div class="field">
          <label for="project-active">Estado inicial</label>
          <select class="select" id="project-active" name="is_active">
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </div>
        <div class="panel-actions">
          <button class="button button-primary" type="submit">Guardar proyecto</button>
          <button class="button button-secondary" type="button" data-route="/dashboard">Cancelar</button>
        </div>
      </form>
    </section>
  `)
}

async function manageProjectView(projectId) {
  if (state.user.role !== 'admin') {
    navigate('/dashboard')
    return ''
  }
  const [projectData, usersData] = await Promise.all([api(`/api/projects/${projectId}`), api('/api/options/users')])
  const assignedIds = new Set(projectData.members.map((member) => member.id))
  const availableUsers = usersData.users.filter((user) => !assignedIds.has(user.id))

  return protectedShell(`
    ${hero(
      `Gestion de ${projectData.project.name}`,
      'Edita datos basicos del proyecto y administra la lista de miembros asignados.',
      `<button class="button button-secondary" data-route="/projects/${projectId}/board">Abrir tablero</button><button class="button button-secondary" data-route="/dashboard">Volver</button>`,
    )}
    <div class="split">
      <section class="panel">
        <h3>Datos generales</h3>
        <form id="update-project-form" class="grid" data-project-id="${projectId}">
          <div class="field">
            <label>Nombre</label>
            <input class="input" name="name" value="${escapeHtml(projectData.project.name)}" required>
          </div>
          <div class="field">
            <label>Descripcion</label>
            <textarea class="textarea" name="description">${escapeHtml(projectData.project.description || '')}</textarea>
          </div>
          <div class="field">
            <label>Estado</label>
            <select class="select" name="is_active">
              <option value="true" ${projectData.project.is_active ? 'selected' : ''}>Activo</option>
              <option value="false" ${!projectData.project.is_active ? 'selected' : ''}>Inactivo</option>
            </select>
          </div>
          <div class="panel-actions">
            <button class="button button-primary" type="submit">Guardar cambios</button>
          </div>
        </form>
      </section>
      <section class="panel">
        <div class="section-header">
          <h3>Miembros</h3>
          <span class="pill">${projectData.members.length}</span>
        </div>
        <form id="assign-user-form" class="grid" data-project-id="${projectId}">
          <div class="field">
            <label>Agregar usuario</label>
            <select class="select" name="user_id" ${availableUsers.length ? '' : 'disabled'}>
              <option value="">Selecciona un usuario</option>
              ${availableUsers
                .map(
                  (user) =>
                    `<option value="${user.id}">${escapeHtml(user.name)} · @${escapeHtml(user.username)}</option>`,
                )
                .join('')}
            </select>
          </div>
          <div>
            <button class="button button-secondary" type="submit" ${availableUsers.length ? '' : 'disabled'}>Asignar al proyecto</button>
          </div>
        </form>
        <div class="grid">
          ${projectData.members
            .map(
              (member) => `
              <article class="summary-card">
                <div class="list-row">
                  <div>
                    <strong>${escapeHtml(member.name)}</strong>
                    <div class="table-subtext">@${escapeHtml(member.username)} · ${member.role}</div>
                  </div>
                  <button class="button button-danger" data-action="remove-project-user" data-project-id="${projectId}" data-user-id="${member.id}">Remover</button>
                </div>
              </article>
            `,
            )
            .join('')}
        </div>
      </section>
    </div>
  `)
}

async function boardView(projectId) {
  const data = await api(`/api/projects/${projectId}/board`)

  const columns = data.statuses
    .map((status) => {
      const cards = data.cards.filter((card) => card.status === status.value)
      return `
        <section class="board-column">
          <div class="board-column-header">
            <div class="section-header">
              <span class="accent-dot accent-${status.accent}"></span>
              <strong>${status.label}</strong>
            </div>
            <span class="counter">${cards.length}</span>
          </div>
          <div class="column-card-list">
            ${
              cards.length
                ? cards
                    .map(
                      (card) => `
                      <article class="board-card" data-action="open-card" data-card-id="${card.id}">
                        <div class="header-split">
                          <span class="eyebrow">Card #${card.id}</span>
                          <select class="select status-select" data-action="change-card-status" data-card-id="${card.id}">
                            ${data.statuses
                              .map(
                                (item) =>
                                  `<option value="${item.value}" ${item.value === card.status ? 'selected' : ''}>${item.label}</option>`,
                              )
                              .join('')}
                          </select>
                        </div>
                        <h4>${escapeHtml(card.title)}</h4>
                        <p class="card-description">${escapeHtml(card.description || 'Sin descripcion')}</p>
                        <div class="helper-row">
                          <span>${escapeHtml(card.assigned_user_name || 'Sin responsable')}</span>
                          <span>${formatDate(card.updated_at)}</span>
                        </div>
                      </article>
                    `,
                    )
                    .join('')
                : '<div class="empty-state"><h3>Sin cards</h3><p>Agrega una card para iniciar esta columna.</p></div>'
            }
          </div>
        </section>
      `
    })
    .join('')

  return protectedShell(`
    ${hero(
      data.project.name,
      data.project.description || 'Tablero principal del proyecto.',
      `<button class="button button-secondary" data-route="/dashboard">Volver</button>${
        state.user.role === 'admin'
          ? `<button class="button button-secondary" data-route="/projects/${projectId}/manage">Gestionar proyecto</button>`
          : ''
      }<button class="button button-primary" data-action="open-create-card" data-project-id="${projectId}">Crear card</button>`,
    )}
    <section class="summary-card">
      <div class="helper-row">
        <span>Proyecto ${data.project.is_active ? 'activo' : 'inactivo'}</span>
        <span>${data.members.length} miembros</span>
      </div>
      <div class="chip-row">
        ${data.members
          .map(
            (member) =>
              `<span class="pill">${escapeHtml(member.name)} · @${escapeHtml(member.username)}</span>`,
          )
          .join('')}
      </div>
    </section>
    <section class="board-wrapper">
      <div class="board">${columns}</div>
    </section>
  `)
}

async function usersView() {
  if (state.user.role !== 'admin') {
    navigate('/dashboard')
    return ''
  }
  const data = await api('/api/users')
  return protectedShell(`
    ${hero('Administracion de usuarios', 'Gestiona altas, roles y estado activo de los usuarios del sistema.', '<button class="button button-secondary" data-route="/dashboard">Volver</button>')}
    <div class="split">
      <section class="panel">
        <h3>Crear usuario</h3>
        <form id="create-user-form" class="grid">
          <div class="field"><label>Nombre</label><input class="input" name="name" required></div>
          <div class="field"><label>Usuario</label><input class="input" name="username" required></div>
          <div class="field"><label>Rol</label><select class="select" name="role"><option value="user">user</option><option value="admin">admin</option></select></div>
          <div class="field"><label>Contrasena temporal</label><input class="input" name="password" value="temporal" required></div>
          <div class="panel-actions"><button class="button button-primary" type="submit">Crear usuario</button></div>
        </form>
      </section>
      <section class="table-wrap">
        <div class="section-header">
          <h3>Usuarios</h3>
          <span class="pill">${data.users.length}</span>
        </div>
        <table class="table">
          <thead>
            <tr><th>Usuario</th><th>Rol</th><th>Estado</th><th>Guardar</th></tr>
          </thead>
          <tbody>
            ${data.users
              .map(
                (user) => `
                <tr>
                  <td>
                    <div class="field"><label>Nombre</label><input class="input" data-user-name="${user.id}" value="${escapeHtml(user.name)}"></div>
                    <div class="field"><label>Usuario</label><input class="input" data-user-username="${user.id}" value="${escapeHtml(user.username)}"></div>
                  </td>
                  <td>
                    <select class="select" data-user-role="${user.id}">
                      <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>admin</option>
                      <option value="user" ${user.role === 'user' ? 'selected' : ''}>user</option>
                    </select>
                  </td>
                  <td>
                    <select class="select" data-user-active="${user.id}">
                      <option value="true" ${user.is_active ? 'selected' : ''}>Activo</option>
                      <option value="false" ${!user.is_active ? 'selected' : ''}>Inactivo</option>
                    </select>
                  </td>
                  <td>
                    <button class="button button-secondary" data-action="save-user" data-user-id="${user.id}">Guardar</button>
                  </td>
                </tr>
              `,
              )
              .join('')}
          </tbody>
        </table>
      </section>
    </div>
  `)
}

async function profileView() {
  return protectedShell(`
    ${hero('Mi cuenta', 'Consulta tus datos base y cambia tu contrasena actual.', '<button class="button button-secondary" data-route="/dashboard">Volver</button>')}
    <div class="split">
      <section class="summary-card">
        <div class="section-header">
          <div class="avatar">${initials(state.user.name)}</div>
          <div>
            <h3>${escapeHtml(state.user.name)}</h3>
            <p>@${escapeHtml(state.user.username)}</p>
          </div>
        </div>
        <div class="detail-grid">
          <div><div class="eyebrow">Rol</div><p>${escapeHtml(state.user.role)}</p></div>
          <div><div class="eyebrow">Estado</div><p>${state.user.is_active ? 'Activo' : 'Inactivo'}</p></div>
        </div>
      </section>
      <section class="panel">
        <h3>Cambiar contrasena</h3>
        <form id="change-password-form" class="grid">
          <div class="field"><label>Contrasena actual</label><input class="input" type="password" name="current_password" required></div>
          <div class="field"><label>Nueva contrasena</label><input class="input" type="password" name="new_password" required></div>
          <div class="field"><label>Confirmar nueva contrasena</label><input class="input" type="password" name="confirm_new_password" required></div>
          <div class="panel-actions"><button class="button button-primary" type="submit">Guardar cambios</button></div>
        </form>
      </section>
    </div>
  `)
}

function createCardModal(projectId) {
  state.modal = `
    <div class="modal-backdrop" data-action="close-modal-backdrop">
      <aside class="modal-panel" onclick="event.stopPropagation()">
        <div class="header-split">
          <div>
            <div class="eyebrow">Nueva card</div>
            <h2>Crear card</h2>
          </div>
          <button class="button button-secondary" data-action="close-modal">Cerrar</button>
        </div>
        <form id="create-card-form" class="grid" data-project-id="${projectId}">
          <div class="field"><label>Titulo</label><input class="input" name="title" required></div>
          <div class="field"><label>Descripcion</label><textarea class="textarea" name="description"></textarea></div>
          <div class="field"><label>Estado inicial</label>
            <select class="select" name="status">${Object.entries(statusLabels)
              .map(([value, label]) => `<option value="${value}">${label}</option>`)
              .join('')}</select>
          </div>
          <div class="panel-actions"><button class="button button-primary" type="submit">Guardar card</button></div>
        </form>
      </aside>
    </div>
  `
  render()
}

async function openCardModal(cardId) {
  const [cardData, historyData] = await Promise.all([api(`/api/cards/${cardId}`), api(`/api/cards/${cardId}/comments/history`)])
  state.modal = `
    <div class="modal-backdrop" data-action="close-modal-backdrop">
      <aside class="modal-panel" onclick="event.stopPropagation()">
        <div class="header-split">
          <div>
            <div class="eyebrow">Detalle de card #${cardData.card.id}</div>
            <h2>${escapeHtml(cardData.card.title)}</h2>
            <p class="panel-subtext">${escapeHtml(cardData.project.name)}</p>
          </div>
          <button class="button button-secondary" data-action="close-modal">Cerrar</button>
        </div>
        <form id="card-detail-form" class="grid" data-card-id="${cardData.card.id}" data-project-id="${cardData.project.id}">
          <div class="field"><label>Titulo</label><input class="input" name="title" value="${escapeHtml(cardData.card.title)}" required></div>
          <div class="field"><label>Descripcion</label><textarea class="textarea" name="description">${escapeHtml(cardData.card.description || '')}</textarea></div>
          <div class="modal-grid">
            <div class="field"><label>Estado</label><select class="select" name="status">${Object.entries(statusLabels)
              .map(
                ([value, label]) => `<option value="${value}" ${value === cardData.card.status ? 'selected' : ''}>${label}</option>`,
              )
              .join('')}</select></div>
            <div class="field"><label>Responsable</label><select class="select" name="assigned_user_id"><option value="">Sin responsable</option>${cardData.members
              .map(
                (member) =>
                  `<option value="${member.id}" ${member.id === cardData.card.assigned_user_id ? 'selected' : ''}>${escapeHtml(member.name)}</option>`,
              )
              .join('')}</select></div>
          </div>
          <div class="panel-actions"><button class="button button-primary" type="submit">Guardar cambios</button></div>
        </form>

        <section class="panel">
          <div class="section-header"><h3>Comentarios activos</h3><span class="pill">${cardData.comments.length}</span></div>
          <form id="comment-form" class="grid" data-card-id="${cardData.card.id}">
            <div class="field"><label>Nuevo comentario</label><textarea class="textarea" name="content" required></textarea></div>
            <div class="panel-actions"><button class="button button-secondary" type="submit">Agregar comentario</button></div>
          </form>
          <div class="grid">
            ${
              cardData.comments.length
                ? cardData.comments
                    .map(
                      (comment) => `
                      <article class="comment">
                        <div class="comment-header">
                          <div class="section-header">
                            <div class="avatar-sm">${initials(comment.user_name)}</div>
                            <div>
                              <strong>${escapeHtml(comment.user_name)}</strong>
                              <div class="comment-meta">${formatDate(comment.created_at)}</div>
                            </div>
                          </div>
                          <button class="button button-danger" data-action="archive-comment" data-comment-id="${comment.id}" data-card-id="${cardData.card.id}">Archivar</button>
                        </div>
                        <div class="comment-body"><div>${escapeHtml(comment.content)}</div></div>
                      </article>
                    `,
                    )
                    .join('')
                : '<div class="empty-state"><h3>Sin comentarios activos</h3><p>Agrega el primer comentario de seguimiento.</p></div>'
            }
          </div>
        </section>

        <section class="panel">
          <div class="section-header"><h3>Historico archivado</h3><span class="pill">${historyData.comments.length}</span></div>
          <div class="grid">
            ${
              historyData.comments.length
                ? historyData.comments
                    .map(
                      (comment) => `
                      <article class="summary-card">
                        <strong>${escapeHtml(comment.user_name)}</strong>
                        <div class="table-subtext">Archivado ${formatDate(comment.archived_at || comment.updated_at)}</div>
                        <div>${escapeHtml(comment.content)}</div>
                      </article>
                    `,
                    )
                    .join('')
                : '<div class="empty-state"><h3>Sin historico</h3><p>No hay comentarios archivados para esta card.</p></div>'
            }
          </div>
        </section>
      </aside>
    </div>
  `
  render()
}

function closeModal() {
  state.modal = null
  render()
}

async function render() {
  const route = currentRoute()
  try {
    if (!state.user && route !== '/login') {
      navigate('/login')
      return
    }

    if (route === '/login') {
      app.innerHTML = loginView()
      return
    }

    const routes = [
      { pattern: '/dashboard', view: dashboardView },
      { pattern: '/projects/new', view: createProjectView },
      { pattern: '/projects/:id/manage', view: ({ id }) => manageProjectView(id) },
      { pattern: '/projects/:id/board', view: ({ id }) => boardView(id) },
      { pattern: '/users', view: usersView },
      { pattern: '/profile', view: profileView },
    ]

    const match = routes
      .map((candidate) => ({ params: matchRoute(candidate.pattern, route), candidate }))
      .find((result) => result.params)

    if (!match) {
      navigate('/dashboard')
      return
    }

    app.innerHTML = await match.candidate.view(match.params)
  } catch (error) {
    setFlash('error', error.message)
    if (error.message.includes('sesion')) {
      state.user = null
      navigate('/login')
    }
  }
}

document.addEventListener('submit', async (event) => {
  const form = event.target
  if (!(form instanceof HTMLFormElement)) return
  event.preventDefault()

  try {
    if (form.id === 'login-form') {
      const formData = new FormData(form)
      const data = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      })
      state.user = data.user
      state.flash = null
      navigate('/dashboard')
      return
    }

    if (form.id === 'create-project-form') {
      const formData = new FormData(form)
      const project = await api('/api/projects', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.get('name'),
          description: formData.get('description'),
          is_active: formData.get('is_active') === 'true',
        }),
      })
      state.flash = { type: 'success', message: 'Proyecto creado correctamente.' }
      navigate(`/projects/${project.project.id}/manage`)
      return
    }

    if (form.id === 'update-project-form') {
      const projectId = form.dataset.projectId
      const formData = new FormData(form)
      await api(`/api/projects/${projectId}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: formData.get('name'),
          description: formData.get('description'),
          is_active: formData.get('is_active') === 'true',
        }),
      })
      setFlash('success', 'Proyecto actualizado.')
      return
    }

    if (form.id === 'assign-user-form') {
      const projectId = form.dataset.projectId
      const formData = new FormData(form)
      const userId = formData.get('user_id')
      if (!userId) throw new Error('Selecciona un usuario para asignar.')
      await api(`/api/projects/${projectId}/users`, {
        method: 'POST',
        body: JSON.stringify({ user_id: Number(userId) }),
      })
      setFlash('success', 'Usuario asignado al proyecto.')
      render()
      return
    }

    if (form.id === 'create-user-form') {
      const formData = new FormData(form)
      await api('/api/users', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      })
      setFlash('success', 'Usuario creado correctamente.')
      render()
      return
    }

    if (form.id === 'change-password-form') {
      const formData = new FormData(form)
      await api('/api/me/password', {
        method: 'PUT',
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      })
      form.reset()
      setFlash('success', 'Contrasena actualizada correctamente.')
      return
    }

    if (form.id === 'create-card-form') {
      const projectId = form.dataset.projectId
      const formData = new FormData(form)
      await api(`/api/projects/${projectId}/cards`, {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      })
      closeModal()
      setFlash('success', 'Card creada correctamente.')
      return
    }

    if (form.id === 'card-detail-form') {
      const cardId = form.dataset.cardId
      const projectId = form.dataset.projectId
      const formData = new FormData(form)
      await api(`/api/cards/${cardId}`, {
        method: 'PUT',
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      })
      state.flash = { type: 'success', message: 'Card actualizada.' }
      await openCardModal(cardId)
      navigate(`/projects/${projectId}/board`)
      return
    }

    if (form.id === 'comment-form') {
      const cardId = form.dataset.cardId
      const formData = new FormData(form)
      await api(`/api/cards/${cardId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content: formData.get('content') }),
      })
      await openCardModal(cardId)
      return
    }
  } catch (error) {
    setFlash('error', error.message)
  }
})

document.addEventListener('click', async (event) => {
  const target = event.target.closest('[data-action], [data-route]')
  if (!target) return

  const route = target.dataset.route
  if (route) {
    navigate(route)
    return
  }

  const action = target.dataset.action

  try {
    if (action === 'logout') {
      await api('/api/auth/logout', { method: 'POST' })
      state.user = null
      state.flash = null
      navigate('/login')
      return
    }

    if (action === 'remove-project-user') {
      await api(`/api/projects/${target.dataset.projectId}/users/${target.dataset.userId}`, { method: 'DELETE' })
      setFlash('success', 'Usuario removido del proyecto.')
      render()
      return
    }

    if (action === 'save-user') {
      const userId = target.dataset.userId
      const role = document.querySelector(`[data-user-role="${userId}"]`).value
      const isActive = document.querySelector(`[data-user-active="${userId}"]`).value === 'true'
      const name = document.querySelector(`[data-user-name="${userId}"]`).value
      const username = document.querySelector(`[data-user-username="${userId}"]`).value
      await api(`/api/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({
          name,
          username,
          role,
          is_active: isActive,
        }),
      })
      setFlash('success', 'Usuario actualizado.')
      render()
      return
    }

    if (action === 'open-create-card') {
      createCardModal(target.dataset.projectId)
      return
    }

    if (action === 'open-card') {
      await openCardModal(target.dataset.cardId)
      return
    }

    if (action === 'close-modal' || action === 'close-modal-backdrop') {
      closeModal()
      return
    }

    if (action === 'archive-comment') {
      await api(`/api/comments/${target.dataset.commentId}/archive`, { method: 'PUT' })
      await openCardModal(target.dataset.cardId)
      return
    }
  } catch (error) {
    setFlash('error', error.message)
  }
})

document.addEventListener('change', async (event) => {
  const target = event.target
  if (!(target instanceof HTMLSelectElement)) return
  if (target.dataset.action !== 'change-card-status') return

  try {
    await api(`/api/cards/${target.dataset.cardId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: target.value }),
    })
    setFlash('success', 'Estado de la card actualizado.')
  } catch (error) {
    setFlash('error', error.message)
  }
})

window.addEventListener('hashchange', render)

async function bootstrap() {
  try {
    const data = await api('/api/me')
    state.user = data.user
    if (currentRoute() === '/login') {
      navigate('/dashboard')
      return
    }
  } catch (_error) {
    state.user = null
    if (currentRoute() !== '/login') {
      navigate('/login')
      return
    }
  }
  render()
}

bootstrap()
