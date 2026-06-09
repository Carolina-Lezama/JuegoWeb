import { objetosDelPersonaje, jugador,datosObjetos,objetos,objetosActivos, personajeHumanoEnUso, personajeGatoEnUso, ApartadoMenu, setPersonajeHumanoEnUso, setPersonajeGatoEnUso, setApartadoMenu,objetos_jugador } from '../globals.js';
import { isMobile, getPosEscala, reescalarGlobalFlexible,cargarPersonajeActual, cargarGatoActual, createAndAdaptTextFlexible } from '../uiHelpers.js';
//---ESCENA INSTRUCCIONES
export class EscenaInstrucciones extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaInstrucciones' });
    }
    preload() {
    }
create() {
    console.log(jugador);

    // 🎵 Música
    if (!this.sound.get('musicaFondo')) {
        this.musica = this.sound.add('musicaFondo', {
            loop: true,
            volume: 0.5
        });
        this.musica.play();
    } else {
        this.musica = this.sound.get('musicaFondo');
        if (!this.musica.isPlaying) {
            this.musica.play();
        }
    }


    // 🌌 Fondo
    this.fondo = this.add.image(0, 0, 'instrucciones');

    // 🧊 CONTENEDOR PRINCIPAL
    this.panel = this.add.rectangle(0, 0, 900, 600, 0x0c1022, 0.8)
        .setStrokeStyle(3, 0x00ffc3);

    // 🏷️ TÍTULO
    this.titulo = this.add.text(0, 0, 'INSTRUCCIONES', {
        fontSize: '40px',
        color: '#00ffc3',
        fontStyle: 'bold'
    }).setOrigin(0.5);

    // 📜 CONTENIDO (SECCIONES)
    const textoInstrucciones = [
        'MOVIMIENTO',
        'Usa W A S D  para moverte',
        '----------------------',

        ' COMBATE',
        'Presiona clic izquierdo para atacar',
        'Derrota enemigos para ganar puntos',
        '----------------------',

        ' INVENTARIO',
        'Presiona R para abrir inventario',
        'Selecciona objetos para usarlos',
        '----------------------',

        ' INTERACTUAR CON EL MAPA',
        'Presiona e para inspeccionar ciertas locaciones',
        '----------------------',

        ' OBJETOS',
        'Recoge objetos del mapa',
        'Algunos otorgan habilidades especiales',
        '----------------------',

        ' PERSONAJE / GATO',
        'Puedes cambiar de personaje',
        'Equipa el espejo y haz click en el',

    ];

    this.texto = this.add.text(0, 0, textoInstrucciones, {
        fontSize: '32px',
        color: '#ffffff',
        align: 'left',
        lineSpacing: 6,
        wordWrap: { width: 1000 }
    }).setOrigin(0.5, 0);

    // 🔙 BOTÓN REGRESO
    this.regreso = this.add.image(0, 0, 'regreso').setInteractive();

    this.regreso.on('pointerdown', () => {
        if (window.ultimaEscenaActiva) {
            this.scene.resume(window.ultimaEscenaActiva);
        }
        this.scene.stop();
    });

    this.regreso.on('pointerout', () => {
        this.regreso.setScale(1);
    });

    this.aplicarReescalado();

    this.scale.on('resize', () => {
        this.aplicarReescalado();
    });
}
aplicarReescalado() {
    reescalarGlobalFlexible(this.scale, [

        {
            obj: this.fondo,
            autoFill: true,
            originX: 0.5,
            originY: 0.5
        },

        // PANEL CENTRAL
        {
            obj: this.panel,
            posX: getPosEscala(0.5, 0),
            posY: getPosEscala(0.45, 0),
            escalaRelativa: getPosEscala(1.2, 0),
            originX: 0.5,
            originY: 0.5
        },

        // TITULO
        {
            obj: this.titulo,
            posX: getPosEscala(0.5, 0),
            posY: getPosEscala(0.13, 0),
            escalaRelativa: getPosEscala(0.8, 0),
            originX: 0.5,
            originY: 0.5
        },

        // TEXTO
        {
            obj: this.texto,
            posX: getPosEscala(0.5, 0),
            posY: getPosEscala(0.18, 0),
            escalaRelativa: getPosEscala(0.77, 0),
            originX: 0.5,
            originY: 0
        },

        // BOTÓN
        {
            obj: this.regreso,
            posX: getPosEscala(0.07, 0),
            posY: getPosEscala(0.15, 0),
            escalaRelativa: getPosEscala(0.2, 0),
            originX: 0.5,
            originY: 0.5
        }

    ]);
}

    update() {}
}