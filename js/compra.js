function iniciarCompra() {

const EVENTOS = [
  {
    evento: 'Día 1 — Escenario Rock',
    fecha: '2027-01-15',
    lugar: 'Old Lions Rugby Club',
    ciudad: 'Santiago del Estero',
    horario: '18:00 - 23:30',
    artista: 'The Warning · Turnstile · Fontaines D.C. · Deftones',
    genero: 'Rock',
    precio: 15000,
    moneda: 'ARS',
    entradas_disponibles: 1500,
    descripcion: 'La noche más potente del festival. Cuatro bandas de rock internacional que pondrán a vibrar el anfiteatro con riffs electrizantes y baterías atronadoras.',
    esAbono: false
  },
  {
    evento: 'Día 2 — Escenario Pop & Electrónica',
    fecha: '2027-01-16',
    lugar: 'Santiago Lawn Tennis Club',
    ciudad: 'Santiago del Estero',
    horario: '19:00 - 01:00',
    artista: 'Peggy Gou · Chappell Roan · Sabrina Carpenter · Skrillex',
    genero: 'Pop / Electrónica',
    precio: 15000,
    moneda: 'ARS',
    entradas_disponibles: 2000,
    descripcion: 'Una fusión de melodías pop y beats electrónicos. De la calidez vocal de Chappell Roan al bass de Skrillex, pasando por el groove de Peggy Gou.',
    esAbono: false
  },
  {
    evento: 'Día 3 — Escenario Metal',
    fecha: '2027-01-17',
    lugar: 'Hipódromo 27 de Abril',
    ciudad: 'Santiago del Estero',
    horario: '17:00 - 23:00',
    artista: 'Evanescence · Megadeth · Iron Maiden · AC/DC',
    genero: 'Metal',
    precio: 15000,
    moneda: 'ARS',
    entradas_disponibles: 1200,
    descripcion: 'El cierre del festival con lo más pesado del metal. Leyendas como Iron Maiden y AC/DC junto a la potencia de Evanescence y Megadeth.',
    esAbono: false
  },
  {
    evento: 'Abono General (3 días)',
    fecha: '2027-01-15',
    lugar: 'Todas las sedes',
    ciudad: 'Santiago del Estero',
    horario: 'Todo el festival',
    artista: 'Todos los artistas',
    genero: 'Todos los géneros',
    precio: 35000,
    moneda: 'ARS',
    entradas_disponibles: 2000,
    descripcion: 'Acceso los tres días a todos los escenarios. Incluye pulsera conmemorativa.',
    esAbono: true,
    abonoKey: 'general'
  },
  {
    evento: 'Abono VIP (3 días)',
    fecha: '2027-01-15',
    lugar: 'Todas las sedes',
    ciudad: 'Santiago del Estero',
    horario: 'Todo el festival',
    artista: 'Todos los artistas',
    genero: 'Todos los géneros',
    precio: 65000,
    moneda: 'ARS',
    entradas_disponibles: 500,
    descripcion: 'Acceso preferencial + zona VIP con barra exclusiva, baños privados y vista privilegiada. Incluye remera oficial.',
    esAbono: true,
    abonoKey: 'vip'
  },
  {
    evento: 'Experiencia Premium (3 días)',
    fecha: '2027-01-15',
    lugar: 'Todas las sedes',
    ciudad: 'Santiago del Estero',
    horario: 'Todo el festival',
    artista: 'Todos los artistas',
    genero: 'Todos los géneros',
    precio: 95000,
    moneda: 'ARS',
    entradas_disponibles: 200,
    descripcion: 'Abono VIP + Meet & Greet con artistas + estacionamiento + merchandising exclusivo.',
    esAbono: true,
    abonoKey: 'premium'
  }
];

const TIPOS_ENTRADA = {
  General: 1,
  VIP: 2,
  Palco: 3
};

const TIPOS_ABONO = {
  general: 'Abono General',
  vip: 'Abono VIP',
  premium: 'Experiencia Premium'
};

const MIN_ENTRADAS = 1;
const MAX_ENTRADAS = 6;

let paises = [];
let temporizador = null;
let segundosRestantes = 900;
let tarjetaDetectada = null;

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

fetchPaises();
cargarEventos();
leerParametrosURL();
configurarValidacion();
configurarListeners();
iniciarContador(getElemento('contador'));
actualizarEstadoBoton();
actualizarResumen();

function getElemento(id) {
  return document.getElementById(id);
}

function valor(elem) {
  return elem ? elem.value.trim() : '';
}

function mostrarError(id, mensaje) {
  const campo = getElemento(id);
  if (!campo) return;
  const feedback = campo.parentElement.querySelector('.feedback');
  if (!feedback) return;
  campo.classList.remove('valido');
  campo.classList.add('invalido');
  feedback.textContent = mensaje;
  feedback.className = 'feedback error';
}

function mostrarExito(id) {
  const campo = getElemento(id);
  if (!campo) return;
  const feedback = campo.parentElement.querySelector('.feedback');
  if (!feedback) return;
  campo.classList.remove('invalido');
  campo.classList.add('valido');
  feedback.textContent = 'Correcto';
  feedback.className = 'feedback exito';
}

function limpiarFeedback(id) {
  const campo = getElemento(id);
  if (!campo) return;
  const feedback = campo.parentElement.querySelector('.feedback');
  if (!feedback) return;
  feedback.textContent = '';
  feedback.className = 'feedback';
}

async function fetchPaises() {
  const select = getElemento('pais');
  if (!select) return;

  try {
    const respuesta = await fetch(
      'https://gist.githubusercontent.com/eduardolat/b2a252d17b17363fab0974bb0634d259/raw/e12763a1e35b364974b8da47f28a7b81467feb95/paises.json'
    );
    if (!respuesta.ok) throw new Error('Error al cargar países');
    paises = await respuesta.json();

    paises.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

    select.innerHTML = '<option value="">Seleccioná tu país</option>';
    paises.forEach((p) => {
      const opt = document.createElement('option');
      opt.value = p.nombre;
      opt.textContent = p.nombre;
      select.appendChild(opt);
    });
  } catch (err) {
    console.warn('No se pudieron cargar los países:', err.message);
    select.innerHTML =
      '<option value="">Error al cargar países</option>' +
      '<option value="Argentina">Argentina</option>' +
      '<option value="Chile">Chile</option>' +
      '<option value="Uruguay">Uruguay</option>' +
      '<option value="Brasil">Brasil</option>' +
      '<option value="Paraguay">Paraguay</option>' +
      '<option value="Bolivia">Bolivia</option>' +
      '<option value="Perú">Perú</option>' +
      '<option value="Colombia">Colombia</option>' +
      '<option value="Ecuador">Ecuador</option>' +
      '<option value="Venezuela">Venezuela</option>' +
      '<option value="México">México</option>' +
      '<option value="España">España</option>' +
      '<option value="Estados Unidos">Estados Unidos</option>';
    paises = [
      { nombre: 'Argentina' },
      { nombre: 'Chile' },
      { nombre: 'Uruguay' },
      { nombre: 'Brasil' },
      { nombre: 'Paraguay' },
      { nombre: 'Bolivia' },
      { nombre: 'Perú' },
      { nombre: 'Colombia' },
      { nombre: 'Ecuador' },
      { nombre: 'Venezuela' },
      { nombre: 'México' },
      { nombre: 'España' },
      { nombre: 'Estados Unidos' }
    ];
  }
}

function cargarEventos() {
  const select = getElemento('evento-select');
  if (!select) return;

  select.innerHTML = '<option value="">Seleccioná un evento</option>';
  EVENTOS.forEach((ev, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `${ev.evento} — $${ev.precio.toLocaleString('es-AR')} ARS`;
    select.appendChild(opt);
  });
}

function actualizarTiposEntrada() {
  const selectEvento = getElemento('evento-select');
  const selectTipo = getElemento('tipo-entrada');
  if (!selectEvento || !selectTipo) return;

  const idx = parseInt(selectEvento.value, 10);
  const ev = (!isNaN(idx) && idx >= 0 && idx < EVENTOS.length) ? EVENTOS[idx] : null;

  const currentVal = selectTipo.value;
  selectTipo.innerHTML = '';

  if (ev && ev.esAbono) {
    selectTipo.innerHTML = '<option value="Único">Único</option>';
  } else {
    selectTipo.innerHTML =
      '<option value="">Seleccioná un tipo</option>' +
      '<option value="General">General</option>' +
      '<option value="VIP">VIP</option>' +
      '<option value="Palco">Palco</option>';
  }

  const options = Array.from(selectTipo.options).map(o => o.value);
  if (options.includes(currentVal)) {
    selectTipo.value = currentVal;
  }
}

function leerParametrosURL() {
  const params = new URLSearchParams(window.location.search);
  const abono = params.get('abono');
  if (!abono) return;

  const selectEvento = getElemento('evento-select');
  if (!selectEvento) return;

  const idx = EVENTOS.findIndex(e => e.esAbono && e.abonoKey === abono);
  if (idx >= 0) {
    selectEvento.value = idx;
    actualizarTiposEntrada();
    actualizarInfoEvento();
    calcularTotal();
  }
}

function actualizarInfoEvento() {
  const select = getElemento('evento-select');
  const idx = parseInt(select.value, 10);

  const campos = {
    'evento-desc': '',
    'evento-fecha': '',
    'evento-ubicacion': '',
    'evento-artista': '',
    'evento-genero': '',
    'evento-horario': '',
    'evento-disponibles': ''
  };

  if (!isNaN(idx) && idx >= 0 && idx < EVENTOS.length) {
    const ev = EVENTOS[idx];
    const fechaFormateada = new Date(ev.fecha + 'T00:00:00').toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    campos['evento-desc'] = ev.descripcion;
    campos['evento-fecha'] = fechaFormateada;
    campos['evento-ubicacion'] = `${ev.lugar}, ${ev.ciudad}`;
    campos['evento-artista'] = ev.artista;
    campos['evento-genero'] = ev.genero;
    campos['evento-horario'] = ev.horario;
    campos['evento-disponibles'] =
      `${ev.entradas_disponibles.toLocaleString('es-AR')} entradas disponibles`;
  }

  Object.entries(campos).forEach(([id, texto]) => {
    const el = getElemento(id);
    if (el) el.textContent = texto;
  });

  actualizarResumen();
  calcularTotal();
}

function calcularTotal() {
  const selectEvento = getElemento('evento-select');
  const selectTipo = getElemento('tipo-entrada');
  const inputCant = getElemento('cantidad');
  const totalSpan = getElemento('precio-total');

  if (!selectEvento || !selectTipo || !inputCant || !totalSpan) return;

  const idx = parseInt(selectEvento.value, 10);
  const tipo = selectTipo.value;
  const cant = parseInt(inputCant.value, 10);

  if (isNaN(idx) || idx < 0 || !tipo || isNaN(cant) || cant < MIN_ENTRADAS) {
    totalSpan.textContent = '$0';
    actualizarResumen();
    return;
  }

  const ev = EVENTOS[idx];
  let multiplicador = 1;
  if (!ev.esAbono) {
    multiplicador = TIPOS_ENTRADA[tipo] || 1;
  }
  const total = ev.precio * multiplicador * cant;

  totalSpan.textContent = `$${total.toLocaleString('es-AR')}`;
  actualizarResumen();
}

function validarNombre(v) {
  if (!v) return 'El nombre completo es obligatorio';
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,}$/.test(v))
    return 'Solo letras y espacios, mínimo 3 caracteres';
  return '';
}

function validarEmail(v) {
  if (!v) return 'El correo electrónico es obligatorio';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
    return 'Ingresá un correo electrónico válido (ej: usuario@dominio.com)';
  return '';
}

function validarTelefono(v) {
  if (!v) return 'El número de teléfono es obligatorio';
  if (!/^\d{10}$/.test(v)) return 'Debe contener exactamente 10 dígitos numéricos';
  return '';
}

function validarFechaNac(v) {
  if (!v) return 'La fecha de nacimiento es obligatoria';

  if (!/^(\d{2})\/(\d{2})\/(\d{4})$/.test(v)) {
    return 'Formato inválido. Usá dd/mm/yyyy (ej: 15/06/1998)';
  }

  const partes = v.split('/');
  const dia = parseInt(partes[0], 10);
  const mes = parseInt(partes[1], 10) - 1;
  const anio = parseInt(partes[2], 10);

  const hoy = new Date();
  if (anio < 1900 || anio > hoy.getFullYear()) return 'Año inválido';

  const fechaNac = new Date(anio, mes, dia);
  if (
    fechaNac.getFullYear() !== anio ||
    fechaNac.getMonth() !== mes ||
    fechaNac.getDate() !== dia
  ) {
    return 'La fecha no es válida';
  }

  const edad = hoy.getFullYear() - anio;
  const diffMes = hoy.getMonth() - mes;
  const diffDia = hoy.getDate() - dia;
  let edadReal = edad;
  if (diffMes < 0 || (diffMes === 0 && diffDia < 0)) {
    edadReal--;
  }

  if (edadReal < 18) return 'Debés tener al menos 18 años para comprar entradas';

  return '';
}

function validarPais(v) {
  if (!v) return 'Seleccioná tu país de residencia';
  return '';
}

function validarCantidad(v) {
  if (!v) return 'Indicá la cantidad de entradas';
  const n = parseInt(v, 10);
  if (isNaN(n) || n < MIN_ENTRADAS || n > MAX_ENTRADAS)
    return `La cantidad debe ser entre ${MIN_ENTRADAS} y ${MAX_ENTRADAS}`;
  return '';
}

function formatearTarjeta(valor) {
  const digitos = valor.replace(/\D/g, '');
  const esAmex = /^3[47]/.test(digitos);
  const maxDig = esAmex ? 15 : 16;
  const recortado = digitos.slice(0, maxDig);
  const partes = [];
  if (esAmex) {
    partes.push(recortado.substring(0, 4));
    if (recortado.length > 4) partes.push(recortado.substring(4, 10));
    if (recortado.length > 10) partes.push(recortado.substring(10, 15));
  } else {
    for (let i = 0; i < recortado.length; i += 4) {
      partes.push(recortado.substring(i, i + 4));
    }
  }
  return partes.join(' ');
}

function validarTarjeta(v) {
  if (!v) return 'El número de tarjeta es obligatorio';
  const limpio = v.replace(/\s/g, '');
  if (!/^\d+$/.test(limpio)) return 'Solo números y espacios';

  const len = limpio.length;
  const prefix = limpio.substring(0, 2);

  if (limpio[0] === '4') {
    if (len !== 16) return 'Visa debe tener 16 dígitos';
    tarjetaDetectada = 'visa';
    return '';
  }

  if (/^5[1-5]/.test(limpio)) {
    if (len !== 16) return 'MasterCard debe tener 16 dígitos';
    tarjetaDetectada = 'mastercard';
    return '';
  }

  if (/^3[47]/.test(limpio)) {
    if (len !== 15) return 'American Express debe tener 15 dígitos';
    tarjetaDetectada = 'amex';
    return '';
  }

  tarjetaDetectada = null;
  return 'Debe ser Visa (4), MasterCard (5) o American Express (34/37)';
}

function validarVencimiento(v) {
  if (!v) return 'La fecha de vencimiento es obligatoria';
  if (!/^\d{2}\/\d{2}$/.test(v)) return 'Formato MM/AA (ej: 12/28)';

  const partes = v.split('/');
  const mes = parseInt(partes[0], 10);
  const anio = parseInt(partes[1], 10) + 2000;

  if (mes < 1 || mes > 12) return 'El mes debe estar entre 01 y 12';

  const ahora = new Date();
  const venc = new Date(anio, mes, 0);
  if (venc < ahora) return 'La tarjeta está vencida';

  return '';
}

function validarCVV(v) {
  if (!v) return 'El CVV es obligatorio';

  if (tarjetaDetectada === 'amex') {
    if (!/^\d{4}$/.test(v)) return 'American Express requiere 4 dígitos de CVV';
  } else {
    if (!/^\d{3,4}$/.test(v)) return 'El CVV debe tener 3 o 4 dígitos';
  }

  return '';
}

function validarNombreTarjeta(v) {
  if (!v) return 'El nombre en la tarjeta es obligatorio';
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,}$/.test(v))
    return 'Solo letras y espacios, mínimo 3 caracteres';
  return '';
}

const VALIDACIONES = {
  'nombre-completo': validarNombre,
  'email': validarEmail,
  'telefono': validarTelefono,
  'fecha-nac': validarFechaNac,
  'pais': validarPais,
  'evento-select': (v) => (!v ? 'Seleccioná un evento' : ''),
  'tipo-entrada': (v) => (!v ? 'Seleccioná un tipo de entrada' : ''),
  'cantidad': validarCantidad,
  'num-tarjeta': validarTarjeta,
  'vencimiento': validarVencimiento,
  'cvv': validarCVV,
  'nombre-tarjeta': validarNombreTarjeta
};

function validarCampo(id) {
  const campo = getElemento(id);
  if (!campo) return false;
  const v = valor(campo);
  const fn = VALIDACIONES[id];
  if (!fn) return false;

  if (id === 'cvv' && !tarjetaDetectada) {
    mostrarError(id, 'Primero ingresá un número de tarjeta válido');
    return false;
  }

  const error = fn(v);
  if (error) {
    mostrarError(id, error);
    return false;
  }
  mostrarExito(id);
  return true;
}

function validarTodo() {
  const ids = Object.keys(VALIDACIONES);
  const resultados = ids.map((id) => validarCampo(id));
  const todosValidos = resultados.every(Boolean);
  actualizarEstadoBoton(todosValidos);
  return todosValidos;
}

function actualizarEstadoBoton(forzarValido) {
  const btn = getElemento('btn-pagar');
  const msg = getElemento('btn-error');
  if (!btn) return;

  let todoValido = forzarValido === true || forzarValido === false ? forzarValido : true;

  if (forzarValido === undefined) {
    const ids = Object.keys(VALIDACIONES);
    todoValido = ids.every((id) => {
      const campo = getElemento(id);
      if (!campo) return true;
      return campo.classList.contains('valido');
    });
  }

  btn.disabled = !todoValido;
  if (msg) {
    msg.style.display = todoValido ? 'none' : 'block';
  }
}

function detectarTarjeta(pan) {
  const contenedor = getElemento('card-brand');
  if (!contenedor) return;

  const limpio = pan.replace(/\s/g, '');
  let marca = null;
  let clase = '';
  let nombre = '';

  if (/^4/.test(limpio) && limpio.length >= 1) {
    marca = 'visa';
    clase = 'fab fa-cc-visa';
    nombre = 'Visa';
  } else if (/^5[1-5]/.test(limpio) && limpio.length >= 2) {
    marca = 'mastercard';
    clase = 'fab fa-cc-mastercard';
    nombre = 'MasterCard';
  } else if (/^3[47]/.test(limpio) && limpio.length >= 2) {
    marca = 'amex';
    clase = 'fab fa-cc-amex';
    nombre = 'American Express';
  }

  if (marca && limpio.length >= 4) {
    contenedor.innerHTML = `<i class="${clase}" style="font-size:2.5rem;color:var(--teal)"></i>
      <span style="font-size:0.8rem;color:var(--claro);margin-top:4px">${nombre}</span>`;
    contenedor.style.display = 'flex';
  } else {
    contenedor.style.display = 'none';
  }

  actualizarCardBrand(marca);
}

function actualizarCardNumero(pan) {
  const el = getElemento('card-display-number');
  if (!el) return;
  const limpio = pan.replace(/\D/g, '');
  let mostrar = '•••• •••• •••• ••••';
  if (limpio.length > 0) {
    const visible = limpio.slice(-4);
    const masked = limpio.slice(0, -4).replace(/./g, '•');
    const partes = [];
    const total = masked + visible;
    for (let i = 0; i < total.length; i += 4) {
      partes.push(total.substring(i, i + 4));
    }
    mostrar = partes.join(' ');
  }
  el.textContent = mostrar;
}

function actualizarCardNombre(valor) {
  const el = getElemento('card-display-name');
  if (!el) return;
  el.textContent = valor.toUpperCase() || 'TU NOMBRE';
}

function actualizarCardVenc(valor) {
  const el = getElemento('card-display-exp');
  if (!el) return;
  el.textContent = valor || 'MM/AA';
}

function actualizarCardCvv(valor) {
  const el = getElemento('card-display-cvv');
  if (!el) return;
  const v = valor.replace(/\D/g, '');
  el.textContent = v || '•••';
}

function actualizarCardBrand(marca) {
  const logo = getElemento('card-brand-logo');
  if (!logo) return;
  if (marca === 'visa') {
    logo.innerHTML = '<i class="fab fa-cc-visa"></i>';
  } else if (marca === 'mastercard') {
    logo.innerHTML = '<i class="fab fa-cc-mastercard"></i>';
  } else if (marca === 'amex') {
    logo.innerHTML = '<i class="fab fa-cc-amex"></i>';
  } else {
    logo.innerHTML = '<i class="fas fa-credit-card"></i>';
  }
}

function actualizarResumen() {
  const resumen = getElemento('resumen-contenido');
  if (!resumen) return;

  const nombre = valor(getElemento('nombre-completo'));
  const email = valor(getElemento('email'));
  const idx = parseInt(getElemento('evento-select')?.value, 10);
  const tipo = getElemento('tipo-entrada')?.value || '';
  const cant = parseInt(getElemento('cantidad')?.value, 10);
  const pais = valor(getElemento('pais'));
  const tipoPago = tarjetaDetectada
    ? { visa: 'Visa', mastercard: 'MasterCard', amex: 'American Express' }[tarjetaDetectada]
    : '—';

  let totalTexto = '$0';
  if (!isNaN(idx) && idx >= 0 && tipo && !isNaN(cant) && cant >= 1) {
    const ev = EVENTOS[idx];
    const mult = ev.esAbono ? 1 : (TIPOS_ENTRADA[tipo] || 1);
    totalTexto = `$${(ev.precio * mult * cant).toLocaleString('es-AR')} ARS`;
  }

  const eventoTexto = !isNaN(idx) && idx >= 0 ? EVENTOS[idx].evento : '—';

  if (!nombre && !email && idx === undefined) {
    resumen.innerHTML = '<p style="color:var(--mutado);font-style:italic">Completá el formulario para ver el resumen de tu compra.</p>';
    return;
  }

  resumen.innerHTML = `
    <div class="resumen-item"><span class="resumen-label">Comprador</span><span>${nombre || '—'}</span></div>
    <div class="resumen-item"><span class="resumen-label">Email</span><span>${email || '—'}</span></div>
    <div class="resumen-item"><span class="resumen-label">País</span><span>${pais || '—'}</span></div>
    <div class="resumen-item"><span class="resumen-label">Evento</span><span>${eventoTexto}</span></div>
    <div class="resumen-item"><span class="resumen-label">Tipo</span><span>${tipo || '—'}</span></div>
    <div class="resumen-item"><span class="resumen-label">Cantidad</span><span>${!isNaN(cant) && cant >= 1 ? cant : '—'}</span></div>
    <div class="resumen-item"><span class="resumen-label">Tarjeta</span><span>${tipoPago}</span></div>
    <div class="resumen-item resumen-total"><span class="resumen-label">Total</span><span>${totalTexto}</span></div>
  `;
}

function iniciarContador(elem) {
  if (!elem) return;

  segundosRestantes = 900;

  function formatearTiempo(seg) {
    const m = Math.floor(seg / 60);
    const s = seg % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function actualizarDisplay() {
    if (!elem) return;
    elem.textContent = formatearTiempo(segundosRestantes);

    if (segundosRestantes <= 120) {
      elem.style.color = '#ef4444';
    } else if (segundosRestantes <= 300) {
      elem.style.color = '#f59e0b';
    } else {
      elem.style.color = 'var(--teal)';
    }
  }

  if (temporizador) {
    clearInterval(temporizador);
  }

  actualizarDisplay();

  temporizador = setInterval(function () {
    segundosRestantes--;

    if (segundosRestantes <= 0) {
      clearInterval(temporizador);
      temporizador = null;
      if (elem) {
        elem.textContent = '00:00';
        elem.style.color = '#ef4444';
      }

      const btn = getElemento('btn-pagar');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Tiempo Expirado';
      }
      const msg = getElemento('btn-error');
      if (msg) {
        msg.textContent = 'El tiempo para completar la compra ha expirado. Recargá la página para iniciar una nueva.';
        msg.style.display = 'block';
      }
      return;
    }

    actualizarDisplay();
  }, 1000);
}

function detenerContador() {
  if (temporizador) {
    clearInterval(temporizador);
    temporizador = null;
  }
}

function procesarCompra(e) {
  e.preventDefault();

  const todoValido = validarTodo();
  if (!todoValido) return;

  detenerContador();

  const modal = getElemento('modal-exito');
  const detalles = getElemento('modal-detalles');
  if (!modal || !detalles) return;

  const idx = parseInt(getElemento('evento-select').value, 10);
  const ev = EVENTOS[idx];
  const tipo = getElemento('tipo-entrada').value;
  const cant = parseInt(getElemento('cantidad').value, 10);
  const mult = ev.esAbono ? 1 : (TIPOS_ENTRADA[tipo] || 1);
  const total = ev.precio * mult * cant;

  const fechaLegible = new Date(ev.fecha + 'T00:00:00').toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  detalles.innerHTML = `
    <p><strong>Comprador:</strong> ${valor(getElemento('nombre-completo'))}</p>
    <p><strong>Evento:</strong> ${ev.evento}</p>
    <p><strong>Fecha:</strong> ${fechaLegible}</p>
    <p><strong>Artistas:</strong> ${ev.artista}</p>
    <p><strong>Tipo de entrada:</strong> ${tipo}</p>
    <p><strong>Cantidad:</strong> ${cant}</p>
    <p><strong>Total pagado:</strong> <span style="color:var(--teal);font-size:1.2rem">$${total.toLocaleString('es-AR')} ARS</span></p>
    <hr style="border-color:var(--borde);margin:12px 0">
    <p style="font-size:0.85rem;color:var(--mutado)">Te enviaremos la confirmación y las entradas a <strong>${valor(getElemento('email'))}</strong>.</p>
  `;

  modal.classList.add('activo');

  const btn = getElemento('btn-pagar');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Compra Exitosa';
  }
}

function cerrarModal() {
  const modal = getElemento('modal-exito');
  if (modal) modal.classList.remove('activo');
}

function configurarValidacion() {
  const idsConValidation = Object.keys(VALIDACIONES);

  idsConValidation.forEach((id) => {
    const campo = getElemento(id);
    if (!campo) return;

    campo.addEventListener('blur', function () {
      validarCampo(id);
      validarTodo();
    });

    campo.addEventListener('input', function () {
      if (id === 'num-tarjeta') {
        const formateado = formatearTarjeta(campo.value);
        if (campo.value !== formateado) {
          campo.value = formateado;
        }
        detectarTarjeta(campo.value);

        campo.maxLength = tarjetaDetectada === 'amex' ? 17 : 19;
        actualizarCardNumero(campo.value);

        const cvvCampo = getElemento('cvv');
        if (cvvCampo && valor(cvvCampo)) {
          validarCampo('cvv');
        }
      }
      if (id === 'vencimiento') {
        actualizarCardVenc(valor(campo));
      }
      if (id === 'nombre-tarjeta') {
        actualizarCardNombre(valor(campo));
      }
      if (id === 'cvv') {
        actualizarCardCvv(valor(campo));
      }
      if (id === 'cantidad' || id === 'tipo-entrada' || id === 'evento-select') {
        calcularTotal();
      }
      actualizarResumen();

      if (campo.classList.contains('invalido') || campo.classList.contains('valido')) {
        validarCampo(id);
        validarTodo();
      }
    });

    if (campo.tagName === 'SELECT') {
      campo.addEventListener('change', function () {
        validarCampo(id);
        validarTodo();
        if (id === 'evento-select') {
          actualizarInfoEvento();
          actualizarTiposEntrada();
        }
        if (id === 'tipo-entrada' || id === 'evento-select') {
          calcularTotal();
        }
        actualizarResumen();
      });
    }
  });

  const fechaNacInput = getElemento('fecha-nac');
  if (fechaNacInput) {
    fechaNacInput.addEventListener('input', function () {
      let v = this.value.replace(/[^\d]/g, '');
      if (v.length > 2 && v.length <= 4) {
        v = v.substring(0, 2) + '/' + v.substring(2);
      } else if (v.length > 4) {
        v = v.substring(0, 2) + '/' + v.substring(2, 4) + '/' + v.substring(4, 8);
      }
      this.value = v;
    });
  }

  const vencInput = getElemento('vencimiento');
  if (vencInput) {
    vencInput.addEventListener('input', function () {
      let v = this.value.replace(/[^\d]/g, '');
      if (v.length > 2) {
        v = v.substring(0, 2) + '/' + v.substring(2, 4);
      }
      this.value = v;
    });
  }
}

function configurarListeners() {

  const btn = getElemento('btn-pagar');
  const form = getElemento('form-compra');
  if (form) {
    form.addEventListener('submit', procesarCompra);
  }

  const modalCerrar = getElemento('modal-cerrar');
  if (modalCerrar) {
    modalCerrar.addEventListener('click', cerrarModal);
  }

  const modal = getElemento('modal-exito');
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) cerrarModal();
    });
  }

  const cantInput = getElemento('cantidad');
  if (cantInput) {
    cantInput.addEventListener('keydown', function (e) {
      if (
        !/^\d$/.test(e.key) &&
        e.key !== 'Backspace' &&
        e.key !== 'Delete' &&
        e.key !== 'Tab' &&
        e.key !== 'ArrowLeft' &&
        e.key !== 'ArrowRight' &&
        e.key !== 'Home' &&
        e.key !== 'End'
      ) {
        e.preventDefault();
      }
    });
  }

  const telInput = getElemento('telefono');
  if (telInput) {
    telInput.addEventListener('keydown', function (e) {
      if (
        !/^\d$/.test(e.key) &&
        e.key !== 'Backspace' &&
        e.key !== 'Delete' &&
        e.key !== 'Tab' &&
        e.key !== 'ArrowLeft' &&
        e.key !== 'ArrowRight' &&
        e.key !== 'Home' &&
        e.key !== 'End'
      ) {
        e.preventDefault();
      }
    });
  }

  const tarjetaInput = getElemento('num-tarjeta');
  if (tarjetaInput) {
    tarjetaInput.addEventListener('keydown', function (e) {
      if (
        !/^\d$/.test(e.key) &&
        e.key !== ' ' &&
        e.key !== 'Backspace' &&
        e.key !== 'Delete' &&
        e.key !== 'Tab' &&
        e.key !== 'ArrowLeft' &&
        e.key !== 'ArrowRight' &&
        e.key !== 'Home' &&
        e.key !== 'End'
      ) {
        e.preventDefault();
      }
    });
  }

  const cvvInput = getElemento('cvv');
  if (cvvInput) {
    cvvInput.addEventListener('keydown', function (e) {
      if (
        !/^\d$/.test(e.key) &&
        e.key !== 'Backspace' &&
        e.key !== 'Delete' &&
        e.key !== 'Tab' &&
        e.key !== 'ArrowLeft' &&
        e.key !== 'ArrowRight' &&
        e.key !== 'Home' &&
        e.key !== 'End'
      ) {
        e.preventDefault();
      }
    });

    cvvInput.addEventListener('focus', function () {
      const card = getElemento('card-visual');
      if (card) card.classList.add('volteada');
    });

    cvvInput.addEventListener('blur', function () {
      const card = getElemento('card-visual');
      if (card) card.classList.remove('volteada');
    });
  }
}

}

if (document.getElementById('form-compra')) {
  iniciarCompra();
}
