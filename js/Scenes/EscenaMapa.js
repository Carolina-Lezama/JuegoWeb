import { objetosDelPersonaje, datosObjetos,objetos,objetosActivos, personajeHumanoEnUso, personajeGatoEnUso, ApartadoMenu, setPersonajeHumanoEnUso, setPersonajeGatoEnUso, setApartadoMenu, puntosTotales } from '../globals.js';
import { isMobile, getPosEscala, reescalarGlobalFlexible,cargarPersonajeActual, cargarGatoActual, createAndAdaptTextFlexible, extraerDatosObjetoPorId  } from '../responsive.js';
//--- ESCENA DE LA CABAÑA ADENTRO

export class EscenaMapa  extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaMapa' });
    }
    preload() {
    }
        create() {
        this.EscenaMapa = this.add.image(0, 0, 'EscenaMapa');
        this.botonFinalizar = this.add.image(0, 0, 'botonFinalizar').setInteractive().setDepth(10).setVisible(true);
        this.IconoCaballero = this.add.image(0, 0, 'IconoCaballero').setInteractive().setDepth(10).setVisible(true);
        this.IconoCalaca = this.add.image(0, 0, 'IconoCalaca').setInteractive().setDepth(10).setVisible(true);
        this.IconoDuende = this.add.image(0, 0, 'IconoDuende').setInteractive().setDepth(10).setVisible(true);
        this.IconoSlime = this.add.image(0, 0, 'IconoSlime').setInteractive().setDepth(10).setVisible(true);
        this.gato = this.add.sprite(0, 0, 'gato');
        this.gato.setFlipX(true); 
        this.mago = this.add.sprite(0, 0, 'mago');
        this.mago.setFlipX(true); 
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

        this.gato.anims.play('gato-movimiento', true);
        this.mago.anims.play('mago-movimiento', true);

        this.botonFinalizar.on('pointerdown', () => {
            this.scene.start('EscenaFinal');
        });
        this.IconoSlime.on('pointerdown', () => {
            this.scene.start('EscenaPeleaSlime');

        });        
        this.IconoCaballero.on('pointerdown', () => {
            this.scene.start('EscenaCastilloIfernal');

        });        
        this.IconoCalaca.on('pointerdown', () => {
            this.scene.start('EscenaCementerio');

        });        
        this.IconoDuende.on('pointerdown', () => {
            this.scene.start('EscenaCasaAbandonada');

        });
    this.aplicarReescalado();
    this.scale.on('resize', () => {
        this.aplicarReescalado();
    });
            this.texto1 = createAndAdaptTextFlexible(this, {
            text: 'Puntos',
            posX: 0.5,
            posY: 0.1,
            maxWidth: 950,
            maxHeight: 500,
            fontSizeInicial: 110,
            fontSizeMinimo: 18,
            originX: 0.5,
            originY: 0.5,
            config: {
                fontFamily: 'Silkscreen',
                color: '#000000',
                align: 'center'
            }
        });
        this.texto2 = createAndAdaptTextFlexible(this, {
            text: puntosTotales,
            posX: 0.5,
            posY: 0.25,
            maxWidth: 950,
            maxHeight: 500,
            fontSizeInicial: 85,
            fontSizeMinimo: 18,
            originX: 0.5,
            originY: 0.5,
            config: {
                fontFamily: 'Silkscreen',
                color: '#000000',
                align: 'center'
            }
        });
}
    aplicarReescalado() {
        reescalarGlobalFlexible(this.scale, [
            {
                obj: this.EscenaMapa,
                autoFill: true,
                originX: 0.5,
                originY: 0.5
            },
            {
                obj: this.gato,
                posX: getPosEscala(0.58, 0),
                posY: getPosEscala(0.9, 0),
                escalaRelativa: getPosEscala(0.19, 0),
                originX: 0.5,
                originY: 0.5
            },
            {
                obj: this.mago,
                posX: getPosEscala(0.44, 0),
                posY: getPosEscala(0.8, 0),
                escalaRelativa: getPosEscala(0.22, 0),
                originX: 0.5,
                originY: 0.5
            },           
            {
                obj: this.botonFinalizar,
                posX: getPosEscala(0.5, 0),
                posY: getPosEscala(0.5, 0),
                escalaRelativa: getPosEscala(0.5, 0),
                originX: 0.5,
                originY: 0.5
            },           
            {
                obj: this.IconoCaballero,
                posX: getPosEscala(0.8, 0),
                posY: getPosEscala(0.7, 0),
                escalaRelativa: getPosEscala(0.32, 0),
                originX: 0.5,
                originY: 0.5
            }  ,           
            {
                obj: this.IconoCalaca,
                posX: getPosEscala(0.2, 0),
                posY: getPosEscala(0.7, 0),
                escalaRelativa: getPosEscala(0.32, 0),
                originX: 0.5,
                originY: 0.5
            }  ,           
            {
                obj: this.IconoDuende,
                posX: getPosEscala(0.8, 0),
                posY: getPosEscala(0.3, 0),
                escalaRelativa: getPosEscala(0.32, 0),
                originX: 0.5,
                originY: 0.5
            }  ,           
            {
                obj: this.IconoSlime,
                posX: getPosEscala(0.2, 0),
                posY: getPosEscala(0.3, 0),
                escalaRelativa: getPosEscala(0.32, 0),
                originX: 0.5,
                originY: 0.5
            }           
        ]); 
        this.EscenaMapa.setPosition(this.scale.width / 2, this.scale.height / 2);
    }
    update() {}
}
