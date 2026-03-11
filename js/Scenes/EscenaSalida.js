import { objetosDelPersonaje, datosObjetos,objetos,objetosActivos, personajeHumanoEnUso, personajeGatoEnUso, ApartadoMenu, setPersonajeHumanoEnUso, setPersonajeGatoEnUso, setApartadoMenu } from '../globals.js';
import { isMobile, getPosEscala, reescalarGlobalFlexible,cargarPersonajeActual, cargarGatoActual, createAndAdaptTextFlexible, extraerDatosObjetoPorId  } from '../responsive.js';
//--- ESCENA DESPEDIDA Y ENTREGA DEL ARMA
export class EscenaSalida extends Phaser.Scene {
  constructor() {
    super({ key: 'EscenaSalida' });
  }
  create() {
    this.fondo = this.add.image(0, 0, 'FondoCabaña');
    this.fondoObjeto = this.add.image(0, 0, 'FondoObjetoAmarillo').setVisible(false).setDepth(4);
    this.recuadroMa = this.add.image(0, 0, 'recuadroM').setDepth(2).setVisible(true);
    this.botonD = this.add.image(0, 0, 'botonDescripcion').setDepth(4).setVisible(false);
    this.botonI = this.add.image(0, 0, 'botonInventario').setInteractive().setDepth(10).setVisible(true);
    this.botonSa = this.add.image(0, 0, 'botonSalir').setInteractive().setDepth(4).setVisible(false);
    this.boton = this.add.image(0, 0, 'botonSiguiente').setInteractive();
    this.botonS = this.add.image(0, 0, 'botonSaltar').setInteractive();
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
this.botonI.on('pointerdown', () => {
    this.dialogoActual++;
    window.ultimaEscenaActiva = this.scene.key;
    
    // Verifica si la escena ya está activa antes de lanzarla
    if (!this.scene.isActive('EscenaInventario')) {
        this.scene.launch('EscenaInventario');
    }
    
    // Trae la escena del inventario al frente
    this.scene.bringToTop('EscenaInventario');
    this.scene.pause();
});

this.input.keyboard.on('keydown-R', () => {
    this.dialogoActual++;
    window.ultimaEscenaActiva = this.scene.key;
    
    // Verifica si la escena ya está activa antes de lanzarla
    if (!this.scene.isActive('EscenaInventario')) {
        this.scene.launch('EscenaInventario');
    }
    
    // Trae la escena del inventario al frente
    this.scene.bringToTop('EscenaInventario');
    this.scene.pause();
});
    this.anims.create({
      key: 'mago-movimiento',
      frames: this.anims.generateFrameNumbers('mago', { start: 0, end: 4 }),
      frameRate: 5,
      repeat: -1
    });
    this.objetoEspada = this.add.sprite(0, 0, 'objetoEspada').setVisible(false).setDepth(10);
    this.anims.create({
        key: 'objetoEspada-movimiento',
        frames: this.anims.generateFrameNumbers('objetoEspada', { start: 0, end: 6 }),
        frameRate: 6,
        repeat: -1});
    this.aplicarReescalado();
    this.scale.on('resize', () => {
        this.aplicarReescalado();
    });
    let e_uno ='Ahora que saber como usar el espejo, es hora de explorar el mundo.';
    let e_dos ='Te dare un ultimo regalo para protegerte.';
    let e_tres ='Es facil usar esta arma.';

        fetch('/Juego/api/guardar_objeto_usuario.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ objeto_id: 2 })
        })
        .then(res => res.json())
        .then(data => {
            if (data && !data.error) {
                console.log('Objeto guardado en BD:', data);
            } else {
                console.warn('Error al guardar objeto en BD:', data.error);
            }
        })
        .catch(err => console.error('Error AJAX guardar objeto:', err));
        let e_cuatro =''
        let e_cinco ='Equipa en tu inventario como hiciste antes.'
        let e_seis ='Es hora de partir, Carlitos.'

        this.dialogos = [
            e_uno,e_dos,e_tres,e_cuatro,e_cinco,e_seis
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
        this.texto.setOrigin(0.5, 0.5).setDepth(3);

        objetosDelPersonaje[2]= extraerDatosObjetoPorId(2) || {id:0, nombre:'',descripcion:'',cantidad:0,rareza:''};
        this.texto2 = createAndAdaptTextFlexible(this, {
            text: (objetosDelPersonaje[2].nombre || '') + '\n\n' +
                  (objetosDelPersonaje[2].descripcion || '') + '\n\nCantidad de usos maximo: ' +
                  (objetosDelPersonaje[2].cantidad || 'Sin limite') + '\n\nRareza: ' +
                  (objetosDelPersonaje[2].rareza || ''),
            posX: 0.3,
            posY: 0.49,
            maxWidth: 850,
            maxHeight: 500,
            fontSizeInicial: 38,
            fontSizeMinimo: 10,
            originX: 0.5,
            originY: 0.5,
            config: {
                fontFamily: 'Silkscreen',
                color: '#ffffff',
                align: 'center'
            }
        });
        this.texto2.setVisible(false);
        this.gato.anims.play('gato-movimiento', true);
        this.mago.anims.play('mago-movimiento', true);
        this.botonS.on('pointerdown', () => {
            this.scene.start('EscenaParteUno');});
        this.botonI.on('pointerdown', () => {
    this.dialogoActual++;
    window.ultimaEscenaActiva = this.scene.key;

    if (!this.scene.isActive('EscenaInventario')) {
        this.scene.launch('EscenaInventario');
    }

    this.scene.bringToTop('EscenaInventario');
    this.scene.pause();
});

this.input.keyboard.on('keydown-R', () => {
    this.dialogoActual++;
    window.ultimaEscenaActiva = this.scene.key;

    if (!this.scene.isActive('EscenaInventario')) {
        this.scene.launch('EscenaInventario');
    }

    this.scene.bringToTop('EscenaInventario');
    this.scene.pause();
});
        this.boton.on('pointerdown', () => {
        this.dialogoActual++;
        if (this.dialogoActual < this.dialogos.length) {
            this.texto.setText(this.dialogos[this.dialogoActual]);
            this.actualizarEscenaPorDialogo(this.dialogoActual);
        } else {
            this.scene.start('EscenaParteUno');
        }
        });
        this.botonSa.on('pointerdown', () => {
            this.dialogoActual++;
            if (this.dialogoActual < this.dialogos.length) {
                this.texto.setText(this.dialogos[this.dialogoActual]);
                this.actualizarEscenaPorDialogo(this.dialogoActual);
            }
        });
  }
    actualizarEscenaPorDialogo(dialogoIndex) {
        const mostrarMago = [0, 1, 2, 3, 4];
        this.recuadroMa.setVisible(true);
        this.mago.setVisible(true);
        this.gato.setVisible(true);
        this.fondoObjeto.setVisible(false);
        this.botonD.setVisible(false);
        this.botonI.setVisible(true);
        this.boton.setVisible(true);
        this.botonS.setVisible(true);      
        this.botonSa.setVisible(false);
        this.texto2.setVisible(false);

        this.objetoEspada.setVisible(false);

        if (mostrarMago.includes(dialogoIndex)) {
            if (dialogoIndex === 3) {
                this.objetoEspada.anims.play('objetoEspada-movimiento').setVisible(true);
                        fetch('/Juego/api/guardar_objeto_usuario.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ objeto_id: 2 })
        })
        .then(res => res.json())
        .then(data => {
            if (data && !data.error) {
                console.log('Objeto guardado en BD:', data);
            } else {
                console.warn('Error al guardar objeto en BD:', data.error);
            }
        })
        .catch(err => console.error('Error AJAX guardar objeto:', err));

                this.recuadroMa.setVisible(false);
                this.mago.setVisible(false);
                this.gato.setVisible(false);
                this.boton.setVisible(false);
                this.botonS.setVisible(false);
                this.fondoObjeto.setVisible(true);
                this.botonD.setVisible(true);
                this.botonSa.setVisible(true);
                this.texto2.setVisible(true);
                this.texto2.setDepth(20);
            }
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
                posX: getPosEscala(0.44, 0),
                posY: getPosEscala(0.81, 0),
                escalaRelativa: getPosEscala(0.24, 0),
                originX: 0.5,
                originY: 0.5
              },
              {
                obj: this.mago,
                posX: getPosEscala(0.24, 0),
                posY: getPosEscala(0.67, 0),
                escalaRelativa: getPosEscala(0.3, 0),
                originX: 0.5,
                originY: 0.5
            },
            {
                obj: this.objetoEspada,
                posX: getPosEscala(0.73, 0),
                posY: getPosEscala(0.5, 0),
                escalaRelativa: getPosEscala(0.7, 0),
                originX: 0.5,
                originY: 0.5
            },            
            {
                obj: this.fondoObjeto,
                posX: getPosEscala(0.5, 0),
                posY: getPosEscala(0.5, 0),
                escalaRelativa: getPosEscala(2, 0),
                originX: 0.5,
                originY: 0.5
            },            
            {
                obj: this.botonD,
                posX: getPosEscala(0.3, 0),
                posY: getPosEscala(0.2, 0),
                escalaRelativa: getPosEscala(0.55, 0),
                originX: 0.5,
                originY: 0.5
            },            
            {
                obj: this.botonSa,
                posX: getPosEscala(0.3, 0),
                posY: getPosEscala(0.8, 0),
                escalaRelativa: getPosEscala(0.3, 0),
                originX: 0.5,
                originY: 0.5
            },            
            {
                obj: this.botonI,
                posX: getPosEscala(0.05, 0),
                posY: getPosEscala(0.1, 0),
                escalaRelativa: getPosEscala(0.15, 0),
                originX: 0.5,
                originY: 0.5
            }         
            ]);
        this.fondo.setPosition(this.scale.width / 2, this.scale.height );
}
  update(){
  }
}
