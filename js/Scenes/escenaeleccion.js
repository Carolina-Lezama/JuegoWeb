import { objetosDelPersonaje, datosObjetos,objetos,objetosActivos, personajeHumanoEnUso, personajeGatoEnUso, ApartadoMenu, setPersonajeHumanoEnUso, setPersonajeGatoEnUso, setApartadoMenu } from '../globals.js';
import { isMobile, getPosEscala, reescalarGlobalFlexible,cargarPersonajeActual, cargarGatoActual, createAndAdaptTextFlexible, extraerDatosObjetoPorId  } from '../uiHelpers.js';
//--- ESCENA DE COMO SE MUEVE EL USUARIO Y USO DEL ESPEJO

export class EscenaEleccion extends Phaser.Scene {
  constructor() {
    super({ key: 'EscenaEleccion' });
}

  preload() {

  }

  create() {
    this.fondo = this.add.image(0, 0, 'eleccion').setOrigin(0, 0).setDepth(0);
    
    this.lucha = this.add.text(0, 0, 'LUCHA', {
      fontSize: '52px',
      fontFamily: 'Silkscreen',
      color: '#ffd700',
      fontStyle: 'bold',
      stroke: '#ff6b00',
      strokeThickness: 4,
      shadow: {
        offsetX: 4,
        offsetY: 4,
        color: '#000000',
        blur: 8,
        fill: true
      },
      align: 'center'
    }).setOrigin(0.5);

    this.historia = this.add.text(0, 0, 'HISTORIA', {
      fontSize: '52px',
      fontFamily: 'Silkscreen',
      color: '#00d4ff',
      fontStyle: 'bold',
      stroke: '#6b21b6',
      strokeThickness: 4,
      shadow: {
        offsetX: 4,
        offsetY: 4,
        color: '#000000',
        blur: 8,
        fill: true
      },
      align: 'center'
    }).setOrigin(0.5);


    // LUCHA - Descripción/párrafo
    this.luchaDes = this.add.text(0, 0, 'Ir directo\na la batalla', {
      fontSize: '28px',
      fontFamily: 'Silkscreen',
      color: '#ffd700',
      fontStyle: 'bold',
      stroke: '#ff6b00',
      strokeThickness: 2,
      shadow: {
        offsetX: 3,
        offsetY: 3,
        color: '#000000',
        blur: 6,
        fill: true
      },
      align: 'center',
      lineSpacing: 6,
      wordWrap: { width: 200 }
    }).setOrigin(0.5);

    this.icono_lucha = this.add.image(0, 0, 'icono_lucha').setInteractive().setDepth(1);
    this.icono_lucha.on('pointerdown', () => {
      this.scene.start('EscenaMapa');//EscenaMapa
    });



    // HISTORIA - Descripción/párrafo
    this.historiaDes = this.add.text(0, 0, 'Descubre\nla aventura', {
      fontSize: '28px',
      fontFamily: 'Silkscreen',
      color: '#00ffd5',
      fontStyle: 'bold',
      stroke: '#6b21b6',
      strokeThickness: 2,
      shadow: {
        offsetX: 3,
        offsetY: 3,
        color: '#000000',
        blur: 6,
        fill: true
      },
      align: 'center',
      lineSpacing: 6,
      wordWrap: { width: 200 }
    }).setOrigin(0.5);

    this.icono_historia = this.add.image(0, 0, 'icono_historia').setInteractive().setDepth(1);
    this.icono_historia.on('pointerdown', () => {
      this.scene.start('EscenaIntroduccionUno'); //EscenaIntroduccionUno
    });


    this.aplicarReescalado();
    this.scale.on('resize', () => {
      this.aplicarReescalado();
    });
}

    aplicarReescalado() {
      reescalarGlobalFlexible(this.scale.gameSize, [
        {
            obj: this.fondo,
            autoFill: true,
            originX: 0.5,
            originY: 0.5
        },{
            obj: this.icono_lucha,
            posX: getPosEscala(0.7, 0),
            posY: getPosEscala(0.65, 0),
            escalaRelativa: getPosEscala(0.36, 0),
            originX: 0.5,
            originY: 0.5
        },{
            obj: this.icono_historia,
            posX: getPosEscala(0.25, 0),
            posY: getPosEscala(0.65, 0),
            escalaRelativa: getPosEscala(0.36, 0),
            originX: 0.5,
            originY: 0.5
        },{
            obj: this.lucha,
            posX: getPosEscala(0.71, 0),
            posY: getPosEscala(0.08, 0),
            escalaRelativa: getPosEscala(0.65, 0),
            originX: 0.5,
            originY: 0.5
        },{
            obj: this.historia,
            posX: getPosEscala(0.25, 0),
            posY: getPosEscala(0.08, 0),
            escalaRelativa: getPosEscala(0.8, 0),
            originX: 0.5,
            originY: 0.5
        },{
            obj: this.luchaDes,
            posX: getPosEscala(0.7, 0),
            posY: getPosEscala(0.3, 0),
            escalaRelativa: getPosEscala(0.3, 0),
            originX: 0.5,
            originY: 0.5
        },{
            obj: this.historiaDes,
            posX: getPosEscala(0.25, 0),
            posY: getPosEscala(0.3, 0),
            escalaRelativa: getPosEscala(0.3, 0),
            originX: 0.5,
            originY: 0.5
        },
      ]);
    }


    update() {
        // Actualización en tiempo real si es necesario
    }
}
