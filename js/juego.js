
document.addEventListener("DOMContentLoaded", () => {

    fetch('../api/obtener_logros.php')
        .then(res => res.json())
        .then(data => {
            const contenedor = document.getElementById("logros-container");
            contenedor.innerHTML = "";

            if (!data || data.error) {
                contenedor.innerHTML = "<p>No se pudieron cargar los logros</p>";
                return;
            }

            if (data.length === 0) {
                contenedor.innerHTML = "<p>Aún no tienes logros desbloqueados</p>";
                // Actualizar contador de logros en el header
                document.getElementById('logros-count').textContent = '0';
                return;
            }

            // Actualizar contador de logros en el header
            document.getElementById('logros-count').textContent = data.length;

            const rutaBase = "../assets/static/Logros/"; 

            data.forEach(logro => {

                const card = document.createElement("div");
                card.classList.add("logro-card", logro.tipo.toLowerCase());

                // Si imagen ya es URL completa, usa directo
                const imgSrc = logro.imagen.startsWith("http")
                    ? logro.imagen
                    : rutaBase + logro.imagen;

                card.innerHTML = `
                    <div class="logro-img">
                        <img src="${imgSrc}" alt="${logro.nombre}">
                    </div>

                    <div class="logro-info">
                        <h4>${logro.nombre}</h4>
                        <p>${logro.descripcion}</p>

                        <div class="logro-extra">
                            <span class="tipo">${logro.tipo}</span>
                            <span class="puntos">+${logro.puntos} pts</span>
                        </div>
                    </div>
                `;

                contenedor.appendChild(card);
            });
        })
        .catch(err => console.error(err));

});
