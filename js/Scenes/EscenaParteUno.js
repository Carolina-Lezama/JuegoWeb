import { objetosDelPersonaje, datosObjetos,objetos,objetosActivos, personajeHumanoEnUso, personajeGatoEnUso, ApartadoMenu, setPersonajeHumanoEnUso, setPersonajeGatoEnUso, setApartadoMenu, usuarioAutenticado, guardarObjetoBD, guardarObjetoLocal, 
guardarLogroLocal, cargarLogrosLocales, sumarPuntosLogro } from '../globals.js';
import { isMobile, getPosEscala, reescalarGlobalFlexible,cargarPersonajeActual, cargarGatoActual, createAndAdaptTextFlexible, extraerDatosObjetoPorId  } from '../uiHelpers.js';
//--- ESCENA DE COMO SE MUEVE EL USUARIO Y USO DEL ESPEJO
window.ultimaEscenaActiva = null;

export class EscenaParteUno extends Phaser.Scene {
  constructor() {
    super({ key: 'EscenaParteUno' });
    this.logroObtenido = false;
    this.mapaObtenido = false;
    this.inspeccionRealizada = false;
  }

  preload() {
    this.load.tilemapTiledJSON('BosqueFuente', 'assets/static/BosqueFuente.json');
    this.load.image('fondoBosqueFuente', 'assets/static/fondoBosqueFuente.png');
  }

  create() {
    // --- ANIMACIONES PERSONAJE ---
if (!this.anims.exists('caminar_abajo')) {
  this.anims.create({
    key: 'caminar_abajo',
    frames: this.anims.generateFrameNumbers('niñoCaminando', { start: 1, end: 2 }),
    frameRate: 8,
    repeat: -1
  });
}

if (!this.anims.exists('caminar_arriba')) {
  this.anims.create({
    key: 'caminar_arriba',
    frames: this.anims.generateFrameNumbers('niñoCaminando', { start: 4, end: 5 }),
    frameRate: 8,
    repeat: -1
  });
}

if (!this.anims.exists('caminar_derecha')) {
  this.anims.create({
    key: 'caminar_derecha',
    frames: this.anims.generateFrameNumbers('niñoCaminando', { start: 6, end: 7 }),
    frameRate: 8,
    repeat: -1
  });
}

    // ---------------- UI ----------------
    this.fondoObjeto = this.add.image(0, 0, 'FondoObjeto').setVisible(false).setDepth(4);
    this.Logro1 = this.add.image(0, 0, 'Logro1').setVisible(false).setDepth(5);
    this.botonD = this.add.image(0, 0, 'botonDescripcion').setDepth(4).setVisible(false);
    this.botonSa = this.add.image(0, 0, 'botonSalir').setInteractive().setDepth(4).setVisible(false);
    this.objetoMapa = this.add.sprite(0, 0, 'objetoMapa').setVisible(false).setDepth(10);
    
    // ✅ AGREGADO: Crear texto2 que faltaba
    this.texto2 = this.add.text(0, 0, '', {
      font: '18px Arial',
      fill: '#fff',
      backgroundColor: '#000',
      padding: { x: 10, y: 5 }
    }).setScrollFactor(0).setDepth(1000).setVisible(false);

    // ---------------- MAPA ----------------
    const map = this.make.tilemap({ key: 'BosqueFuente' });
    const tileset = map.addTilesetImage('fondoBosqueFuente', 'fondoBosqueFuente');
    const fondoLayer = map.createLayer('Fondo', tileset, 0, 0);

    // ✅ ESCALA DEL MAPA AGREGADA
    if (isMobile()) {
      fondoLayer.setScale(0.8);
    }

    // ---------------- COLISIONES ----------------
    const colisionesLayer = map.getObjectLayer('Colisiones');

    this.colisiones = this.physics.add.staticGroup();

    colisionesLayer.objects.forEach(obj => {
      if (!obj.ellipse) {
        this.colisiones.create(
          obj.x + obj.width / 2,
          obj.y + obj.height / 2,
          null
        )
        .setSize(obj.width, obj.height)
        .setVisible(false);
      }
    });

    // ---------------- INTERACCIONES ----------------
    this.objetosInteraccion = [];

    colisionesLayer.objects.forEach(obj => {
      if (obj.ellipse && obj.properties) {
        const props = {};
        obj.properties.forEach(p => props[p.name] = p.value);

        this.objetosInteraccion.push({
          x: obj.x + obj.width / 2,
          y: obj.y + obj.height / 2,
          width: obj.width,
          height: obj.height,
          ...props
        });
      }
    });

    // ---------------- MUNDO ----------------
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // ✅ POSICIÓN INICIAL: CENTRADO HORIZONTALMENTE, MISMA ALTURA
    const posicionXCentrada = map.widthInPixels / 2;
    const posicionY = 200; // Mantiene la altura original

    // ---------------- PERSONAJE ----------------
    this.personaje = this.physics.add.sprite(posicionXCentrada, posicionY, 'niñoCaminando');
    this.personaje.setScale(0.6);
    this.personaje.setCollideWorldBounds(true);

    this.physics.add.collider(this.personaje, this.colisiones);

    this.cameras.main.startFollow(this.personaje);

    // ---------------- CONTROLES ----------------
    this.teclasMovimiento = this.input.keyboard.addKeys({
      arriba: Phaser.Input.Keyboard.KeyCodes.W,
      abajo: Phaser.Input.Keyboard.KeyCodes.S,
      izquierda: Phaser.Input.Keyboard.KeyCodes.A,
      derecha: Phaser.Input.Keyboard.KeyCodes.D
    });

    this.teclasExtras = this.input.keyboard.addKeys('E,G');

    // ---------------- TEXTO ----------------
    this.textoAccion = this.add.text(10, 10, '', {
      fontSize: '16px',
      fill: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 8, y: 4 }
    }).setScrollFactor(0).setVisible(false);

    this.mensajeTexto = this.add.text(20, 20, '', {
      fontSize: '18px',
      fill: '#fff',
      backgroundColor: '#000'
    }).setScrollFactor(0).setVisible(false);
  }

  update() {
    const velocity = 150;
    let vx = 0, vy = 0;
    const personaje = this.personaje;

    // ✅ CONTROLES DE MOVIMIENTO
    if (this.teclasMovimiento.izquierda.isDown) {
      vx = -velocity;
      personaje.setFlipX(true);
    } else if (this.teclasMovimiento.derecha.isDown) {
      vx = velocity;
      personaje.setFlipX(false);
    }

    if (this.teclasMovimiento.arriba.isDown) {
      vy = -velocity;
    } else if (this.teclasMovimiento.abajo.isDown) {
      vy = velocity;
    }

    personaje.setVelocity(vx, vy);

    // ✅ ANIMACIONES
    if (vx !== 0 || vy !== 0) {
      if (vy < 0) personaje.anims.play('caminar_arriba', true);
      else if (vy > 0) personaje.anims.play('caminar_abajo', true);
      else personaje.anims.play('caminar_derecha', true);
    } else {
      personaje.anims.stop();
      personaje.setFrame(0);
    }

    // ✅ BOTÓN SALIR DE INSPECCIÓN
    this.botonSa.on('pointerdown', () => {
      this.fondoObjeto.setVisible(false);
      this.botonD.setVisible(false);
      this.botonSa.setVisible(false);
      this.objetoMapa.setVisible(false);
      this.texto2.setVisible(false);
      this.cameras.main.startFollow(this.personaje);
      this.cameras.main.centerOn(this.personaje.x, this.personaje.y);
      this.inspeccionRealizada = true;
      this.logroObtenido = true;
      this.mapaObtenido = true;
    });

    // ✅ LÓGICA DE INTERACCIONES
    let enInteraccion = false;

    for (let obj of this.objetosInteraccion) {
      const distancia = Phaser.Math.Distance.Between(personaje.x, personaje.y, obj.x, obj.y);
      
      if (distancia < 50) {
        enInteraccion = true;
        
        const mensaje = obj.tipo === 'salida' ? 'Presiona G para salir' : 'Presiona E para inspeccionar';
        this.textoAccion.setText(mensaje).setVisible(true);
        this.textoAccion.setPosition(personaje.x + 30, personaje.y - 40);

        // ✅ INTERACCIÓN CON OBJETOS
        if (this.teclasExtras.E.isDown && obj.tipo === 'inspeccionar') {
          if (obj.texto === 'Un objeto nuevo.') {
            if (!this.inspeccionRealizada) {
              // Guardar objeto en BD
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

              // Centrar cámara y mostrar objeto
              this.cameras.main.stopFollow();
              const centerX = this.physics.world.bounds.width / 2;
              const centerY = this.physics.world.bounds.height / 2;
              const offset = 50;
              this.cameras.main.centerOn(centerX, centerY + offset);

              this.fondoObjeto.setVisible(true).setPosition(centerX, centerY + offset);
              this.botonD.setVisible(true).setPosition(centerX - 300, centerY + offset - 290);
              this.botonSa.setVisible(true).setPosition(centerX - 289, centerY + offset + 235);
              this.objetoMapa.setVisible(true).setPosition(centerX + 420, centerY + offset + 1);
              this.texto2.setVisible(true).setPosition(centerX - 340, centerY + offset - 35);
            } else {
              this.mostrarMensaje('Un objeto nuevo.');
            }
          } else if (obj.texto === 'Ser curioso merece su recompensa') {
            if (!this.logroObtenido) {

if (usuarioAutenticado()) {
  fetch('/Juego/api/guardar_logro_usuario.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ logro_id: 1 })
  })
  .then(res => res.json())
  .then(data => {
    if (data && !data.error) {
      console.log('Logro guardado en BD:', data);
      // Sumar puntos del logro
      sumarPuntosLogro(1);
    } else {
      console.warn('Error al guardar logro en BD:', data.error);
    }
  })
  .catch(err => console.error('Error AJAX guardar logro:', err));
} else {
  guardarLogroLocal(1);
  console.log('Logro guardado LOCAL (invitado)');
  // Sumar puntos del logro
  sumarPuntosLogro(1);
}
              this.logroObtenido = true;
              this.Logro1.setVisible(true).setPosition(850, 850).setDisplaySize(750, 300);
              this.time.delayedCall(3000, () => {
                this.Logro1.setVisible(false);
              });
            } 
          } else {
            this.mostrarMensaje(obj.texto || '');
          }
        } else if (this.teclasExtras.G.isDown && obj.tipo === 'salida') {
          this.scene.start('EscenaMapa');
        }
        break;
      }
    }

    if (!enInteraccion) {
      this.textoAccion.setVisible(false);
    }
  }}
