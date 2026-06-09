import { getState } from '../globals.js';
import { reescalarGlobalFlexible } from '../uiHelpers.js';

export class EscenaInicio extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaInicio' });
    }

    create() {
        // Accedemos a los datos globales a través del nuevo Gestor de Estado
        console.log("Jugador activo:", getState().jugador);

        // 1. GESTIÓN DE AUDIO
        if (!this.sound.get('musicaFondo')) {
            this.musica = this.sound.add('musicaFondo', { loop: true, volume: 0.5 });
            this.musica.play();
        } else {
            this.musica = this.sound.get('musicaFondo');
            if (!this.musica.isPlaying) {
                this.musica.play();
            }
        }

        // 2. CREACIÓN DE FONDOS Y SPRITES
        // Como usamos scale FIT (1650x900), las posiciones iniciales no importan tanto 
        // porque 'aplicarReescalado' las acomodará inmediatamente, pero es buena práctica centrarlas.
        this.fondo = this.add.image(825, 450, 'fondoInicio');
        this.SlimeVerde = this.add.sprite(0, 0, 'slimeVerde');
        this.SlimeRojo = this.add.sprite(0, 0, 'slimeRojo');

        // 3. ANIMACIONES (Protegidas)
        // Evitamos el error que ocurre si sales y vuelves a entrar a la escena
        if (!this.anims.exists('slimeVM')) {
            this.anims.create({
                key: 'slimeVM',
                frames: this.anims.generateFrameNumbers('slimeVerde', { start: 0, end: 4 }),
                frameRate: 4,
                repeat: -1
            });
        }
        
        if (!this.anims.exists('slimeRM')) {
            this.anims.create({
                key: 'slimeRM',
                frames: this.anims.generateFrameNumbers('slimeRojo', { start: 0, end: 4 }),
                frameRate: 4,
                repeat: -1
            });
        }

        this.SlimeVerde.play('slimeVM');
        this.SlimeRojo.play('slimeRM');

        // 4. INTERFAZ Y BOTONES
        this.botonInicio = this.add.image(0, 0, 'botonInicio').setInteractive();
        this.botonInicio.on('pointerdown', () => {
            this.scene.start('EscenaEleccion'); // CAMBIAR LUEGO A EscenaIntroduccionUno
        });

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

        this.icono_instrucciones = this.add.image(0, 0, 'icono_instrucciones').setInteractive();
        this.icono_instrucciones.on('pointerdown', () => {
            window.ultimaEscenaActiva = this.scene.key;
            this.scene.launch('EscenaInstrucciones');
            this.scene.pause();
        });

        // 5. RESPONSIVIDAD
        this.aplicarReescalado();
        
        // En modo FIT, el resize del navegador redimensiona el canvas entero automáticamente,
        // pero mantenemos el listener por si hay cambios de orientación en móviles.
        this.scale.on('resize', () => this.aplicarReescalado());
    }

    aplicarReescalado() {
        // Ahora pasamos 'this' (la escena completa) en lugar de 'this.scale'
        // y eliminamos el redundante getPosEscala gracias al modo FIT de Phaser.
        reescalarGlobalFlexible(this, [
            { obj: this.fondo, posX: 0.5, posY: 0.5, escalaRelativa: 1 },
            { obj: this.botonInicio, posX: 0.5, posY: 0.6, escalaRelativa: 0.55 },
            { obj: this.botonPersonaje, posX: 0.3, posY: 0.6, escalaRelativa: 0.23 },
            { obj: this.iconomenu, posX: 0.7, posY: 0.6, escalaRelativa: 0.16 },
            { obj: this.iconologros, posX: 0.2, posY: 0.6, escalaRelativa: 0.16 },
            { obj: this.icono_instrucciones, posX: 0.8, posY: 0.6, escalaRelativa: 0.17 },
            { obj: this.SlimeVerde, posX: 0.2, posY: 0.85, escalaRelativa: 0.17 },
            { obj: this.SlimeRojo, posX: 0.3, posY: 0.45, escalaRelativa: 0.19 }
        ]);
    }
}