import { objetosDelPersonaje, datosObjetos,objetos,objetosActivos, personajeHumanoEnUso, personajeGatoEnUso, ApartadoMenu, setPersonajeHumanoEnUso, setPersonajeGatoEnUso, setApartadoMenu } from '../globals.js';
import { isMobile, getPosEscala, reescalarGlobalFlexible,cargarPersonajeActual, cargarGatoActual, createAndAdaptTextFlexible, extraerDatosObjetoPorId  } from '../responsive.js';
//--- ESCENA DE COMO SE MUEVE EL USUARIO Y USO DEL ESPEJO
window.ultimaEscenaActiva = null;

export class EscenaTutorialUno extends Phaser.Scene {
  constructor() {
    super({ key: 'EscenaTutorialUno' });
        this.objetoSeleccionado = null;
        this.marcadorSeleccion = null;
        this.personajeA='humano';
  }

  preload() {
    this.load.image('FondoCasaU', 'assets/static/FondoCasaU.png');
    this.load.tilemapTiledJSON('mapaTutorial', 'assets/static/Nosale.json');
  }

  create() {
    const mapa = this.make.tilemap({ key: 'mapaTutorial' });
    const tileset = mapa.addTilesetImage('Fondo', 'FondoCasaU');

    const escalaX = this.scale.width / (mapa.width * mapa.tileWidth);
    const escalaY = this.scale.height / (mapa.height * mapa.tileHeight);

    const capaFondo = mapa.createLayer('fondo', tileset, 0, 0);
    capaFondo.setScale(escalaX, escalaY);
    capaFondo.setOrigin(0, 0);

    this.cameras.main.setBounds(0, 0, this.scale.width, this.scale.height);
    this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);

    this.personaje = this.physics.add.sprite(0, 0, 'niñoCaminando');
    this.animal = this.physics.add.sprite(0, 0, 'gatoCaminando').setVisible(false);
    this.personaje.setScale(0);
    this.personaje.setCollideWorldBounds(true);
    this.cameras.main.startFollow(this.personaje);
    this.cameras.main.startFollow(this.animal);
    this.barra = this.add.image(0, 0, 'barraobjetos').setInteractive().setDepth(5).setVisible(true);
    this.botonI = this.add.image(0, 0, 'botonInventario').setInteractive().setDepth(5).setVisible(true);
        this.botonI.on('pointerdown', () => {
            window.ultimaEscenaActiva = this.scene.key;
            this.scene.switch('EscenaInventario');
        });
        this.input.keyboard.on('keydown-R', () => {
            window.ultimaEscenaActiva = this.scene.key;
            this.scene.switch('EscenaInventario');
        });
    
    // Mostrar los objetos activos en pantalla y guardarlos en objetosImgs
    this.objetosImgs = {};
    objetosActivos.forEach(id => {
      const sprite = this.add.sprite(0, 0, id)
        .setDepth(8)
        .setVisible(true)
        .setInteractive();
      this.objetosImgs[id] = sprite;
      const animKey = id + 'movimiento';
      if (!this.anims.exists(animKey)) {
        try {
          this.anims.create({
            key: animKey,
            frames: this.anims.generateFrameNumbers(id, { start: 0, end: 6 }),
            frameRate: 3,
            repeat: -1
          });
        } catch (err) {
          console.warn(`No se pudieron generar los frames para '${id}'`);
        }
      }
      if (this.anims.exists(animKey)) {
        sprite.anims.play(animKey, true);
      }
      sprite.on('pointerdown', () => {
        this.objetoSeleccionado = id;
        this.cambiarPersonaje();
        if (this.marcadorSeleccion) {
          this.marcadorSeleccion.destroy();
        }
        this.marcadorSeleccion = this.add.rectangle(
          sprite.x, sprite.y,
          sprite.displayWidth, sprite.displayHeight,
          0x00ff00, 0.2
        ).setDepth(sprite.depth + 1)
         .setOrigin(sprite.originX, sprite.originY);
      });
    });
    this.aplicarReescalado();
    this.scale.on('resize', () => {
      this.aplicarReescalado();
    });


    this.anims.create({ key: 'caminar_abajo', frames: this.anims.generateFrameNumbers('niñoCaminando', { start: 1, end: 2 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'caminar_arriba', frames: this.anims.generateFrameNumbers('niñoCaminando', { start: 4, end: 5 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'caminar_derecha', frames: this.anims.generateFrameNumbers('niñoCaminando', { start: 6, end: 7 }), frameRate: 8, repeat: -1 });

    this.anims.create({ key: 'caminar_abajo_animal', frames: this.anims.generateFrameNumbers('gatoCaminando', { start: 1, end: 2 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'caminar_arriba_animal', frames: this.anims.generateFrameNumbers('gatoCaminando', { start: 4, end: 5 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'caminar_derecha_animal', frames: this.anims.generateFrameNumbers('gatoCaminando', { start: 6, end: 7 }), frameRate: 8, repeat: -1 });

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
    }).setVisible(false).setScrollFactor(0);

    this.mensajeTexto = this.add.text(20, 20, '', {
      fontSize: '18px', fill: '#fff',
      backgroundColor: '#000'
    }).setVisible(false).setScrollFactor(0);

    this.paredes = this.physics.add.staticGroup();
    this.zonasInteraccion = [];

    const capaObjetos = mapa.getObjectLayer('Objetos');
    if (!capaObjetos) {
      console.error('No se encontró la capa "Objetos" en el mapa');
      return;
    }

    // Rectángulos colisionables
    capaObjetos.objects.forEach(obj => {
      if (obj.ellipse) return;
      const centroX = (obj.x + (obj.width || 0) / 2) * escalaX;
      const centroY = (obj.y + (obj.height || 0) / 2) * escalaY;
      const ancho = (obj.width || 0) * escalaX;
      const alto = (obj.height || 0) * escalaY;

      const pared = this.add.zone(centroX, centroY, ancho, alto);
      this.physics.add.existing(pared, true);
      this.paredes.add(pared);
    });

    // Zonas de interacción tipo elipse
    capaObjetos.objects.forEach(obj => {
      if (!obj.ellipse) return;
      const centroX = (obj.x + (obj.width || 0) / 2) * escalaX;
      const centroY = (obj.y + (obj.height || 0) / 2) * escalaY;
      const ancho = (obj.width || 0) * escalaX;
      const alto = (obj.height || 0) * escalaY;

      const zona = this.add.zone(centroX, centroY, ancho, alto);
      this.physics.add.existing(zona, true);
      zona.propiedades = obj.properties?.reduce((acc, p) => {
        acc[p.name] = p.value;
        return acc;
      }, {}) || {};
      this.zonasInteraccion.push(zona);
    });

    this.physics.add.collider(this.personaje, this.paredes);
    this.physics.add.collider(this.animal, this.paredes);
  }

  cambiarPersonaje(){
    if (this.objetoSeleccionado && this.objetoSeleccionado == 1){
      if(this.personajeA === 'humano') {
        this.personaje.setVisible(false);
        this.animal.setVisible(true);
        this.personajeA = 'gato';
      }else{
        this.personaje.setVisible(true);
        this.animal.setVisible(false);
        this.personajeA = 'humano';
      }
    }
  }

    aplicarReescalado() {
      reescalarGlobalFlexible(this.scale, [
        {
          obj: this.personaje,
          posX: 0.5,
          posY: 0.5,
          escalaRelativa: 0.07,
          originX: 0.5,
          originY: 0.5
        },
        {
          obj: this.animal,
          posX: 0.5,
          posY: 0.5,
          escalaRelativa: 0.1,
          originX: 0.5,
          originY: 0.5
        },
        {
          obj: this.barra,
          posX: 0.45,
          posY: 0.93,
          escalaRelativa: 0.5,
          originX: 0.5,
          originY: 0.5
        },
        {
          obj: this.botonI,
          posX: getPosEscala(0.28, 0),
          posY: getPosEscala(0.93, 0),
          escalaRelativa: getPosEscala(0.1, 0),
          originX: 0.5,
          originY: 0.5
        },
        this.objetosImgs[1] ? {
          obj: this.objetosImgs[1],
          posX: getPosEscala(0.35, 0),
          posY: getPosEscala(0.93, 0),
          escalaRelativa: getPosEscala(0.06),
          originX: 0.5,
          originY: 0.5
        } : null
      ].filter(Boolean));
      if (this.fondo) this.fondo.setPosition(this.scale.width / 2, this.scale.height );
    }
    
  mostrarMensaje(texto) {
    this.mensajeTexto.setText(texto).setVisible(true);
    this.time.delayedCall(3000, () => {
      this.mensajeTexto.setVisible(false);
    });
  }

  update() {
    const teclas = this.teclasMovimiento;
    // Determina qué personaje está activo
    const personaje = (this.personajeA === 'gato') ? this.animal : this.personaje;
    const otroPersonaje = (this.personajeA === 'gato') ? this.personaje : this.animal;

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
    // Sincroniza la posición del otro personaje
    otroPersonaje.x = personaje.x;
    otroPersonaje.y = personaje.y;

    if (vx !== 0 || vy !== 0) {
      if (this.personajeA === 'gato') {
        if (vy < 0) personaje.anims.play('caminar_arriba_animal', true);
        else if (vy > 0) personaje.anims.play('caminar_abajo_animal', true);
        else personaje.anims.play('caminar_derecha_animal', true);
      } else {
        if (vy < 0) personaje.anims.play('caminar_arriba', true);
        else if (vy > 0) personaje.anims.play('caminar_abajo', true);
        else personaje.anims.play('caminar_derecha', true);
      }
    } else {
      personaje.anims.stop();
      personaje.setFrame(0);
    }

    // Detectar si está en zona de interacción
    let zonaActual = null;
    for (let zona of this.zonasInteraccion) {
      const bounds = zona.getBounds();
      if (bounds.contains(personaje.x, personaje.y)) {
        zonaActual = zona;
        break;
      }
    }

    if (zonaActual) {
      const tecla = zonaActual.propiedades?.tecla || 'E';
      const tipo = zonaActual.propiedades?.tipo || 'inspeccionar';
      const texto = zonaActual.propiedades?.texto || '';

      const mensaje = tipo === 'salida' ? 'Presiona G para salir' : 'Presiona E para inspeccionar';
      this.textoAccion.setText(mensaje).setVisible(true);
      this.textoAccion.setPosition(personaje.x - 40, personaje.y - 60);

      if ((tecla === 'E' && this.teclasExtras.E.isDown) || (tecla === 'G' && this.teclasExtras.G.isDown)) {
        if (tipo === 'inspeccionar') {
          this.mostrarMensaje(texto);
        } else if (tipo === 'salida') {
          this.scene.start('EscenaSalida');
        }
      }
    } else {
      this.textoAccion.setVisible(false);
    }
  }
}

