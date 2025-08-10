import { personajeHumanoEnUso, personajeGatoEnUso, ApartadoMenu, setPersonajeHumanoEnUso, setPersonajeGatoEnUso, setApartadoMenu } from '../globals.js';
import { dialogosRecuperados } from '../globals.js';
import { isMobile, getPosEscala, reescalarGlobalFlexible,cargarPersonajeActual, cargarGatoActual, createAndAdaptTextFlexible } from '../responsive.js';
//---ESCENA DEL BOSQUE PRIMERA PARTE
export class EscenaBosque extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaBosque' });
    }
    preload() {
    }
    create() {
        this.fondo = this.add.image(0, 0, 'fondoBosque');
        this.recuadro = this.add.image(0, 0, 'recuadro').setInteractive().setDepth(2);
        this.recuadroMa = this.add.image(0, 0, 'recuadroM').setInteractive().setDepth(2).setVisible(false);
        this.recuadroPe = this.add.image(0, 0, 'recuadroP').setInteractive().setDepth(2).setVisible(false);
        this.personaje = this.add.sprite(0, 0, 'personajeUsar');
        this.anims.create({
            key: 'personaje-movimiento',
            frames: this.anims.generateFrameNumbers('personajeUsar', { start: 0, end: 4 }),
            frameRate: 5,
            repeat: -1
        });
        this.mago = this.add.sprite(0, 0, 'mago').setVisible(false).setDepth(10);
        this.anims.create({
            key: 'mago-movimiento',
            frames: this.anims.generateFrameNumbers('mago', { start: 0, end: 4 }),
            frameRate: 5,
            repeat: -1
        });
        this.animacionFondoBosque = this.add.sprite(0, 0, 'fondoAnimadoBosque').setVisible(false).setDepth(10);
        this.anims.create({
            key: 'fondoAnimadoBosqueFinal',
            frames: this.anims.generateFrameNumbers('fondoAnimadoBosque', { start: 0, end: 36 }),
            frameRate: 5,
            repeat: 0
        });
        this.boton = this.add.image(0, 0, 'botonSiguiente').setInteractive();
        this.botonS = this.add.image(0, 0, 'botonSaltar').setInteractive();
        let e_uno = 'El niño fue llevado a un mundo desconocido que él no podía reconocer: ¿dónde estaba y qué hacía él allí?';
        let e_dos = 'A lo lejos, escuchó que alguien se acercaba; parecía ser un hombre alto, con ropas extrañas.';
        let e_tres = 'Mago desconocido: ¿Quién eres tú? No eres de por aquí, ¿verdad? ¿Necesitas ayuda?';
        let e_cuatro = 'Niño: No sé qué pasó… Tengo miedo. ¿Qué debo hacer?';
        let e_cinco = '(El hombre pensó por un instante, con la mirada fija en el niño.)';
        let e_seis = 'Mago desconocido: A veces, los sueños que dan miedo… solo están tomando una nueva forma. Pero primero necesitas valor, pequeño viajero. ¿Estás dispuesto a descubrir lo que este mundo guarda para ti?';
        let e_siete ='(El niño lo miró con duda, cuidadoso por el miedo. No sabía qué responder.)';
        let e_ocho = 'Te daré una pequeña ayuda… algo que te guíe para descubrir tu propósito aquí.';
        this.dialogos = [
            e_uno,e_dos,e_tres,e_cuatro,e_cinco,e_seis,e_siete,e_ocho
        ];
        this.dialogoActual = 0;
        this.texto = createAndAdaptTextFlexible(this, {
            text: this.dialogos[this.dialogoActual],
            posX: 0.31,
            posY: 0.19,
            maxWidth: 970,
            maxHeight: 500,
            fontSizeInicial: 38,
            fontSizeMinimo: 10,
            originX: 0.5,
            originY: 0.5,
            config: {
                fontFamily: 'Silkscreen',
                color: '#000000',
                align: 'center'
            }
        });
        this.personaje.anims.play('personaje-movimiento', true);
        const animarFondo = () => {
            this.texto.setVisible(false);
            this.boton.setVisible(false);
            this.botonS.setVisible(false);
            this.recuadroMa.setVisible(false);
            this.personaje.setVisible(false);
            this.mago.setVisible(false);
            this.animacionFondoBosque.setVisible(true);
            this.animacionFondoBosque.setDepth(10);
            this.animacionFondoBosque.anims.play('fondoAnimadoBosqueFinal', true);
            this.animacionFondoBosque.once('animationcomplete', () => {
                this.scene.start('EscenaBosque2');
            });
        };
        this.botonS.on('pointerdown', () => {
                animarFondo();
        });
        
        this.boton.on('pointerdown', () => {
            this.dialogoActual++;
            if (this.dialogoActual < this.dialogos.length) {
                this.texto.setText(this.dialogos[this.dialogoActual]);
                this.actualizarEscenaPorDialogo(this.dialogoActual);
            } else {
                animarFondo();
            }
        });
        this.aplicarReescalado();
        this.scale.on('resize', () => {
            this.aplicarReescalado();
        });
    }
    actualizarEscenaPorDialogo(dialogoIndex) {
        const mostrarMago = [2, 5, 7];
        const mostrarPe = [3];
        const mostrarNormal = [4, 6];
        const mostrarAnimacion = [0, 1];

        // Oculta todo primero (evita inconsistencias)
        this.recuadro.setVisible(false);
        this.recuadroMa.setVisible(false);
        this.recuadroPe.setVisible(false);
        this.mago.setVisible(false);

        if (mostrarMago.includes(dialogoIndex)) {
            this.mago.setVisible(true);
            this.recuadroMa.setVisible(true);
            this.mago.anims.play('mago-movimiento', true);
        } else if (mostrarPe.includes(dialogoIndex)) {
            this.recuadroPe.setVisible(true);
            this.mago.setVisible(true);
        } else if (mostrarNormal.includes(dialogoIndex)) {
            this.recuadro.setVisible(true);
            this.mago.setVisible(true);
        } else if (mostrarAnimacion.includes(dialogoIndex)) {
            this.recuadro.setVisible(true);
            this.mago.setVisible(false);
        }
    }
    aplicarReescalado() {
        reescalarGlobalFlexible(this.scale, [
            {
                obj: this.fondo,
                autoFill: true,
                originX: 0.5,
                originY: 0.5
            },
            {
                obj: this.recuadro,
                posX: getPosEscala(0.43, 0),
                posY: getPosEscala(0.22, 0),
                escalaRelativa: getPosEscala(1.7, 0),
                originX: 0.5,
                originY: 0.5
            },
            {
                obj: this.recuadroPe,
                posX: getPosEscala(0.3, 0),
                posY: getPosEscala(0.2, 0),
                escalaRelativa: getPosEscala(1.18, 0),
                originX: 0.5,
                originY: 0.5
            },
            {
                obj: this.recuadroMa,
                posX: getPosEscala(0.3, 0),
                posY: getPosEscala(0.2, 0),
                escalaRelativa: getPosEscala(1.18, 0),
                originX: 0.5,
                originY: 0.5
            },
            {
                obj: this.boton,
                posX: getPosEscala(0.3, 0),
                posY: getPosEscala(0.44, 0),
                escalaRelativa: getPosEscala(0.34, 0),
                originX: 0.5,
                originY: 0.5
            },
            {
                obj: this.botonS,
                posX: getPosEscala(0.1, 0),
                posY: getPosEscala(0.43, 0),
                escalaRelativa: getPosEscala(0.34, 0),
                originX: 0.5,
                originY: 0.5
            },
            {
                obj: this.personaje,
                posX: getPosEscala(0.51, 0),
                posY: getPosEscala(0.69, 0),
                escalaRelativa: getPosEscala(0.32, 0),
                originX: 0.5,
                originY: 0.5
            },
            {
                obj: this.mago,
                posX: getPosEscala(0.72, 0),
                posY: getPosEscala(0.62, 0),
                escalaRelativa: getPosEscala(0.38, 0),
                originX: 0.5,
                originY: 0.5
            },
            {
                obj: this.animacionFondoBosque,
                autoFill: true,
                originX: 0.5,
                originY: 0.5
            }
        ]);
        this.fondo.setPosition(this.scale.width / 2, this.scale.height / 2);
        this.texto.setOrigin(0.5, 0.5).setDepth(3);
        this.boton.setOrigin(0.5, 0.5).setDepth(4);
        this.botonS.setOrigin(0.5, 0.5).setDepth(4);
        this.animacionFondoBosque.setPosition(this.scale.width / 2, this.scale.height/2);

    }
    update() {}
}