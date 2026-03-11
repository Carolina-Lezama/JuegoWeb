
import { isMobile, getPosEscala, reescalarGlobalFlexible,cargarPersonajeActual, cargarGatoActual, createAndAdaptTextFlexible, extraerDatosObjetoPorId } from './responsive.js';
import { EscenaInicio } from './Scenes/EscenaInicio.js';
import { EscenaSalida } from './Scenes/EscenaSalida.js';
import { EscenaTutorialUno } from './Scenes/EscenaTutorialUno.js';
import { EscenaInventario } from './Scenes/EscenaInventario.js';
import { EscenaBosque } from './Scenes/EscenaBosque.js';
import { EscenaElegir } from './Scenes/EscenaElegir.js';
import { EscenaParteUno } from './Scenes/EscenaParteUno.js';
import { EscenaBosque2 } from './Scenes/EscenaBosque2.js';
import { EscenaCabanaAfuera } from './Scenes/EscenaCabanaAfuera.js';
import { EscenaCabanaAdentro } from './Scenes/EscenaCabanaAdentro.js';
import { EscenaMuerte } from './Scenes/EscenaMuerte.js';
import { EscenaPeleaSlime } from './Scenes/EscenaPeleaSlime.js';
import { EscenaMapa } from './Scenes/EscenaMapa.js';
import { EscenaIntroduccionUno } from './Scenes/EscenaIntroduccionUno.js';
import { EscenaLogros } from './Scenes/EscenaLogros.js';
import { EscenaMenu } from './Scenes/EscenaMenu.js';
import { EscenaFinal } from './Scenes/EscenaFinal.js';

import { EscenaCementerio } from './Scenes/EscenaCementerio.js';
import { EscenaCasaAbandonada } from './Scenes/EscenaCasaAbandonada.js';
import { EscenaCastilloIfernal } from './Scenes/EscenaCastilloIfernal.js';

import { personajeHumanoEnUso, personajeGatoEnUso, ApartadoMenu, setPersonajeHumanoEnUso, setPersonajeGatoEnUso, setApartadoMenu,setLogros,setObjetosUser,getObjetosUser, objetos_jugador, logros, getLogros, setUser } from './globals.js';
import { puntos,puntosTotales,actualizarPuntosTotales,setDialogosRecuperados, objetosDelPersonaje, datosObjetos, setObjetos, objetos, } from './globals.js';

fetch('/Juego/api/obtener_dialogos.php')
    .then(res => res.json())
    .then(data => {
        if (data && !data.error) {
            setDialogosRecuperados(data);//.introduccion_uno,introduccion_dos,introduccion_tres
    }
});

//--- ESCENA DE PRE CARGA
class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        this.load.image('fondoCarga', '/Juego/assets/static/FondoCarga.png');
        this.load.image('textoCarga', '/Juego/assets/static/textoCargando.png');
    }

    create() {
        this.fondo = this.add.image(0, 0, 'fondoCarga');
        this.texto = this.add.image(0, 0, 'textoCarga');
        
        const barraFondo = this.add.graphics();//barra
        const barraProgreso = this.add.graphics();//relleno 
        barraFondo.fillStyle(0x444444, 1);// color
        const ancho = 640;//tamaños
        const alto = 60;
        const x = 550;//posiciones
        const y = 500; 
        barraFondo.fillRect(x, y, ancho, alto);
        this.aplicarReescalado();
        this.scale.on('resize', () => {
            this.aplicarReescalado();
        });
            //CARGAR ARCHIVOS PESADOS AQUI.
        this.load.spritesheet('gato', '/Juego/assets/static/gato.png', { frameWidth: 262, frameHeight: 282});

        this.load.spritesheet('gato', '/Juego/assets/static/gato.png', { frameWidth: 262, frameHeight: 282});
        this.load.image('tituloLogros', '/Juego/assets/static/tituloLogros.png');
        this.load.image('Logro1', '/Juego/assets/static/Logros/Logro1.png');
        this.load.image('FondoMenu', '/Juego/assets/static/FondoMenu.png');
        this.load.image('recuadroM', '/Juego/assets/static/recuadroMago.png');
        this.load.image('barraobjetos', '/Juego/assets/static/barraobjetos.png');
        this.load.image('fondoLogros', '/Juego/assets/static/fondoLogros.png');
        this.load.image('fondoVestuario', '/Juego/assets/static/vesturarioEstatico.png');
        this.load.image('fondoPersonajes', '/Juego/assets/static/fondoPersonajes2.png');
        this.load.image('iconoPersona', '/Juego/assets/static/iconoPersona.png');
        this.load.image('iconoGato', '/Juego/assets/static/iconoGato.png');

        this.load.image('inventariopanel', '/Juego/assets/static/inventariopanel.png');
        this.load.image('fondoInventario', '/Juego/assets/static/fondoInventario.png');
        this.load.image('recuadroP', '/Juego/assets/static/recuadroPersona.png');
        this.load.image('fondoBosque', '/Juego/assets/static/EscenaBosque2.png');
        this.load.image('recuadro', '/Juego/assets/static/recuadro2.png');
        this.load.image('FondoCabaña', '/Juego/assets/static/fondoCabaña.png');


        this.load.image('fondoMenuNegro', '/Juego/assets/static/fondoMenuNegro.png');

        cargarPersonajeActual(this, personajeHumanoEnUso);
            if (Array.isArray(objetos)) {
            objetos.forEach(obj => {
                if (obj.id) {
                    this.load.spritesheet(String(obj.id), `/Juego/assets/static/${obj.id}.png`, {frameWidth: 134,frameHeight: 184});
                }
            });
        }
        
        this.load.image('fondoInicio', '/Juego/assets/static/inicioEstatico2.png');
        this.load.image('FondoCabanaAdentro', '/Juego/assets/static/FondoCasa.png');
        this.load.image('FondoObjeto', '/Juego/assets/static/fondoObjeto2.png');
        this.load.image('FondoObjetoAmarillo', '/Juego/assets/static/fondoObjeto3.png');



        this.load.image('opcionesLetra', '/Juego/assets/static/opcionesLetra.png');
        this.load.image('MusicaLetra', '/Juego/assets/static/MusicaLetra.png');
        this.load.image('checkpoint', '/Juego/assets/static/checkpoint.png');
        this.load.image('decision', '/Juego/assets/static/decision.png');
        this.load.image('si', '/Juego/assets/static/si.png');
        this.load.image('no', '/Juego/assets/static/no.png');
        this.load.image('iconomenu', '/Juego/assets/static/iconomenu.png');
        this.load.image('iconologros', '/Juego/assets/static/iconologros.png');
        this.load.image('recuadroLogroMaestro', '/Juego/assets/static/recuadroLogroMaestro.png');
        this.load.image('recuadroLogroNovato', '/Juego/assets/static/recuadroLogroNovato.png');
        this.load.image('recuadroLogroMitico', '/Juego/assets/static/recuadroLogroMitico.png');
        const logrosData = getLogros();
        if (logrosData && Array.isArray(logrosData)) {
        logrosData.forEach(logro => {
            if (logro.imagen) {
            this.load.image(`${logro.imagen}`, `/Juego/assets/static/Logros/${logro.imagen}.png`);
            }
        });
        }
        this.load.image('novatoLogros', '/Juego/assets/static/novatoLogros.png');
        this.load.image('todosLogros', '/Juego/assets/static/todosLogros.png');
        this.load.image('avanzadoLogros', '/Juego/assets/static/avanzadoLogros.png');
        this.load.image('maestroLogros', '/Juego/assets/static/maestroLogros.png')
        this.load.image('tInventario', '/Juego/assets/static/botonInventario.png');
        this.load.image('botonDescripcion', '/Juego/assets/static/botonDescripcion.png');
        this.load.image('fondoIntroduccionUno', '/Juego/assets/static/EscenaIntroduccionUno2.png');
//AUDIOS
        this.load.audio('musicaFinal', '/Juego/assets/static/Audios/musicaFinal.mp3');
        this.load.audio('musicaFondo', '/Juego/assets/static/Audios/musicaFondo.mp3');

//FONDOS

        this.load.image('EscenaMapa', '/Juego/assets/static/EscenaMapa.png');
        this.load.image('FondoTelevision', '/Juego/assets/static/FondoTelevision.png');

//BOTONES
        this.load.image('botonSiguiente', '/Juego/assets/static/Botones/botonSiguiente.png');
        this.load.image('botonSalir', '/Juego/assets/static/Botones/botonSalir.png');
        this.load.image('botonInicio', '/Juego/assets/static/Botones/botonInicio.png');
        this.load.image('botonRegresar', '/Juego/assets/static/Botones/botonRegresar.png');
        this.load.image('botonSaltar', '/Juego/assets/static/Botones/botonSaltar.png');
        this.load.image('botonEquipar', '/Juego/assets/static/Botones/botonEquipar.png');
        this.load.image('botonPersonaje', '/Juego/assets/static/Botones/botonPersonaje.png');
        this.load.image('botonInventario', '/Juego/assets/static/Botones/inventarioIcono.png');
        this.load.image('botonFinalizar', '/Juego/assets/static/Botones/botonFinalizar.png');
        this.load.image('siBoton', '/Juego/assets/static/Botones/si.png');
        this.load.image('noBoton', '/Juego/assets/static/Botones/no.png');
        this.load.image('regreso', '/Juego/assets/static/Botones/regreso.png');


//MENSAJES
        this.load.image('FinalCompletado', '/Juego/assets/static/Mensajes/FinalCompletado.png');
        this.load.image('IconoCaballero', '/Juego/assets/static/Mensajes/IconoCaballero.png');
        this.load.image('IconoCalaca', '/Juego/assets/static/Mensajes/IconoCalaca.png');
        this.load.image('IconoDuende', '/Juego/assets/static/Mensajes/IconoDuende.png');
        this.load.image('IconoSlime', '/Juego/assets/static/Mensajes/IconoSlime.png');
        this.load.image('RegresarMenu', '/Juego/assets/static/Mensajes/RegresarMenu.png');
        this.load.image('ImagenFinal', '/Juego/assets/static/Mensajes/ImagenFinal.png');

//ANIMACIONES
        this.load.spritesheet('fondoAnimado', '/Juego/assets/static/Animaciones/FondoAnimado.png', {
            frameWidth: 1536,
            frameHeight: 960
        });
        this.load.spritesheet('fondoAnimadoBosque', '/Juego/assets/static/Animaciones/animacionBosque2.png', {
            frameWidth: 1536,
            frameHeight: 1024
        });
        this.load.spritesheet('AnimacionFinalParteUno', '/Juego/assets/static/Animaciones/AnimacionFinalParteUno.png', {
            frameWidth: 1536,
            frameHeight: 960
        });        this.load.spritesheet('AnimacionFinalParteDos', '/Juego/assets/static/Animaciones/AnimacionFinalParteDos.png', {
            frameWidth: 1536,
            frameHeight: 960
        });        this.load.spritesheet('AnimacionFinalParteTres', '/Juego/assets/static/Animaciones/AnimacionFinalParteTres.png', {
            frameWidth: 1536,
            frameHeight: 960
        });
//ENEMIGOS
        this.load.spritesheet('slimeVerde', '/Juego/assets/static/Enemigos/slimeVerde.png', {frameWidth: 250,frameHeight: 250});
        this.load.spritesheet('Caballero', '/Juego/assets/static/Enemigos/Caballero.png', {frameWidth: 358,frameHeight: 400});
        this.load.spritesheet('Calavera', '/Juego/assets/static/Enemigos/Calavera.png', {frameWidth: 300,frameHeight: 400});
        this.load.spritesheet('Duende', '/Juego/assets/static/Enemigos/Duende.png', {frameWidth: 326,frameHeight: 340});
        this.load.spritesheet('slimeRojo', '/Juego/assets/static/Enemigos/slimeRojo.png', {frameWidth: 250,frameHeight: 250});

//TILED MAPAS
        this.load.tilemapTiledJSON('EscenaPeleaSlimeJson', '/Juego/assets/static/Lugares/EscenaPeleaSlimeJson.json');
        this.load.tilemapTiledJSON('CementerioJSON', '/Juego/assets/static/Lugares/CementerioJSON.json');
        this.load.tilemapTiledJSON('CastilloIfernalJSON', '/Juego/assets/static/Lugares/CastilloIfernalJSON.json');
        this.load.tilemapTiledJSON('CasaAbandonadaJSON', '/Juego/assets/static/Lugares/CasaAbandonadaJSON.json');
        this.load.tilemapTiledJSON('mapaTutorial', '/Juego/assets/static/Lugares/mapaTutorial.json');
        this.load.tilemapTiledJSON('BosqueFuente', '/Juego/assets/static/Lugares/BosqueFuente.json');

//TILED FONDOS
        this.load.image('EscenaPeleaSlime', '/Juego/assets/static/Lugares/EscenaPeleaSlime.png');
        this.load.image('FondoCasaU', '/Juego/assets/static/Lugares/FondoCasaU.png');
        this.load.image('fondoBosqueFuente', '/Juego/assets/static/Lugares/fondoBosqueFuente.png');
        this.load.image('CasaAbandonada', '/Juego/assets/static/Lugares/CasaAbandonada.png');
        this.load.image('CastilloIfernal', '/Juego/assets/static/Lugares/CastilloIfernal.png');
        this.load.image('Cementerio', '/Juego/assets/static/Lugares/Cementerio.png');

//SPRITES PERSONAJES
        ['personaje1', 'personaje2', 'personaje3', 'personaje4'].forEach(p => {
            this.load.image(p, `/Juego/assets/static/Sprites/${p}.png`);
        });
        ['gato1', 'gato2', 'gato3', 'gato4'].forEach(g => {
            this.load.image(g, `/Juego/assets/static/Sprites/${g}.png`);
        });
        this.load.spritesheet('objetoEspejo', '/Juego/assets/static/Sprites/animacionEspejo.png', { frameWidth: 447, frameHeight: 447});
        this.load.spritesheet('objetoEspada', '/Juego/assets/static/Sprites/animacionEspada.png', { frameWidth: 447, frameHeight: 447});
        this.load.spritesheet('mago', '/Juego/assets/static/Sprites/mago2.png', { frameWidth: 250, frameHeight: 450 });
        this.load.spritesheet('niñoCaminando', '/Juego/assets/static/Sprites/caminataFinal.png', {frameWidth: 92,frameHeight: 155});
        this.load.spritesheet('gatoCaminando', '/Juego/assets/static/Sprites/caminataFinalGato.png', {frameWidth: 194,frameHeight: 143});
        this.load.spritesheet('objetoMapa', '/Juego/assets/static/Sprites/animacionMapa.png', { frameWidth: 447, frameHeight: 447});

//-----------------------------------------------------------------------------------------------------------------
        this.load.on('progress', (value) => { //se activa cada vez que un recurso termina de cargarse
            barraProgreso.clear();
            barraProgreso.fillStyle(0xffffff, 1);
            barraProgreso.fillRect(x, y, ancho * value, alto);
        });

        // Cuando termine la carga, iniciar la siguiente escena
        this.load.on('complete', () => {
            this.scene.start('EscenaInicio');
        });
        this.load.start();
        
    }

    
    aplicarReescalado() {
        reescalarGlobalFlexible(this.scale.gameSize, [
            {
                obj: this.fondo,
                autoFill: true,
                originX: 0.5,
                originY: 0.5
            },
            {
                obj: this.texto,
                posX: getPosEscala(0.51, 0),
                posY: getPosEscala(0.38, 0),
                escalaRelativa: getPosEscala(1.2, 0),
                originX: 0.5,
                originY: 0.5
            }
        ]);
    }
}


window.ultimaEscenaActiva = null;



const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#fff',
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false  // o true si quieres ver los cuerpos de colisión
        }
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [PreloadScene, EscenaCementerio,EscenaFinal,EscenaCasaAbandonada,EscenaCastilloIfernal,EscenaInicio, EscenaIntroduccionUno, EscenaElegir, EscenaBosque, EscenaBosque2, EscenaCabanaAfuera, EscenaCabanaAdentro, EscenaInventario, EscenaTutorialUno,EscenaSalida,EscenaLogros,EscenaMenu,EscenaParteUno,EscenaMapa,EscenaPeleaSlime,EscenaMuerte]
};




async function inicializarJuego() {
    try {
        const response1 = await fetch('/Juego/api/obtener_objetos.php');
        const data1 = await response1.json();
        if (data1 && !data1.error) {
            setObjetos(data1);
        } else {
        }
        const response4 = await fetch('/Juego/api/obtener_logros.php');
        const data4 = await response4.json();
        if (data4 && !data4.error) {
            setLogros(data4);
        } else {
        }
        const response2 = await fetch('/Juego/api/obtener_objetosJ.php');
        const data2 = await response2.json();
        if (data2 && !data2.error) {
            setObjetosUser(data2);
        } else {
        }
        const response3 = await fetch('/Juego/api/obtener_usuario.php');
        const data3 = await response3.json();
        if (data3 && !data3.error) {
            setUser(data3);
        } else {
        }
        console.log('Todos los datos cargados, iniciando juego...');

    } catch (error) {
        console.error('Error al cargar datos:', error);
    }

    if (document.fonts) {
        await document.fonts.load('38px Silkscreen');
    }

    new Phaser.Game(config);
}

inicializarJuego();