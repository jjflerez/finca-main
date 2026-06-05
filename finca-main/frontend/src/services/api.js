const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

async function request(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      Accept: 'application/json',
    },
  };

  if (body !== null && body !== undefined) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');

  if (!response.ok) {
    let message = `Error HTTP: ${response.status}`;

    if (isJson) {
      try {
        const errorData = await response.json();
        message = errorData?.message || errorData?.error || message;
      } catch {
        // Ignore JSON parsing errors and fall back to the HTTP status.
      }
    } else {
      const text = await response.text().catch(() => '');
      if (text) {
        message = text;
      }
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  if (isJson) {
    return response.json();
  }

  const text = await response.text().catch(() => '');
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export const api = {
  edificios: {
    getAll: () => request('/edificios'),
    getById: (id) => request(`/edificios/${id}`),
    create: (data) => request('/edificios', 'POST', data),
    delete: (id) => request(`/edificios/${id}`, 'DELETE'),
  },
  inmuebles: {
    getAll: () => request('/inmuebles'),
  },
  pisos: {
    getAll: () => request('/pisos'),
    getFree: () => request('/pisos/libres'),
    create: (data) => request('/pisos', 'POST', data),
    delete: (id) => request(`/pisos/${id}`, 'DELETE'),
  },
  locales: {
    getAll: () => request('/locales'),
    getFree: () => request('/locales/libres'),
    create: (data) => request('/locales', 'POST', data),
    delete: (id) => request(`/locales/${id}`, 'DELETE'),
  },
  inquilinos: {
    getAll: () => request('/inquilinos'),
    getByDni: (dni) => request(`/inquilinos/${dni}`),
    create: (data) => request('/inquilinos', 'POST', data),
    update: (dni, data) => request(`/inquilinos/${dni}`, 'PUT', data),
    delete: (dni) => request(`/inquilinos/${dni}`, 'DELETE'),
    puedeAlquilar: (dni) => request(`/inquilinos/${dni}/puede-alquilar`),
  },
  recibos: {
    getAll: () => request('/recibos'),
    getPendientes: () => request('/recibos/pendientes'),
    getByInmueble: (id) => request(`/recibos/inmueble/${id}`),
    create: (data) => request('/recibos', 'POST', data),
    update: (id, data) => request(`/recibos/${id}`, 'PUT', data),
    marcarCobrado: (id, cobrado) => request(`/recibos/${id}/cobrar`, 'PATCH', { cobrado }),
    copiarMesAnterior: (inmuebleId) => request(`/recibos/copiar-mes-anterior/${inmuebleId}`, 'POST'),
    delete: (id) => request(`/recibos/${id}`, 'DELETE'),
  },
  alquiler: {
    alquilar: (data) => request('/alquiler/alquilar', 'POST', data),
    desalquilar: (inmuebleId, tipoInmueble) => request('/alquiler/desalquilar', 'POST', { inmuebleId, tipoInmueble }),
  },
  bancos: {
    getAll: () => request('/bancos'),
    create: (data) => request('/bancos', 'POST', data),
    getCuentas: (id) => request(`/bancos/${id}/cuentas`),
    crearCuenta: (bancoId, data) => request(`/bancos/${bancoId}/cuentas`, 'POST', data),
  },
  movimientos: {
    getAll: () => request('/movimientos'),
    getByInmueble: (id) => request(`/movimientos/inmueble/${id}`),
    create: (data) => request('/movimientos', 'POST', data),
    getResumenAnual: (anio) => request(`/informes/resumen-anual/${anio}`),
  },
};
