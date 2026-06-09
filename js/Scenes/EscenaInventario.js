import { getState, obtenerInventarioUnificado, alternarObjetoActivo } from '../globals.js';
import { reescalarGlobalFlexible, createAndAdaptTextFlexible, agregarEfectoHover } from '../uiHelpers.js';

export class EscenaInventario extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaInventario' });
        this.objetoSeleccionado = null;
        this.marcadorSeleccion = null;
    }

    create() {
        // 1. FONDOS E INTERFAZ
        this.fondo = this.add.image(0, 0, 'fondoInventario').setDepth(0);
        this.inventariopanel = this.add.image(0, 0, 'inventariopanel').setDepth(1);
        
        // Botones interactivos
        this.botonI = this.add.image(0, 0, 'botonInventario').setDepth(2).setInteractive({ useHandCursor: true });
        this.botonE = this.add.image(0, 0, 'botonEquipar').setDepth(2).setInteractive({ useHandCursor: true });

        // 2. LÓGICA DE CIERRE UNIVERSAL (Enrutamiento)
        // Ya no necesitamos hardcodear los nombres de las escenas.
        // Verificamos si esta escena fue "Lanzada" (Launch, que no pausa el update)
        // o si fue iniciada normalmente (Start).
        const cerrarInventario = () => {
            if (window.ultimaEscenaActiva) {
                this.scene.stop();
                // Si la escena anterior sigue existiendo, la reanudamos
                if (this.scene.manager.getScene(window.ultimaEscenaActiva)) {
                     this.scene.resume(window.ultimaEscenaActiva);
                } else {
                    // Fallback de seguridad
                     this.scene.start(window.ultimaEscenaActiva);
                }
            }
        };

        this.botonI.on('pointerdown', cerrarInventario);
        this.input.keyboard.on('keydown-R', cerrarInventario);

        // 3. CARGA DE DATOS UNIFICADOS
        this.objetosImgs = {};
        const inventarioUnificado = obtenerInventarioUnificado();
        
        // 4. RENDERIZADO DEL GRID DE OBJETOS
        let indiceObjeto = 0;
        const baseGlobal = getState().objetosGlobales || [];

        Object.keys(inventarioUnificado).forEach(id => {
            // Buscamos los datos completos del objeto en la base de datos de objetos
            const dataObj = baseGlobal.find(o => o.id == id) || inventarioUnificado[id];
            
            if (!dataObj) {
                console.warn(`No se encontraron datos para el objeto con ID: ${id}`);
                return;
            }

            const spriteKey = dataObj.sprite || dataObj.imagen || String(id);
            const sprite = this.add.sprite(0, 0, spriteKey)
                .setDepth(3)
                .setInteractive({ useHandCursor: true });
            
            this.objetosImgs[id] = sprite;

            // Manejo de animaciones seguras
            const animKey = spriteKey + '-movimiento';
            if (!this.anims.exists(animKey)) {
                try {
                    this.anims.create({
                        key: animKey,
                        frames: this.anims.generateFrameNumbers(spriteKey, { start: 0, end: 6 }),
                        frameRate: 3,
                        repeat: -1
                    });
                } catch (err) {
                    console.warn(`No se pudo generar animación para ${spriteKey}. Usando imagen estática.`);
                }
            }

            if (this.anims.exists(animKey)) {
                sprite.play(animKey);
            }

            // Manejo de selección (Click en el objeto)
            sprite.on('pointerdown', () => {
                this.objetoSeleccionado = id;
                
                // Limpiar marcador anterior
                if (this.marcadorSeleccion) {
                    this.marcadorSeleccion.destroy();
                }

                // Dibujar nuevo marcador encima del sprite
                this.marcadorSeleccion = this.add.rectangle(
                    sprite.x, sprite.y, 
                    sprite.displayWidth + 10, sprite.displayHeight + 10, // Un poco más grande que el sprite
                    0x00ff00, 0.3 // Verde semitransparente
                ).setDepth(2).setOrigin(0.5); // El origin debe coincidir con el sprite
            });

            indiceObjeto++;
        });

        // 5. SISTEMA DE NOTIFICACIONES (Botón Equipar)
        this.textoNotificacion = createAndAdaptTextFlexible(this, {
            text: 'Agregado correctamente a tu barra de herramientas',
            posX: 0.48, posY: 0.14, maxWidth: 850, fontSizeInicial: 38,
            originX: 0.5, originY: 0.5, color: '#ffffff'
        }).setDepth(5).setVisible(false);

        this.botonE.on('pointerdown', () => {
            if (!this.objetoSeleccionado) return;

            // Usamos nuestra nueva función global para equipar/desequipar
            const fueEquipado = alternarObjetoActivo(this.objetoSeleccionado);

            if (fueEquipado) {
                this.textoNotificacion.setText('Objeto equipado correctamente.');
                this.textoNotificacion.setColor('#00ff00'); // Verde
            } else {
                this.textoNotificacion.setText('Objeto retirado de tu barra.');
                this.textoNotificacion.setColor('#ff9900'); // Naranja
            }

            this.textoNotificacion.setVisible(true);

            // Ocultar notificación tras 2 segundos
            this.time.delayedCall(2000, () => {
                this.textoNotificacion.setVisible(false);
            });
        });

        // 6. RESPONSIVIDAD Y EFECTOS
        this.aplicarReescalado();
        this.scale.on('resize', () => this.aplicarReescalado());

        agregarEfectoHover(this.botonI, 1.15);
        agregarEfectoHover(this.botonE);
    }

    aplicarReescalado() {
        const elementosAReescalar = [
            { obj: this.fondo, posX: 0.5, posY: 1, originX: 0.5, originY: 1, escalaRelativa: 1, autoFill: true },
            { obj: this.inventariopanel, posX: 0.5, posY: 0.62, escalaRelativa: 1.25 },
            { obj: this.botonI, posX: 0.05, posY: 0.1, escalaRelativa: 0.15 },
            { obj: this.botonE, posX: 0.82, posY: 0.15, escalaRelativa: 0.3 }
        ];

        // Añadimos los sprites del inventario a la lista de reescalado
        // Usamos la misma matemática de grid, pero limpia y legible
        const IDs = Object.keys(this.objetosImgs);
        IDs.forEach((id, index) => {
            const columna = index % 5;
            const fila = Math.floor(index / 5);
            
            elementosAReescalar.push({
                obj: this.objetosImgs[id],
                // Ajustes de cuadrícula basados en el modo FIT (1650x900)
                posX: 0.265 + (0.1 * columna),
                posY: 0.425 + (0.13 * fila),
                escalaRelativa: 0.10
            });
        });

        reescalarGlobalFlexible(this, elementosAReescalar);

        // Si hay un marcador activo durante el redimensionado, ajustamos su posición
        if (this.marcadorSeleccion && this.objetoSeleccionado) {
            const spriteActivo = this.objetosImgs[this.objetoSeleccionado];
            if (spriteActivo) {
                this.marcadorSeleccion.setPosition(spriteActivo.x, spriteActivo.y);
            }
        }

        this.botonI.escalaBase = this.botonI.scale;
        this.botonE.escalaBase = this.botonE.scale;
    }
}