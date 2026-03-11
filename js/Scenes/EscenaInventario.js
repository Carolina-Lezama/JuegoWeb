import { objetosDelPersonaje,  objetos_jugador,objetosActivos, datosObjetos, objetos, personajeHumanoEnUso, personajeGatoEnUso, ApartadoMenu, setPersonajeHumanoEnUso, setPersonajeGatoEnUso, setApartadoMenu } from '../globals.js';
import { isMobile, getPosEscala, reescalarGlobalFlexible, cargarPersonajeActual, cargarGatoActual, createAndAdaptTextFlexible, extraerDatosObjetoPorId } from '../responsive.js';
//--- ESCENA DEL INVENTARIO

function getInventarioUnificado() {
    // Unifica ambos conjuntos evitando repeticiones por id
    // Prioriza los objetos de la base de datos
    const inventario = {};
    // Primero los de la base de datos
    if (Array.isArray(objetos_jugador)) {
        objetos_jugador.forEach(obj => {
            // Usar objeto_id o id según lo que venga de la BD
            const id = obj.objetos_id;
            inventario[id] = obj;
        });
    }
    // Luego los locales, usando objetos_id
    Object.values(objetosDelPersonaje).forEach(obj => {
        const id = obj.objetos_id;
        if (id && !inventario[id]) {
            inventario[id] = obj;
        }
    });
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
        Object.keys(inventarioUnificado).forEach(id => {
            // Para el sprite, el id debe ser el nombre de la textura
            // Si tienes un mapeo de id a nombre de textura, úsalo aquí
            const spriteKey = id; // Ajusta si necesitas mapear a otro nombre
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
            objetosActivos.push(this.objetoSeleccionado);
            if (this.objetoSeleccionado) {
                this.texto.setVisible(true);
                this.time.delayedCall(2000, () => {
                    this.texto.setVisible(false);
                });
            }
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
