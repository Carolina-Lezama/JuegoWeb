import { getState } from '../globals.js';
import { reescalarGlobalFlexible, createAndAdaptTextFlexible, agregarEfectoHover } from '../uiHelpers.js';

export class EscenaFinal extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaFinal' });
    }

    create() {
        // 1. ANIMACIÓN PARTE UNO (Cierre de la cinemática)
        this.AnimacionFinalParteUno = this.add.sprite(0, 0, 'AnimacionFinalParteUno').setDepth(1);
        
        if (!this.anims.exists('AnimacionFinalParteUno-movimiento')) {
            this.anims.create({
                key: 'AnimacionFinalParteUno-movimiento',
                frames: this.anims.generateFrameNumbers('AnimacionFinalParteUno', { start: 0, end: 31 }),
                frameRate: 5,
                repeat: 0
            });
        }

        // 2. ELEMENTOS DE LA HABITACIÓN (Fondo y UI)
        this.FondoTelevision = this.add.image(0, 0, 'FondoTelevision').setVisible(false).setDepth(2);
        this.recuadroPe = this.add.image(0, 0, 'recuadroP').setDepth(3).setVisible(false);
        this.personaje = this.add.sprite(0, 0, 'personajeUsar').setVisible(false).setDepth(4);
        this.botonSiguiente = this.add.image(0, 0, 'botonSiguiente').setDepth(5).setVisible(false).setInteractive({ useHandCursor: true });
        
        // Pantalla de créditos / fin real
        this.ImagenFinal = this.add.image(0, 0, 'ImagenFinal').setVisible(false).setDepth(6);

        if (!this.anims.exists('personaje-movimiento')) {
            this.anims.create({
                key: 'personaje-movimiento',
                frames: this.anims.generateFrameNumbers('personajeUsar', { start: 0, end: 4 }),
                frameRate: 5,
                repeat: -1
            });
        }

        // Texto de diálogo
        this.texto = createAndAdaptTextFlexible(this, {
            text: '',
            posX: 0.28, posY: 0.18, maxWidth: 970, fontSizeInicial: 38,
            originX: 0.5, originY: 0.5, color: '#000000'
        }).setDepth(5).setVisible(false);

        // 3. ANIMACIONES POSTERIORES (Partes 2 y 3)
        this.AnimacionFinalParteDos = this.add.sprite(0, 0, 'AnimacionFinalParteDos').setVisible(false).setDepth(2);
        if (!this.anims.exists('AnimacionFinalParteDos-movimiento')) {
            this.anims.create({
                key: 'AnimacionFinalParteDos-movimiento',
                frames: this.anims.generateFrameNumbers('AnimacionFinalParteDos', { start: 0, end: 7 }),
                frameRate: 3,
                repeat: 0
            });
        }

        this.AnimacionFinalParteTres = this.add.sprite(0, 0, 'AnimacionFinalParteTres').setVisible(false).setDepth(6);
        if (!this.anims.exists('AnimacionFinalParteTres-movimiento')) {
            this.anims.create({
                key: 'AnimacionFinalParteTres-movimiento',
                frames: this.anims.generateFrameNumbers('AnimacionFinalParteTres', { start: 0, end: 3 }),
                frameRate: 5,
                repeat: -1
            });
        }

        // 4. CONFIGURACIÓN DE DIÁLOGOS
        this.dialogos = [
            'Ese fue un sueño muy raro.',
            'Mejor escuchemos un rato la radio.'
        ];
        this.dialogoActual = 0;
        this.texto.setText(this.dialogos[this.dialogoActual]);

        // 5. FLUJO NARRATIVO Y DISPARADORES
        // Al terminar la parte 1, despertamos la habitación del niño
        this.AnimacionFinalParteUno.on('animationcomplete', () => {
            this.AnimacionFinalParteUno.setVisible(false);
            this.FondoTelevision.setVisible(true);

            this.personaje.setVisible(true).play('personaje-movimiento');
            this.recuadroPe.setVisible(true);
            this.botonSiguiente.setVisible(true);
            this.texto.setVisible(true);
        });

        // Botón Siguiente
        this.botonSiguiente.on('pointerdown', () => {
            this.dialogoActual++;
            if (this.dialogoActual < this.dialogos.length) {
                this.texto.setText(this.dialogos[this.dialogoActual]);
            } else {
                this.iniciarSecuenciaFinal();
            }
        });

        // Iniciar secuencia cinemática
        this.AnimacionFinalParteUno.play('AnimacionFinalParteUno-movimiento');

        // 6. GESTIÓN DE AUDIO INICIAL
        if (!this.sound.get('musicaFondo')) {
            this.musica = this.sound.add('musicaFondo', { loop: true, volume: 0.5 });
            this.musica.play();
        } else {
            this.musica = this.sound.get('musicaFondo');
            if (!this.musica.isPlaying) this.musica.play();
        }

        // 7. RESPONSIVIDAD
        this.aplicarReescalado();
        this.scale.on('resize', () => this.aplicarReescalado());
        
        agregarEfectoHover(this.botonSiguiente);
    }

    iniciarSecuenciaFinal() {
        // Limpieza visual inmediata del layout de diálogos
        this.ocultarTodo();

        // Lanzamos la parte 2 (Transición hacia la radio)
        this.AnimacionFinalParteDos.setVisible(true).setDepth(2);
        this.AnimacionFinalParteDos.play('AnimacionFinalParteDos-movimiento');

        // Al terminar la transición, pasamos al loop definitivo y música de créditos
        this.AnimacionFinalParteDos.once('animationcomplete', () => {
            this.AnimacionFinalParteDos.setVisible(false);

            // Loop infinito de la radio encendida
            this.AnimacionFinalParteTres.setVisible(true).setDepth(6);
            this.AnimacionFinalParteTres.play('AnimacionFinalParteTres-movimiento');

            // Fade Out / Pausa de la música normal del juego
            const musicaFondo = this.sound.get('musicaFondo');
            if (musicaFondo && musicaFondo.isPlaying) {
                musicaFondo.pause();
            }

            // Reproducción de la canción de créditos (32 segundos)
            let musicaFinal = this.sound.get('musicaFinal');
            if (!musicaFinal) {
                musicaFinal = this.sound.add('musicaFinal', { loop: false, volume: 0.5 });
            }
            if (musicaFinal.isPlaying) {
                musicaFinal.stop();
            }

            // Fin absoluto del juego
            musicaFinal.once('complete', () => {
                this.ocultarTodo();

                // Pantalla fija de "Fin"
                if (this.ImagenFinal) {
                    this.ImagenFinal.setVisible(true).setDepth(10);
                }
                
                // Esperamos 2 segundos en la pantalla de fin y reiniciamos el juego completo
                this.time.delayedCall(2000, () => {
                    this.sound.stopAll();
                    // Limpiamos la bandera de victoria global del juego por si vuelven a jugar
                    window.todosEnemigosVencidos = false; 
                    this.scene.start('EscenaInicio'); 
                });
            });

            musicaFinal.play();
        });
    }

    ocultarTodo() {
        const elementos = [
            'AnimacionFinalParteUno', 'AnimacionFinalParteDos', 'AnimacionFinalParteTres',
            'FondoTelevision', 'recuadroPe', 'botonSiguiente', 'personaje', 'texto', 'ImagenFinal'
        ];
        elementos.forEach(name => {
            if (this[name] && typeof this[name].setVisible === 'function') {
                this[name].setVisible(false);
            }
        });
    }

    aplicarReescalado() {
        reescalarGlobalFlexible(this, [
            // Elementos cinemáticos ocupan pantalla completa (autoFill)
            { obj: this.AnimacionFinalParteUno, posX: 0.5, posY: 0.5, autoFill: true },
            { obj: this.FondoTelevision, posX: 0.5, posY: 0.5, autoFill: true },
            { obj: this.AnimacionFinalParteDos, posX: 0.5, posY: 0.5, autoFill: true },
            { obj: this.AnimacionFinalParteTres, posX: 0.5, posY: 0.5, autoFill: true },
            { obj: this.ImagenFinal, posX: 0.5, posY: 0.5, autoFill: true },

            // Layout de Interfaz Narrativa
            { obj: this.personaje, posX: 0.5, posY: 0.8, escalaRelativa: 0.5 },
            { obj: this.recuadroPe, posX: 0.3, posY: 0.2, escalaRelativa: 1.18 },
            { obj: this.botonSiguiente, posX: 0.3, posY: 0.44, escalaRelativa: 0.34 }
        ]);

        this.botonSiguiente.escalaBase = this.botonSiguiente.scale;
    }
}