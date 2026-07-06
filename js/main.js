// ==========================================
// 1. IMPORTACIONES (Ordenadas por categoría)
// ==========================================

// Utilidades y Responsividad
import { isMobile, getPosEscala, createAndAdaptTextFlexible } from './uiHelpers.js';

// Estado Global
import { 
    getState, 
    setUser, 
    setObjetos, 
    setObjetosUser, 
    setDialogosRecuperados, 
    setLogros 
} from './globals.js';

// Escenas
import { EscenaInicio } from './Scenes/EscenaInicio.js';
import { EscenaMenu } from './Scenes/EscenaMenu.js';
import { EscenaElegir } from './Scenes/EscenaElegir.js';
import { EscenaEleccion } from './Scenes/escenaeleccion.js';
import { EscenaInstrucciones } from './Scenes/EscenaInstrucciones.js';
import { EscenaLogros } from './Scenes/EscenaLogros.js';
import { EscenaInventario } from './Scenes/EscenaInventario.js';
import { EscenaMapa } from './Scenes/EscenaMapa.js';

// Escenas de Historia
import { EscenaIntroduccionUno } from './Scenes/EscenaIntroduccionUno.js';
import { EscenaTutorialUno } from './Scenes/EscenaTutorialUno.js';
import { EscenaBosque } from './Scenes/EscenaBosque.js';
import { EscenaBosque2 } from './Scenes/EscenaBosque2.js';
import { EscenaCabanaAfuera } from './Scenes/EscenaCabanaAfuera.js';
import { EscenaCabanaAdentro } from './Scenes/EscenaCabanaAdentro.js';
import { EscenaParteUno } from './Scenes/EscenaParteUno.js';

// Escenas de Acción/Pelea/Finales
import { EscenaPeleaSlime } from './Scenes/EscenaPeleaSlime.js';
import { EscenaCementerio } from './Scenes/EscenaCementerio.js';
import { EscenaCasaAbandonada } from './Scenes/EscenaCasaAbandonada.js';
import { EscenaCastilloIfernal } from './Scenes/EscenaCastilloIfernal.js';
import { EscenaMuerte } from './Scenes/EscenaMuerte.js';
import { EscenaSalida } from './Scenes/EscenaSalida.js';
import { EscenaFinal } from './Scenes/EscenaFinal.js';

// ==========================================
// 2. ESCENA DE PRECARGA (Asset Management)
// ==========================================
class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        this.load.image('fondoCarga', '/Juego/assets/static/Fondos/FondoCarga.png');
        this.load.image('textoCarga', '/Juego/assets/static/Textos/textoCargando.png');
    }

    create() {
        this.textoMotivacional = this.add.text(800, 650, 'Buscando inspiración en el cosmos...', {
            fontSize: '30px',
            color: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'italic',
            align: 'center',
            wordWrap: { width: 700 }
        }).setOrigin(0.5).setDepth(5);

        this.consumirApiMotivacional();
        
        // 1. Centramos el fondo en las coordenadas (825, 450)
        this.fondo = this.add.image(825, 450, 'fondoCarga');
        
        // 2. Colocamos el texto "Cargando..." un poco más arriba de la mitad (ej. Y: 380)
        this.texto = this.add.image(850, 380, 'textoCarga').setScale(2.3);
        const barraFondo = this.add.graphics();
        const barraProgreso = this.add.graphics(); 
        barraFondo.fillStyle(0x444444, 1);
        
        const ancho = 640, alto = 60;
        const x = 500, y = 500; 
        barraFondo.fillRect(x, y, ancho, alto);


        this.load.on('progress', (value) => {
            barraProgreso.clear();
            barraProgreso.fillStyle(0xffffff, 1);
            barraProgreso.fillRect(x, y, ancho * value, alto);
        });

        this.load.on('complete', () => {
            this.scene.start('EscenaTutorialUno'); //aqui EscenaInicio
        });

        // --- CARGA MASIVA DE ASSETS ESTATICOS ---
        this.load.spritesheet('slimeVerde', '/Juego/assets/static/Enemigos/slimeVerde.png', {frameWidth: 200,frameHeight: 200});
        this.load.spritesheet('slimeRojo', '/Juego/assets/static/Enemigos/slimeRojo.png', {frameWidth: 200,frameHeight: 200});
        this.load.spritesheet('Caballero', '/Juego/assets/static/Enemigos/Caballero.png', {frameWidth: 300,frameHeight: 400});
        this.load.spritesheet('Calavera', '/Juego/assets/static/Enemigos/Calavera.png', {frameWidth: 300,frameHeight: 400});
        this.load.spritesheet('Duende', '/Juego/assets/static/Enemigos/Duende.png', {frameWidth: 300,frameHeight: 300});

        const fondos = [
            // Escenas de movimiento
            { key: 'EscenaPeleaSlime', path: 'Lugares/EscenaPeleaSlime.png' },
            { key: 'FondoCasaU', path: 'Lugares/FondoCasaU.png' },
            { key: 'fondoBosqueFuente', path: 'Lugares/fondoBosqueFuente.png' },
            { key: 'CasaAbandonada', path: 'Lugares/CasaAbandonada.png' },
            { key: 'CastilloIfernal', path: 'Lugares/CastilloIfernal.png' },
            { key: 'Cementerio', path: 'Lugares/Cementerio.png' },

            // Fondos
            { key: 'EscenaMapa', path: 'Fondos/EscenaMapa.png' },
            { key: 'FondoTelevision', path: 'Fondos/FondoTelevision.png' },
            { key: 'fondoInicio', path: 'Fondos/inicioEstatico2.png' },
            { key: 'FondoCabanaAdentro', path: 'Fondos/FondoCasa.png' },
            { key: 'FondoCabana', path: 'Fondos/fondoCabana.png' },
            { key: 'fondoBosque', path: 'Fondos/EscenaBosque2.png' },
            { key: 'instrucciones', path: 'Fondos/instrucciones.png' },
            { key: 'eleccion', path: 'Fondos/eleccion.png' },
            { key: 'fondoIntroduccionUno', path: 'Fondos/EscenaIntroduccionUno2.png' },
            { key: 'fondoMenuNegro', path: 'Fondos/fondoMenuNegro.png' },
            { key: 'fondoLogros', path: 'Fondos/fondoLogros.png' },
            { key: 'fondoVestuario', path: 'Fondos/vesturarioEstatico.png' },
            { key: 'fondoInventario', path: 'Fondos/fondoInventario.png' },
            { key: 'FondoMenu', path: 'Fondos/FondoMenu.png' },
            { key: 'FondoObjeto', path: 'Fondos/fondoObjeto2.png' },
            { key: 'FondoObjetoAmarillo', path: 'Fondos/fondoObjeto3.png' },
            { key: 'FinalCompletado', path: 'Fondos/FinalCompletado.png' },
            { key: 'RegresarMenu', path: 'Fondos/RegresarMenu.png' },
            { key: 'ImagenFinal', path: 'Fondos/ImagenFinal.png' }
        ];
        fondos.forEach(f => this.load.image(f.key, `/Juego/assets/static/${f.path}`));

        const mapas = ['EscenaPeleaSlimeJson', 'CementerioJSON', 'CastilloIfernalJSON', 'CasaAbandonadaJSON', 'mapaTutorial', 'BosqueFuente'];
        mapas.forEach(mapa => this.load.tilemapTiledJSON(mapa, `/Juego/assets/static/Lugares/${mapa}.json`));

        ['personaje1', 'personaje2', 'personaje3', 'personaje4'].forEach(p => {
            this.load.image(p, `/Juego/assets/static/Personajes/${p}.png`);
        });
        ['gato1', 'gato2', 'gato3', 'gato4'].forEach(g => {
            this.load.image(g, `/Juego/assets/static/Personajes/${g}.png`);
        });
        ['SpritePersonaje1', 'SpritePersonaje2', 'SpritePersonaje3', 'SpritePersonaje4'].forEach(g => {
            this.load.spritesheet(g, `/Juego/assets/static/Personajes/sprites/${g}.png`, { frameWidth: 185, frameHeight: 350});
        });
        ['SpriteGato1', 'SpriteGato2', 'SpriteGato3', 'SpriteGato4'].forEach(g => {
            this.load.spritesheet(g, `/Juego/assets/static/Personajes/sprites/${g}.png`, { frameWidth: 200, frameHeight: 230});
        });

        this.load.spritesheet('fondoAnimado', '/Juego/assets/static/Animaciones/FondoAnimado.png', { frameWidth: 1536, frameHeight: 960 });
        this.load.spritesheet('fondoAnimadoBosque', '/Juego/assets/static/Animaciones/animacionBosque2.png', { frameWidth: 1536, frameHeight: 1024 });
        this.load.spritesheet('AnimacionFinalParteUno', '/Juego/assets/static/Animaciones/AnimacionFinalParteUno.png', { frameWidth: 1536, frameHeight: 960 });
        this.load.spritesheet('AnimacionFinalParteDos', '/Juego/assets/static/Animaciones/AnimacionFinalParteDos.png', { frameWidth: 1536, frameHeight: 960 });
        this.load.spritesheet('AnimacionFinalParteTres', '/Juego/assets/static/Animaciones/AnimacionFinalParteTres.png', { frameWidth: 1536, frameHeight: 960 });

        const uiAssets = [
            // Botones rectangulares
            { key: 'botonEquipar', path: 'Botones/Rectangulares/botonEquipar.png' },
            { key: 'botonFinalizar', path: 'Botones/Rectangulares/botonFinalizar.png' },
            { key: 'botonInicio', path: 'Botones/Rectangulares/botonInicio.png' },
            { key: 'tInventario', path: 'Botones/Rectangulares/botonInventario.png' },
            { key: 'botonRegresar', path: 'Botones/Rectangulares/botonRegresar.png' },
            { key: 'botonSalir', path: 'Botones/Rectangulares/botonSalir.png' },
            { key: 'botonSaltar', path: 'Botones/Rectangulares/botonSaltar.png' },
            { key: 'botonSiguiente', path: 'Botones/Rectangulares/botonSiguiente.png' },
            { key: 'siBoton', path: 'Botones/Rectangulares/si.png' },
            { key: 'noBoton', path: 'Botones/Rectangulares/no.png' },

            //Botones cuadrados
            { key: 'avanzadoLogros', path: 'Botones/Cuadrados/avanzadoLogros.png' },
            { key: 'botonPersonaje', path: 'Botones/Cuadrados/botonPersonaje.png' },
            { key: 'icono_historia', path: 'Botones/Cuadrados/icono_historia.png' },
            { key: 'icono_instrucciones', path: 'Botones/Cuadrados/icono_instrucciones.png' },
            { key: 'icono_lucha', path: 'Botones/Cuadrados/icono_lucha.png' },
            { key: 'iFlecha', path: 'Botones/Cuadrados/iconoFlecha.png' },
            { key: 'iconoGato', path: 'Botones/Cuadrados/iconoGato.png' },
            { key: 'iconomenu', path: 'Botones/Cuadrados/iconomenu.png' },
            { key: 'iconologros', path: 'Botones/Cuadrados/iconologros.png' },
            { key: 'iconoPersona', path: 'Botones/Cuadrados/iconoPersona.png' },
            { key: 'botonInventario', path: 'Botones/Cuadrados/inventarioIcono.png' },
            { key: 'novatoLogros', path: 'Botones/Cuadrados/novatoLogros.png' },
            { key: 'todosLogros', path: 'Botones/Cuadrados/todosLogros.png' },
            { key: 'maestroLogros', path: 'Botones/Cuadrados/maestroLogros.png' },
            { key: 'regreso', path: 'Botones/Cuadrados/regreso.png' },
            { key: 'IconoCaballero', path: 'Botones/Cuadrados/IconoCaballero.png' },
            { key: 'IconoCalaca', path: 'Botones/Cuadrados/IconoCalaca.png' },
            { key: 'IconoDuende', path: 'Botones/Cuadrados/IconoDuende.png' },
            { key: 'IconoSlime', path: 'Botones/Cuadrados/IconoSlime.png' },
            { key: 'checkpoint', path: 'Botones/Cuadrados/checkpoint.png' },
            { key: 'decision', path: 'Botones/Cuadrados/decision.png' },

            // Textos
            { key: 'MusicaLetra', path: 'Textos/MusicaLetra.png' },
            { key: 'opcionesLetra', path: 'Textos/opcionesLetra.png' },
            { key: 'si', path: 'Textos/si.png' },
            { key: 'no', path: 'Textos/no.png' },
            { key: 'tituloLogros', path: 'Textos/tituloLogros.png' },
            { key: 'botonDescripcion', path: 'Textos/botonDescripcion.png' },

            // Recuadros
            { key: 'recuadroLogroMaestro', path: 'Recuadros/recuadroLogroMaestro.png' },
            { key: 'recuadroLogroNovato', path: 'Recuadros/recuadroLogroNovato.png' },
            { key: 'recuadroLogroMitico', path: 'Recuadros/recuadroLogroMitico.png' },
            { key: 'fondoPersonajes', path: 'Recuadros/fondoPersonajes2.png' },
            { key: 'recuadroM', path: 'Recuadros/recuadroMago.png' },
            { key: 'recuadroP', path: 'Recuadros/recuadroPersona.png' },
            { key: 'recuadro', path: 'Recuadros/recuadro2.png' },
            { key: 'barraobjetos', path: 'Recuadros/barraobjetos.png' },
            { key: 'inventariopanel', path: 'Recuadros/inventariopanel.png' },






            


];
        this.load.spritesheet('niñoCaminando', '/Juego/assets/static/Personajes/sprites/caminataFinal.png', {frameWidth: 92,frameHeight: 155});
        this.load.spritesheet('gatoCaminando', '/Juego/assets/static/Personajes/sprites/caminataFinalGato.png', {frameWidth: 194,frameHeight: 143});
        

// quiero que quites variables de rescalado, usar las globales de personajes y gato, dejar los comentarios para el reescalado de recursos, agregar el .setscale()







        this.load.spritesheet('mago', '/Juego/assets/static/Personajes/sprites/mago.png', { frameWidth: 207, frameHeight: 400 });

        uiAssets.forEach(ui => this.load.image(ui.key, `/Juego/assets/static/${ui.path}`));

        if (Array.isArray(getState().objetosGlobales)) {
            getState().objetosGlobales.forEach(obj => {
                if (obj.id) {
                    this.load.spritesheet(String(obj.id), `/Juego/assets/static/Animaciones/${obj.id}.png`, {frameWidth: 134, frameHeight: 184});
                }
            });
        }

        this.load.spritesheet('objetoEspejo', '/Juego/assets/static/Animaciones/animacionEspejo.png', { frameWidth: 447, frameHeight: 447});
        this.load.spritesheet('objetoEspada', '/Juego/assets/static/Animaciones/animacionEspada.png', { frameWidth: 447, frameHeight: 447});
        this.load.spritesheet('objetoMapa', '/Juego/assets/static/Animaciones/animacionMapa.png', { frameWidth: 447, frameHeight: 447});

        const logrosData = getState().logrosGlobales;
        if (logrosData && Array.isArray(logrosData)) {
            logrosData.forEach(logro => {
                if (logro.imagen) {
                    // LÓGICA ESTANDARIZADA: Ya no borramos nada, usamos el ID directo de la BD y concatenamos .png
                    this.load.image(logro.imagen, `/Juego/assets/static/Logros/${logro.imagen}.png`);
                }
            });
        }

        this.load.audio('musicaFinal', '/Juego/assets/static/Audios/musicaFinal.mp3');
        this.load.audio('musicaFondo', '/Juego/assets/static/Audios/musicaFondo.mp3');

        this.load.start();
    }

    async consumirApiMotivacional() {
        try {
            // Hacemos la petición a la API
            const respuesta = await fetch('https://api.adviceslip.com/advice');
            
            // Verificamos que la respuesta sea correcta
            if (!respuesta.ok) throw new Error('Error en la red');
            
            // Convertimos la respuesta a JSON
            const datos = await respuesta.json();
            
            // Extraemos el consejo del JSON y actualizamos el texto en Phaser
            const consejo = datos.slip.advice;
            this.textoMotivacional.setText(`" ${consejo} "`);

        } catch (error) {
            // Plan B: Si no hay internet o la API falla, mostramos un mensaje por defecto
            console.warn("No se pudo cargar la API:", error);
            this.textoMotivacional.setText('" El verdadero tesoro es el código que depuramos en el camino. "');
        }
    }



}

// ==========================================
// 3. CONFIGURACIÓN E INICIALIZACIÓN
// ==========================================
window.ultimaEscenaActiva = null;

const config = {
    type: Phaser.AUTO,
    width: 1650,
    height: 900,
    backgroundColor: '#000',
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        PreloadScene,
        EscenaInicio, 
        EscenaMenu,
        EscenaInstrucciones,
        EscenaLogros,
        EscenaElegir,
        EscenaEleccion,
        EscenaIntroduccionUno,
        EscenaBosque,
        EscenaBosque2, 
        EscenaCabanaAfuera, 
        EscenaCabanaAdentro, 
        EscenaInventario,
        EscenaTutorialUno, 
        
        
        EscenaSalida,
        EscenaParteUno,
        EscenaMapa,
        EscenaPeleaSlime, 
        EscenaCastilloIfernal, 
        EscenaCementerio, 
        EscenaCasaAbandonada,
        EscenaMuerte,
        EscenaFinal
    ]
};

// ==========================================
// 4. API Y ARRANQUE SEGURO
// ==========================================

// Petición silenciosa: solo avisa a la consola si algo falla
async function fetchSeguro(url, nombreEtiqueta) {
    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) {
            console.warn(`[API] ⚠️ Advertencia en ${nombreEtiqueta}: Status HTTP ${respuesta.status}`);
        }
        return await respuesta.json();
    } catch (error) {
        console.error(`[API] ❌ ERROR en ${nombreEtiqueta}:`, error.message);
        return { success: false, error: error.message, data: null };
    }
}

async function inicializarJuego() {
    console.log(' Sincronizando datos con el servidor...');

    try {
        const [dialogosRes, objetosRes, logrosRes, objetosJRes, usuarioRes] = await Promise.all([
            fetchSeguro('/Juego/api/obtener_dialogos.php', 'Diálogos'),
            fetchSeguro('/Juego/api/obtener_objetos.php', 'Catálogo Objetos'),
            fetchSeguro('/Juego/api/obtener_logros.php', 'Catálogo Logros'),
            fetchSeguro('/Juego/api/obtener_objetosJ.php', 'Inventario Jugador'), 
            fetchSeguro('/Juego/api/obtener_usuario.php', 'Sesión Usuario')
        ]);

        // Asignación rápida y silenciosa
        if (dialogosRes.success && dialogosRes.data) setDialogosRecuperados(dialogosRes.data);
        if (objetosRes.success && objetosRes.data) setObjetos(objetosRes.data);
        if (logrosRes.success && logrosRes.data) setLogros(logrosRes.data);
        if (objetosJRes.success && objetosJRes.data) setObjetosUser(objetosJRes.data);

        if (usuarioRes.success) {
            setUser(usuarioRes); 
            console.log(` Identidad confirmada: ${usuarioRes.guest ? 'INVITADO (Progreso Local)' : 'JUGADOR REGISTRADO'}`);
        }

        console.log(' Datos listos. Arrancando motor gráfico de Phaser...');
        
        //  ARQUITECTURA CLAVE: Arrancamos el juego HASTA QUE la memoria (Store) tiene los datos.
        // Esto evita que PreloadScene intente cargar imágenes de logros que aún no existen en el estado.
        window.game = new Phaser.Game(config);

    } catch (error) {
        console.error(' Error crítico al arrancar el juego:', error);
        alert('Hubo un error de conexión con el servidor. El juego podría no funcionar correctamente.');
    }
}

// ¡Que comience la aventura!
inicializarJuego();