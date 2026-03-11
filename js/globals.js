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

export function setPuntosTotales(valor) {
    puntosTotales = valor;
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
