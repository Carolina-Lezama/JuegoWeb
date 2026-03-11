import { objetosDelPersonaje, datosObjetos,objetos,objetosActivos, personajeHumanoEnUso, personajeGatoEnUso, ApartadoMenu, setPersonajeHumanoEnUso, setPersonajeGatoEnUso, setApartadoMenu } from '../globals.js';
import { isMobile, getPosEscala, reescalarGlobalFlexible,cargarPersonajeActual, cargarGatoActual, createAndAdaptTextFlexible, extraerDatosObjetoPorId  } from '../responsive.js';
//--- ESCENA DE COMO SE MUEVE EL USUARIO Y USO DEL ESPEJO
window.ultimaEscenaActiva = null;

export class EscenaParteUno extends Phaser.Scene {
  constructor() {
    super({ key: 'EscenaParteUno' });
    this.logroObtenido = false;
    this.mapaObtenido = false;
    this.inspeccionRealizada = false; // Bandera para la inspección especial
}

  preload() {
    this.load.tilemapTiledJSON('BosqueFuente', 'assets/static/BosqueFuente.json');
    this.load.image('fondoBosqueFuente', 'assets/static/fondoBosqueFuente.png');
  }

  create() {
    this.fondoObjeto = this.add.image(0, 0, 'FondoObjeto').setVisible(false).setDepth(4);
    this.Logro1 = this.add.image(0, 0, 'Logro1').setVisible(false).setDepth(5);
    this.botonD = this.add.image(0, 0, 'botonDescripcion').setDepth(4).setVisible(false);
    this.botonSa = this.add.image(0, 0, 'botonSalir').setInteractive().setDepth(4).setVisible(false);
    this.objetoMapa = this.add.sprite(0, 0, 'objetoMapa').setVisible(false).setDepth(10);

    this.anims.create({
      key: 'objetoMapa-movimiento',
      frames: this.anims.generateFrameNumbers('objetoMapa', { start: 0, end: 6 }),
      frameRate: 3,
      repeat: -1
    });

        objetosDelPersonaje[3]= extraerDatosObjetoPorId(3) || {id:0, nombre:'',descripcion:'',cantidad:0,rareza:''};
        this.texto2 = createAndAdaptTextFlexible(this, {
            text: (objetosDelPersonaje[3].nombre || '') + '\n\n' +
                  (objetosDelPersonaje[3].descripcion || '') + '\n\nCantidad de usos maximo: ' +
                  (objetosDelPersonaje[3].cantidad || 'Sin limite') + '\n\nRareza: ' +
                  (objetosDelPersonaje[3].rareza || ''),
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
        this.texto2.setVisible(false).setDepth(9);

    // Crear el tilemap y las capas
    const map = this.make.tilemap({ key: 'BosqueFuente' });
    const tileset = map.addTilesetImage('fondoBosqueFuente', 'fondoBosqueFuente');
    const fondoLayer = map.createLayer('Fondo', tileset, 0, 0);

    // Calcular escala para expandir a todo el ancho de la pantalla
    const anchoPantalla = this.sys.game.config.width;
    const anchoMapaEnPixeles = map.widthInPixels;
    const escalaX = anchoPantalla / anchoMapaEnPixeles;

    // Escalar fondo
    fondoLayer.setScale(escalaX);

    // Crear capa de colisiones (objectgroup)
    const colisionesLayer = map.getObjectLayer('Colisiones');

    // Crear grupo de colisiones
    this.colisiones = this.physics.add.staticGroup();
    colisionesLayer.objects.forEach(obj => {
      if (!obj.ellipse) {
        // Ajustar posición y tamaño por escala
        this.colisiones.create(
          (obj.x + obj.width/2) * escalaX,
          (obj.y + obj.height/2) * escalaX,
          null
        )
        .setSize(obj.width * escalaX, obj.height * escalaX)
        .setVisible(false);
      }
    });

    // Crear objetos interactivos (elipses con propiedades)
    this.objetosInteraccion = [];
    colisionesLayer.objects.forEach(obj => {
      if (obj.ellipse && obj.properties) {
        const props = {};
        obj.properties.forEach(p => { props[p.name] = p.value; });
        this.objetosInteraccion.push({
          x: (obj.x + obj.width/2) * escalaX,
          y: (obj.y + obj.height/2) * escalaX,
          width: obj.width * escalaX,
          height: obj.height * escalaX,
          ...props
        });
      }
    });

    // Ajustar límites de cámara y mundo
    const nuevoAncho = map.widthInPixels * escalaX;
    const nuevoAlto = map.heightInPixels * escalaX;
    this.cameras.main.setBounds(0, 0, nuevoAncho, nuevoAlto);
    this.physics.world.setBounds(0, 0, nuevoAncho, nuevoAlto);

    this.personaje = this.physics.add.sprite(0, 0, 'niñoCaminando');
    this.personaje.setScale(0);
    this.personaje.setCollideWorldBounds(true);

    this.cameras.main.startFollow(this.personaje);
    this.aplicarReescalado();
    this.scale.on('resize', () => {
      this.aplicarReescalado();
    });

    this.anims.create({ key: 'caminar_abajo', frames: this.anims.generateFrameNumbers('niñoCaminando', { start: 1, end: 2 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'caminar_arriba', frames: this.anims.generateFrameNumbers('niñoCaminando', { start: 4, end: 5 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'caminar_derecha', frames: this.anims.generateFrameNumbers('niñoCaminando', { start: 6, end: 7 }), frameRate: 8, repeat: -1 });

    this.teclasMovimiento = this.input.keyboard.addKeys({
      arriba: Phaser.Input.Keyboard.KeyCodes.W,
      abajo: Phaser.Input.Keyboard.KeyCodes.S,
      izquierda: Phaser.Input.Keyboard.KeyCodes.A,
      derecha: Phaser.Input.Keyboard.KeyCodes.D
    });
    this.teclasExtras = this.input.keyboard.addKeys('E,G');

this.textoAccion = this.add.text(10, 10, '', {
  fontSize: '16px', fill: '#ffffff',
  backgroundColor: '#000000', padding: { x: 8, y: 4 }
}).setVisible(false); // <- Quitamos setScrollFactor(0)


    this.mensajeTexto = this.add.text(20, 20, '', {
      fontSize: '18px', fill: '#fff',
      backgroundColor: '#000'
    }).setVisible(false).setScrollFactor(0);

    this.physics.add.collider(this.personaje, this.colisiones);
  }


    aplicarReescalado() {
      reescalarGlobalFlexible(this.scale, [
        {
          obj: this.personaje,
          posX: 0.5,
          posY: 0.2,
          escalaRelativa: 0.07,
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
          obj: this.objetoMapa,
          posX: getPosEscala(0.73, 0),
          posY: getPosEscala(0.5, 0),
          escalaRelativa: getPosEscala(0.7, 0),
          originX: 0.5,
          originY: 0.5
        },                
      ]);
      if (this.fondo) this.fondo.setPosition(this.scale.width / 2, this.scale.height );
    }
    
mostrarMensaje(texto, x = null, y = null) {
  if (this.mensajeTexto) {
    this.mensajeTexto.destroy();
  }

  // Mostrar en una posición fija de pantalla (esquina superior izquierda)
  x = 20;
  y = 20;

  this.mensajeTexto = this.add.text(x, y, texto, {
    font: '18px Arial',
    fill: '#fff',
    backgroundColor: '#000',
    padding: { x: 10, y: 5 },
  }).setScrollFactor(0).setDepth(1000); // <-- Importante para fijarlo en pantalla

  // Destruir el mensaje después de 2 segundos
  this.time.delayedCall(2000, () => {
    if (this.mensajeTexto) this.mensajeTexto.destroy();
  });
}


  update() {
    const teclas = this.teclasMovimiento;
    // Solo hay un personaje activo
    const personaje = this.personaje;

    const velocidad = 150;
    let vx = 0, vy = 0;

    if (teclas.izquierda.isDown) {
      vx = -velocidad;
      personaje.setFlipX(true);
    } else if (teclas.derecha.isDown) {
      vx = velocidad;
      personaje.setFlipX(false);
    }

    if (teclas.arriba.isDown) {
      vy = -velocidad;
    } else if (teclas.abajo.isDown) {
      vy = velocidad;
    }

    personaje.setVelocity(vx, vy);

    if (vx !== 0 || vy !== 0) {
      if (vy < 0) personaje.anims.play('caminar_arriba', true);
      else if (vy > 0) personaje.anims.play('caminar_abajo', true);
      else personaje.anims.play('caminar_derecha', true);
    } else {
      personaje.anims.stop();
      personaje.setFrame(0);
    }
    this.botonSa.on('pointerdown', () => {
      this.fondoObjeto.setVisible(false);
      this.botonD.setVisible(false);
      this.botonSa.setVisible(false);
      this.objetoMapa.setVisible(false);
      this.texto2.setVisible(false);
      // Volver a seguir al personaje y centrar la cámara en él
      this.cameras.main.startFollow(this.personaje);
      this.cameras.main.centerOn(this.personaje.x, this.personaje.y);
      this.inspeccionRealizada = true;
      this.LogroObtenido = true;

      this.mapaObtenido = true;

    });
    // Lógica de interacción usando objetosInteraccion
    let enInteraccion = false;
    for (let obj of this.objetosInteraccion) {
      const distancia = Phaser.Math.Distance.Between(personaje.x, personaje.y, obj.x, obj.y);
      if (distancia < 50) {
        enInteraccion = true;
        const mensajeAccion = obj.tipo === 'salida' ? 'Presiona G para salir' : 'Presiona E para inspeccionar';
        this.textoAccion.setText(mensajeAccion).setVisible(true);
        this.textoAccion.setPosition(personaje.x + 30, personaje.y - 40);
        // Detectar teclas para interacción
        if ((obj.tecla === 'E' || !obj.tecla) && this.teclasExtras.E.isDown) {
          if (obj.tipo === 'inspeccionar') {
            // Lógica especial para "Un objeto nuevo."
            if (obj.texto === 'Un objeto nuevo.') {
              if (!this.inspeccionRealizada) {
            fetch('/Juego/api/guardar_objeto_usuario.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ objeto_id: 3 })
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

                // Detener el seguimiento de la cámara y centrarla en el punto medio del mapa, pero más abajo
                this.cameras.main.stopFollow();
                      const centerX = this.physics.world.bounds.width / 2;
                      const centerY = this.physics.world.bounds.height / 2;
                      const offset = 50;
                      this.cameras.main.centerOn(centerX, centerY + offset);

                      // Centrar los elementos en el nuevo centro de la cámara
                      this.fondoObjeto.setVisible(true).setPosition(centerX, centerY + offset);
                      this.botonD.setVisible(true).setPosition(centerX - 300, centerY + offset - 290);
                      this.botonSa.setVisible(true).setPosition(centerX - 289, centerY + offset + 235);
                      this.objetoMapa.setVisible(true).setPosition(centerX + 420, centerY + offset + 1);
                      this.texto2.setVisible(true).setPosition(centerX - 340, centerY + offset - 35);
              } else {
                // Solo mostrar el mensaje
                this.mostrarMensaje('Un objeto nuevo.', personaje.x + 40, personaje.y - 20);
              }
              
            } else {
              this.mostrarMensaje(obj.texto || '', personaje.x + 40, personaje.y - 20);
            }
if (obj.texto === 'Ser curioso merece su recompensa') {
  if (!this.LogroObtenido) {
            fetch('/Juego/api/guardar_logro_usuario.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ logro_id: 1 })
        })
        .then(res => res.json())
        .then(data => {
            if (data && !data.error) {
                console.log('Objeto guardado en BD:', data);
            } else {
                console.warn('Error al guardar objeto en BD:', data.error);
            }
        })
    this.LogroObtenido = true;

    this.Logro1.setVisible(true).setPosition(850,950).setDisplaySize(750, 300);

    // Hacer que el logro desaparezca después de 5 segundos
    this.time.delayedCall(3000, () => {
      this.Logro1.setVisible(false);
    });

  } else {
    // Solo mostrar el mensaje
    this.mostrarMensaje('Ser curioso merece su recompensa', personaje.x + 40, personaje.y - 20);
  }

} else {
  this.mostrarMensaje(obj.texto || '', personaje.x + 40, personaje.y - 20);
}

          } else if (obj.tipo === 'salida') {
            this.scene.start('EscenaMapa');
          }
        } else if (obj.tecla === 'G' && this.teclasExtras.G.isDown) {
          if (obj.tipo === 'salida') {
            this.scene.start('EscenaMapa');
          }
        }
        break;
      }
    }
    if (!enInteraccion) {
      this.textoAccion.setVisible(false);
    }
  }
}
//FALTA SUBIR EL LOGRO A LA BASE DE DATOS
