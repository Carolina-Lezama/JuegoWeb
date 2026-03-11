import { personajeHumanoEnUso, personajeGatoEnUso, ApartadoMenu, setPersonajeHumanoEnUso, setPersonajeGatoEnUso, setApartadoMenu } from '../globals.js';
import { nombre } from '../globals.js';
import { isMobile, getPosEscala, reescalarGlobalFlexible,cargarPersonajeActual, cargarGatoActual, createAndAdaptTextFlexible } from '../responsive.js';
//---ESCENA DEL BOSQUE PARTE FINAL

export class EscenaBosque2  extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaBosque2' });
    }
    preload() {
    }
    create() {
    this.fondo = this.add.image(0, 0, 'fondoBosque');
    this.recuadro = this.add.image(0, 0, 'recuadro').setInteractive().setDepth(2);
    this.recuadroMa = this.add.image(0, 0, 'recuadroM').setInteractive().setDepth(2).setVisible(false);
    this.recuadroPe = this.add.image(0, 0, 'recuadroP').setInteractive().setDepth(2).setVisible(false);
    this.gato = this.add.sprite(0, 0, 'gato');
    this.anims.create({
        key: 'gato-movimiento',
        frames: this.anims.generateFrameNumbers('gato', { start: 0, end: 7 }),
        frameRate: 3,
        repeat: -1
    });
    this.mago = this.add.sprite(0, 0, 'mago').setVisible(true).setDepth(10);
    this.anims.create({
        key: 'mago-movimiento',
        frames: this.anims.generateFrameNumbers('mago', { start: 0, end: 4 }),
        frameRate: 5,
        repeat: -1
    });
    this.boton = this.add.image(0, 0, 'botonSiguiente').setInteractive();
    this.botonS = this.add.image(0, 0, 'botonSaltar').setInteractive();

    let e_uno = '(El niño, ahora transformado en un gato, no podía decir nada.)';
    let e_dos = 'Mago desconocido (desde su mente): Por ahora tendremos que hablar mentalmente. Dime, ¿cómo te sientes?';
    let e_tres = 'Gato (niño): ¿Por qué soy un gato?';
    let e_cuatro = 'Mago desconocido: Los gatos son inteligentes. Vayamos a mi casa: te daré unas herramientas que utilizarás. Luego, partirás.';
    let e_cinco = 'Gato (niño): ¿Me dejarás solo? ¿Qué se supone que debo hacer?';
    let e_seis = 'Mago desconocido: Así es tu destino. Por cierto, ¿cómo te llamas? Mi nombre es Thalor.';
    let e_siete ='Gato (niño): Soy ...';
    let e_ocho= String(nombre);
    this.dialogos = [
        e_uno,e_dos,e_tres,e_cuatro,e_cinco,e_seis,e_siete,e_ocho
    ];
    this.dialogoActual = 0;

    // Texto adaptativo
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
    this.gato.anims.play('gato-movimiento', true);
    this.mago.anims.play('mago-movimiento', true);
    this.botonS.on('pointerdown', () => {
        this.scene.start('EscenaCabanaAfuera');
    });
    this.boton.on('pointerdown', () => {
        this.dialogoActual++;
        if (this.dialogoActual < this.dialogos.length) {
            this.texto.setText(this.dialogos[this.dialogoActual]);
            this.actualizarEscenaPorDialogo(this.dialogoActual);
        } else {
            const input = document.getElementById('nombreInput');
            if (input) input.remove();
            this.scene.start('EscenaCabanaAfuera');
        }
    });
    this.aplicarReescalado();
    this.scale.on('resize', () => {
        this.aplicarReescalado();
    });
}
    actualizarEscenaPorDialogo(dialogoIndex) {
        const mostrarMago = [1, 3, 5];
        const mostrarPe = [2, 4, 6, 7];
        const mostrarNormal = [0];

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
            obj: this.gato,
            posX: getPosEscala(0.51, 0),
            posY: getPosEscala(0.81, 0),
            escalaRelativa: getPosEscala(0.3, 0),
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
        }
    ]);
    this.fondo.setPosition(this.scale.width / 2, this.scale.height / 2);
    this.texto.setOrigin(0.5, 0.5).setDepth(3);
    this.boton.setOrigin(0.5, 0.5).setDepth(4);
    this.botonS.setOrigin(0.5, 0.5).setDepth(4);
}
    update() {}
}