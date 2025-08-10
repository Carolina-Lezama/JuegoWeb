import { personajeHumanoEnUso, personajeGatoEnUso, ApartadoMenu, setPersonajeHumanoEnUso, setPersonajeGatoEnUso, setApartadoMenu } from '../globals.js';
import { nombre } from '../globals.js';
import { isMobile, getPosEscala, reescalarGlobalFlexible,cargarPersonajeActual, cargarGatoActual, createAndAdaptTextFlexible } from '../responsive.js';

//---ESCENA DE LA CABAÑA AFUERA
export class EscenaCabanaAfuera  extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaCabanaAfuera' });
    }
    preload() {
    }
        create() {
        this.fondo = this.add.image(0, 0, 'FondoCabaña');
        this.recuadro = this.add.image(0, 0, 'recuadro').setInteractive().setDepth(2);
        this.recuadroMa = this.add.image(0, 0, 'recuadroM').setInteractive().setDepth(2).setVisible(false);
        this.recuadroPe = this.add.image(0, 0, 'recuadroP').setInteractive().setDepth(2).setVisible(false);
        this.gato = this.add.sprite(0, 0, 'gato');
        this.mago = this.add.sprite(0, 0, 'mago');
        this.anims.create({
            key: 'gato-movimiento',
            frames: this.anims.generateFrameNumbers('gato', { start: 0, end: 7 }),
            frameRate: 3,
            repeat: -1
        });
        this.anims.create({
            key: 'mago-movimiento',
            frames: this.anims.generateFrameNumbers('mago', { start: 0, end: 4 }),
            frameRate: 5,
            repeat: -1
        });
        this.boton = this.add.image(0, 0, 'botonSiguiente').setInteractive();
        this.botonS = this.add.image(0, 0, 'botonSaltar').setInteractive();

        let e_uno = '(Llegan a la casa del mago, que es una cabaña acogedora en medio del bosque)';
        let e_dos = 'Thalor: Esta es mi casa. ¿Qué te parece? Es linda, ¿no?';
        let e_tres = 'Carlitos: Miau, miau, miau. (Es acogedora como mi casa.)';
        let e_cuatro = 'Thalor: Rápido, entremos. La noche es peligrosa. Saldremos mañana, para que te vayas.';
        let e_cinco = '(Entran a casa.)';
        this.dialogos = [
            e_uno,e_dos,e_tres,e_cuatro,e_cinco
        ];
        this.dialogoActual = 0;
        this.texto = createAndAdaptTextFlexible(this, {
            text: this.dialogos[this.dialogoActual],
            posX: 0.74,
            posY: 0.19,
            maxWidth: 850,
            maxHeight: 500,
            fontSizeInicial: 36,
            fontSizeMinimo: 10,
            originX: 0.5,
            originY: 0.5,
            config: {
                fontFamily: 'Silkscreen',
                color: '#000000',
                align: 'center'
            }
        });
        this.gato.anims.play('gato-movimiento', true);
        this.mago.anims.play('mago-movimiento', true);
        this.botonS.on('pointerdown', () => {
                this.scene.start('EscenaCabanaAdentro');
        });
    this.boton.on('pointerdown', () => {
        this.dialogoActual++;
        if (this.dialogoActual < this.dialogos.length) {
            this.texto.setText(this.dialogos[this.dialogoActual]);
            this.actualizarEscenaPorDialogo(this.dialogoActual);
        } else {
            const input = document.getElementById('nombreInput');
            if (input) input.remove();
            this.scene.start('EscenaCabanaAdentro');
        }
    });
    this.aplicarReescalado();
    this.scale.on('resize', () => {
        this.aplicarReescalado();
    });
}
    actualizarEscenaPorDialogo(dialogoIndex) {
        const mostrarMago = [1, 3];
        const mostrarPe = [2];
        const mostrarNormal = [0, 4];

        this.recuadro.setVisible(false);
        this.recuadroMa.setVisible(false);
        this.recuadroPe.setVisible(false);

        if (mostrarMago.includes(dialogoIndex)) {
            this.recuadroMa.setVisible(true);
        } else if (mostrarPe.includes(dialogoIndex)) {
            this.recuadroPe.setVisible(true);
        } else if (mostrarNormal.includes(dialogoIndex)) {
            this.recuadro.setVisible(true);
        }   
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
                posX: getPosEscala(0.85, 0),
                posY: getPosEscala(0.22, 0),
                escalaRelativa: getPosEscala(1.5, 0),
                originX: 0.5,
                originY: 0.5
            },
            {
                obj: this.recuadroPe,
                posX: getPosEscala(0.73, 0),
                posY: getPosEscala(0.19, 0),
                escalaRelativa: getPosEscala(1.03, 0),
                originX: 0.5,
                originY: 0.5
            },
            {
                obj: this.recuadroMa,
                posX: getPosEscala(0.73, 0),
                posY: getPosEscala(0.19, 0),
                escalaRelativa: getPosEscala(1.04, 0),
                originX: 0.5,
                originY: 0.5
            },
            {
                obj: this.boton,
                posX: getPosEscala(0.73, 0),
                posY: getPosEscala(0.4207, 0),
                escalaRelativa: getPosEscala(0.32, 0),
                originX: 0.5,
                originY: 0.5
            },
            {
                obj: this.botonS,
                posX: getPosEscala(0.9, 0),
                posY: getPosEscala(0.409, 0),
                escalaRelativa: getPosEscala(0.32, 0),
                originX: 0.5,
                originY: 0.5
            },
            {
                obj: this.gato,
                posX: getPosEscala(0.24, 0),
                posY: getPosEscala(0.81, 0),
                escalaRelativa: getPosEscala(0.24, 0),
                originX: 0.5,
                originY: 0.5
            },
            {
                obj: this.mago,
                posX: getPosEscala(0.44, 0),
                posY: getPosEscala(0.67, 0),
                escalaRelativa: getPosEscala(0.3, 0),
                originX: 0.5,
                originY: 0.5
            }
        ]);
        this.fondo.setPosition(this.scale.width / 2, this.scale.height );
        this.texto.setOrigin(0.5, 0.5).setDepth(3);
        this.boton.setOrigin(0.5, 0.5).setDepth(4);
        this.botonS.setOrigin(0.5, 0.5).setDepth(4);
    }
    update() {}

}