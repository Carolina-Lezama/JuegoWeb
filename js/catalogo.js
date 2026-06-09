/**
 * Controlador del Catálogo de Juegos
 * Maneja el filtrado por categorías y la búsqueda por texto de manera unificada.
 */

document.addEventListener("DOMContentLoaded", () => {
    const botonesCategoria = document.querySelectorAll(".categories button");
    const buscador = document.querySelector(".search");
    
    // Basado en nuestro refactor de catalogo.php, iteramos directamente sobre el enlace contenedor
    const juegosContenedores = document.querySelectorAll(".game-link"); 

    // 1. ESTADO GLOBAL DE LOS FILTROS
    // Mantiene en memoria qué estamos buscando y en qué categoría estamos
    const estadoFiltros = {
        categoria: "all",
        busqueda: ""
    };

    // 2. EVENTO: Filtrado por Categoría
    botonesCategoria.forEach(boton => {
        boton.addEventListener("click", (e) => {
            // Feedback UI: Quitamos la clase 'active' de todos y se la ponemos al presionado
            botonesCategoria.forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");

            // Actualizamos el estado y disparamos el render
            estadoFiltros.categoria = e.target.dataset.filter;
            aplicarFiltrosUnificados();
        });
    });

    // 3. EVENTO: Búsqueda por Texto (Con Debounce)
    let debounceTimer;
    if (buscador) {
        buscador.addEventListener("input", (e) => {
            // Limpiamos el temporizador anterior si el usuario sigue escribiendo
            clearTimeout(debounceTimer);
            
            // Solo ejecutamos la búsqueda 300ms después de que el usuario deje de teclear
            debounceTimer = setTimeout(() => {
                estadoFiltros.busqueda = e.target.value.toLowerCase().trim();
                aplicarFiltrosUnificados();
            }, 300); 
        });
    }

    // 4. FUNCIÓN CENTRAL DE RENDERIZADO
    function aplicarFiltrosUnificados() {
        juegosContenedores.forEach(enlace => {
            const tarjeta = enlace.querySelector(".game-card");
            if (!tarjeta) return;

            const categoriasArray = tarjeta.dataset.category || "";
            const titulo = tarjeta.querySelector("h3")?.textContent.toLowerCase() || "";

            // Evaluamos ambas condiciones
            const cumpleCategoria = estadoFiltros.categoria === "all" || categoriasArray.includes(estadoFiltros.categoria);
            const cumpleBusqueda = estadoFiltros.busqueda === "" || titulo.includes(estadoFiltros.busqueda);

            // El juego SOLO se muestra si cumple con la categoría seleccionada Y con la búsqueda
            if (cumpleCategoria && cumpleBusqueda) {
                enlace.style.display = "";
            } else {
                enlace.style.display = "none";
            }
        });
    }
});