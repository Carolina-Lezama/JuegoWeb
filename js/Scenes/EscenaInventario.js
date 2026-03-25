import { objetosDelPersonaje,  objetos_jugador,objetosActivos, datosObjetos, objetos, personajeHumanoEnUso, personajeGatoEnUso, ApartadoMenu, setPersonajeHumanoEnUso, setPersonajeGatoEnUso, setApartadoMenu } from '../globals.js';
import { isMobile, getPosEscala, reescalarGlobalFlexible, cargarPersonajeActual, cargarGatoActual, createAndAdaptTextFlexible, extraerDatosObjetoPorId } from '../responsive.js';
//--- ESCENA DEL INVENTARIO

function normalizarId(obj) {
    return obj.objetos_id || obj.id;
}

function getInventarioUnificado() {
    const inventario = {};

    // 🔥 1. LOCAL (invitado o fallback)
    let inventarioLocal = {};
    try {
        inventarioLocal = JSON.parse(localStorage.getItem('inventario_temp')) || {};
    } catch (e) {
        console.warn("Error leyendo localStorage");
    }

    Object.values(inventarioLocal).forEach(obj => {
        const id = normalizarId(obj);
        if (id) inventario[id] = obj;
    });

    // 🔥 2. MEMORIA (siempre)
    Object.values(objetosDelPersonaje).forEach(obj => {
        const id = normalizarId(obj);
        if (id) inventario[id] = obj;
    });

    // 🔥 3. BD (tiene prioridad)
    if (Array.isArray(objetos_jugador)) {
        objetos_jugador.forEach(obj => {
            const id = normalizarId(obj);
            if (id) inventario[id] = obj;
        });
    }

    return inventario;
}

export class EscenaInventario extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaInventario' });
        this.objetoSeleccionado = null;
        this.marcadorSeleccion = null;
    }
    preload() {}

    create() {
        this.fondo = this.add.image(0, 0, 'fondoInventario');
        this.botonI = this.add.image(0, 0, 'botonInventario').setDepth(1).setVisible(true).setInteractive();
        this.inventariopanel = this.add.image(0, 0, 'inventariopanel').setDepth(1).setVisible(true);
        this.botonE = this.add.image(0, 0, 'botonEquipar').setInteractive().setDepth(2).setVisible(true);
        this.botonI.on('pointerdown', () => {
            if (window.ultimaEscenaActiva === 'EscenaCabanaAdentro' || window.ultimaEscenaActiva === 'EscenaSalida' ) {
                this.cerrarInventarioPorPausa();
            } else if (window.ultimaEscenaActiva === 'EscenaTutorialUno') {
                this.cerrarInventarioPorCambio();
                return objetosActivos;
            }else if (window.ultimaEscenaActiva === 'EscenaPeleaSlime' || window.ultimaEscenaActiva === 'EscenaCementerio'|| window.ultimaEscenaActiva === 'EscenaCasaAbandonada'|| window.ultimaEscenaActiva === 'EscenaCastilloIfernal'){
                this.cerrarInventarioPorSwich();
            }
        });
        this.input.keyboard.on('keydown-R', () => {
            if (window.ultimaEscenaActiva === 'EscenaCabanaAdentro' ) {
                this.cerrarInventarioPorPausa();
            } else if (window.ultimaEscenaActiva === 'EscenaTutorialUno') {
                this.cerrarInventarioPorCambio();
                return objetosActivos;
            }else if (window.ultimaEscenaActiva === 'EscenaPeleaSlime' || window.ultimaEscenaActiva === 'EscenaCementerio'|| window.ultimaEscenaActiva === 'EscenaCasaAbandonada'|| window.ultimaEscenaActiva === 'EscenaCastilloIfernal'){
                this.cerrarInventarioPorSwich();
            }
        });
        this.objetosImgs = {};
        // --- INVENTARIO UNIFICADO ---
        const inventarioUnificado = getInventarioUnificado();
        let idx = 0;
        console.log("Inventario unificado:", inventarioUnificado);
        Object.keys(inventarioUnificado).forEach(id => {
            // Para el sprite, el id debe ser el nombre de la textura
            // Si tienes un mapeo de id a nombre de textura, úsalo aquí
            const dataObj = datosObjetos[id] || extraerDatosObjetoPorId(id);
            if (!dataObj) {
            console.warn("Objeto sin datos:", id);
            return;
            }
            const spriteKey = dataObj?.sprite || dataObj?.imagen || id;
            const sprite = this.add.sprite(0, 0, spriteKey)
                .setDepth(2)
                .setVisible(true)
                .setInteractive();
            this.objetosImgs[id] = sprite;
            const animKey = spriteKey + 'movimiento';
            if (!this.anims.exists(animKey)) {
                try {
                    this.anims.create({
                        key: animKey,
                        frames: this.anims.generateFrameNumbers(spriteKey, { start: 0, end: 6 }),
                        frameRate: 3,
                        repeat: -1
                    });
                } catch (err) {
                    console.warn(`No se pudieron generar los frames para '${spriteKey}'`);
                }
            }
            if (this.anims.exists(animKey)) {
                sprite.anims.play(animKey, true);
            }
            // Manejo del clic: al hacer click se selecciona el objeto
            sprite.on('pointerdown', () => {
                this.objetoSeleccionado = id;
                if (this.marcadorSeleccion) {
                    this.marcadorSeleccion.destroy();
                }
                this.marcadorSeleccion = this.add.rectangle(
                    sprite.x, sprite.y,
                    sprite.displayWidth, sprite.displayHeight,
                    0x00ff00, 0.2
                )
                    .setDepth(sprite.depth + 1)
                    .setOrigin(sprite.originX, sprite.originY);
            });
            idx++;
        });
        this.aplicarReescalado();
        this.scale.on('resize', () => {
            this.aplicarReescalado();
        });
this.botonE.on('pointerdown', () => {

    if (!this.objetoSeleccionado) return;

    if (!objetosActivos.includes(this.objetoSeleccionado)) {
        objetosActivos.push(this.objetoSeleccionado);
    }

    this.texto.setVisible(true);

    this.time.delayedCall(2000, () => {
        this.texto.setVisible(false);
    });
});
        this.texto = createAndAdaptTextFlexible(this, {
            text: 'Agregado correctamente a tu barra de herramientas',
            posX: 0.48,
            posY: 0.14,
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
        this.texto.setOrigin(0.5, 0.5).setDepth(3).setVisible(false);
    }

    aplicarReescalado() {
        reescalarGlobalFlexible(this.scale.gameSize, [
            {
                obj: this.fondo,
                autoFill: true,
                originX: 0.5,
                originY: 1
            },
            {
                obj: this.botonI,
                posX: getPosEscala(0.05, 0),
                posY: getPosEscala(0.1, 0),
                escalaRelativa: getPosEscala(0.15, 0),
                originX: 0.5,
                originY: 0.5
            },
            {
                obj: this.inventariopanel,
                posX: getPosEscala(0.5, 0),
                posY: getPosEscala(0.62, 0),
                escalaRelativa: getPosEscala(1.25, 0),
                originX: 0.5,
                originY: 0.5
            },
            {
                obj: this.botonE,
                posX: getPosEscala(0.82, 0),
                posY: getPosEscala(0.15, 0),
                escalaRelativa: getPosEscala(0.3, 0),
                originX: 0.5,
                originY: 0.5
            },
            // Reescalado de los objetos del inventario unificado
            ...Object.keys(this.objetosImgs).map((id, i) => ({
                obj: this.objetosImgs[id],
                posX: getPosEscala(0.265 + 0.1 * (i % 5), 0),
                posY: getPosEscala(0.425 + 0.13 * Math.floor(i / 5), 0),
                escalaRelativa: getPosEscala(0.10),
                originX: 0.5,
                originY: 0.5
            }))
        ]);
        this.fondo.setPosition(this.scale.width / 2, this.scale.height);
    }
    cerrarInventarioPorPausa() {
        if (window.ultimaEscenaActiva) {
            this.scene.stop();
            this.scene.resume(window.ultimaEscenaActiva);
        }
    }
    cerrarInventarioPorCambio() {
        if (window.ultimaEscenaActiva) {
            this.scene.stop();
            this.scene.start(window.ultimaEscenaActiva);
        }
    }
        cerrarInventarioPorSwich() {
        if (window.ultimaEscenaActiva) {
            this.scene.stop();
            this.scene.start(window.ultimaEscenaActiva);
        }
    }
    update() {}
}
