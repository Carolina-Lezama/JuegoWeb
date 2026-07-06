import { getState } from '../globals.js';

export class EscenaTutorialUno extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaTutorialUno' });
        this.objetoSeleccionado = null;
        this.marcadorSeleccion = null;
        this.personajeActivoStr = 'humano'; // Controla quién se mueve
    }

    preload() {
        this.load.image('FondoCasaU', 'assets/static/Lugares/FondoCasaU.png');
        this.load.tilemapTiledJSON('mapaTutorial', 'assets/static/Lugares/Nosale.json'); 
    }

    create() {
        // ==============================================================
        // 1. CARGA DEL MAPA TILED Y ESCALADO UNIFORME
        // ==============================================================
        const mapa = this.make.tilemap({ key: 'mapaTutorial' });
        const tileset = mapa.addTilesetImage('Fondo', 'FondoCasaU');

        // Escala uniforme para no deformar el mapa. 
        // Si quieres que sea más grande o más chico, cambia este número (ej. 1.2, 0.8)
        const escalaMapa = 1; 

        const capaFondo = mapa.createLayer('fondo', tileset, 0, 0);
        capaFondo.setScale(escalaMapa);

        // ==============================================================
        // 2. LÍMITES DEL MUNDO Y CÁMARA
        // ==============================================================
        const mapWidth = mapa.width * mapa.tileWidth * escalaMapa;
        const mapHeight = mapa.height * mapa.tileHeight * escalaMapa;
        
        this.physics.world.setBounds(0, 0, mapWidth, mapHeight);
        this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);

        // ==============================================================
        // 3. JUGADORES Y FÍSICAS
        // ==============================================================
        this.personaje = this.physics.add.sprite(mapWidth / 2, mapHeight / 2, 'niñoCaminando').setScale(0.7); // <-- Modifica escala del jugador aquí
        this.animal = this.physics.add.sprite(mapWidth / 2, mapHeight / 2, 'gatoCaminando').setVisible(false).setScale(0.7); // <-- Modifica escala del animal aquí
        this.animal.body.enable = false;
        
        this.personaje.setCollideWorldBounds(true);
        this.animal.setCollideWorldBounds(true);
        
        this.jugadorActivo = this.personaje;
        this.cameras.main.startFollow(this.jugadorActivo);

        // ==============================================================
        // 4. INICIALIZACIÓN
        // ==============================================================
        this.crearAnimacionesMovimiento();
        this.crearInterfazUsuario();
        this.crearZonasDeInteraccion(mapa, escalaMapa); // Pasamos la escala única

        // Controles
        this.teclasMovimiento = this.input.keyboard.addKeys({
            arriba: Phaser.Input.Keyboard.KeyCodes.W,
            abajo: Phaser.Input.Keyboard.KeyCodes.S,
            izquierda: Phaser.Input.Keyboard.KeyCodes.A,
            derecha: Phaser.Input.Keyboard.KeyCodes.D
        });
        this.teclasExtras = this.input.keyboard.addKeys('E,G');
    }

    crearInterfazUsuario() {
        // ==============================================================
        // INTERFAZ FIJA A LA CÁMARA (1650x900)
        // ==============================================================
        this.barra = this.add.image(742, 837, 'barraobjetos')
            .setDepth(5)
            .setScrollFactor(0)
            .setScale(1.1); // <-- Escala de la barra
        
        this.botonI = this.add.image(462, 837, 'botonInventario')
            .setDepth(5)
            .setInteractive({ useHandCursor: true })
            .setScrollFactor(0)
            .setScale(1); // <-- Escala del botón de inventario
            
        this.agregarEfectoHover(this.botonI, 1.15);

        const abrirInventario = () => {
            window.ultimaEscenaActiva = this.scene.key;
            this.scene.switch('EscenaInventario');
        };

        this.botonI.on('pointerdown', abrirInventario);
        this.input.keyboard.on('keydown-R', abrirInventario);

        // ==============================================================
        // BARRA DE HERRAMIENTAS (HOTBAR)
        // ==============================================================
        this.objetosImgs = {};
        const activos = getState().objetosActivos || []; 
        
        activos.forEach((id, index) => {
            const dataObj = getState().objetosGlobales?.find(o => o.id == id);
            const spriteKey = dataObj?.sprite || id;

            // Separación dinámica de 80 píxeles por cada objeto en la barra
            const posX = 577 + (index * 80);
            
            const sprite = this.add.sprite(posX, 837, spriteKey)
                .setDepth(8)
                .setInteractive({ useHandCursor: true })
                .setScrollFactor(0)
                .setScale(0.5); // <-- Escala de los objetos en la barra

            this.objetosImgs[id] = sprite;

            if (this.anims.exists(spriteKey + '-movimiento')) {
                sprite.play(spriteKey + '-movimiento');
            }

            sprite.on('pointerdown', () => {
                this.objetoSeleccionado = id;
                this.gestionarUsoDeObjeto(id, sprite);
            });
        });

        // ==============================================================
        // TEXTOS FLOTANTES Y DE MENSAJES
        // ==============================================================
        this.textoAccion = this.add.text(0, 0, '', {
            fontSize: '16px', fill: '#ffffff', backgroundColor: '#000000', padding: { x: 8, y: 4 }
        }).setVisible(false).setDepth(20); // Sin ScrollFactor, flota en el mundo

        this.mensajeTexto = this.add.text(20, 20, '', {
            fontSize: '18px', fill: '#fff', backgroundColor: '#000'
        }).setVisible(false).setScrollFactor(0).setDepth(20);
    }

    gestionarUsoDeObjeto(id, sprite) {
        if (this.marcadorSeleccion) this.marcadorSeleccion.destroy();
        
        this.marcadorSeleccion = this.add.rectangle(
            sprite.x, sprite.y, sprite.displayWidth + 5, sprite.displayHeight + 5, 0x00ff00, 0.3
        ).setDepth(sprite.depth - 1).setScrollFactor(0);

        if (id == 1) { // ID 1 = Espejo
            this.cambiarPersonaje();
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

    crearZonasDeInteraccion(mapa, escalaMapa) {
        this.paredes = this.physics.add.staticGroup();
        this.zonaInteractivaActual = null; 

        const capaObjetos = mapa.getObjectLayer('Objetos');
        if (!capaObjetos) return;

        capaObjetos.objects.forEach(obj => {
            // Se usa la misma escala para X e Y para evitar distorsiones en las cajas de colisión
            const x = (obj.x + (obj.width || 0) / 2) * escalaMapa;
            const y = (obj.y + (obj.height || 0) / 2) * escalaMapa;
            const w = (obj.width || 0) * escalaMapa;
            const h = (obj.height || 0) * escalaMapa;

            const zona = this.add.zone(x, y, w, h);
            this.physics.add.existing(zona, true); // true = Static body

            if (!obj.ellipse) {
                this.paredes.add(zona);
            } else {
                zona.propiedades = obj.properties?.reduce((acc, p) => ({ ...acc, [p.name]: p.value }), {}) || {};
                
                this.physics.add.overlap(this.personaje, zona, () => this.zonaInteractivaActual = zona);
                this.physics.add.overlap(this.animal, zona, () => this.zonaInteractivaActual = zona);
            }
        });

        this.physics.add.collider(this.personaje, this.paredes);
        this.physics.add.collider(this.animal, this.paredes);
    }

    crearAnimacionesMovimiento() {
        if (!this.anims.exists('caminar_abajo')) {
            this.anims.create({ key: 'caminar_abajo', frames: this.anims.generateFrameNumbers('niñoCaminando', { start: 1, end: 2 }), frameRate: 8, repeat: -1 });
            this.anims.create({ key: 'caminar_arriba', frames: this.anims.generateFrameNumbers('niñoCaminando', { start: 4, end: 5 }), frameRate: 8, repeat: -1 });
            this.anims.create({ key: 'caminar_derecha', frames: this.anims.generateFrameNumbers('niñoCaminando', { start: 6, end: 7 }), frameRate: 8, repeat: -1 });
            
            this.anims.create({ key: 'caminar_abajo_animal', frames: this.anims.generateFrameNumbers('gatoCaminando', { start: 1, end: 2 }), frameRate: 8, repeat: -1 });
            this.anims.create({ key: 'caminar_arriba_animal', frames: this.anims.generateFrameNumbers('gatoCaminando', { start: 4, end: 5 }), frameRate: 8, repeat: -1 });
            this.anims.create({ key: 'caminar_derecha_animal', frames: this.anims.generateFrameNumbers('gatoCaminando', { start: 6, end: 7 }), frameRate: 8, repeat: -1 });
        }
    }

    mostrarMensaje(texto) {
        this.mensajeTexto.setText(texto).setVisible(true);
        this.time.delayedCall(3000, () => this.mensajeTexto.setVisible(false));
    }

    // Función interna nativa para reemplazar la de uiHelpers.js
    agregarEfectoHover(boton, multiplicador = 1.1) {
        boton.escalaBase = boton.scaleX;
        boton.on('pointerover', () => boton.setScale(boton.escalaBase * multiplicador));
        boton.on('pointerout', () => boton.setScale(boton.escalaBase));
    }

    update() {
        // ==============================================================
        // 1. MOVIMIENTO
        // ==============================================================
        const teclas = this.teclasMovimiento;
        const velocidad = 150;
        let vx = 0, vy = 0;

        if (teclas.izquierda.isDown) {
            vx = -velocidad;
            this.jugadorActivo.setFlipX(true);
        } else if (teclas.derecha.isDown) {
            vx = velocidad;
            this.jugadorActivo.setFlipX(false);
        }

        if (teclas.arriba.isDown) {
            vy = -velocidad;
        } else if (teclas.abajo.isDown) {
            vy = velocidad;
        }

        this.jugadorActivo.setVelocity(vx, vy);

        // ==============================================================
        // 2. GESTIÓN DE ANIMACIONES
        // ==============================================================
        const esGato = this.personajeActivoStr === 'gato';
        
        if (vx !== 0 || vy !== 0) {
            if (vy < 0) this.jugadorActivo.play(esGato ? 'caminar_arriba_animal' : 'caminar_arriba', true);
            else if (vy > 0) this.jugadorActivo.play(esGato ? 'caminar_abajo_animal' : 'caminar_abajo', true);
            else this.jugadorActivo.play(esGato ? 'caminar_derecha_animal' : 'caminar_derecha', true);
        } else {
            this.jugadorActivo.anims.stop();
            this.jugadorActivo.setFrame(0); // Vuelve a la pose estática
        }

        // ==============================================================
        // 3. INTERACCIÓN CON ZONAS DE TILED
        // ==============================================================
        if (this.zonaInteractivaActual) {
            const props = this.zonaInteractivaActual.propiedades;
            const tecla = props.tecla || 'E';
            const tipo = props.tipo || 'inspeccionar';
            
            this.textoAccion.setText(tipo === 'salida' ? 'Presiona G para salir' : 'Presiona E para inspeccionar').setVisible(true);
            
            // Posicionar texto sobre la cabeza del jugador (en coordenadas de mundo físico)
            this.textoAccion.setPosition(this.jugadorActivo.x - 40, this.jugadorActivo.y - 60);

            if ((tecla === 'E' && Phaser.Input.Keyboard.JustDown(this.teclasExtras.E)) || 
                (tecla === 'G' && Phaser.Input.Keyboard.JustDown(this.teclasExtras.G))) {
                
                if (tipo === 'inspeccionar') {
                    this.mostrarMensaje(props.texto);
                } else if (tipo === 'salida') {
                    this.scene.start('EscenaSalida');
                }
            }

            // Limpiamos la zona en cada frame. Si el jugador sigue ahí, el evento 'overlap' la volverá a asignar.
            this.zonaInteractivaActual = null; 
        } else {
            this.textoAccion.setVisible(false);
        }
    }
}