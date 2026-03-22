const BOARD_STATUSES = [
  'datos_importantes',
  'por_definir',
  'por_hacer',
  'haciendo',
  'en_revision',
  'finalizados',
  'archivados',
]

const STATUS_META = {
  datos_importantes: {
    label: 'Datos importantes',
    accent: 'important',
  },
  por_definir: {
    label: 'Por definir',
    accent: 'neutral',
  },
  por_hacer: {
    label: 'Por hacer',
    accent: 'todo',
  },
  haciendo: {
    label: 'Haciendo',
    accent: 'doing',
  },
  en_revision: {
    label: 'En revision',
    accent: 'review',
  },
  finalizados: {
    label: 'Finalizados',
    accent: 'done',
  },
  archivados: {
    label: 'Archivados',
    accent: 'archived',
  },
}

module.exports = {
  BOARD_STATUSES,
  STATUS_META,
}
