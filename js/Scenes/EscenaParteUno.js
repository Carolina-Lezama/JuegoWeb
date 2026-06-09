import { getState, agregarObjetoInventario, otorgarLogro } from '../globals.js';
import { reescalarGlobalFlexible, agregarEfectoHover } from '../uiHelpers.js';

export class EscenaParteUno extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaParteUno' });
        // Banderas de estado local
        this.logroObtenido = false;
        this.mapaObtenido = false;
        this.inspeccionRealizada = false;
        this.zonaInteractivaActual = null; // Referencia a la zona tocada
    }

    preload() {
        // Asegúrate de que las rutas sean correctas
        this.load.tilemapTiledJSON('BosqueFuente', 'assets/static/Lugares/BosqueFuente.json');
        this.load.image('fondoBosqueFuente', 'assets/static/Lugares/fondoBosqueFuente.png');
    }

    create() {
        // 1. CARGA DEL MAPA Y FÍSICAS MUNDIALES
        const map = this.make.tilemap({ key: 'BosqueFuente' });
        const tileset = map.addTilesetImage('fondoBosqueFuente', 'fondoBosqueFuente');
        const fondoLayer = map.createLayer('Fondo', tileset, 0, 0);

        // Como usamos Scale.FIT en el motor, el mapa se escalará automáticamente
        // sin necesidad de forzar fondoLayer.setScale() para móviles.
        
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // 2. CREACIÓN DEL JUGADOR
        const posicionXCentrada = map.widthInPixels / 2;
        const posicionY = 200; 

        this.personaje = this.physics.add.sprite(posicionXCentrada, posicionY, 'niñoCaminando');
        this.personaje.setScale(0.6);
        this.personaje.setCollideWorldBounds(true);
        this.cameras.main.startFollow(this.personaje);

        this.crearAnimacionesMovimiento();

        // 3. INTERFAZ DE USUARIO (Pegada a la pantalla)
        this.crearInterfazUsuario();

        // 4. COLISIONES Y ZONAS DE INTERACCIÓN
        this.crearZonasDeInteraccion(map);

        // 5. CONTROLES Y EVENTOS
        this.teclasMovimiento = this.input.keyboard.addKeys({
            arriba: Phaser.Input.Keyboard.KeyCodes.W,
            abajo: Phaser.Input.Keyboard.KeyCodes.S,
            izquierda: Phaser.Input.Keyboard.KeyCodes.A,
            derecha: Phaser.Input.Keyboard.KeyCodes.D
        });
        this.teclasExtras = this.input.keyboard.addKeys('E,G');

        // 6. RESPONSIVIDAD DE UI
        this.aplicarReescaladoUI();
        this.scale.on('resize', () => this.aplicarReescaladoUI());
    }

    crearAnimacionesMovimiento() {
        if (!this.anims.exists('caminar_abajo')) {
            this.anims.create({ key: 'caminar_abajo', frames: this.anims.generateFrameNumbers('niñoCaminando', { start: 1, end: 2 }), frameRate: 8, repeat: -1 });
            this.anims.create({ key: 'caminar_arriba', frames: this.anims.generateFrameNumbers('niñoCaminando', { start: 4, end: 5 }), frameRate: 8, repeat: -1 });
            this.anims.create({ key: 'caminar_derecha', frames: this.anims.generateFrameNumbers('niñoCaminando', { start: 6, end: 7 }), frameRate: 8, repeat: -1 });
        }
    }

    crearInterfazUsuario() {
        // Elementos con ScrollFactor(0) para ignorar la cámara
        this.fondoObjeto = this.add.image(0, 0, 'FondoObjeto').setVisible(false).setDepth(20).setScrollFactor(0);
        this.Logro1 = this.add.image(0, 0, 'Logro1').setVisible(false).setDepth(25).setScrollFactor(0);
        
        this.botonD = this.add.image(0, 0, 'botonDescripcion').setDepth(21).setVisible(false).setScrollFactor(0);
        this.botonSa = this.add.image(0, 0, 'botonSalir').setDepth(21).setInteractive({ useHandCursor: true }).setVisible(false).setScrollFactor(0);
        this.objetoMapa = this.add.sprite(0, 0, 'objetoMapa').setDepth(22).setVisible(false).setScrollFactor(0);
        
        // Textos Dinámicos
        this.texto2 = this.add.text(0, 0, '', {
            fontFamily: 'Silkscreen', fontSize: '18px', fill: '#000', wordWrap: { width: 400 }
        }).setDepth(22).setVisible(false).setScrollFactor(0);

        this.textoAccion = this.add.text(0, 0, '', {
            fontSize: '16px', fill: '#ffffff', backgroundColor: '#000000', padding: { x: 8, y: 4 }
        }).setVisible(false).setDepth(15); // Este SÍ se mueve con la cámara porque sigue al personaje

        this.mensajeTexto = this.add.text(20, 20, '', {
            fontSize: '18px', fill: '#fff', backgroundColor: '#000'
        }).setVisible(false).setScrollFactor(0).setDepth(25);

        // Eventos de Botones
        agregarEfectoHover(this.botonSa);
        
        this.botonSa.on('pointerdown', () => {
            // Cerrar Pop-Up
            this.fondoObjeto.setVisible(false);
            this.botonD.setVisible(false);
            this.botonSa.setVisible(false);
            this.objetoMapa.setVisible(false);
            this.texto2.setVisible(false);
            
            // Devolver el control al jugador
            this.personaje.body.enable = true;
        });
    }

    crearZonasDeInteraccion(map) {
        const colisionesLayer = map.getObjectLayer('Colisiones');
        if (!colisionesLayer) return;

        this.paredes = this.physics.add.staticGroup();

        colisionesLayer.objects.forEach(obj => {
            const x = obj.x + obj.width / 2;
            const y = obj.y + obj.height / 2;

            if (!obj.ellipse) {
                // Es un rectángulo sólido (Pared)
                const pared = this.add.zone(x, y, obj.width, obj.height);
                this.physics.add.existing(pared, true);
                this.paredes.add(pared);
            } else {
                // Es un área de interacción (Elipse/Trigger)
                const zona = this.add.zone(x, y, obj.width, obj.height);
                this.physics.add.existing(zona, true);
                zona.propiedades = obj.properties?.reduce((acc, p) => ({ ...acc, [p.name]: p.value }), {}) || {};
                
                // EVENTO DE OVERLAP (Rendimiento Óptimo)
                this.physics.add.overlap(this.personaje, zona, () => this.zonaInteractivaActual = zona);
            }
        });

        // Activar choques
        this.physics.add.collider(this.personaje, this.paredes);
    }

    gestionarInteraccion() {
        const props = this.zonaInteractivaActual.propiedades;
        
        // 1. OBTENCIÓN DE OBJETO (El Mapa)
        if (props.texto === 'Un objeto nuevo.') {
            if (!this.inspeccionRealizada) {
                this.inspeccionRealizada = true;
                
                // Lógica delegada al Store
                agregarObjetoInventario(3); 
                
                // Extraer datos visuales para el Pop-Up
                const itemData = getState().objetosGlobales?.find(o => o.id == 3) || {
                    nombre: 'Mapa del Bosque', descripcion: 'Guía tu camino.', rareza: 'Raro', cantidad: 1
                };

                this.texto2.setText(`${itemData.nombre}\n\n${itemData.descripcion}\nRareza: ${itemData.rareza}`);
                
                // Mostrar UI y pausar jugador
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
        // 2. OBTENCIÓN DE LOGRO
        else if (props.texto === 'Ser curioso merece su recompensa') {
            if (!this.logroObtenido) {
                this.logroObtenido = true;
                
                // Lógica delegada al Store
                otorgarLogro(1);
                
                // Mostrar notificación visual
                this.Logro1.setVisible(true);
                this.time.delayedCall(3000, () => this.Logro1.setVisible(false));
            }
        } 
        // 3. TEXTOS COMUNES
        else {
            this.mostrarMensaje(props.texto || 'Nada interesante aquí.');
        }
    }

    mostrarMensaje(texto) {
        this.mensajeTexto.setText(texto).setVisible(true);
        this.time.delayedCall(3000, () => this.mensajeTexto.setVisible(false));
    }

    aplicarReescaladoUI() {
        // Gracias a setScrollFactor(0), las posiciones (0.5) siempre serán el centro de la pantalla
        reescalarGlobalFlexible(this, [
            { obj: this.fondoObjeto, posX: 0.5, posY: 0.5, escalaRelativa: 2 },
            { obj: this.botonD, posX: 0.3, posY: 0.2, escalaRelativa: 0.55 },
            { obj: this.botonSa, posX: 0.3, posY: 0.8, escalaRelativa: 0.3 },
            { obj: this.objetoMapa, posX: 0.7, posY: 0.5, escalaRelativa: 0.7 },
            { obj: this.Logro1, posX: 0.8, posY: 0.8, escalaRelativa: 0.5 }
        ]);

        // Posicionar el texto relativo al botón de descripción
        if (this.botonD) {
            this.texto2.setPosition(this.scale.width * 0.2, this.scale.height * 0.4);
        }

        this.botonSa.escalaBase = this.botonSa.scale;
    }

    update() {
        // --- MOVIMIENTO ---
        if (!this.personaje.body.enable) return; // Evita moverse si hay un Pop-Up abierto

        const velocity = 150;
        let vx = 0, vy = 0;

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

        // --- ANIMACIONES ---
        if (vx !== 0 || vy !== 0) {
            if (vy < 0) this.personaje.play('caminar_arriba', true);
            else if (vy > 0) this.personaje.play('caminar_abajo', true);
            else this.personaje.play('caminar_derecha', true);
        } else {
            this.personaje.anims.stop();
            this.personaje.setFrame(0);
        }

        // --- INTERACCIONES ---
        if (this.zonaInteractivaActual) {
            const props = this.zonaInteractivaActual.propiedades;
            const mensaje = props.tipo === 'salida' ? 'Presiona G para salir' : 'Presiona E para inspeccionar';
            
            // Pegar el texto sobre la cabeza del personaje en el mundo
            this.textoAccion.setText(mensaje).setVisible(true);
            this.textoAccion.setPosition(this.personaje.x - 40, this.personaje.y - 60);

            // JustDown evita que se dispare múltiple veces si dejas la tecla oprimida
            if (props.tipo === 'salida' && Phaser.Input.Keyboard.JustDown(this.teclasExtras.G)) {
                this.scene.start('EscenaMapa'); // Ajusta a la escena que deba ir
            } 
            else if (props.tipo === 'inspeccionar' && Phaser.Input.Keyboard.JustDown(this.teclasExtras.E)) {
                this.gestionarInteraccion();
            }

            this.zonaInteractivaActual = null; // Reiniciar en cada frame
        } else {
            this.textoAccion.setVisible(false);
        }
    }
}