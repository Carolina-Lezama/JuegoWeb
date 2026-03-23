const botones = document.querySelectorAll(".categories button");
const juegos = document.querySelectorAll(".game-card");

botones.forEach(boton => {

    boton.addEventListener("click", () => {

        const filtro = boton.dataset.filter;

        juegos.forEach(juego => {

            const categorias = juego.dataset.category;
            const contenedor = juego.closest("a") || juego;

            if(filtro === "all"){

                contenedor.style.display = "";

            } else if(categorias.includes(filtro)){

                contenedor.style.display = "";

            } else {

                contenedor.style.display = "none";

            }

        });

    });

});

const buscador = document.querySelector(".search");

buscador.addEventListener("input", () => {

    const texto = buscador.value.toLowerCase();

    juegos.forEach(juego => {

        const titulo = juego.querySelector("h3").textContent.toLowerCase();
        const contenedor = juego.closest("a") || juego;

        if(titulo.includes(texto)){
            contenedor.style.display = "";
        }else{
            contenedor.style.display = "none";
        }

    });

});