import { getState, agregarObjetoInventario } from '../globals.js';
import { reescalarGlobalFlexible, createAndAdaptTextFlexible, agregarEfectoHover } from '../uiHelpers.js';

export class EscenaSalida extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaSalida' });
    }

    create() {
        // 1. ELEMENTOS VISUALES Y FONDOS
        this.fondo = this.add.image(0, 0, 'FondoCabana').setDepth(1);
        this.fondoObjeto = this.add.image(0, 0, 'FondoObjetoAmarillo').setDepth(4).setVisible(false);
        
        // Recuadros de diálogo
        this.recuadroMa = this.add.image(0, 0, 'recuadroM').setDepth(2).setVisible(true);
        
        // Botones e Interfaz
        this.botonD = this.add.image(0, 0, 'botonDescripcion').setDepth(4).setVisible(false);
        this.botonI = this.add.image(0, 0, 'botonInventario').setDepth(10).setInteractive({ useHandCursor: true });
        this.botonSa = this.add.image(0, 0, 'botonSalir').setDepth(4).setInteractive({ useHandCursor: true }).setVisible(false);
        this.boton = this.add.image(0, 0, 'botonSiguiente').setDepth(4).setInteractive({ useHandCursor: true });
        this.botonS = this.add.image(0, 0, 'botonSaltar').setDepth(4).setInteractive({ useHandCursor: true });

        // 2. PERSONAJES Y OBJETOS ANIMADOS
        this.gato = this.add.sprite(0, 0, 'gato').setDepth(3).setFlipX(true);
        this.mago = this.add.sprite(0, 0, 'mago').setDepth(3).setFlipX(true);
        this.objetoEspada = this.add.sprite(0, 0, 'objetoEspada').setDepth(10).setVisible(false);

        // Protección de animaciones
        if (!this.anims.exists('gato-movimiento')) {
            this.anims.create({ key: 'gato-movimiento', frames: this.anims.generateFrameNumbers('gato', { start: 0, end: 7 }), frameRate: 3, repeat: -1 });
        }
        if (!this.anims.exists('mago-movimiento')) {
            this.anims.create({ key: 'mago-movimiento', frames: this.anims.generateFrameNumbers('mago', { start: 0, end: 4 }), frameRate: 5, repeat: -1 });
        }
        if (!this.anims.exists('objetoEspada-movimiento')) {
            this.anims.create({ key: 'objetoEspada-movimiento', frames: this.anims.generateFrameNumbers('objetoEspada', { start: 0, end: 6 }), frameRate: 6, repeat: -1 });
        }

        this.gato.play('gato-movimiento');
        this.mago.play('mago-movimiento');

        // 3. LÓGICA DE INVENTARIO (Delegada al Store)
        const ITEM_ID = 2; // ID de la Espada
        agregarObjetoInventario(ITEM_ID); 

        // Recuperamos los datos del objeto de forma segura
        const objetosGlobales = getState().objetosGlobales || [];
        const itemData = objetosGlobales.find(o => o.id == ITEM_ID) || {
            nombre: 'Espada de Madera',
            descripcion: 'Un arma básica para defenderte de los monstruos.',
            cantidad: 'Sin límite',
            rareza: 'Común'
        };

        // 4. SISTEMA DE DIÁLOGOS Y TEXTOS
        const nombreJugador = getState().jugador?.jugador || getState().jugador?.nombre_jugador || 'Viajero';

        this.dialogos = [
            'Ahora que sabes cómo usar el espejo, es hora de explorar el mundo.',
            'Te daré un último regalo para protegerte.',
            'Es fácil usar esta arma.',
            '', // Espacio para el Pop-Up de la Espada
            'Equípala en tu inventario como hiciste antes.',
            `Es hora de partir, ${nombreJugador}.` // Nombre dinámico inyectado
        ];
        this.dialogoActual = 0;

        // Texto principal de diálogo
        this.texto = createAndAdaptTextFlexible(this, {
            text: this.dialogos[this.dialogoActual],
            posX: 0.74, posY: 0.19, maxWidth: 850, fontSizeInicial: 36,
            originX: 0.5, originY: 0.5, color: '#000000'
        }).setDepth(5);

        // Texto de descripción del objeto (UI emergente)
        const textoDescripcionObjeto = `${itemData.nombre}\n\n${itemData.descripcion}\n\nCantidad de usos máximo: ${itemData.cantidad}\n\nRareza: ${itemData.rareza}`;
        
        this.texto2 = createAndAdaptTextFlexible(this, {
            text: textoDescripcionObjeto,
            posX: 0.3, posY: 0.49, maxWidth: 850, fontSizeInicial: 38,
            originX: 0.5, originY: 0.5, color: '#ffffff'
        }).setDepth(20).setVisible(false);

        // 5. EVENTOS E INTERACCIÓN
        const abrirInventario = () => {
            this.dialogoActual++;
            window.ultimaEscenaActiva = this.scene.key;
            this.scene.launch('EscenaInventario');
            this.scene.pause();
        };

        this.botonI.on('pointerdown', abrirInventario);
        this.input.keyboard.on('keydown-R', abrirInventario);

        this.botonS.on('pointerdown', () => this.scene.start('EscenaParteUno'));

        this.boton.on('pointerdown', () => {
            this.dialogoActual++;
            if (this.dialogoActual < this.dialogos.length) {
                this.texto.setText(this.dialogos[this.dialogoActual]);
                this.actualizarEscenaPorDialogo(this.dialogoActual);
            } else {
                this.scene.start('EscenaParteUno');
            }
        });

        this.botonSa.on('pointerdown', () => {
            this.dialogoActual++;
            if (this.dialogoActual < this.dialogos.length) {
                this.texto.setText(this.dialogos[this.dialogoActual]);
                this.actualizarEscenaPorDialogo(this.dialogoActual);
            }
        });

        // 6. RESPONSIVIDAD Y EFECTOS
        this.aplicarReescalado();
        this.scale.on('resize', () => this.aplicarReescalado());

        agregarEfectoHover(this.boton);
        agregarEfectoHover(this.botonS);
        agregarEfectoHover(this.botonI, 1.15);
        agregarEfectoHover(this.botonSa);
    }

    actualizarEscenaPorDialogo(dialogoIndex) {
        const mostrarMago = [0, 1, 2, 3, 4, 5]; // El mago habla en todos los diálogos

        // Restablecer vista por defecto
        this.recuadroMa.setVisible(true);
        this.mago.setVisible(true);
        this.gato.setVisible(true);
        this.boton.setVisible(true);
        this.botonS.setVisible(true);
        this.botonI.setVisible(true);
        this.fondo.setVisible(true);
        
        // Ocultar Pop-Up
        this.fondoObjeto.setVisible(false);
        this.botonD.setVisible(false);
        this.botonSa.setVisible(false);
        this.texto2.setVisible(false);
        this.objetoEspada.setVisible(false);

        if (mostrarMago.includes(dialogoIndex)) {
            if (dialogoIndex === 3) {
                this.objetoEspada.play('objetoEspada-movimiento').setVisible(true);

                // Ocultar fondo y personajes para centrarse en el objeto
                this.recuadroMa.setVisible(false);
                this.mago.setVisible(false);
                this.gato.setVisible(false);
                this.boton.setVisible(false);
                this.botonS.setVisible(false);
                this.fondo.setVisible(false);
                
                // Mostrar Pop-Up del objeto
                this.fondoObjeto.setVisible(true);
                this.botonD.setVisible(true);
                this.botonSa.setVisible(true);
                this.texto2.setVisible(true);
            }
        }   
    }

    aplicarReescalado() {
        reescalarGlobalFlexible(this, [
            { obj: this.fondo, posX: 0.5, posY: 1, originX: 0.5, originY: 1, escalaRelativa: 1, autoFill: true },
            
            // Layout de diálogo
            { obj: this.recuadroMa, posX: 0.73, posY: 0.19, escalaRelativa: 1.04 },
            { obj: this.boton, posX: 0.73, posY: 0.4207, escalaRelativa: 0.32 },
            { obj: this.botonS, posX: 0.9, posY: 0.409, escalaRelativa: 0.32 },
            
            // Actores
            { obj: this.gato, posX: 0.44, posY: 0.81, escalaRelativa: 0.24 },
            { obj: this.mago, posX: 0.24, posY: 0.67, escalaRelativa: 0.3 },
            
            // Pop-Up de Objeto
            { obj: this.objetoEspada, posX: 0.73, posY: 0.5, escalaRelativa: 0.7 },
            { obj: this.fondoObjeto, posX: 0.5, posY: 0.5, escalaRelativa: 2 },
            { obj: this.botonD, posX: 0.3, posY: 0.2, escalaRelativa: 0.55 },
            { obj: this.botonSa, posX: 0.3, posY: 0.8, escalaRelativa: 0.3 },
            
            // UI Global
            { obj: this.botonI, posX: 0.05, posY: 0.1, escalaRelativa: 0.15 }
        ]);

        // Guardar escalas base para Hover
        this.boton.escalaBase = this.boton.scale;
        this.botonS.escalaBase = this.botonS.scale;
        this.botonI.escalaBase = this.botonI.scale;
        this.botonSa.escalaBase = this.botonSa.scale;
    }
}