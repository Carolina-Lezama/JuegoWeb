import { getState, agregarObjetoInventario, otorgarLogro } from '../globals.js';

export class EscenaParteUno extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaParteUno' });
        // Banderas de estado local
        this.logroObtenido = false;
        this.mapaObtenido = false;
        this.inspeccionRealizada = false;
        this.zonaInteractivaActual = null; 
    }

    preload() {
        this.load.tilemapTiledJSON('BosqueFuente', 'assets/static/Lugares/BosqueFuente.json');
        this.load.image('fondoBosqueFuente', 'assets/static/Lugares/fondoBosqueFuente.png');
    }

    create() {
        // ==============================================================
        // 1. CARGA DEL MAPA Y FÍSICAS MUNDIALES
        // ==============================================================
        const map = this.make.tilemap({ key: 'BosqueFuente' });
        const tileset = map.addTilesetImage('fondoBosqueFuente', 'fondoBosqueFuente');
        const fondoLayer = map.createLayer('Fondo', tileset, 0, 0);
        
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // ==============================================================
        // 2. CREACIÓN DEL JUGADOR (Humano Original)
        // ==============================================================
        const posicionXCentrada = map.widthInPixels / 2;
        const posicionY = 200; 

        this.personaje = this.physics.add.sprite(posicionXCentrada, posicionY, 'niñoCaminando');
        this.personaje.setCollideWorldBounds(true).setScale(0.6); // <-- Modifica la escala aquí
        this.cameras.main.startFollow(this.personaje);

        this.crearAnimacionesMovimiento();

        // ==============================================================
        // 3. INTERFAZ DE USUARIO (Coordenadas Fijas Base 1650x900)
        // ==============================================================
        this.fondoObjeto = this.add.image(825, 450, 'FondoObjeto').setVisible(false).setDepth(20).setScrollFactor(0).setScale(1); // <-- Modifica la escala aquí
        this.Logro1 = this.add.image(1320, 720, 'Logro1').setVisible(false).setDepth(25).setScrollFactor(0).setScale(0.5); // <-- Modifica la escala aquí
        
        this.botonD = this.add.image(495, 180, 'botonDescripcion').setDepth(21).setVisible(false).setScrollFactor(0).setScale(1,0.5); // <-- Modifica la escala aquí
        this.botonSa = this.add.image(495, 720, 'botonSalir').setDepth(21).setInteractive({ useHandCursor: true }).setVisible(false).setScrollFactor(0).setScale(1); // <-- Modifica la escala aquí
        this.objetoMapa = this.add.sprite(1204, 450, 'objetoMapa').setDepth(22).setVisible(false).setScrollFactor(0).setScale(1); // <-- Modifica la escala aquí
        
        // Texto del Pop-Up de descripción del Mapa
        this.texto2 = this.add.text(495, 441, '', {
            fontFamily: 'Arial', fontSize: '36px', fill: '#ffffff', align: 'center', wordWrap: { width: 850 }
        }).setOrigin(0.5).setDepth(22).setVisible(false).setScrollFactor(0).setScale(1); // <-- Modifica la escala aquí

        // Texto de acción flotante (Sigue al personaje en el mundo)
        this.textoAccion = this.add.text(0, 0, '', {
            fontSize: '24px', fontFamily: 'Arial', fill: '#ffffff', backgroundColor: '#000000', padding: { x: 10, y: 6 }
        }).setVisible(false).setOrigin(0.5).setDepth(15).setScale(1); // <-- Modifica la escala aquí

        // ==============================================================
        // COORDENADA PROVISIONAL PARA INSPECCIÓN (Modifica la posición aquí)
        // ==============================================================
        this.mensajeTexto = this.add.text(825, 550, '', {
            fontSize: '48px', 
            fontFamily: 'Arial', 
            fill: '#ffff00', 
            backgroundColor: '#000000', 
            padding: { x: 25, y: 15 },
            align: 'center'
        }).setOrigin(0.5).setVisible(false).setScrollFactor(0).setDepth(500).setScale(1); // <-- Modifica la escala aquí

        // Eventos del Botón Salir del Pop-Up
        this.agregarEfectoHover(this.botonSa, 1.1);
        this.botonSa.on('pointerdown', () => {
            this.fondoObjeto.setVisible(false);
            this.botonD.setVisible(false);
            this.botonSa.setVisible(false);
            this.objetoMapa.setVisible(false);
            this.texto2.setVisible(false);
            this.personaje.body.enable = true; 
        });

        // ==============================================================
        // 4. COLISIONES Y ZONAS DE INTERACCIÓN
        // ==============================================================
        this.crearZonasDeInteraccion(map);

        // ==============================================================
        // 5. CONTROLES DEL JUEGO
        // ==============================================================
        this.teclasMovimiento = this.input.keyboard.addKeys({
            arriba: Phaser.Input.Keyboard.KeyCodes.W,
            abajo: Phaser.Input.Keyboard.KeyCodes.S,
            izquierda: Phaser.Input.Keyboard.KeyCodes.A,
            derecha: Phaser.Input.Keyboard.KeyCodes.D
        });
        this.teclasExtras = this.input.keyboard.addKeys('E,G');
    }

    crearAnimacionesMovimiento() {
        if (!this.anims.exists('caminar_abajo')) {
            this.anims.create({ key: 'caminar_abajo', frames: this.anims.generateFrameNumbers('niñoCaminando', { start: 1, end: 2 }), frameRate: 8, repeat: -1 });
            this.anims.create({ key: 'caminar_arriba', frames: this.anims.generateFrameNumbers('niñoCaminando', { start: 4, end: 5 }), frameRate: 8, repeat: -1 });
            this.anims.create({ key: 'caminar_derecha', frames: this.anims.generateFrameNumbers('niñoCaminando', { start: 6, end: 7 }), frameRate: 8, repeat: -1 });
        }
    }

    crearZonasDeInteraccion(map) {
        const colisionesLayer = map.getObjectLayer('Colisiones');
        if (!colisionesLayer) return;

        this.paredes = this.physics.add.staticGroup();

        colisionesLayer.objects.forEach(obj => {
            const x = obj.x + obj.width / 2;
            const y = obj.y + obj.height / 2;

            if (!obj.ellipse) {
                const pared = this.add.zone(x, y, obj.width, obj.height);
                this.physics.add.existing(pared, true);
                this.paredes.add(pared);
            } else {
                const zona = this.add.zone(x, y, obj.width, obj.height);
                this.physics.add.existing(zona, true);
                zona.propiedades = obj.properties?.reduce((acc, p) => ({ ...acc, [p.name]: p.value }), {}) || {};
                this.physics.add.overlap(this.personaje, zona, () => this.zonaInteractivaActual = zona);
            }
        });

        this.physics.add.collider(this.personaje, this.paredes);
    }

    gestionarInteraccion() {
        const props = this.zonaInteractivaActual.propiedades;
        
        if (props.texto === 'Un objeto nuevo.') {
            if (!this.inspeccionRealizada) {
                this.inspeccionRealizada = true;
                
                agregarObjetoInventario(3); 
                
                const itemData = getState().objectsGlobales?.find(o => o.id == 3) || {
                    nombre: 'Mapa del Bosque', descripcion: 'Guía tu camino.', rareza: 'Raro'
                };

                this.texto2.setText(`${itemData.nombre}\n\n${itemData.descripcion}\n\nMira tu entorno: ${itemData.rareza}`);
                
                this.personaje.body.enable = false;
                this.personaje.anims.stop();
                
                this.fondoObjeto.setVisible(true);
                this.botonD.setVisible(true);
                this.botonSa.setVisible(true);
                this.objetoMapa.setVisible(true);
                this.texto2.setVisible(true);
            } else {
                this.mostrarMensaje('Ya revisaste este lugar.');
            }
        } 
        else if (props.texto === 'Ser curioso merece su recompensa') {
            if (!this.logroObtenido) {
                this.logroObtenido = true;
                otorgarLogro(1);
                this.Logro1.setVisible(true);
                this.time.delayedCall(3000, () => this.Logro1.setVisible(false));
            }
        } 
        else {
            this.mostrarMensaje(props.texto || 'Nada interesante aquí.');
        }
    }

    mostrarMensaje(texto) {
        this.mensajeTexto.setText(texto).setVisible(true);
        this.time.delayedCall(3000, () => this.mensajeTexto.setVisible(false));
    }

    agregarEfectoHover(boton, multiplicador) {
        boton.escalaBase = boton.scaleX;
        boton.on('pointerover', () => boton.setScale(boton.escalaBase * multiplicador));
        boton.on('pointerout', () => boton.setScale(boton.escalaBase));
    }

    update() {
        if (!this.personaje.body.enable) return; 

        const velocity = 150;
        let vx = 0, vy = 0;

        // --- ENTRADAS ---
        if (this.teclasMovimiento.izquierda.isDown) {
            vx = -velocity;
            this.personaje.setFlipX(true);
        } else if (this.teclasMovimiento.derecha.isDown) {
            vx = velocity;
            this.personaje.setFlipX(false);
        }

        if (this.teclasMovimiento.arriba.isDown) {
            vy = -velocity;
        } else if (this.teclasMovimiento.abajo.isDown) {
            vy = velocity;
        }

        this.personaje.setVelocity(vx, vy);

        // --- ANIMACIONES DEL NIÑO ---
        if (vx !== 0 || vy !== 0) {
            if (vy < 0) this.personaje.play('caminar_arriba', true);
            else if (vy > 0) this.personaje.play('caminar_abajo', true);
            else this.personaje.play('caminar_derecha', true);
        } else {
            this.personaje.anims.stop();
            this.personaje.setFrame(0);
        }

        // --- EVENTOS DE PROXIMIDAD ---
        if (this.zonaInteractivaActual) {
            const props = this.zonaInteractivaActual.propiedades;
            const mensaje = props.tipo === 'salida' ? 'Presiona G para salir' : 'Presiona E para inspeccionar';
            
            this.textoAccion.setText(mensaje).setVisible(true);
            this.textoAccion.setPosition(this.personaje.x, this.personaje.y - 75);

            if (props.tipo === 'salida' && Phaser.Input.Keyboard.JustDown(this.teclasExtras.G)) {
                this.scene.start('EscenaMapa'); 
            } 
            else if (props.tipo === 'inspeccionar' && Phaser.Input.Keyboard.JustDown(this.teclasExtras.E)) {
                this.gestionarInteraccion();
            }

            this.zonaInteractivaActual = null; 
        } else {
            this.textoAccion.setVisible(false);
        }
    }
}