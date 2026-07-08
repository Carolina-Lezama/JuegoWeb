import { getPersonajeActivo } from '../globals.js';
import { agregarEfectoHover } from '../uiHelpers.js';

export class EscenaFinal extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaFinal' });
    }

    create() {
        // ==============================================================
        // 1. DETERMINAR QUÉ PERSONAJE USAR (Fuente Única de Verdad)
        // ==============================================================
        const claveHumano = getPersonajeActivo();
        const animHumano = `movimiento-${claveHumano}`;

        // ==============================================================
        // 2. ANIMACIÓN PARTE UNO (Cierre de la cinemática)
        // ==============================================================
        this.AnimacionFinalParteUno = this.add.sprite(825, 450, 'AnimacionFinalParteUno').setDepth(1);
        
        if (!this.anims.exists('AnimacionFinalParteUno-movimiento')) {
            this.anims.create({
                key: 'AnimacionFinalParteUno-movimiento',
                frames: this.anims.generateFrameNumbers('AnimacionFinalParteUno', { start: 0, end: 31 }),
                frameRate: 5,
                repeat: 0
            });
        }

        // ==============================================================
        // 3. ELEMENTOS DE LA HABITACIÓN (Fondo, Sprites y UI Estática)
        // ==============================================================
        this.FondoTelevision = this.add.image(825, 450, 'FondoTelevision').setVisible(false).setDepth(2);
        this.recuadroPe = this.add.image(495, 180, 'recuadroP').setDepth(3).setVisible(false).setScale(1.7,1.2);
        
        // Usamos la clave dinámica del personaje activo aquí:
        this.personaje = this.add.sprite(825, 720, claveHumano).setVisible(false).setDepth(4).setScale(2);
        
        this.botonSiguiente = this.add.image(495, 396, 'botonSiguiente').setDepth(5).setVisible(false).setInteractive({ useHandCursor: true }).setScale(1);        
        this.ImagenFinal = this.add.image(825, 450, 'ImagenFinal').setVisible(false).setDepth(6);

        // Generamos la animación dinámicamente según el personaje cargado
        if (!this.anims.exists(animHumano)) {
            this.anims.create({
                key: animHumano,
                frames: this.anims.generateFrameNumbers(claveHumano, { start: 0, end: 4 }),
                frameRate: 5,
                repeat: -1
            });
        }

        // Texto de diálogo corregido a formato nativo
        this.texto = this.add.text(462, 162, '', {
            font: '38px Arial',
            fill: '#000000',
            wordWrap: { width: 970 }
        }).setOrigin(0.5, 0.5).setDepth(5).setVisible(false);

        // ==============================================================
        // 4. ANIMACIONES POSTERIORES (Partes 2 y 3)
        // ==============================================================
        this.AnimacionFinalParteDos = this.add.sprite(825, 450, 'AnimacionFinalParteDos').setVisible(false).setDepth(2);
        if (!this.anims.exists('AnimacionFinalParteDos-movimiento')) {
            this.anims.create({
                key: 'AnimacionFinalParteDos-movimiento',
                frames: this.anims.generateFrameNumbers('AnimacionFinalParteDos', { start: 0, end: 7 }),
                frameRate: 3,
                repeat: 0
            });
        }

        this.AnimacionFinalParteTres = this.add.sprite(825, 450, 'AnimacionFinalParteTres').setVisible(false).setDepth(6);
        if (!this.anims.exists('AnimacionFinalParteTres-movimiento')) {
            this.anims.create({
                key: 'AnimacionFinalParteTres-movimiento',
                frames: this.anims.generateFrameNumbers('AnimacionFinalParteTres', { start: 0, end: 3 }),
                frameRate: 5,
                repeat: -1
            });
        }

        // ==============================================================
        // 5. CONFIGURACIÓN DE DIÁLOGOS
        // ==============================================================
        this.dialogos = [
            'Ese fue un sueño muy raro.',
            'Mejor escuchemos un rato la radio.'
        ];
        this.dialogoActual = 0;
        this.texto.setText(this.dialogos[this.dialogoActual]);

        // ==============================================================
        // 6. FLUJO NARRATIVO Y DISPARADORES
        // ==============================================================
        this.AnimacionFinalParteUno.on('animationcomplete', () => {
            this.AnimacionFinalParteUno.setVisible(false);
            this.FondoTelevision.setVisible(true);

            // Activamos el sprite y ejecutamos la animación dinámica correspondiente
            this.personaje.setVisible(true).play(animHumano);
            this.recuadroPe.setVisible(true);
            this.botonSiguiente.setVisible(true);
            this.texto.setVisible(true);
        });

        this.botonSiguiente.on('pointerdown', () => {
            this.dialogoActual++;
            if (this.dialogoActual < this.dialogos.length) {
                this.texto.setText(this.dialogos[this.dialogoActual]);
            } else {
                this.iniciarSecuenciaFinal();
            }
        });

        // Iniciar secuencia cinemática automáticamente
        this.AnimacionFinalParteUno.play('AnimacionFinalParteUno-movimiento');

        // ==============================================================
        // 7. GESTIÓN DE AUDIO
        // ==============================================================
        if (!this.sound.get('musicaFondo')) {
            this.musica = this.sound.add('musicaFondo', { loop: true, volume: 0.5 });
            this.musica.play();
        } else {
            this.musica = this.sound.get('musicaFondo');
            if (!this.musica.isPlaying) this.musica.play();
        }
        
        agregarEfectoHover(this.botonSiguiente);
    }

    iniciarSecuenciaFinal() {
        this.ocultarTodo();

        this.AnimacionFinalParteDos.setVisible(true).setDepth(2);
        this.AnimacionFinalParteDos.play('AnimacionFinalParteDos-movimiento');

        this.AnimacionFinalParteDos.once('animationcomplete', () => {
            this.AnimacionFinalParteDos.setVisible(false);

            this.AnimacionFinalParteTres.setVisible(true).setDepth(6);
            this.AnimacionFinalParteTres.play('AnimacionFinalParteTres-movimiento');

            const musicaFondo = this.sound.get('musicaFondo');
            if (musicaFondo && musicaFondo.isPlaying) {
                musicaFondo.pause();
            }

            let musicaFinal = this.sound.get('musicaFinal');
            if (!musicaFinal) {
                musicaFinal = this.sound.add('musicaFinal', { loop: false, volume: 0.5 });
            }
            if (musicaFinal.isPlaying) {
                musicaFinal.stop();
            }

            musicaFinal.once('complete', () => {
                this.ocultarTodo();

                if (this.ImagenFinal) {
                    this.ImagenFinal.setVisible(true).setDepth(10);
                }
                
                this.time.delayedCall(2000, () => {
                    this.sound.stopAll();
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
}