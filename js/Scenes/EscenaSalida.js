import { getState, agregarObjetoInventario, getGatoActivo } from '../globals.js';

export class EscenaSalida extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaSalida' });
    }

    create() {
        // ==============================================================
        // 1. DETERMINAR QUÉ GATO USAR (Fuente Única de Verdad)
        // ==============================================================
        const claveGato = getGatoActivo();

        // ==============================================================
        // 2. ELEMENTOS VISUALES ESTÁTICOS
        // ==============================================================
        this.fondo = this.add.image(825, 450, 'FondoCabana').setDepth(1).setScale(1); // <-- Modifica la escala aquí
        this.fondoObjeto = this.add.image(825, 450, 'FondoObjetoAmarillo').setDepth(4).setVisible(false).setScale(1); // <-- Modifica la escala aquí
        
        // Recuadros de diálogo
        this.recuadroMa = this.add.image(1200, 170, 'recuadroM').setDepth(2).setVisible(true).setScale(1.85, 1.35); // <-- Modifica la escala aquí
        
        // Botones e Interfaz
        this.botonD = this.add.image(495, 180, 'botonDescripcion').setDepth(4).setVisible(false).setScale(0.55); // <-- Modifica la escala aquí
        this.botonI = this.add.image(82, 90, 'botonInventario').setDepth(10).setInteractive({ useHandCursor: true }).setScale(1); // <-- Modifica la escala aquí
        this.botonSa = this.add.image(495, 720, 'botonSalir').setDepth(4).setInteractive({ useHandCursor: true }).setVisible(false).setScale(0.7); // <-- Modifica la escala aquí
        this.boton = this.add.image(1104, 368, 'botonSiguiente').setDepth(4).setInteractive({ useHandCursor: true }).setScale(0.8); // <-- Modifica la escala aquí
        this.botonS = this.add.image(1485, 368, 'botonSaltar').setDepth(4).setInteractive({ useHandCursor: true }).setScale(0.8); // <-- Modifica la escala aquí

        // ==============================================================
        // 3. PERSONAJES Y OBJETOS ANIMADOS
        // ==============================================================
        this.gato = this.add.sprite(726, 729, claveGato).setDepth(3).setFlipX(true).setScale(1); // <-- Modifica la escala aquí
        this.mago = this.add.sprite(396, 603, 'mago').setDepth(3).setFlipX(true).setScale(1.2); // <-- Modifica la escala aquí
        this.objetoEspada = this.add.sprite(1204, 450, 'objetoEspada').setDepth(10).setVisible(false).setScale(0.7); // <-- Modifica la escala aquí

        // Protección de animaciones dinámicas del Gato
        const animGato = `caminata-${claveGato}`;
        if (!this.anims.exists(animGato)) {
            this.anims.create({ key: animGato, frames: this.anims.generateFrameNumbers(claveGato, { start: 0, end: 7 }), frameRate: 4, repeat: -1 });
        }
        
        // Protección de animaciones fijas
        if (!this.anims.exists('mago-movimiento')) {
            this.anims.create({ key: 'mago-movimiento', frames: this.anims.generateFrameNumbers('mago', { start: 0, end: 4 }), frameRate: 4, repeat: -1 });
        }
        if (!this.anims.exists('objetoEspada-movimiento')) {
            this.anims.create({ key: 'objetoEspada-movimiento', frames: this.anims.generateFrameNumbers('objetoEspada', { start: 0, end: 6 }), frameRate: 6, repeat: -1 });
        }

        this.gato.play(animGato);
        this.mago.play('mago-movimiento');

        // ==============================================================
        // 4. LÓGICA DE INVENTARIO (Delegada al Store)
        // ==============================================================
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

        // ==============================================================
        // 5. SISTEMA DE DIÁLOGOS Y TEXTOS NATIVOS
        // ==============================================================
        const nombreJugador = getState().jugador?.jugador || getState().jugador?.nombre_jugador || 'Viajero';

        this.dialogos = [
            'Ahora que sabes cómo usar el espejo, es hora de explorar el mundo.',
            'Te daré un último regalo para protegerte.',
            'Es fácil usar esta arma.',
            '', // Espacio para el Pop-Up de la Espada
            'Equípala en tu inventario como hiciste antes.',
            `Es hora de partir, ${nombreJugador}.`
        ];
        this.dialogoActual = 0;

        // Texto principal de diálogo centrado en el recuadro
        this.texto = this.add.text(1221, 171, this.dialogos[this.dialogoActual], {
            fontSize: '36px',
            color: '#000000',
            fontFamily: 'Arial',
            align: 'center',
            wordWrap: { width: 850 }
        }).setOrigin(0.5).setDepth(5).setScale(1); // <-- Modifica la escala aquí

        // Texto de descripción del objeto (UI emergente del Pop-Up)
        const textoDescripcionObjeto = `${itemData.nombre}\n\n${itemData.descripcion}\n\nCantidad de usos máximo: ${itemData.cantidad}\n\nRareza: ${itemData.rareza}`;
        
        this.texto2 = this.add.text(495, 441, textoDescripcionObjeto, {
            fontSize: '38px',
            color: '#ffffff',
            fontFamily: 'Arial',
            align: 'center',
            wordWrap: { width: 850 }
        }).setOrigin(0.5).setDepth(20).setVisible(false).setScale(1); // <-- Modifica la escala aquí

        // ==============================================================
        // 6. EVENTOS E INTERACCIÓN (Lógica Switch Unificada)
        // ==============================================================
        const abrirInventario = () => {
            this.dialogoActual++;
            window.ultimaEscenaActiva = this.scene.key;
            this.scene.switch('EscenaInventario'); // Pone a dormir limpiamente esta escena
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

        // ==============================================================
        // 7. EVENTOS HOVER (Feedback Visual)
        // ==============================================================
        this.agregarEfectoHover(this.boton, 1.1);
        this.agregarEfectoHover(this.botonS, 1.1);
        this.agregarEfectoHover(this.botonI, 1.15);
        this.agregarEfectoHover(this.botonSa, 1.1);
    }

    actualizarEscenaPorDialogo(dialogoIndex) {
        const mostrarMago = [0, 1, 2, 3, 4, 5];

        // Restablecer vista por defecto
        this.recuadroMa.setVisible(true);
        this.mago.setVisible(true);
        this.gato.setVisible(true);
        this.boton.setVisible(true);
        this.botonS.setVisible(true);
        this.botonI.setVisible(true);
        this.fondo.setVisible(true);
        
        // Ocultar Pop-Up por defecto
        this.fondoObjeto.setVisible(false);
        this.botonD.setVisible(false);
        this.botonSa.setVisible(false);
        this.texto2.setVisible(false);
        this.objetoEspada.setVisible(false);

        if (mostrarMago.includes(dialogoIndex)) {
            if (dialogoIndex === 3) {
                this.objetoEspada.play('objetoEspada-movimiento').setVisible(true);

                // Ocultar entorno para centrarse en el Pop-Up
                this.recuadroMa.setVisible(false);
                this.mago.setVisible(false);
                this.gato.setVisible(false);
                this.boton.setVisible(false);
                this.botonS.setVisible(false);
                this.fondo.setVisible(false);
                
                // Activar el Pop-Up de la Espada obtenido del Store
                this.fondoObjeto.setVisible(true);
                this.botonD.setVisible(true);
                this.botonSa.setVisible(true);
                this.texto2.setVisible(true);
            }
        }   
    }

    agregarEfectoHover(boton, multiplicador) {
        boton.escalaBase = boton.scaleX;
        boton.on('pointerover', () => boton.setScale(boton.escalaBase * multiplicador));
        boton.on('pointerout', () => boton.setScale(boton.escalaBase));
    }
}