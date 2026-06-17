/**
 * Controlador de Interfaz de Usuario (UI) externa al juego Phaser.
 * Maneja modales, botones del DOM y llamadas a la API de logros.
 */

// Estado global de la UI
const UIState = {
    modalConfirmado: false,
    accionEnCurso: null
};

document.addEventListener("DOMContentLoaded", () => {
    initModalSystem();
    loadAchievements();
});

// ==========================================
// SISTEMA DE MODALES
// ==========================================
function initModalSystem() {
    const btnConfirmarSi = document.getElementById('btnConfirmarSi');
    const btnConfirmarNo = document.getElementById('btnConfirmarNo');
    const btnReiniciar = document.getElementById('btnReiniciar');
    const btnSalir = document.getElementById('btnSalir');

    if (btnConfirmarSi) {
        btnConfirmarSi.addEventListener('click', manejarConfirmacionSi);
    }
    
    if (btnConfirmarNo) {
        btnConfirmarNo.addEventListener('click', cerrarModal);
    }

    if (btnReiniciar) {
        btnReiniciar.addEventListener('click', () => {
            mostrarModal('Reiniciar Juego', '¿Estás seguro de que deseas reiniciar tu progreso actual?', 'reiniciar');
        });
    }

    if (btnSalir) {
        btnSalir.addEventListener('click', () => {
            mostrarModal('Salir del Juego', '¿Deseas salir del juego? Se cerrará tu sesión.', 'salir');
        });
    }
}

function mostrarModal(titulo, mensaje, accion) {
    document.getElementById('modalTitulo').textContent = titulo;
    document.getElementById('modalMensaje').textContent = mensaje;
    
    UIState.accionEnCurso = accion;
    UIState.modalConfirmado = false;
    
    document.getElementById('modalConfirmacion').classList.add('mostrar');
}

function cerrarModal() {
    document.getElementById('modalConfirmacion').classList.remove('mostrar');
    UIState.accionEnCurso = null;
}

function manejarConfirmacionSi() {
    if (UIState.accionEnCurso === 'reiniciar') {
        location.reload();
    } else if (UIState.accionEnCurso === 'salir') {
        window.location.href = 'cerrar.php';
    }
    cerrarModal();
}

// ==========================================
// SISTEMA DE LOGROS (API)
// ==========================================
// ==========================================
// SISTEMA DE LOGROS (API)
// ==========================================
async function loadAchievements() {
    const contenedor = document.getElementById("logros-container");
    const countDisplay = document.getElementById('logros-count');
    
    if (!contenedor) return;
    
    try {
        const res = await fetch('../api/obtener_logros.php');
        const response = await res.json();

        contenedor.innerHTML = ""; // Limpiar estado de carga

        // Validamos la nueva estructura estandarizada (success)
        if (!response || !response.success) {
            contenedor.innerHTML = "<p>No se pudieron cargar los logros.</p>";
            return;
        }

        // Extraemos el arreglo real de logros
        const listaLogros = response.data;

        // Validamos que 'listaLogros' sea un arreglo válido
        if (!Array.isArray(listaLogros) || listaLogros.length === 0) {
            contenedor.innerHTML = "<p>Aún no tienes logros desbloqueados.</p>";
            if (countDisplay) countDisplay.textContent = '0';
            return;
        }

        // Actualizar contador visual
        if (countDisplay) countDisplay.textContent = listaLogros.length;
        
        renderAchievements(listaLogros, contenedor);

    } catch (err) {
        console.error("Error cargando logros:", err);
        contenedor.innerHTML = "<p>Error de conexión al cargar logros.</p>";
    }
}

function renderAchievements(logros, contenedor) {
    const rutaBase = "../assets/static/Logros/"; 

    logros.forEach(logro => {
        const card = document.createElement("div");
        const tipoClase = logro.tipo ? logro.tipo.toLowerCase() : 'default';
        card.classList.add("logro-card", tipoClase);

        // 🔥 NUEVA LÓGICA ESTANDARIZADA: 
        // Agregamos la extensión .png dinámicamente desde el frontend
        const imgSrc = logro.imagen.startsWith("http") 
            ? logro.imagen 
            : rutaBase + logro.imagen + ".png";

        card.innerHTML = `
            <div class="logro-img">
                <img src="${imgSrc}" alt="${logro.nombre}">
            </div>
            <div class="logro-info">
                <h4>${logro.nombre}</h4>
                <p>${logro.descripcion}</p>
                <div class="logro-extra">
                    <span class="tipo">${logro.tipo || 'General'}</span>
                    <span class="puntos">+${logro.puntos || 0} pts</span>
                </div>
            </div>
        `;
        contenedor.appendChild(card);
    });
}