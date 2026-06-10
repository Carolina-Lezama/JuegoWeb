import { getState, sumarPuntos } from '../globals.js';
import { reescalarGlobalFlexible, agregarEfectoHover } from '../uiHelpers.js';

export class EscenaCombateBase extends Phaser.Scene {
    // Recibe la configuración desde la escena Hija
    constructor(config) {
        super({ key: config.key });
        this.configNivel = config;
    }

    // Inicializamos variables de estado cada vez que se entra al nivel
    init() {
        this.vidaPersonaje = 100;
        this.juegoPausado = false;
        this.tiempoUltimoDaño = 0;
        this.enemigos = [];
        this.personajeActivoStr = 'humano';
        this.objetoSeleccionado = null;
        this.marcadorSeleccion = null;
    }

    create() {
        // 1. CARGA DE MAPA Y LÍMITES (Basado en la configuración hija)
        const map = this.make.tilemap({ key: this.configNivel.mapaJson });
        const tileset = map.addTilesetImage(this.configNivel.tilesetImg, this.configNivel.tilesetImg);
        const fondoLayer = map.createLayer('Fondo', tileset, 0, 0);

        const escalaX = this.scale.width / (map.width * map.tileWidth);
        const escalaY = this.scale.height / (map.height * map.tileHeight);
        fondoLayer.setScale(escalaX, escalaY);

        const mapWidth = map.width * map.tileWidth * escalaX;
        const mapHeight = map.height * map.tileHeight * escalaY;

        this.physics.world.setBounds(0, 0, mapWidth, mapHeight);
        this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);

        // 2. CREACIÓN DE PAREDES
        this.paredes = this.physics.add.staticGroup();
        const colisionesLayer = map.getObjectLayer('Colisiones');
        if (colisionesLayer) {
            colisionesLayer.objects.forEach(obj => {
                const pared = this.paredes.create(
                    (obj.x + obj.width / 2) * escalaX,
                    (obj.y + obj.height / 2) * escalaY, null
                );
                pared.setSize(obj.width * escalaX, obj.height * escalaY).setVisible(false);
            });
        }

        // 3. JUGADORES Y ENEMIGOS
        this.crearPersonajes(mapWidth, mapHeight);
        
        // El método crearEnemigos debe ser provisto/sobreescrito por la escena Hija
        if (typeof this.crearEnemigos === 'function') {
            this.crearEnemigos(mapWidth, mapHeight);
        }

        // Colisiones Genéricas
        this.physics.add.collider(this.personaje, this.paredes);
        this.physics.add.collider(this.animal, this.paredes);
        
        if (this.grupoEnemigos) {
            this.physics.add.overlap(this.personaje, this.grupoEnemigos, this.recibirDaño, null, this);
            this.physics.add.overlap(this.animal, this.grupoEnemigos, this.recibirDaño, null, this);
        }

        // 4. INTERFAZ DE USUARIO Y MENÚS
        this.crearInterfazUsuario();
        this.crearMenuPausaYVictoria();

        // 5. CONTROLES Y EVENTOS
        this.teclasMovimiento = this.input.keyboard.addKeys({
            arriba: Phaser.Input.Keyboard.KeyCodes.W,
            abajo: Phaser.Input.Keyboard.KeyCodes.S,
            izquierda: Phaser.Input.Keyboard.KeyCodes.A,
            derecha: Phaser.Input.Keyboard.KeyCodes.D
        });

        this.input.on('pointerdown', () => {
            if (!this.juegoPausado && this.objetoSeleccionado == 2) { // 2 = Espada
                this.atacar();
            }
        });

        // 6. RESPONSIVIDAD
        this.aplicarReescaladoUI();
        this.scale.on('resize', () => this.aplicarReescaladoUI());
    }

    // ==========================================
    // MÉTODOS DE CREACIÓN (Heredados)
    // ==========================================
    crearPersonajes(mapWidth, mapHeight) {
        this.personaje = this.physics.add.sprite(mapWidth * 0.1, mapHeight * 0.7, 'niñoCaminando').setDepth(5);
        this.animal = this.physics.add.sprite(mapWidth * 0.1, mapHeight * 0.7, 'gatoCaminando').setDepth(5).setVisible(false);
        
        this.personaje.setCollideWorldBounds(true);
        this.animal.setCollideWorldBounds(true);
        this.animal.body.enable = false;

        this.jugadorActivo = this.personaje;
        this.cameras.main.startFollow(this.jugadorActivo);

        // Animaciones Genéricas
        if (!this.anims.exists('caminar_abajo')) {
            this.anims.create({ key: 'caminar_abajo', frames: this.anims.generateFrameNumbers('niñoCaminando', { start: 1, end: 2 }), frameRate: 8, repeat: -1 });
            this.anims.create({ key: 'caminar_arriba', frames: this.anims.generateFrameNumbers('niñoCaminando', { start: 4, end: 5 }), frameRate: 8, repeat: -1 });
            this.anims.create({ key: 'caminar_derecha', frames: this.anims.generateFrameNumbers('niñoCaminando', { start: 6, end: 7 }), frameRate: 8, repeat: -1 });
            this.anims.create({ key: 'caminar_abajo_animal', frames: this.anims.generateFrameNumbers('gatoCaminando', { start: 1, end: 2 }), frameRate: 8, repeat: -1 });
            this.anims.create({ key: 'caminar_arriba_animal', frames: this.anims.generateFrameNumbers('gatoCaminando', { start: 4, end: 5 }), frameRate: 8, repeat: -1 });
            this.anims.create({ key: 'caminar_derecha_animal', frames: this.anims.generateFrameNumbers('gatoCaminando', { start: 6, end: 7 }), frameRate: 8, repeat: -1 });
        }
    }

    crearInterfazUsuario() {
        this.barra = this.add.image(0, 0, 'barraobjetos').setDepth(15).setScrollFactor(0);
        this.botonI = this.add.image(0, 0, 'botonInventario').setDepth(15).setInteractive({ useHandCursor: true }).setScrollFactor(0);
        
        agregarEfectoHover(this.botonI);

        const abrirInventario = () => {
            if (this.juegoPausado) return;
            window.ultimaEscenaActiva = this.scene.key;
            this.scene.switch('EscenaInventario');
        };

        this.botonI.on('pointerdown', abrirInventario);
        this.input.keyboard.on('keydown-R', abrirInventario);

        this.barraVidaGrafico = this.add.graphics().setDepth(15).setScrollFactor(0);
        this.actualizarBarraVida(); 

        this.objetosImgs = {};
        const activos = getState().objetosActivos || [];
        
        activos.forEach(id => {
            const dataObj = getState().objetosGlobales?.find(o => o.id == id);
            const spriteKey = dataObj?.sprite || id;
            
            const sprite = this.add.sprite(0, 0, spriteKey).setDepth(16).setInteractive({ useHandCursor: true }).setScrollFactor(0);
            this.objetosImgs[id] = sprite;

            if (this.anims.exists(spriteKey + '-movimiento')) sprite.play(spriteKey + '-movimiento');

            sprite.on('pointerdown', () => {
                this.objetoSeleccionado = id;
                if (this.marcadorSeleccion) this.marcadorSeleccion.destroy();
                this.marcadorSeleccion = this.add.rectangle(sprite.x, sprite.y, sprite.displayWidth + 5, sprite.displayHeight + 5, 0x00ff00, 0.3)
                    .setDepth(15).setScrollFactor(0);

                if (id == 1) this.cambiarPersonaje(); 
            });
        });
    }

    crearMenuPausaYVictoria() {
        this.regreso = this.add.image(0, 0, 'regreso').setDepth(20).setInteractive({ useHandCursor: true }).setScrollFactor(0);
        this.RegresarMenu = this.add.image(0, 0, 'RegresarMenu').setDepth(20).setVisible(false).setScrollFactor(0);
        this.siBoton = this.add.image(0, 0, 'siBoton').setDepth(21).setVisible(false).setInteractive({ useHandCursor: true }).setScrollFactor(0);     
        this.noBoton = this.add.image(0, 0, 'noBoton').setDepth(21).setVisible(false).setInteractive({ useHandCursor: true }).setScrollFactor(0);
        
        this.FinalCompletado = this.add.image(0, 0, 'FinalCompletado').setDepth(20).setVisible(false).setScrollFactor(0);
        this.botonSiguiente = this.add.image(0, 0, 'botonSiguiente').setDepth(21).setInteractive({ useHandCursor: true }).setVisible(false).setScrollFactor(0);

        this.regreso.on('pointerdown', () => {
            this.juegoPausado = true;
            this.jugadorActivo.setVelocity(0, 0); 
            if (this.grupoEnemigos) {
                this.grupoEnemigos.setVelocityX(0); 
                this.grupoEnemigos.setVelocityY(0);
            }

            this.RegresarMenu.setVisible(true);
            this.siBoton.setVisible(true);
            this.noBoton.setVisible(true);
        });

        this.siBoton.on('pointerdown', () => this.scene.start('EscenaMapa'));
        
        this.noBoton.on('pointerdown', () => {
            this.juegoPausado = false;
            this.RegresarMenu.setVisible(false);
            this.siBoton.setVisible(false);
            this.noBoton.setVisible(false);
        });

        this.botonSiguiente.on('pointerdown', () => this.scene.start('EscenaMapa'));

        agregarEfectoHover(this.regreso);
        agregarEfectoHover(this.siBoton);
        agregarEfectoHover(this.noBoton);
        agregarEfectoHover(this.botonSiguiente);
    }

    // ==========================================
    // LÓGICA DE COMBATE
    // ==========================================
    actualizarBarraVida() {
        this.barraVidaGrafico.clear();
        const ancho = 350, alto = 40;
        const x = this.scale.width * 0.05, y = this.scale.height * 0.05;

        this.barraVidaGrafico.fillStyle(0x000000, 0.7).fillRect(x, y, ancho, alto);
        this.barraVidaGrafico.fillStyle(0xff0000, 1).fillRect(x + 6, y + 6, (ancho - 12) * (Math.max(0, this.vidaPersonaje) / 100), alto - 12);
        this.barraVidaGrafico.lineStyle(4, 0xffffff, 1).strokeRect(x, y, ancho, alto);
    }

    mostrarDaño(x, y, cantidad, color = '#ff0000') {
        const texto = this.add.text(x, y, `-${cantidad}`, {
            font: 'bold 32px Silkscreen', fill: color, stroke: '#000', strokeThickness: 4
        }).setOrigin(0.5).setDepth(20);

        this.tweens.add({
            targets: texto, y: y - 50, alpha: 0, duration: 900, ease: 'Cubic.easeOut',
            onComplete: () => texto.destroy()
        });
    }

    recibirDaño(jugador, enemigo) {
        if (this.juegoPausado || enemigo.vida <= 0) return;

        if (this.time.now - this.tiempoUltimoDaño > 1000) {
            // Usamos el daño configurado en la clase hija, si no, por defecto 5
            const dañoRecibido = this.configNivel.dañoEnemigo || 5;
            this.vidaPersonaje -= dañoRecibido;
            this.tiempoUltimoDaño = this.time.now;
            
            this.actualizarBarraVida();
            this.mostrarDaño(jugador.x, jugador.y - 50, dañoRecibido, '#ff0000');

            const angulo = Phaser.Math.Angle.Between(enemigo.x, enemigo.y, jugador.x, jugador.y);
            this.physics.velocityFromRotation(angulo, 300, jugador.body.velocity);

            if (this.vidaPersonaje <= 0) {
                window.ultimaEscenaActiva = this.scene.key;
                this.scene.start('EscenaMuerte');
            }
        }
    }

    atacar() {
        const rango = 120;
        const areaAtaque = new Phaser.Geom.Rectangle(this.jugadorActivo.x - rango/2, this.jugadorActivo.y - rango/2, rango, rango);
        let ataqueRealizado = false;

        this.enemigos.forEach((enemigo) => {
            if (enemigo.vida <= 0) return;

            if (Phaser.Geom.Rectangle.Contains(areaAtaque, enemigo.x, enemigo.y)) {
                enemigo.vida -= 15;
                ataqueRealizado = true;
                
                this.mostrarDaño(enemigo.x, enemigo.y - 40, 15, '#ffae00');

                enemigo.enRetroceso = true;
                const angulo = Phaser.Math.Angle.Between(this.jugadorActivo.x, this.jugadorActivo.y, enemigo.x, enemigo.y);
                this.physics.velocityFromRotation(angulo, 400, enemigo.body.velocity);
                this.time.delayedCall(200, () => enemigo.enRetroceso = false);

                if (enemigo.vida <= 0) {
                    enemigo.setVisible(false);
                    enemigo.body.enable = false;
                    sumarPuntos(this.configNivel.puntosRecompensa || 15);
                }
            }
        });

        if (ataqueRealizado && this.enemigos.every(e => e.vida <= 0)) {
            window.todosEnemigosVencidos = true;
            this.botonSiguiente.setVisible(true);
            this.FinalCompletado.setVisible(true);
            this.juegoPausado = true;
            this.jugadorActivo.setVelocity(0, 0); 
        }
    }

    cambiarPersonaje() {
        if (this.personajeActivoStr === 'humano') {
            this.personaje.setVisible(false);
            this.personaje.body.enable = false;
            this.animal.setPosition(this.personaje.x, this.personaje.y);
            this.animal.setVisible(true);
            this.animal.body.enable = true;
            this.personajeActivoStr = 'gato';
            this.jugadorActivo = this.animal;
        } else {
            this.animal.setVisible(false);
            this.animal.body.enable = false;
            this.personaje.setPosition(this.animal.x, this.animal.y);
            this.personaje.setVisible(true);
            this.personaje.body.enable = true;
            this.personajeActivoStr = 'humano';
            this.jugadorActivo = this.personaje;
        }
        this.cameras.main.startFollow(this.jugadorActivo);
    }

    aplicarReescaladoUI() {
        const elementosUI = [
            { obj: this.barra, posX: 0.45, posY: 0.93, escalaRelativa: 0.5 },
            { obj: this.botonI, posX: 0.28, posY: 0.93, escalaRelativa: 0.1 },
            { obj: this.regreso, posX: 0.95, posY: 0.08, escalaRelativa: 0.15 },
            { obj: this.RegresarMenu, posX: 0.5, posY: 0.5, escalaRelativa: 1.5 },
            { obj: this.siBoton, posX: 0.4, posY: 0.6, escalaRelativa: 0.3 },
            { obj: this.noBoton, posX: 0.6, posY: 0.6, escalaRelativa: 0.3 },
            { obj: this.FinalCompletado, posX: 0.5, posY: 0.5, escalaRelativa: 1.5 },
            { obj: this.botonSiguiente, posX: 0.5, posY: 0.65, escalaRelativa: 0.5 }
        ];

        Object.keys(this.objetosImgs).forEach((id, index) => {
            elementosUI.push({ obj: this.objetosImgs[id], posX: 0.35 + (index * 0.04), posY: 0.93, escalaRelativa: 0.06 });
        });

        reescalarGlobalFlexible(this, elementosUI);

        if (this.marcadorSeleccion && this.objetoSeleccionado) {
            const spriteActivo = this.objetosImgs[this.objetoSeleccionado];
            if (spriteActivo) this.marcadorSeleccion.setPosition(spriteActivo.x, spriteActivo.y);
        }
    }

    update() {
        if (this.juegoPausado) return;

        // Movimiento Jugador
        const velocidad = (this.personajeActivoStr === 'gato') ? 220 : 150;
        let vx = 0, vy = 0;

        if (this.teclasMovimiento.izquierda.isDown) { vx = -velocidad; this.jugadorActivo.setFlipX(true); }
        else if (this.teclasMovimiento.derecha.isDown) { vx = velocidad; this.jugadorActivo.setFlipX(false); }
        if (this.teclasMovimiento.arriba.isDown) { vy = -velocidad; }
        else if (this.teclasMovimiento.abajo.isDown) { vy = velocidad; }

        this.jugadorActivo.setVelocity(vx, vy);

        if (vx !== 0 || vy !== 0) {
            const sufijo = this.personajeActivoStr === 'gato' ? '_animal' : '';
            if (vy < 0) this.jugadorActivo.play(`caminar_arriba${sufijo}`, true);
            else if (vy > 0) this.jugadorActivo.play(`caminar_abajo${sufijo}`, true);
            else this.jugadorActivo.play(`caminar_derecha${sufijo}`, true);
        } else {
            this.jugadorActivo.anims.stop();
            this.jugadorActivo.setFrame(0);
        }

        // IA Enemigos
        const velEnemigo = this.configNivel.velocidadEnemigo || 60;
        this.enemigos.forEach((enemigo) => {
            if (enemigo.vida <= 0 || enemigo.enRetroceso) return;

            const distancia = Phaser.Math.Distance.Between(enemigo.x, enemigo.y, this.jugadorActivo.x, this.jugadorActivo.y);
            if (distancia > 45) {
                this.physics.moveToObject(enemigo, this.jugadorActivo, velEnemigo);
            } else {
                enemigo.setVelocity(0, 0);
            }
        });
    }
}