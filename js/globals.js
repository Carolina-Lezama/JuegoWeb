/**
 * Gestor de Estado Global (Single Source of Truth)
 * Centraliza los datos del jugador, inventario y progreso.
 */

// 1. ESTADO PRIVADO (Nadie puede modificar esto directamente desde afuera)
const state = {
    usuarioAutenticado: document.body.dataset.usuario === "1",
    jugador: null,
    
    // Progresión
    puntosLocales: 0,
    puntosTotales: 0,
    logrosDesbloqueados: [],
    
    // Inventario y Configuración
    objetosGlobales: [],
    objetosJugador: [],
    objetosDelPersonaje: {},
    objetosActivos: [],
    
    // Personajes
    personajeHumanoEnUso: 'personaje1',
    personajeGatoEnUso: 'gato1',
    
    // Textos y Flags
    dialogos: null,
    apartadoMenu: true,
    todosEnemigosVencidos: false
};

// 2. GETTERS Y SETTERS BÁSICOS
export const getState = () => state;

export const setUser = (val) => { state.jugador = val; };
export const setObjetos = (val) => { state.objetosGlobales = val; };
export const setObjetosUser = (val) => { state.objetosJugador = val; };
export const setDialogosRecuperados = (val) => { state.dialogos = val; };
export const setLogros = (val) => { state.logrosGlobales = val; };

export const setPersonajesEnUso = (humano, gato) => {
    if (humano) state.personajeHumanoEnUso = humano;
    if (gato) state.personajeGatoEnUso = gato;
};

// 3. ACTUALIZACIÓN DE INTERFAZ (UI)
function actualizarPuntosDOM(nuevoTotal) {
    const display = document.getElementById('puntos-display');
    if (display) display.textContent = nuevoTotal;
}

// 4. LÓGICA DE PUNTOS Y LOGROS (Unificada)
export async function sumarPuntos(cantidad) {
    if (cantidad <= 0) return true;

    if (state.usuarioAutenticado) {
        return await guardarPuntosBD(cantidad);
    } else {
        return guardarPuntosLocal(cantidad);
    }
}

function guardarPuntosLocal(cantidad) {
    const puntosActuales = parseInt(localStorage.getItem('puntos_invitado') || '0', 10);
    const nuevoTotal = puntosActuales + cantidad;
    
    localStorage.setItem('puntos_invitado', nuevoTotal.toString());
    
    state.puntosLocales = nuevoTotal;
    state.puntosTotales = nuevoTotal;
    actualizarPuntosDOM(nuevoTotal);
    
    console.log(`[Local] Puntos sumados: ${cantidad}. Total: ${nuevoTotal}`);
    return true;
}

async function guardarPuntosBD(cantidad) {
    try {
        const puntosBase = parseInt(state.jugador?.puntos || '0', 10);
        const res = await fetch('/Juego/api/actualizar_puntos.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: state.jugador?.email,
                puntos: puntosBase + cantidad 
            })
        });

        const data = await res.json();
        if (data.success) {
            state.puntosTotales = data.puntos;
            if (state.jugador) state.jugador.puntos = data.puntos.toString();
            
            actualizarPuntosDOM(data.puntos);
            console.log(`[BD] Puntos sumados: ${cantidad}. Total: ${data.puntos}`);
            return true;
        }
        return false;
    } catch (err) {
        console.error("Error al guardar puntos en BD:", err);
        return false;
    }
}

export async function otorgarLogro(logroId) {
    if (!state.logrosGlobales) return false;

    const datosLogro = state.logrosGlobales.find(l => l.id === logroId);
    if (!datosLogro) return false;

    const puntosAGanar = parseInt(datosLogro.puntos || '0', 10);
    
    // Aquí podrías agregar la lógica de guardar el logro en BD/Local
    // similar a los puntos.
    
    if (puntosAGanar > 0) {
        await sumarPuntos(puntosAGanar);
    }
    return true;
}

// 5. LÓGICA DE INVENTARIO
export async function agregarObjetoInventario(objetoId) {
    if (state.usuarioAutenticado) {
        try {
            const res = await fetch('/Juego/api/guardar_objeto_usuario.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ objeto_id: objetoId })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            return true;
        } catch (err) {
            console.warn("Fallo al guardar objeto en BD:", err.message);
            return false;
        }
    } else {
        let inventario = JSON.parse(localStorage.getItem('inventario_temp')) || {};
        inventario[objetoId] = { id: objetoId, timestamp: Date.now() };
        localStorage.setItem('inventario_temp', JSON.stringify(inventario));
        return true;
    }
}

// Añadir en globals.js (cerca de la sección 5. LÓGICA DE INVENTARIO)

export function obtenerInventarioUnificado() {
    const inventario = {};
    const estado = getState();

    // Función helper para normalizar IDs (asegura que las claves sean las mismas)
    const getId = (obj) => obj.objetos_id || obj.id;

    // 1. Datos del Personaje Actual (Memoria local temporal)
    Object.values(estado.objetosDelPersonaje || {}).forEach(obj => {
        const id = getId(obj);
        if (id) inventario[id] = obj;
    });

    // 2. Base de Datos
    if (estado.usuarioAutenticado && Array.isArray(estado.objetosJugador)) {
        estado.objetosJugador.forEach(obj => {
            const id = getId(obj);
            if (id) inventario[id] = obj;
        });
    } else if (!estado.usuarioAutenticado) {
        // 3. Fallback a LocalStorage para Invitados
        try {
            const inventarioLocal = JSON.parse(localStorage.getItem('inventario_temp')) || {};
            Object.values(inventarioLocal).forEach(obj => {
                const id = getId(obj);
                if (id) inventario[id] = obj;
            });
        } catch (e) {
            console.warn("Error leyendo inventario desde localStorage");
        }
    }

    return inventario;
}

// Para la funcionalidad de "Equipar"
export function alternarObjetoActivo(id) {
    const index = state.objetosActivos.indexOf(id);
    if (index === -1) {
        if (state.objetosActivos.length < 6) { // Límite de 6 objetos equipados
            state.objetosActivos.push(id);
            return true; // Se equipó con éxito
        }
        return false; // Inventario lleno
    } else {
        // Si ya está activo, lo desequipamos
        state.objetosActivos.splice(index, 1);
        return false; 
    }
}