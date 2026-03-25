export let objetos = null;
export function setObjetos(val) { objetos = val; }
export function getObjetos() { return objetos; }

export let logros = null;
export function setLogros(val) { logros = val;}
export function getLogros() { return logros;}

export let jugador = null;
export function setUser(val) { jugador = val; }
export function getUser() { return jugador; }

export let objetos_jugador = null;
export function setObjetosUser(val) { objetos_jugador = val; }
export function getObjetosUser() { return objetos_jugador; }

export let personajeHumanoEnUso = 'personaje1';
export let personajeGatoEnUso = 'gato1';
export let ApartadoMenu = true;

export function setPersonajeHumanoEnUso(val) { personajeHumanoEnUso = val; }
export function setPersonajeGatoEnUso(val) { personajeGatoEnUso = val; }
export function setApartadoMenu(val) { ApartadoMenu = val; }

export let dialogosRecuperados = null;
export function setDialogosRecuperados(val) { dialogosRecuperados = val; }

// 🎬 Actualizar puntos en el DOM del header
export function actualizarPuntosDOM(nuevoPuntos) {
  const puntosDisplay = document.getElementById('puntos-display');
  if (puntosDisplay) {
    puntosDisplay.textContent = nuevoPuntos;
  }
}

export function setPuntosTotales(valor) {
    puntosTotales = valor;
    // Actualizar DOM del header
    actualizarPuntosDOM(valor);
}
export let nombre='Carlitos';
export let objetosActivos = [];

export let objetosDelPersonaje = {}
export let datosObjetos = {};//buscar por posicion o algun campo del objeto
// Fetch dialogosRecuperados globally and set
export async function fetchDialogosRecuperados() {
    try {
        const res = await fetch('/Juego/api/obtener_dialogos.php');
        const data = await res.json();
        if (data && !data.error) {
            setDialogosRecuperados(data);
        }
    } catch (e) {
        console.error('Error fetching dialogos:', e);
    }
}
// Variable local para puntos aún no guardados en la BD
export let puntos = 0;

// Variable para el total de puntos (local + BD)
export let puntosTotales = 0;

// Función para actualizar el total de puntos
export function actualizarPuntosTotales(jugador) {
    // jugadores.puntos es string, puntos es number
    const puntosBD = parseInt(jugador.puntos || "0", 10);
    puntosTotales = puntos + puntosBD;
    return puntosTotales;
}

export let todosEnemigosVencidos = false;

// 🔥 Detectar si hay sesión activa
export function usuarioAutenticado() {
    return document.body.dataset.usuario === "1"; 
    // 👆 esto lo pondrás desde PHP
}

// 📦 Guardado temporal (para invitados)
export function guardarObjetoLocal(objeto) {
    let inventario = JSON.parse(localStorage.getItem('inventario_temp')) || {};

    inventario[objeto.id] = objeto;

    localStorage.setItem('inventario_temp', JSON.stringify(inventario));

    console.log("Objeto guardado LOCAL:", objeto);
}

// ☁️ Guardado en BD
export async function guardarObjetoBD(objeto_id) {
    try {
        const res = await fetch('/Juego/api/guardar_objeto_usuario.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ objeto_id })
        });

        if (res.status === 401) {
            throw new Error("No autenticado");
        }

        const data = await res.json();

        if (data.error) {
            throw new Error(data.error);
        }

        console.log("Objeto guardado BD:", data);

    } catch (err) {
        console.warn("Fallo BD, fallback local:", err.message);
        return false;
    }

    return true;
}

export let logros_jugador = [];

// Cargar logros locales (para invitado)
export function cargarLogrosLocales() {
  const data = localStorage.getItem('logros_invitado');
  logros_jugador = data ? JSON.parse(data) : [];
}

// Guardar logro local
export function guardarLogroLocal(logro_id) {
  if (!logros_jugador.includes(logro_id)) {
    logros_jugador.push(logro_id);
    localStorage.setItem('logros_invitado', JSON.stringify(logros_jugador));
  }
}

// 📦 Guardar puntos localmente (para invitados)
export function guardarPuntosLocal(cantidad) {
  const puntosActuales = parseInt(localStorage.getItem('puntos_invitado') || '0', 10);
  const nuevoTotal = puntosActuales + cantidad;
  localStorage.setItem('puntos_invitado', nuevoTotal.toString());
  puntos = nuevoTotal;
  puntosTotales = nuevoTotal;
  // Actualizar DOM del header
  actualizarPuntosDOM(nuevoTotal);
  console.log("Puntos guardados LOCAL: +", cantidad, "Total:", nuevoTotal);
  return nuevoTotal;
}

// ☁️ Actualizar puntos en BD
export async function actualizarPuntosBD(cantidad) {
  try {
    const res = await fetch('/Juego/api/actualizar_puntos.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: jugador?.email,
        puntos: (parseInt(jugador?.puntos || '0', 10)) + cantidad 
      })
    });

    const data = await res.json();
    
    if (data.success) {
      console.log("Puntos guardados BD: +", cantidad, "Total:", data.puntos);
      // Actualizar puntos locales también
      puntosTotales = data.puntos;
      if (jugador) {
        jugador.puntos = data.puntos.toString();
      }
      // Actualizar DOM del header
      actualizarPuntosDOM(data.puntos);
      return true;
    } else {
      console.warn("Error al guardar puntos en BD:", data.error);
      return false;
    }
  } catch (err) {
    console.error("Error AJAX guardar puntos:", err);
    return false;
  }
}

// 🎁 Obtener datos del logro por ID
export function extraerDatosLogroPorId(logro_id) {
  if (!logros || !Array.isArray(logros)) {
    return null;
  }
  return logros.find(logro => logro.id === logro_id) || null;
}

// 🎊 Función unificada para sumar puntos del logro
export async function sumarPuntosLogro(logro_id) {
  const datosLogro = extraerDatosLogroPorId(logro_id);
  
  if (!datosLogro) {
    console.warn("Logro no encontrado:", logro_id);
    return false;
  }

  const puntosAGanar = parseInt(datosLogro.puntos || '0', 10);
  
  if (puntosAGanar <= 0) {
    console.log("El logro no otorga puntos");
    return true;
  }

  if (usuarioAutenticado()) {
    return await actualizarPuntosBD(puntosAGanar);
  } else {
    guardarPuntosLocal(puntosAGanar);
    return true;
  }
}
