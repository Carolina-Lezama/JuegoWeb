import { personajeHumanoEnUso, personajeGatoEnUso, ApartadoMenu, setPersonajeHumanoEnUso, setPersonajeGatoEnUso, setApartadoMenu } from '../globals.js';
import { dialogosRecuperados } from '../globals.js';
import { isMobile, getPosEscala, reescalarGlobalFlexible,cargarPersonajeActual, cargarGatoActual, createAndAdaptTextFlexible } from '../responsive.js';
//---ESCENA DE ENCUENTRO ENTRE NIÑO Y MAGO
export class EscenaIntroduccionUno extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaIntroduccionUno' });
    }
    preload() {
    }
    create() {
        this.fondo = this.add.image(0, 0, 'fondoIntroduccionUno');
        this.recuadro = this.add.image(0, 0, 'recuadro').setInteractive().setDepth(2);
        this.personaje = this.add.sprite(0, 0, 'personajeUsar');
        this.anims.create({
            key: 'personaje-movimiento',
            frames: this.anims.generateFrameNumbers('personajeUsar', { start: 0, end: 4 }),
            frameRate: 5,
            repeat: -1
        });
        this.animacionFondo = this.add.sprite(0, 0, 'fondoAnimado').setVisible(false).setDepth(10);
        this.anims.create({
            key: 'fondoAnimadoFinal',
            frames: this.anims.generateFrameNumbers('fondoAnimado', { start: 0, end: 38 }),
            frameRate: 8,
            repeat: 0
        });
        this.boton = this.add.image(0, 0, 'botonSiguiente').setInteractive();
        this.botonS = this.add.image(0, 0, 'botonSaltar').setInteractive();
        let estatico_uno = 'Había una vez un niño que adoraba los mundos de fantasía, las historias de magia y los caballeros.';
        let estatico_dos = 'Vencer enemigos, ser un héroe... todos esos sueños que tiene un niño de ocho años.';
        let estatico_tres = 'Lastimosamente, el niño no sabía que había alguien más que podía conocer sus deseos… alguien que haría su sueño realidad, aunque no de la forma en que él lo esperaba.';
        this.dialogos = [
            dialogosRecuperados?.introduccion_uno || estatico_uno,
            dialogosRecuperados?.introduccion_dos || estatico_dos,
            dialogosRecuperados?.introduccion_tres || estatico_tres
        ];
        this.dialogoActual = 0;
        this.texto = createAndAdaptTextFlexible(this, {
            text: this.dialogos[this.dialogoActual],
            posX: 0.71,
            posY: 0.22,
            maxWidth: 970,
            maxHeight: 500,
            fontSizeInicial: 41,
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
            this.recuadro.setVisible(false);
            this.personaje.setVisible(false);
            this.animacionFondo.setVisible(true);
            this.animacionFondo.setDepth(10);
            this.animacionFondo.anims.play('fondoAnimadoFinal', true);
            this.animacionFondo.once('animationcomplete', () => {
                this.scene.start('EscenaBosque');
            });
        };
        this.botonS.on('pointerdown', () => {
            animarFondo();
        });
        this.boton.on('pointerdown', () => {
            this.dialogoActual++;
            if (this.dialogoActual < this.dialogos.length) {
                this.texto.setText(this.dialogos[this.dialogoActual]);
            } else {
                animarFondo();
            }
        });
        this.aplicarReescalado();
        this.scale.on('resize', () => this.aplicarReescalado());
    }
    aplicarReescalado() {
        reescalarGlobalFlexible(this.scale, [
            {
                obj: this.fondo,
                autoFill: true,
                originX: 0.5,
                originY: 1
            },
            {
                obj: this.recuadro,
                posX: getPosEscala(0.83, 0),
                posY: getPosEscala(0.25, 0),
                escalaRelativa: getPosEscala(1.7, 0),
                originX: 0.5,
                originY: 0.5
            },
            {
                obj: this.boton,
                posX: getPosEscala(0.88, 0),
                posY: getPosEscala(0.48, 0),
                escalaRelativa: getPosEscala(0.38, 0),
                originX: 0.5,
                originY: 0.5
            },
            {
                obj: this.botonS,
                posX: getPosEscala(0.5, 0),
                posY: getPosEscala(0.46, 0),
                escalaRelativa: getPosEscala(0.38, 0),
                originX: 0.5,
                originY: 0.5
            },
            {
                obj: this.personaje,
                posX: getPosEscala(0.17, 0),
                posY: getPosEscala(0.68, 0),
                escalaRelativa: getPosEscala(0.35, 0),
                originX: 0.5,
                originY: 0.5
            },
            {
                obj: this.animacionFondo,
                autoFill: true,
                originX: 0.5,
                originY: 1
            }
        ]);
        this.fondo.setPosition(this.scale.width / 2, this.scale.height);
        this.texto.setOrigin(0.5, 0.5).setDepth(3);
        this.boton.setOrigin(0.5, 0.5).setDepth(5);
        this.botonS.setOrigin(0.5, 0.5).setDepth(5);
        this.animacionFondo.setPosition(this.scale.width / 2, this.scale.height);
    }
    update() {}
}