import { objetosDelPersonaje, puntos,setPuntosTotales, puntosTotales, actualizarPuntosTotales, jugador,datosObjetos,objetos,objetosActivos, personajeHumanoEnUso, personajeGatoEnUso, ApartadoMenu, setPersonajeHumanoEnUso, setPersonajeGatoEnUso, setApartadoMenu,objetos_jugador } from '../globals.js';
import { isMobile, getPosEscala, reescalarGlobalFlexible,cargarPersonajeActual, cargarGatoActual, createAndAdaptTextFlexible, extraerDatosObjetoPorId  } from '../responsive.js';
//--- ESCENA DE LA CABAÑA ADENTRO
window.ultimaEscenaActiva = null;
export class EscenaCastilloIfernal  extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaCastilloIfernal' });
        this.objetoSeleccionado = null;
        this.marcadorSeleccion = null;
        this.personajeA = 'humano';
        // Vida del personaje
        this.vidaPersonaje = 100;
        // Enemigos
        this.enemigos = [];
        // Para la barra de vida
        this.barraVida = null;
        // Control de inicialización para diagnóstico
        this.escenaInicializada = false;
        this.juegoPausado = false; // Bandera para pausar la lógica
    }
  mostrarImagenesVictoria(){
        this.botonSiguiente.setVisible(true);
        this.FinalCompletado.setVisible(true);
        this.botonI.disableInteractive();
  }
    // === Mostrar daño flotante ===
    mostrarDaño(x, y, cantidad, color = '#ff0000') {
        const texto = this.add.text(x, y, cantidad > 0 ? `-${cantidad}` : `${cantidad}`, {
            font: 'bold 32px Arial',
            fill: color,
            stroke: '#000',
            strokeThickness: 4,
            align: 'center',
            fontStyle: 'bold',
        }).setOrigin(0.5);
        texto.setDepth(100);
        this.tweens.add({
            targets: texto,
            y: y - 50,
            alpha: 0,
            duration: 900,
            ease: 'Cubic.easeOut',
            onComplete: () => texto.destroy()
        });
    }
    PausaPartida() {
        this.juegoPausado = true;
        if (this.RegresarMenu) this.RegresarMenu.setVisible(true);
        if (this.siBoton) {
            this.siBoton.setVisible(true);
            this.siBoton.setInteractive();
            if (this.siBoton.removeAllListeners) this.siBoton.removeAllListeners();
            this.siBoton.on('pointerdown', () => {
                            this.juegoPausado=false;

            this.scene.start('EscenaMapa');
            });
        }
        if (this.noBoton) {
            this.noBoton.setVisible(true);
            this.noBoton.setInteractive();
        }
    }
    ReanudarPartida() {
        this.juegoPausado = false;
        if (this.RegresarMenu) this.RegresarMenu.setVisible(false);
        if (this.siBoton) this.siBoton.setVisible(false);
        if (this.noBoton) this.noBoton.setVisible(false);
    }
  preload() {
  }
  create() {
    this.FinalCompletado = this.add.image(0, 0, 'FinalCompletado').setDepth(200).setVisible(false);
    this.botonSiguiente = this.add.image(0, 0, 'botonSiguiente').setInteractive().setDepth(200).setVisible(false);
    this.botonSiguiente.on('pointerdown', () => {
        this.scene.switch('EscenaMapa');
    });
    this.regreso = this.add.image(0, 0, 'regreso').setDepth(200).setVisible(true).setInteractive();
    this.regreso.on('pointerdown', () => {
        this.PausaPartida();
    });
    this.RegresarMenu = this.add.image(0, 0, 'RegresarMenu').setDepth(200).setVisible(false);
    this.siBoton = this.add.image(0, 0, 'siBoton').setInteractive().setDepth(200).setVisible(false);

    this.noBoton = this.add.image(0, 0, 'noBoton').setInteractive().setDepth(200).setVisible(false);
    this.noBoton.on('pointerdown', () => {
        this.ReanudarPartida();
    });

    // Inicializar variable de control
    this.ultimoDaño = 0;

    // Crear sprites de enemigos y animaciones
    this.Caballero1 = this.add.sprite(0, 0, 'Caballero');
    this.Caballero2 = this.add.sprite(0, 0, 'Caballero');

    // Crear animaciones solo si no existen
    if (!this.anims.exists('caballero')) {
        this.anims.create({
            key: 'caballero',
            frames: this.anims.generateFrameNumbers('Caballero', { start: 0, end: 4 }),
            frameRate: 6,
            repeat: -1
        });
    }

    // Posicionar, escalar y animar los slimes
    this.Caballero1.setPosition(this.scale.width * 0.8, this.scale.height * 0.75);
    this.Caballero1.setVisible(true);
    this.Caballero1.setDepth(5);
    this.Caballero1.setScale(0.75);
    this.Caballero1.anims.play('caballero', true);

    this.Caballero2.setPosition(this.scale.width * 0.7, this.scale.height * 0.75);
    this.Caballero2.setVisible(true);
    this.Caballero2.setDepth(5);
    this.Caballero2.setScale(0.8);
    this.Caballero2.anims.play('caballero', true);

    // Crear enemigos con posiciones visibles y configuración adecuada
    this.enemigos = [
        { sprite: this.Caballero1, vida: 125, id: 'Caballero', retroceso: 0 },
        { sprite: this.Caballero2, vida: 125, id: 'Caballero', retroceso: 0 }
    ];

    // Configurar física de enemigos
    this.physics.add.existing(this.Caballero1);
    this.physics.add.existing(this.Caballero2);
    this.Caballero1.body.setImmovable(false);
    this.Caballero2.body.setImmovable(false);

    // Barra y botón inventario
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

    // Evento para redibujar la barra de vida al reanudar la escena
    this.events.on('resume', () => {
        this.dibujarBarraVida();
    });

    const map = this.make.tilemap({ key: 'CastilloIfernalJSON' });
    const tileset = map.addTilesetImage('CastilloIfernal', 'CastilloIfernal');
    const fondoLayer = map.createLayer('Fondo', tileset, 0, 0);

    const escalaX = this.scale.width / (map.width * map.tileWidth);
    const escalaY = this.scale.height / (map.height * map.tileHeight);
    fondoLayer.setScale(escalaX, escalaY);
    fondoLayer.setOrigin(0,0);

    this.cameras.main.setBounds(0, 0, this.scale.width, this.scale.height);
    this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);

    // === INICIALIZACIÓN DE PAREDES/COLISIONES ===
    this.paredes = this.physics.add.staticGroup();
    const colisionesLayer = map.getObjectLayer('Colisiones');
    if (colisionesLayer && colisionesLayer.objects) {
        colisionesLayer.objects.forEach((obj, idx) => {
            const colision = this.paredes.create(
                obj.x + obj.width / 2,
                obj.y + obj.height / 2,
                null
            );
            colision.setSize(obj.width, obj.height);
            colision.setVisible(false); // Colisiones invisibles
            colision.body.setOffset(-obj.width / 2, -obj.height / 2);
        });
    }

    // === CONFIGURACIÓN INICIAL DE PERSONAJES ===
    this.personaje = this.physics.add.sprite(this.scale.width * 0.1, this.scale.height * 0.7, 'niñoCaminando');
    this.animal = this.physics.add.sprite(this.scale.width * 0.1, this.scale.height * 0.5, 'gatoCaminando').setVisible(false);
    this.personaje.setScale(1);
    this.personaje.setCollideWorldBounds(true);
    this.cameras.main.startFollow(this.personaje);

    // Añadir colisiones solo con paredes (NO con enemigos para evitar daño constante)
    if (this.personaje && this.paredes) {
        this.physics.add.collider(this.personaje, this.paredes);
    }
    if (this.animal && this.paredes) {
        this.physics.add.collider(this.animal, this.paredes);
    }

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

    // Crear animaciones de movimiento
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

    // === INICIALIZACIÓN DE ZONAS DE INTERACCIÓN ===
    this.zonasInteraccion = [];

    // Verificar si existe la capa de objetos para zonas de interacción (elipses)
    const capaObjetos = map.getObjectLayer('Colisiones');
    if (capaObjetos && capaObjetos.objects) {
        // Solo procesar zonas de interacción tipo elipse (no colisiones rectangulares)
        capaObjetos.objects.forEach((obj, idx) => {
            if (!obj.ellipse) return; // Solo elipses para interacción
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
    }

    // === FINALIZACIÓN DE INICIALIZACIÓN ===
    // Marcar escena como inicializada después de un pequeño retraso
    this.time.delayedCall(100, () => {
        this.escenaInicializada = true;
    });

    // Configurar ataque con clic del mouse
    this.input.on('pointerdown', (pointer) => {
        if (this.objetoSeleccionado == 2) { // Si tiene espada equipada
            this.atacar(pointer);
            console.log('¡Ataque realizado!'); // Feedback para el usuario
        } else {
            console.log('Equipa el arma (objeto 2) para atacar'); // Guía para el usuario
        }
    });
  }

  cambiarPersonaje(){
    // Revisa si this.objetoSeleccionado == 1 es correcto o si debería ser una cadena
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

    // Indicador visual de arma equipada
    if (this.objetoSeleccionado == 2) { // Si tiene espada equipada
        // Agregar indicador visual (opcional)
        const personajeActual = (this.personajeA === 'gato') ? this.animal : this.personaje;
        if (!this.indicadorArma) {
            this.indicadorArma = this.add.circle(0, 0, 5, 0xff0000, 0.8);
            this.indicadorArma.setDepth(15);
        }
        this.indicadorArma.setPosition(personajeActual.x + 20, personajeActual.y - 20);
        this.indicadorArma.setVisible(true);
    } else {
        if (this.indicadorArma) {
            this.indicadorArma.setVisible(false);
        }
    }
  }

  dibujarBarraVida() {
      // Protección: no dibujar si la escena no está completamente inicializada
      if (!this.personaje || !this.paredes || !this.enemigos) {
          return;
      }

      if (this.barraVida) {
          this.barraVida.destroy();
          this.barraVida = null;
      }
      if (!this.barraVida) {
          this.barraVida = this.add.graphics();
          this.barraVida.setDepth(20);
      }
      if (!this.barraVida || typeof this.barraVida.clear !== 'function') {
          return;
      }

      this.barraVida.clear();
      // Fondo
      const ancho = 350;
      const alto = 40;
      this.barraVida.fillStyle(0x000000, 0.7);
      this.barraVida.fillRect(this.scale.width * 0.05, this.scale.height * 0.05, ancho, alto);
      // Vida
      this.barraVida.fillStyle(0xff0000, 1);
      this.barraVida.fillRect(this.scale.width * 0.05 + 6, this.scale.height * 0.05 + 6, (ancho-12) * (this.vidaPersonaje/100), alto-12);
      // Borde
      this.barraVida.lineStyle(5, 0xffffff, 1);
      this.barraVida.strokeRect(this.scale.width * 0.05, this.scale.height * 0.05, ancho, alto);
  }

    aplicarReescalado() {
      reescalarGlobalFlexible(this.scale, [
        {
          obj: this.personaje,
          posX: 0.1,
          posY: 0.7 ,
          escalaRelativa: 0.19,
          originX: 0.5,
          originY: 0.5
        },
        {
          obj: this.animal,
          posX: 0.5,
          posY: 0.5,
          escalaRelativa: 0.19,
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
        {
          obj: this.botonSiguiente,
          posX: getPosEscala(0.5, 0),
          posY: getPosEscala(0.65, 0),
          escalaRelativa: getPosEscala(0.5, 0),
          originX: 0.5,
          originY: 0.5
        },
        {
            obj: this.FinalCompletado,
            autoFill: true,
            originX: 0.5,
            originY: 0.5
        },
        {
          obj: this.regreso,
          posX: getPosEscala(0.3, 0),
          posY: getPosEscala(0.09, 0),
          escalaRelativa: getPosEscala(0.15, 0),
          originX: 0.5,
          originY: 0.5
        },
                {
            obj: this.RegresarMenu,
            autoFill: true,
            originX: 0.5,
            originY: 0.5
        },        {
          obj: this.siBoton,
          posX: getPosEscala(0.4, 0),
          posY: getPosEscala(0.6, 0),
          escalaRelativa: getPosEscala(0.3, 0),
          originX: 0.5,
          originY: 0.5
        },        {
          obj: this.noBoton,
          posX: getPosEscala(0.6, 0),
          posY: getPosEscala(0.6, 0),
          escalaRelativa: getPosEscala(0.3, 0),
          originX: 0.5,
          originY: 0.5
        },
        // Objetos de la barra en orden de agregado
        ...Object.values(this.objetosImgs).map((obj, idx) => {
          // Posiciones predefinidas para los objetos de la barra
          const posiciones = [
            { posX: getPosEscala(0.35, 0), posY: getPosEscala(0.93, 0) },
            { posX: getPosEscala(0.389, 0), posY: getPosEscala(0.93, 0) },
            { posX: getPosEscala(0.43, 0), posY: getPosEscala(0.93, 0) }
          ];
          if (posiciones[idx]) {
            return {
              obj: obj,
              posX: posiciones[idx].posX,
              hitbox: {
                width: obj.width,
                height: obj.height
              },
              vida: 100,
              posY: posiciones[idx].posY,
              escalaRelativa: getPosEscala(0.06),
              originX: 0.5,
              originY: 0.5
            };
          }
          return null;
        }).filter(Boolean)
      ].flat());
      if (this.fondo) this.fondo.setPosition(this.scale.width / 2, this.scale.height );
          this.FinalCompletado.setPosition(this.scale.width / 2, this.scale.height / 2);
    this.RegresarMenu.setPosition(this.scale.width / 2, this.scale.height / 2);

    }
    


  atacar(pointer) {
    const personaje = (this.personajeA === 'gato') ? this.animal : this.personaje;
    const rango = 120; // Rango de ataque aumentado

    // Crear área de ataque alrededor del personaje
    const areaAtaque = new Phaser.Geom.Rectangle(
        personaje.x - rango/2,
        personaje.y - rango/2,
        rango,
        rango
    );

    // Verificar si algún enemigo está en rango
    let ataqueRealizado = false;
    let enemigoEliminado = false;
    this.enemigos.forEach((enemigo) => {
        if (!enemigo || !enemigo.sprite || enemigo.vida <= 0) {
            return;
        }

        // Verificar si el enemigo está en el área de ataque
        const enemigoEnRango = Phaser.Geom.Rectangle.Contains(
            areaAtaque,
            enemigo.sprite.x,
            enemigo.sprite.y
        );

        if (enemigoEnRango) {
            // Aplicar daño
            const daño = 15;
            enemigo.vida -= daño;
            enemigo.retroceso = 45; // Retroceso fuerte al ser atacado
            ataqueRealizado = true;
            // Mostrar daño flotante sobre el enemigo
            this.mostrarDaño(enemigo.sprite.x, enemigo.sprite.y - 40, daño, '#ffae00');

            // Si el enemigo muere
            if (enemigo.vida <= 0) {
                enemigo.sprite.setVisible(false);
                if (enemigo.sprite.body) {
                    enemigo.sprite.body.enable = false;
                }
                setPuntosTotales(puntosTotales + 50);

                enemigoEliminado = true;
            }
        }
    });

    // Comprobar si todos los enemigos han sido vencidos
    if (this.enemigos.every(e => e.vida <= 0)) {
      window.todosEnemigosVencidos = true;
      this.mostrarImagenesVictoria();
    }

    // Feedback visual del ataque (opcional)
    if (ataqueRealizado) {
        // Crear efecto visual temporal
        const efectoAtaque = this.add.circle(personaje.x, personaje.y, rango/2, 0xffff00, 0.3);
        efectoAtaque.setDepth(10);
        this.time.delayedCall(100, () => {
            if (efectoAtaque) efectoAtaque.destroy();
        });
    }
  }

  update(time, delta) {
        if (this.juegoPausado) {
        return; // No procesar lógica si el juego está pausado
    }
    // Control de inicialización: no ejecutar hasta que la escena esté completamente lista
    if (!this.escenaInicializada) {
        return; // Salir silenciosamente hasta que esté listo
    }

    // Protección: no ejecutar update si la escena no está completamente inicializada
    if (!this.personaje || !this.paredes || !this.enemigos) {
        return;
    }

    // Movimiento del jugador
    const teclas = this.teclasMovimiento;
    const personaje = (this.personajeA === 'gato') ? this.animal : this.personaje;
    const otroPersonaje = (this.personajeA === 'gato') ? this.personaje : this.animal;
    const velocidad = (this.personajeA === 'gato') ? 220 : 150;
    let vx = 0, vy = 0;
    if (teclas.izquierda.isDown) { vx = -velocidad; personaje.setFlipX(true); }
    else if (teclas.derecha.isDown) { vx = velocidad; personaje.setFlipX(false); }
    if (teclas.arriba.isDown) { vy = -velocidad; }
    else if (teclas.abajo.isDown) { vy = velocidad; }
    personaje.setVelocity(vx, vy);
    otroPersonaje.x = personaje.x;
    otroPersonaje.y = personaje.y;

    // Animaciones de movimiento
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

    // Ampliar hitbox si la espada está seleccionada
    if (this.objetoSeleccionado == 2) {
        this.personaje.body.setSize(this.personaje.width + 30, this.personaje.height + 30, true);

        // Actualizar posición del indicador de arma
        if (this.indicadorArma) {
            this.indicadorArma.setPosition(personaje.x + 20, personaje.y - 20);
        }
    } else {
        this.personaje.body.setSize(this.personaje.width, this.personaje.height, true);
    }

    // Lógica de enemigos
    this.enemigos.forEach((enemigo, idx) => {
        if (!enemigo || !enemigo.sprite || enemigo.vida <= 0) {
            return;
        }

        // Movimiento hacia el jugador con retroceso
        if (enemigo.retroceso > 0) {
            enemigo.sprite.x += 4; // Retroceso hacia la derecha
            enemigo.retroceso--;
        } else {
            // Solo mover si el enemigo está vivo y no hay retroceso
            const distanciaX = Math.abs(enemigo.sprite.x - personaje.x);
            const distanciaY = Math.abs(enemigo.sprite.y - personaje.y);
            const distanciaMinima = 50; // Distancia mínima para evitar solapamiento constante

            if (distanciaX > distanciaMinima || distanciaY > distanciaMinima) {
                if (enemigo.sprite.x > personaje.x) {
                    enemigo.sprite.x -= 1.5;
                } else if (enemigo.sprite.x < personaje.x) {
                    enemigo.sprite.x += 1.5;
                }
                if (enemigo.sprite.y > personaje.y) {
                    enemigo.sprite.y -= 1;
                } else if (enemigo.sprite.y < personaje.y) {
                    enemigo.sprite.y += 1;
                }
            }
        }

        // Verificar colisión para daño (con mejor control de distancia)
        const distancia = Phaser.Math.Distance.Between(
            personaje.x, personaje.y,
            enemigo.sprite.x, enemigo.sprite.y
        );

        if (distancia < 40 && (time - this.ultimoDaño > 1000)) { // 1 segundo de invulnerabilidad
            const dañoRecibido = 55;
            this.vidaPersonaje -= dañoRecibido;
            this.ultimoDaño = time;
            if (this.vidaPersonaje < 0) this.vidaPersonaje = 0;
            // Mostrar daño flotante sobre el jugador
            this.mostrarDaño(personaje.x, personaje.y - 50, dañoRecibido, '#ff0000');

            // Aplicar retroceso al enemigo para evitar daño continuo
            enemigo.retroceso = 30;
        }
    });

    // Actualizar barra de vida
    this.dibujarBarraVida();

    // Si la vida llega a 0, mostrar pantalla de muerte
    if (this.vidaPersonaje <= 0) {
    this.scene.start('EscenaMuerte'); // Reinicia la pelea
    this.vidaPersonaje = 100;
    window.ultimaEscenaActiva='EscenaCastilloIfernal';
    }
  }
}

