import { objetosDelPersonaje, jugador,datosObjetos,objetos,objetosActivos, personajeHumanoEnUso, personajeGatoEnUso, ApartadoMenu, setPersonajeHumanoEnUso, setPersonajeGatoEnUso, setApartadoMenu,objetos_jugador } from '../globals.js';
import { isMobile, getPosEscala, reescalarGlobalFlexible,cargarPersonajeActual, cargarGatoActual, createAndAdaptTextFlexible } from '../responsive.js';
//---ESCENA INICIO
export class EscenaInicio extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaInicio' });
    }
    preload() {
    }
    create() {
        console.log(jugador);
        // Referencia a la música de fondo SOLO si no existe
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
        this.fondo = this.add.image(0, 0, 'fondoInicio');
        this.SlimeVerde = this.add.sprite(0, 0, 'slimeVerde');
        this.anims.create({
            key: 'slimeVM',
            frames: this.anims.generateFrameNumbers('slimeVerde', { start: 0, end: 4 }),
            frameRate: 4,
            repeat: -1
        });
        this.SlimeRojo = this.add.sprite(0, 0, 'slimeRojo');
        this.anims.create({
            key: 'slimeRM',
            frames: this.anims.generateFrameNumbers('slimeRojo', { start: 0, end: 4 }),
            frameRate: 4,
            repeat: -1
            });
        const animarPersonaje = () => {
            this.SlimeVerde.anims.play('slimeVM', true);
            this.SlimeRojo.anims.play('slimeRM', true);
        };
        animarPersonaje();
        this.botonInicio = this.add.image(0, 0, 'botonInicio').setInteractive();
            this.botonInicio.on('pointerdown', () => {
            this.scene.start('EscenaIntroduccionUno');});// CAMBIAR LUEGO A EscenaIntroduccionUno
        this.botonPersonaje = this.add.image(0, 0, 'botonPersonaje').setInteractive();
            this.botonPersonaje.on('pointerdown', () => {
            this.scene.start('EscenaElegir');
        });
        this.iconomenu = this.add.image(0, 0, 'iconomenu').setInteractive();
            this.iconomenu.on('pointerdown', () => {
            window.ultimaEscenaActiva = this.scene.key;
            this.scene.launch('EscenaMenu');
            this.scene.pause(); 
        });
        this.iconologros = this.add.image(0, 0, 'iconologros').setInteractive();
            this.iconologros.on('pointerdown', () => {
            window.ultimaEscenaActiva = this.scene.key;
            this.scene.launch('EscenaLogros');
            this.scene.pause();

        });
        this.aplicarReescalado();
        this.scale.on('resize', () => {
            this.aplicarReescalado();
        });}
    aplicarReescalado() {
        reescalarGlobalFlexible(this.scale, [
            {
                obj: this.fondo,
                autoFill: true,
                originX: 0.5,
                originY: 0.5
            },{
                obj: this.botonInicio,
                posX: getPosEscala(0.5, 0),
                posY: getPosEscala(0.6, 0),
                escalaRelativa: getPosEscala(0.55, 0),
                originX: 0.5,
                originY: 0.5
            },{
                obj: this.botonPersonaje,
                posX: getPosEscala(0.3, 0),
                posY: getPosEscala(0.6, 0),
                escalaRelativa: getPosEscala(0.23, 0),
                originX: 0.5,
                originY: 0.5
            },{
                obj: this.iconomenu,
                posX: getPosEscala(0.7, 0),
                posY: getPosEscala(0.6, 0),
                escalaRelativa: getPosEscala(0.16, 0),
                originX: 0.5,
                originY: 0.5
            },{
                obj: this.iconologros,
                posX: getPosEscala(0.2, 0),
                posY: getPosEscala(0.6, 0),
                escalaRelativa: getPosEscala(0.16, 0),
                originX: 0.5,
                originY: 0.5
            },
            {
                obj: this.SlimeVerde,
                posX: getPosEscala(0.2, 0), // Más a la izquierda
                posY: getPosEscala(0.85, 0), // Misma línea que el rojo
                escalaRelativa: getPosEscala(0.17, 0), // Más pequeño
                originX: 0.5,
                originY: 0.5
            },
                        {
                obj: this.SlimeRojo,
                posX: getPosEscala(0.3, 0), // Más a la izquierda
                posY: getPosEscala(0.45, 0), // Misma línea que el rojo
                escalaRelativa: getPosEscala(0.19, 0), // Más pequeño
                originX: 0.5,
                originY: 0.5
            }
        ]);
    }
    update() {}
}