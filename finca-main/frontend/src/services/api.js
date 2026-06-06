const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://696e1273390d54.lhr.life/api';

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
  auth: {
    login: (username, password) => request('/auth/login', 'POST', { username, password }),
  },
  edificios: {
    getAll: () => request('/edificios'),
    getById: (id) => request(`/edificios/${id}`),
    create: (data) => request('/edificios', 'POST', data),
    update: (id, data) => request(`/edificios/${id}`, 'PUT', data),
    delete: (id) => request(`/edificios/${id}`, 'DELETE'),
    getPisos: (id) => request(`/edificios/${id}/pisos`),
    getLocales: (id) => request(`/edificios/${id}/locales`),
  },
  inmuebles: {
    getAll: () => request('/inmuebles'),
  },
  pisos: {
    getAll: () => request('/pisos'),
    getById: (id) => request(`/pisos/${id}`),
    getFree: () => request('/pisos/libres'),
    create: (data) => request('/pisos', 'POST', data),
    update: (id, data) => request(`/pisos/${id}`, 'PUT', data),
    delete: (id) => request(`/pisos/${id}`, 'DELETE'),
  },
  locales: {
    getAll: () => request('/locales'),
    getById: (id) => request(`/locales/${id}`),
    getFree: () => request('/locales/libres'),
    create: (data) => request('/locales', 'POST', data),
    update: (id, data) => request(`/locales/${id}`, 'PUT', data),
    delete: (id) => request(`/locales/${id}`, 'DELETE'),
  },
  inquilinos: {
    getAll: () => request('/inquilinos'),
    getByDni: (dni) => request(`/inquilinos/${dni}`),
    getByFecha: () => request('/inquilinos/ordenados-por-fecha'),
    getByRangoFecha: (desde, hasta) => request(`/inquilinos/rango-fecha?desde=${desde}&hasta=${hasta}`),
    create: (data) => request('/inquilinos', 'POST', data),
    update: (dni, data) => request(`/inquilinos/${dni}`, 'PUT', data),
    delete: (dni) => request(`/inquilinos/${dni}`, 'DELETE'),
    puedeAlquilar: (dni) => request(`/inquilinos/${dni}/puede-alquilar`),
  },
  recibos: {
    getAll: () => request('/recibos'),
    getPendientes: () => request('/recibos/pendientes'),
    getPendientesRango: (desde, hasta) => request(`/recibos/pendientes/rango?desde=${desde}&hasta=${hasta}`),
    getCobradosRango: (desde, hasta) => request(`/recibos/cobrados/rango?desde=${desde}&hasta=${hasta}`),
    getByInmueble: (id) => request(`/recibos/inmueble/${id}`),
    getById: (id) => request(`/recibos/${id}`),
    getImpresion: (id) => request(`/recibos/${id}/impresion`),
    create: (data) => request('/recibos', 'POST', data),
    update: (id, data) => request(`/recibos/${id}`, 'PUT', data),
    marcarCobrado: (id, cobrado) => request(`/recibos/${id}/cobrar`, 'PATCH', { cobrado }),
    copiarMesAnterior: (inmuebleId) => request(`/recibos/copiar-mes-anterior/${inmuebleId}`, 'POST'),
    generarMensuales: () => request('/recibos/generar-mensuales', 'POST'),
    inicializarConcepto: (data) => request('/recibos/inicializar-concepto', 'POST', data),
    delete: (id) => request(`/recibos/${id}`, 'DELETE'),
  },
  alquiler: {
    alquilar: (data) => request('/alquiler/alquilar', 'POST', data),
    desalquilar: (inmuebleId, tipoInmueble) => request('/alquiler/desalquilar', 'POST', { inmuebleId, tipoInmueble }),
  },
  bancos: {
    getAll: () => request('/bancos'),
    getById: (id) => request(`/bancos/${id}`),
    create: (data) => request('/bancos', 'POST', data),
    update: (id, data) => request(`/bancos/${id}`, 'PUT', data),
    delete: (id) => request(`/bancos/${id}`, 'DELETE'),
    getCuentas: (id) => request(`/bancos/${id}/cuentas`),
    crearCuenta: (bancoId, data) => request(`/bancos/${bancoId}/cuentas`, 'POST', data),
  },
  cuentas: {
    getAll: () => request('/cuentas'),
    getById: (id) => request(`/cuentas/${id}`),
    getByInmueble: (inmuebleId) => request(`/cuentas/inmueble/${inmuebleId}`),
    update: (id, data) => request(`/cuentas/${id}`, 'PUT', data),
    delete: (id) => request(`/cuentas/${id}`, 'DELETE'),
  },
  movimientos: {
    getAll: () => request('/movimientos'),
    getByInmueble: (id) => request(`/movimientos/inmueble/${id}`),
    getByCuenta: (cuentaId) => request(`/movimientos/cuenta/${cuentaId}`),
    getByRango: (desde, hasta) => request(`/movimientos/rango?desde=${desde}&hasta=${hasta}`),
    getByTipo: (tipo) => request(`/movimientos/tipo/${tipo}`),
    create: (data) => request('/movimientos', 'POST', data),
    getResumenAnual: (anio) => request(`/informes/resumen-anual/${anio}`),
    getDeclaracionRenta: (anio) => request(`/informes/declaracion-renta/${anio}`),
  },
  listados: {
    inquilinosPagos: (desde, hasta, pagado) => request(`/listados/inquilinos-pagos?desde=${desde}&hasta=${hasta}&pagado=${pagado}`),
    recibosCobrados: (desde, hasta) => request(`/listados/recibos-cobrados?desde=${desde}&hasta=${hasta}`),
    recibosRango: (desde, hasta) => request(`/listados/recibos-rango?desde=${desde}&hasta=${hasta}`),
  },
  tiposMovimiento: {
    getGastos: () => request('/tipos-gasto'),
    getIngresos: () => request('/tipos-ingreso'),
  },
};
