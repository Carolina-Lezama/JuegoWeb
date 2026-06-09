import { getState } from '../globals.js';
import { reescalarGlobalFlexible, createAndAdaptTextFlexible } from '../uiHelpers.js';

export class EscenaIntroduccionUno extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaIntroduccionUno' });
    }

    create() {
        // 1. ELEMENTOS VISUALES ESTÁTICOS
        this.fondo = this.add.image(0, 0, 'fondoIntroduccionUno').setDepth(1);
        this.recuadro = this.add.image(0, 0, 'recuadro').setDepth(2);
        
        // Botones interactivos
        this.regreso = this.add.image(0, 0, 'regreso').setDepth(10).setInteractive({ useHandCursor: true });
        this.boton = this.add.image(0, 0, 'botonSiguiente').setDepth(5).setInteractive({ useHandCursor: true });
        this.botonS = this.add.image(0, 0, 'botonSaltar').setDepth(5).setInteractive({ useHandCursor: true });

        // 2. PERSONAJE Y ANIMACIONES
        this.personaje = this.add.sprite(0, 0, 'personajeUsar').setDepth(3);
        this.animacionFondo = this.add.sprite(0, 0, 'fondoAnimado').setVisible(false).setDepth(10);

        // Protegemos la creación de animaciones por si la escena se reinicia
        if (!this.anims.exists('personaje-movimiento')) {
            this.anims.create({
                key: 'personaje-movimiento',
                frames: this.anims.generateFrameNumbers('personajeUsar', { start: 0, end: 4 }),
                frameRate: 5,
                repeat: -1
            });
        }

        if (!this.anims.exists('fondoAnimadoFinal')) {
            this.anims.create({
                key: 'fondoAnimadoFinal',
                frames: this.anims.generateFrameNumbers('fondoAnimado', { start: 0, end: 38 }),
                frameRate: 8,
                repeat: 0
            });
        }

        this.personaje.play('personaje-movimiento');

        // 3. SISTEMA DE DIÁLOGOS
        // Obtenemos los diálogos de la base de datos a través de nuestro Gestor de Estado
        const dialogosAPI = getState().dialogos || {};
        
        this.dialogos = [
            dialogosAPI.introduccion_uno || 'Había una vez un niño que adoraba los mundos de fantasía, las historias de magia y los caballeros.',
            dialogosAPI.introduccion_dos || 'Vencer enemigos, ser un héroe... todos esos sueños que tiene un niño de ocho años.',
            dialogosAPI.introduccion_tres || 'Lastimosamente, el niño no sabía que había alguien más que podía conocer sus deseos… alguien que haría su sueño realidad, aunque no de la forma en que él lo esperaba.'
        ];
        this.dialogoActual = 0;

        // Texto dinámico inicial
        this.texto = createAndAdaptTextFlexible(this, {
            text: this.dialogos[this.dialogoActual],
            posX: 0.71,
            posY: 0.22,
            maxWidth: 970,
            fontSizeInicial: 41,
            originX: 0.5,
            originY: 0.5,
            color: '#000000'
        }).setDepth(4); // Debe ir por encima del recuadro

        // 4. LÓGICA DE EVENTOS (Flujo de la escena)
        const animarFondo = () => {
            this.texto.setVisible(false);
            this.boton.setVisible(false);
            this.botonS.setVisible(false);
            this.recuadro.setVisible(false);
            this.personaje.setVisible(false);
            
            this.animacionFondo.setVisible(true);
            this.animacionFondo.play('fondoAnimadoFinal');
            
            this.animacionFondo.once('animationcomplete', () => {
                this.scene.start('EscenaBosque');
            });
        };

        this.regreso.on('pointerdown', () => this.scene.start('EscenaInicio'));
        
        this.botonS.on('pointerdown', () => animarFondo());
        
        this.boton.on('pointerdown', () => {
            this.dialogoActual++;
            if (this.dialogoActual < this.dialogos.length) {
                this.texto.setText(this.dialogos[this.dialogoActual]);
            } else {
                animarFondo();
            }
        });

        // 5. EVENTOS HOVER (Feedback visual para botones)
        this.agregarEfectoHover(this.boton, 1.1);
        this.agregarEfectoHover(this.botonS, 1.1);
        this.agregarEfectoHover(this.regreso, 1.1);

        // 6. RESPONSIVIDAD
        this.aplicarReescalado();
        this.scale.on('resize', () => this.aplicarReescalado());
    }

    agregarEfectoHover(boton, multiplicador) {
        // Guarda la escala original inmediatamente después del reescalado
        boton.on('pointerover', () => boton.setScale(boton.escalaBase * multiplicador));
        boton.on('pointerout', () => boton.setScale(boton.escalaBase));
    }

    aplicarReescalado() {
        reescalarGlobalFlexible(this, [
            // Los fondos están anclados a la parte inferior (originY: 1, posY: 1)
            { obj: this.fondo, posX: 0.5, posY: 1, originX: 0.5, originY: 1, escalaRelativa: 1, autoFill: true },
            { obj: this.animacionFondo, posX: 0.5, posY: 1, originX: 0.5, originY: 1, escalaRelativa: 1, autoFill: true },
            
            { obj: this.recuadro, posX: 0.83, posY: 0.25, escalaRelativa: 1.7 },
            { obj: this.boton, posX: 0.88, posY: 0.48, escalaRelativa: 0.38 },
            { obj: this.botonS, posX: 0.5, posY: 0.46, escalaRelativa: 0.38 },
            { obj: this.personaje, posX: 0.17, posY: 0.68, escalaRelativa: 0.35 },
            { obj: this.regreso, posX: 0.05, posY: 0.1, escalaRelativa: 0.16 }
        ]);

        // Guardamos las escalas calculadas para el efecto hover
        this.boton.escalaBase = this.boton.scale;
        this.botonS.escalaBase = this.botonS.scale;
        this.regreso.escalaBase = this.regreso.scale;
    }
}