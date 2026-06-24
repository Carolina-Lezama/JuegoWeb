import { getState } from '../globals.js';

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
        // NOTA: Recuerda cambiar los (0, 0) por tus coordenadas reales (ej. X entre 0 y 1650, Y entre 0 y 900)
        this.fondo = this.add.image(825, 450, 'fondoInicio').setScale(1); 
        this.SlimeVerde = this.add.sprite(1400, 370, 'slimeVerde').setScale(0.8); // <-- Modifica la escala aquí
        this.SlimeRojo = this.add.sprite(300, 370, 'slimeRojo').setScale(0.8); // <-- Modifica la escala aquí

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
        this.botonInicio = this.add.image(850, 500, 'botonInicio').setInteractive().setScale(1.5); // <-- Modifica la escala aquí
        this.botonInicio.on('pointerdown', () => {
            this.scene.start('EscenaEleccion'); 
        });

        this.botonPersonaje = this.add.image(300, 500, 'botonPersonaje').setInteractive().setScale(1.2); // <-- Modifica la escala aquí
        this.botonPersonaje.on('pointerdown', () => {
            this.scene.start('EscenaElegir');
        });

        this.iconomenu = this.add.image(1400, 500, 'iconomenu').setInteractive().setScale(1.2); // <-- Modifica la escala aquí
        this.iconomenu.on('pointerdown', () => {
            window.ultimaEscenaActiva = this.scene.key;
            this.scene.launch('EscenaMenu');
            this.scene.pause(); 
        });

        this.iconologros = this.add.image(1250, 500, 'iconologros').setInteractive().setScale(1.2); // <-- Modifica la escala aquí
        this.iconologros.on('pointerdown', () => {
            window.ultimaEscenaActiva = this.scene.key;
            this.scene.launch('EscenaLogros');
            this.scene.pause();
        });

        this.icono_instrucciones = this.add.image(460, 500, 'icono_instrucciones').setInteractive().setScale(1.2); // <-- Modifica la escala aquí
        this.icono_instrucciones.on('pointerdown', () => {
            window.ultimaEscenaActiva = this.scene.key;
            this.scene.launch('EscenaInstrucciones');
            this.scene.pause();
        });

    }

}