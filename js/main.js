// ==========================================
// 1. IMPORTACIONES (Ordenadas por categoría)
// ==========================================

// Utilidades y Responsividad
import { isMobile, getPosEscala, reescalarGlobalFlexible, createAndAdaptTextFlexible } from './uiHelpers.js';

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
        this.load.image('fondoCarga', '/Juego/assets/static/FondoCarga.png');
        this.load.image('textoCarga', '/Juego/assets/static/textoCargando.png');
    }

    create() {
        this.fondo = this.add.image(0, 0, 'fondoCarga');
        this.texto = this.add.image(0, 0, 'textoCarga');
        
        const barraFondo = this.add.graphics();
        const barraProgreso = this.add.graphics(); 
        barraFondo.fillStyle(0x444444, 1);
        
        const ancho = 640, alto = 60;
        const x = 550, y = 500; 
        barraFondo.fillRect(x, y, ancho, alto);

        this.aplicarReescalado();
        this.scale.on('resize', () => this.aplicarReescalado());

        this.load.on('progress', (value) => {
            barraProgreso.clear();
            barraProgreso.fillStyle(0xffffff, 1);
            barraProgreso.fillRect(x, y, ancho * value, alto);
        });

        this.load.on('complete', () => {
            this.scene.start('EscenaInicio');
        });

        // --- CARGA MASIVA DE ASSETS ESTATICOS ---
        this.load.spritesheet('gato', '/Juego/assets/static/gato.png', { frameWidth: 262, frameHeight: 282});
        this.load.spritesheet('mago', '/Juego/assets/static/Sprites/mago2.png', { frameWidth: 250, frameHeight: 450 });
        this.load.spritesheet('niñoCaminando', '/Juego/assets/static/Sprites/caminataFinal.png', {frameWidth: 92,frameHeight: 155});
        this.load.spritesheet('gatoCaminando', '/Juego/assets/static/Sprites/caminataFinalGato.png', {frameWidth: 194,frameHeight: 143});
        
        this.load.spritesheet('slimeVerde', '/Juego/assets/static/Enemigos/slimeVerde.png', {frameWidth: 250,frameHeight: 250});
        this.load.spritesheet('slimeRojo', '/Juego/assets/static/Enemigos/slimeRojo.png', {frameWidth: 250,frameHeight: 250});
        this.load.spritesheet('Caballero', '/Juego/assets/static/Enemigos/Caballero.png', {frameWidth: 358,frameHeight: 400});
        this.load.spritesheet('Calavera', '/Juego/assets/static/Enemigos/Calavera.png', {frameWidth: 300,frameHeight: 400});
        this.load.spritesheet('Duende', '/Juego/assets/static/Enemigos/Duende.png', {frameWidth: 326,frameHeight: 340});

        ['personaje1', 'personaje2', 'personaje3', 'personaje4'].forEach(p => {
            this.load.image(p, `/Juego/assets/static/Sprites/${p}.png`);
        });
        ['gato1', 'gato2', 'gato3', 'gato4'].forEach(g => {
            this.load.image(g, `/Juego/assets/static/Sprites/${g}.png`);
        });

        this.load.spritesheet('objetoEspejo', '/Juego/assets/static/Sprites/animacionEspejo.png', { frameWidth: 447, frameHeight: 447});
        this.load.spritesheet('objetoEspada', '/Juego/assets/static/Sprites/animacionEspada.png', { frameWidth: 447, frameHeight: 447});
        this.load.spritesheet('objetoMapa', '/Juego/assets/static/Sprites/animacionMapa.png', { frameWidth: 447, frameHeight: 447});

        const mapas = ['EscenaPeleaSlimeJson', 'CementerioJSON', 'CastilloIfernalJSON', 'CasaAbandonadaJSON', 'mapaTutorial', 'BosqueFuente'];
        mapas.forEach(mapa => this.load.tilemapTiledJSON(mapa, `/Juego/assets/static/Lugares/${mapa}.json`));

        const fondos = [
            { key: 'EscenaPeleaSlime', path: 'Lugares/EscenaPeleaSlime.png' },
            { key: 'FondoCasaU', path: 'Lugares/FondoCasaU.png' },
            { key: 'fondoBosqueFuente', path: 'Lugares/fondoBosqueFuente.png' },
            { key: 'CasaAbandonada', path: 'Lugares/CasaAbandonada.png' },
            { key: 'CastilloIfernal', path: 'Lugares/CastilloIfernal.png' },
            { key: 'Cementerio', path: 'Lugares/Cementerio.png' },
            { key: 'EscenaMapa', path: 'EscenaMapa.png' },
            { key: 'FondoTelevision', path: 'FondoTelevision.png' },
            { key: 'fondoInicio', path: 'inicioEstatico2.png' },
            { key: 'FondoCabanaAdentro', path: 'FondoCasa.png' },
            { key: 'FondoCabana', path: 'fondoCabana.png' },
            { key: 'fondoBosque', path: 'EscenaBosque2.png' },
            { key: 'instrucciones', path: 'instrucciones.png' },
            { key: 'eleccion', path: 'eleccion.png' },
            { key: 'fondoIntroduccionUno', path: 'EscenaIntroduccionUno2.png' },
            { key: 'FondoMenu', path: 'FondoMenu.png' },
            { key: 'fondoMenuNegro', path: 'fondoMenuNegro.png' },
            { key: 'fondoLogros', path: 'fondoLogros.png' },
            { key: 'fondoVestuario', path: 'vesturarioEstatico.png' },
            { key: 'fondoPersonajes', path: 'fondoPersonajes2.png' },
            { key: 'fondoInventario', path: 'fondoInventario.png' },
            { key: 'FondoObjeto', path: 'fondoObjeto2.png' },
            { key: 'FondoObjetoAmarillo', path: 'fondoObjeto3.png' }
        ];
        fondos.forEach(f => this.load.image(f.key, `/Juego/assets/static/${f.path}`));

        this.load.spritesheet('fondoAnimado', '/Juego/assets/static/Animaciones/FondoAnimado.png', { frameWidth: 1536, frameHeight: 960 });
        this.load.spritesheet('fondoAnimadoBosque', '/Juego/assets/static/Animaciones/animacionBosque2.png', { frameWidth: 1536, frameHeight: 1024 });
        this.load.spritesheet('AnimacionFinalParteUno', '/Juego/assets/static/Animaciones/AnimacionFinalParteUno.png', { frameWidth: 1536, frameHeight: 960 });
        this.load.spritesheet('AnimacionFinalParteDos', '/Juego/assets/static/Animaciones/AnimacionFinalParteDos.png', { frameWidth: 1536, frameHeight: 960 });
        this.load.spritesheet('AnimacionFinalParteTres', '/Juego/assets/static/Animaciones/AnimacionFinalParteTres.png', { frameWidth: 1536, frameHeight: 960 });

        const uiAssets = [
            { key: 'tituloLogros', path: 'tituloLogros.png' },
            { key: 'recuadroM', path: 'recuadroMago.png' },
            { key: 'recuadroP', path: 'recuadroPersona.png' },
            { key: 'recuadro', path: 'recuadro2.png' },
            { key: 'barraobjetos', path: 'barraobjetos.png' },
            { key: 'iconoPersona', path: 'iconoPersona.png' },
            { key: 'iconoGato', path: 'iconoGato.png' },
            { key: 'inventariopanel', path: 'inventariopanel.png' },
            { key: 'opcionesLetra', path: 'opcionesLetra.png' },
            { key: 'MusicaLetra', path: 'MusicaLetra.png' },
            { key: 'checkpoint', path: 'checkpoint.png' },
            { key: 'decision', path: 'decision.png' },
            { key: 'si', path: 'si.png' },
            { key: 'no', path: 'no.png' },
            { key: 'iconomenu', path: 'iconomenu.png' },
            { key: 'iconologros', path: 'iconologros.png' },
            { key: 'recuadroLogroMaestro', path: 'recuadroLogroMaestro.png' },
            { key: 'recuadroLogroNovato', path: 'recuadroLogroNovato.png' },
            { key: 'recuadroLogroMitico', path: 'recuadroLogroMitico.png' },
            { key: 'novatoLogros', path: 'novatoLogros.png' },
            { key: 'todosLogros', path: 'todosLogros.png' },
            { key: 'avanzadoLogros', path: 'avanzadoLogros.png' },
            { key: 'maestroLogros', path: 'maestroLogros.png' },
            { key: 'tInventario', path: 'botonInventario.png' },
            { key: 'botonDescripcion', path: 'botonDescripcion.png' },
            { key: 'botonSiguiente', path: 'Botones/botonSiguiente.png' },
            { key: 'botonSalir', path: 'Botones/botonSalir.png' },
            { key: 'botonInicio', path: 'Botones/botonInicio.png' },
            { key: 'botonRegresar', path: 'Botones/botonRegresar.png' },
            { key: 'botonSaltar', path: 'Botones/botonSaltar.png' },
            { key: 'botonEquipar', path: 'Botones/botonEquipar.png' },
            { key: 'botonPersonaje', path: 'Botones/botonPersonaje.png' },
            { key: 'botonInventario', path: 'Botones/inventarioIcono.png' },
            { key: 'botonFinalizar', path: 'Botones/botonFinalizar.png' },
            { key: 'siBoton', path: 'Botones/si.png' },
            { key: 'noBoton', path: 'Botones/no.png' },
            { key: 'regreso', path: 'Botones/regreso.png' },
            { key: 'icono_instrucciones', path: 'Botones/icono_instrucciones.png' },
            { key: 'icono_lucha', path: 'Botones/icono_lucha.png' },
            { key: 'icono_historia', path: 'Botones/icono_historia.png' },
            { key: 'FinalCompletado', path: 'Mensajes/FinalCompletado.png' },
            { key: 'IconoCaballero', path: 'Mensajes/IconoCaballero.png' },
            { key: 'IconoCalaca', path: 'Mensajes/IconoCalaca.png' },
            { key: 'IconoDuende', path: 'Mensajes/IconoDuende.png' },
            { key: 'IconoSlime', path: 'Mensajes/IconoSlime.png' },
            { key: 'RegresarMenu', path: 'Mensajes/RegresarMenu.png' },
            { key: 'ImagenFinal', path: 'Mensajes/ImagenFinal.png' }
        ];
        uiAssets.forEach(ui => this.load.image(ui.key, `/Juego/assets/static/${ui.path}`));

        // --- CARGA DINÁMICA DE ASSETS DE LA BASE DE DATOS ---
        
        if (Array.isArray(getState().objetosGlobales)) {
            getState().objetosGlobales.forEach(obj => {
                if (obj.id) {
                    this.load.spritesheet(String(obj.id), `/Juego/assets/static/${obj.id}.png`, {frameWidth: 134, frameHeight: 184});
                }
            });
        }

        const logrosData = getState().logrosGlobales;
        if (logrosData && Array.isArray(logrosData)) {
            logrosData.forEach(logro => {
                if (logro.imagen) {
                    // 🔥 LÓGICA ESTANDARIZADA: Ya no borramos nada, usamos el ID directo de la BD y concatenamos .png
                    this.load.image(logro.imagen, `/Juego/assets/static/Logros/${logro.imagen}.png`);
                }
            });
        }

        this.load.audio('musicaFinal', '/Juego/assets/static/Audios/musicaFinal.mp3');
        this.load.audio('musicaFondo', '/Juego/assets/static/Audios/musicaFondo.mp3');

        this.load.start();
    }

    aplicarReescalado() {
        reescalarGlobalFlexible(this, [
            { obj: this.fondo, autoFill: true, originX: 0.5, originY: 0.5 },
            { obj: this.texto, posX: getPosEscala(0.51, 0), posY: getPosEscala(0.38, 0), escalaRelativa: getPosEscala(1.2, 0), originX: 0.5, originY: 0.5 }
        ]);
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
        EscenaMenu,
        EscenaInicio, 
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
    console.log('🚀 Sincronizando datos con el servidor...');

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
            console.log(`👤 Identidad confirmada: ${usuarioRes.guest ? 'INVITADO (Progreso Local)' : 'JUGADOR REGISTRADO'}`);
        }

        console.log('✅ Datos listos. Arrancando motor gráfico de Phaser...');
        
        // 🔥 ARQUITECTURA CLAVE: Arrancamos el juego HASTA QUE la memoria (Store) tiene los datos.
        // Esto evita que PreloadScene intente cargar imágenes de logros que aún no existen en el estado.
        window.game = new Phaser.Game(config);

    } catch (error) {
        console.error('❌ Error crítico al arrancar el juego:', error);
        alert('Hubo un error de conexión con el servidor. El juego podría no funcionar correctamente.');
    }
}

// ¡Que comience la aventura!
inicializarJuego();