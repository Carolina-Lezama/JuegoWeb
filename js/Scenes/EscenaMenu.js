import { objetosDelPersonaje, datosObjetos,objetos,objetosActivos, personajeHumanoEnUso, personajeGatoEnUso, ApartadoMenu, setPersonajeHumanoEnUso, setPersonajeGatoEnUso, setApartadoMenu } from '../globals.js';
import { isMobile, getPosEscala, reescalarGlobalFlexible,cargarPersonajeActual, cargarGatoActual, createAndAdaptTextFlexible, extraerDatosObjetoPorId  } from '../responsive.js';
//--- ESCENA DE COMO SE MUEVE EL USUARIO Y USO DEL ESPEJO

export class EscenaMenu extends Phaser.Scene {
  constructor() {
    super({ key: 'EscenaMenu' });
}

  preload() {

  }

  create() {
    this.fondo = this.add.image(0, 0, 'FondoMenu').setOrigin(0, 0).setDepth(1);
    this.fondoMenuNegro=this.add.image(0,0, 'fondoMenuNegro').setOrigin(0, 0).setDepth(2);
    this.regreso=this.add.image(0,0, 'regreso').setOrigin(0, 0).setDepth(5).setInteractive();
    this.opcionesLetra=this.add.image(0,0, 'opcionesLetra').setOrigin(0, 0).setDepth(2);
    this.MusicaLetra=this.add.image(0,0, 'MusicaLetra').setOrigin(0, 0).setDepth(2);
    this.checkpoint1=this.add.image(0,0, 'checkpoint').setOrigin(0, 0).setDepth(2).setInteractive();
    this.checkpoint2=this.add.image(0,0, 'checkpoint').setOrigin(0, 0).setDepth(2).setInteractive();
    this.decision1=this.add.image(0,0, 'decision').setOrigin(0, 0).setDepth(3);
    this.decision2=this.add.image(0,0, 'decision').setOrigin(0, 0).setVisible(false).setDepth(3);
    this.si=this.add.image(0,0, 'si').setOrigin(0, 0).setDepth(4);
    this.no=this.add.image(0,0, 'no').setOrigin(0, 0).setDepth(4);

    // Referencia a la música de fondo
    if (!this.sound.get('musicaFondo')) {
        this.musicaFondo = this.sound.add('musicaFondo', { loop: true, volume: 0.5 });
    } else {
        this.musicaFondo = this.sound.get('musicaFondo');
    }

    this.regreso.on('pointerdown', () => {
        this.cerrarMenuPorPausa();
    });
    // Estado inicial: música activa
    this.estadoMusica = true;
    this.actualizarEstadoMusica(true);

    // Hacer interactivos los checkpoints
    this.checkpoint1.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
        this.actualizarEstadoMusica(true);
    });
    this.checkpoint2.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
        this.actualizarEstadoMusica(false);
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
        },
        {
          obj: this.fondoMenuNegro,
          posX: getPosEscala(0.5, 0),
          posY: getPosEscala(0.5, 0),
          escalaRelativa: getPosEscala(1.6, 0),
          originX: 0.5,
          originY: 0.5
        },        
        {
          obj: this.regreso,
          posX: getPosEscala(0.05, 0),
          posY: getPosEscala(0.1, 0),
          escalaRelativa: getPosEscala(0.16, 0),
          originX: 0.5,
          originY: 0.5
        },
        {
          obj: this.opcionesLetra,
          posX: getPosEscala(0.5, 0),
          posY: getPosEscala(0.2, 0),
          escalaRelativa: getPosEscala(0.6, 0),
          originX: 0.5,
          originY: 0.5
        },
        {
          obj: this.MusicaLetra,
          posX: getPosEscala(0.25, 0),
          posY: getPosEscala(0.4, 0),
          escalaRelativa: getPosEscala(0.4, 0),
          originX: 0.5,
          originY: 0.5
        },
        {
          obj: this.checkpoint1,
          posX: getPosEscala(0.47, 0),
          posY: getPosEscala(0.4, 0),
          escalaRelativa: getPosEscala(0.1, 0),
          originX: 0.5,
          originY: 0.5
        },
        {
          obj: this.checkpoint2,
          posX: getPosEscala(0.6, 0),
          posY: getPosEscala(0.4, 0),
          escalaRelativa: getPosEscala(0.1, 0),
          originX: 0.5,
          originY: 0.5
        },
        {
          obj: this.decision1,
          posX: getPosEscala(0.47, 0),
          posY: getPosEscala(0.4, 0),
          escalaRelativa: getPosEscala(0.05, 0),
          originX: 0.5,
          originY: 0.5
        },        
        {
          obj: this.decision2,
          posX: getPosEscala(0.6, 0),
          posY: getPosEscala(0.4, 0),
          escalaRelativa: getPosEscala(0.05, 0),
          originX: 0.5,
          originY: 0.5
        },        
        {
          obj: this.si,
          posX: getPosEscala(0.47, 0),
          posY: getPosEscala(0.32, 0),
          escalaRelativa: getPosEscala(0.057, 0),
          originX: 0.5,
          originY: 0.5
        },        
        {
          obj: this.no,
          posX: getPosEscala(0.6, 0),
          posY: getPosEscala(0.323, 0),
          escalaRelativa: getPosEscala(0.064  , 0),
          originX: 0.5,
          originY: 0.5
        }
      ]);
    }

    actualizarEstadoMusica(estado) {
        this.estadoMusica = estado;
        if (estado) {
            // Activar música: si no existe, crearla; si está parada, reproducir desde el inicio
            if (!this.sound.get('musicaFondo')) {
                this.musicaFondo = this.sound.add('musicaFondo', { loop: true, volume: 0.5 });
                this.musicaFondo.play();
            } else {
                this.musicaFondo = this.sound.get('musicaFondo');
                if (!this.musicaFondo.isPlaying) {
                    this.musicaFondo.play(); // Reproduce desde el inicio
                } else if (this.musicaFondo.isPaused) {
                    this.musicaFondo.resume();
                }
            }
            // Mostrar decision1, ocultar decision2
            this.decision1.setVisible(true);
            this.decision2.setVisible(false);
        } else {
            // Detener música completamente
            if (this.sound.get('musicaFondo')) {
                this.musicaFondo = this.sound.get('musicaFondo');
                this.musicaFondo.stop();
            }
            // Mostrar decision2, ocultar decision1
            this.decision1.setVisible(false);
            this.decision2.setVisible(true);
        }
        
    }
    cerrarMenuPorPausa() {
        if (window.ultimaEscenaActiva) {
            this.scene.stop(); // Cierra el inventario
            this.scene.resume(window.ultimaEscenaActiva); // Reanuda la anterior si la pausaste // Vuelve a la escena donde estaba el jugador
        }
    }
  update() {
   }
}
