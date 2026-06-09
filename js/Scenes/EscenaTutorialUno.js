import { getState } from '../globals.js';
import { reescalarGlobalFlexible, agregarEfectoHover } from '../uiHelpers.js';

export class EscenaTutorialUno extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaTutorialUno' });
        this.objetoSeleccionado = null;
        this.marcadorSeleccion = null;
        this.personajeActivoStr = 'humano'; // Controla quién se mueve
    }

    preload() {
        // Asegúrate de que las rutas coincidan con tu proyecto
        this.load.image('FondoCasaU', 'assets/static/Lugares/FondoCasaU.png');
        this.load.tilemapTiledJSON('mapaTutorial', 'assets/static/Lugares/Nosale.json'); 
    }

    create() {
        // 1. CARGA DEL MAPA TILED
        const mapa = this.make.tilemap({ key: 'mapaTutorial' });
        const tileset = mapa.addTilesetImage('Fondo', 'FondoCasaU');

        // Cálculo de escala para que el mapa ocupe la pantalla (si es lo deseado)
        const escalaX = this.scale.width / (mapa.width * mapa.tileWidth);
        const escalaY = this.scale.height / (mapa.height * mapa.tileHeight);

        const capaFondo = mapa.createLayer('fondo', tileset, 0, 0);
        capaFondo.setScale(escalaX, escalaY);

        // 2. LÍMITES DEL MUNDO Y CÁMARA
        // Los límites deben ser el tamaño DEL MAPA ESCALADO, no de la pantalla
        const mapWidth = mapa.width * mapa.tileWidth * escalaX;
        const mapHeight = mapa.height * mapa.tileHeight * escalaY;
        
        this.physics.world.setBounds(0, 0, mapWidth, mapHeight);
        this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);

        // 3. JUGADORES Y FÍSICAS
        this.personaje = this.physics.add.sprite(mapWidth / 2, mapHeight / 2, 'niñoCaminando');
        this.animal = this.physics.add.sprite(mapWidth / 2, mapHeight / 2, 'gatoCaminando').setVisible(false);
        this.animal.body.enable = false;
        
        this.personaje.setCollideWorldBounds(true);
        this.animal.setCollideWorldBounds(true);
        
        // Puntero dinámico al jugador que estamos controlando
        this.jugadorActivo = this.personaje;
        this.cameras.main.startFollow(this.jugadorActivo);

        // 4. ANIMACIONES DEL JUGADOR
        this.crearAnimacionesMovimiento();

        // 5. INTERFAZ DE USUARIO (UI)
        this.crearInterfazUsuario();

        // 6. MAPEO DE COLISIONES Y ZONAS
        this.crearZonasDeInteraccion(mapa, escalaX, escalaY);

        // 7. CONTROLES Y EVENTOS
        this.teclasMovimiento = this.input.keyboard.addKeys({
            arriba: Phaser.Input.Keyboard.KeyCodes.W,
            abajo: Phaser.Input.Keyboard.KeyCodes.S,
            izquierda: Phaser.Input.Keyboard.KeyCodes.A,
            derecha: Phaser.Input.Keyboard.KeyCodes.D
        });
        this.teclasExtras = this.input.keyboard.addKeys('E,G');

        // 8. RESPONSIVIDAD
        this.aplicarReescaladoUI();
        this.scale.on('resize', () => this.aplicarReescaladoUI());
    }

    crearInterfazUsuario() {
        // 🔥 CRÍTICO: setScrollFactor(0) asegura que la UI no se mueva con la cámara
        this.barra = this.add.image(0, 0, 'barraobjetos').setDepth(5).setScrollFactor(0);
        
        this.botonI = this.add.image(0, 0, 'botonInventario')
            .setDepth(5)
            .setInteractive({ useHandCursor: true })
            .setScrollFactor(0);
            
        agregarEfectoHover(this.botonI);

        const abrirInventario = () => {
            window.ultimaEscenaActiva = this.scene.key;
            this.scene.switch('EscenaInventario'); // Usamos switch para pausar y ocultar
        };

        this.botonI.on('pointerdown', abrirInventario);
        this.input.keyboard.on('keydown-R', abrirInventario);

        // Renderizar Barra de Herramientas (Hotbar)
        this.objetosImgs = {};
        const activos = getState().objetosActivos || []; // Leemos del Store
        
        activos.forEach(id => {
            // Buscamos el sprite correcto
            const dataObj = getState().objetosGlobales?.find(o => o.id == id);
            const spriteKey = dataObj?.sprite || id;

            const sprite = this.add.sprite(0, 0, spriteKey)
                .setDepth(8)
                .setInteractive({ useHandCursor: true })
                .setScrollFactor(0); // Fijar a la pantalla

            this.objetosImgs[id] = sprite;

            // Animación segura del objeto
            const animKey = spriteKey + '-movimiento';
            if (this.anims.exists(animKey)) {
                sprite.play(animKey);
            }

            sprite.on('pointerdown', () => {
                this.objetoSeleccionado = id;
                this.gestionarUsoDeObjeto(id, sprite);
            });
        });

        // Textos flotantes
        this.textoAccion = this.add.text(0, 0, '', {
            fontSize: '16px', fill: '#ffffff', backgroundColor: '#000000', padding: { x: 8, y: 4 }
        }).setVisible(false).setDepth(20);

        this.mensajeTexto = this.add.text(20, 20, '', {
            fontSize: '18px', fill: '#fff', backgroundColor: '#000'
        }).setVisible(false).setScrollFactor(0).setDepth(20);
    }

    gestionarUsoDeObjeto(id, sprite) {
        // UI: Dibujar marcador
        if (this.marcadorSeleccion) this.marcadorSeleccion.destroy();
        
        this.marcadorSeleccion = this.add.rectangle(
            sprite.x, sprite.y, sprite.displayWidth + 5, sprite.displayHeight + 5, 0x00ff00, 0.3
        ).setDepth(sprite.depth - 1).setScrollFactor(0);

        // Lógica: Si es el espejo (ID 1), cambia el personaje
        if (id == 1) {
            this.cambiarPersonaje();
        }
    }

    cambiarPersonaje() {
        if (this.personajeActivoStr === 'humano') {
            this.personaje.setVisible(false);
            this.personaje.body.enable = false;
            
            this.animal.setPosition(this.personaje.x, this.personaje.y); // Sincroniza pos
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

    crearZonasDeInteraccion(mapa, escalaX, escalaY) {
        this.paredes = this.physics.add.staticGroup();
        this.zonaInteractivaActual = null; // Guardará en qué zona está pisando el jugador

        const capaObjetos = mapa.getObjectLayer('Objetos');
        if (!capaObjetos) return;

        capaObjetos.objects.forEach(obj => {
            const x = (obj.x + (obj.width || 0) / 2) * escalaX;
            const y = (obj.y + (obj.height || 0) / 2) * escalaY;
            const w = (obj.width || 0) * escalaX;
            const h = (obj.height || 0) * escalaY;

            const zona = this.add.zone(x, y, w, h);
            this.physics.add.existing(zona, true);

            if (!obj.ellipse) {
                // Pared sólida
                this.paredes.add(zona);
            } else {
                // Zona de interacción (Gatillo/Trigger)
                zona.propiedades = obj.properties?.reduce((acc, p) => ({ ...acc, [p.name]: p.value }), {}) || {};
                
                // Usamos Overlap nativo en lugar de calcular intersecciones en el update
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

    aplicarReescaladoUI() {
        // Solo reescalamos la interfaz. Los personajes y el mapa ya viven en el mundo físico.
        const elementosUI = [
            { obj: this.barra, posX: 0.45, posY: 0.93, escalaRelativa: 0.5 },
            { obj: this.botonI, posX: 0.28, posY: 0.93, escalaRelativa: 0.1 }
        ];

        // Reescalamos los objetos de la barra
        Object.keys(this.objetosImgs).forEach((id) => {
            // Ajustamos la posición horizontal según cuántos objetos haya
            elementosUI.push({
                obj: this.objetosImgs[id],
                posX: 0.35, // Aquí deberías sumar un offset por índice si permites más de 1 objeto en la barra
                posY: 0.93,
                escalaRelativa: 0.06
            });
        });

        reescalarGlobalFlexible(this, elementosUI);

        if (this.marcadorSeleccion && this.objetoSeleccionado) {
            const spriteActivo = this.objetosImgs[this.objetoSeleccionado];
            if (spriteActivo) this.marcadorSeleccion.setPosition(spriteActivo.x, spriteActivo.y);
        }

        // Escalar actores del mundo físico
        const escalaPersonaje = (900 * 0.07) / this.personaje.width; // 900 es el height base del FIT
        const escalaAnimal = (900 * 0.1) / this.animal.width;
        this.personaje.setScale(escalaPersonaje);
        this.animal.setScale(escalaAnimal);
    }

    mostrarMensaje(texto) {
        this.mensajeTexto.setText(texto).setVisible(true);
        this.time.delayedCall(3000, () => this.mensajeTexto.setVisible(false));
    }

    update() {
        // 1. MOVIMIENTO
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

        // 2. GESTIÓN DE ANIMACIONES
        const esGato = this.personajeActivoStr === 'gato';
        
        if (vx !== 0 || vy !== 0) {
            if (vy < 0) this.jugadorActivo.play(esGato ? 'caminar_arriba_animal' : 'caminar_arriba', true);
            else if (vy > 0) this.jugadorActivo.play(esGato ? 'caminar_abajo_animal' : 'caminar_abajo', true);
            else this.jugadorActivo.play(esGato ? 'caminar_derecha_animal' : 'caminar_derecha', true);
        } else {
            this.jugadorActivo.anims.stop();
            this.jugadorActivo.setFrame(0);
        }

        // 3. INTERACCIÓN CON ZONAS
        if (this.zonaInteractivaActual) {
            const props = this.zonaInteractivaActual.propiedades;
            const tecla = props.tecla || 'E';
            const tipo = props.tipo || 'inspeccionar';
            
            this.textoAccion.setText(tipo === 'salida' ? 'Presiona G para salir' : 'Presiona E para inspeccionar').setVisible(true);
            
            // Posicionar texto sobre la cabeza del jugador (en coordenadas de mundo)
            this.textoAccion.setPosition(this.jugadorActivo.x - 40, this.jugadorActivo.y - 60);

            if ((tecla === 'E' && Phaser.Input.Keyboard.JustDown(this.teclasExtras.E)) || 
                (tecla === 'G' && Phaser.Input.Keyboard.JustDown(this.teclasExtras.G))) {
                
                if (tipo === 'inspeccionar') {
                    this.mostrarMensaje(props.texto);
                } else if (tipo === 'salida') {
                    this.scene.start('EscenaSalida');
                }
            }

            // Limpiamos la zona en cada frame. Si el jugador sigue ahí, el evento 'overlap' la volverá a llenar.
            this.zonaInteractivaActual = null; 
        } else {
            this.textoAccion.setVisible(false);
        }
    }
}