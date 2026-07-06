import { getState, obtenerInventarioUnificado, alternarObjetoActivo } from '../globals.js';

export class EscenaInventario extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaInventario' });
        this.objetoSeleccionado = null;
        this.marcadorSeleccion = null;
    }

    create() {
        // ==============================================================
        // 1. FONDOS E INTERFAZ
        // ==============================================================
        // Ajustamos el origen del fondo a (0.5, 1) para que ancle abajo al medio, como lo tenías antes
        this.fondo = this.add.image(825, 900, 'fondoInventario').setOrigin(0.5, 1).setDepth(0).setScale(1); // <-- Modifica la escala aquí
        this.inventariopanel = this.add.image(825, 558, 'inventariopanel').setDepth(1).setScale(3); // <-- Modifica la escala aquí
        
        // Botones interactivos
        this.botonI = this.add.image(110, 120, 'botonInventario').setDepth(2).setInteractive({ useHandCursor: true }).setScale(1.2); // <-- Modifica la escala aquí
        this.botonE = this.add.image(1353, 120, 'botonEquipar').setDepth(2).setInteractive({ useHandCursor: true }).setScale(1); // <-- Modifica la escala aquí

        // ==============================================================
        // 2. LÓGICA DE CIERRE UNIVERSAL (Enrutamiento)
        // ==============================================================
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

        // ==============================================================
        // 3. CARGA DE DATOS UNIFICADOS Y RENDERIZADO DEL GRID
        // ==============================================================
        this.objetosImgs = {};
        const inventarioUnificado = obtenerInventarioUnificado();
        const baseGlobal = getState().objetosGlobales || [];
        
        let indiceObjeto = 0;

        Object.keys(inventarioUnificado).forEach(id => {
            // Buscamos los datos completos del objeto en la base de datos
            const dataObj = baseGlobal.find(o => o.id == id) || inventarioUnificado[id];
            
            if (!dataObj) {
                console.warn(`No se encontraron datos para el objeto con ID: ${id}`);
                return;
            }

            // ==========================================================
            // MATEMÁTICA DEL GRID ESTÁTICO (5 objetos por fila)
            // ==========================================================
            const columna = indiceObjeto % 5;
            const fila = Math.floor(indiceObjeto / 5);
            
            // X Base: 437px + (165px de espacio por columna)
            // Y Base: 382px + (117px de espacio por fila)
            const posX = 400 + (165 * columna);
            const posY = 382 + (117 * fila);

            const spriteKey = dataObj.sprite || dataObj.imagen || String(id);
            const sprite = this.add.sprite(posX, posY, spriteKey)
                .setDepth(3)
                .setInteractive({ useHandCursor: true })
                .setScale(0.8); // <-- Modifica la escala de los ítems en el inventario aquí
            
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

                // Dibujar nuevo marcador dinámico encima del sprite basado en su tamaño actual
                this.marcadorSeleccion = this.add.rectangle(
                    sprite.x, sprite.y, 
                    sprite.displayWidth + 10, sprite.displayHeight + 10, 
                    0x00ff00, 0.3 
                ).setDepth(2).setOrigin(0.5); 
            });

            indiceObjeto++;
        });

        // ==============================================================
        // 4. SISTEMA DE NOTIFICACIONES (Botón Equipar)
        // ==============================================================
        this.textoNotificacion = this.add.text(792, 126, 'Agregado correctamente a tu barra de herramientas', {
            fontSize: '38px',
            color: '#ffffff',
            fontFamily: 'Arial',
            align: 'center',
            wordWrap: { width: 850 }
        }).setOrigin(0.5).setDepth(5).setVisible(false).setScale(1); // <-- Modifica la escala aquí

        this.botonE.on('pointerdown', () => {
            if (!this.objetoSeleccionado) return;

            // Usamos la función global para equipar/desequipar
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

        // ==============================================================
        // 5. EVENTOS HOVER (Feedback Visual)
        // ==============================================================
        this.agregarEfectoHover(this.botonI, 1.15); // El icono de inventario crece un poco más
        this.agregarEfectoHover(this.botonE, 1.1);
    }

    // Función interna nativa para reemplazar la global
    agregarEfectoHover(boton, multiplicador) {
        boton.escalaBase = boton.scaleX;
        boton.on('pointerover', () => boton.setScale(boton.escalaBase * multiplicador));
        boton.on('pointerout', () => boton.setScale(boton.escalaBase));
    }
}