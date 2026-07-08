import { getState, agregarObjetoInventario, getGatoActivo } from '../globals.js';

export class EscenaCabanaAdentro extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaCabanaAdentro' });
    }

    create() {
        // ==============================================================
        // 1. DETERMINAR QUÉ GATO USAR (Fuente Única de Verdad)
        // ==============================================================
        const claveGato = getGatoActivo();

        // ==============================================================
        // 2. ELEMENTOS VISUALES Y FONDOS
        // ==============================================================
        this.fondo = this.add.image(825, 450, 'FondoCabanaAdentro').setDepth(1).setScale(1); // <-- Modifica la escala aquí
        this.fondoObjeto = this.add.image(825, 450, 'FondoObjeto').setDepth(4).setVisible(false).setScale(1); // <-- Modifica la escala aquí
        
        // Recuadros de diálogo
        this.recuadro = this.add.image(500, 170, 'recuadro').setDepth(2).setVisible(false).setScale(1.85, 1.35); // <-- Modifica la escala aquí
        this.recuadroMa = this.add.image(500, 170, 'recuadroM').setDepth(2).setVisible(true).setScale(1.85, 1.35); // <-- Modifica la escala aquí
        this.recuadroPe = this.add.image(500, 170, 'recuadroP').setDepth(2).setVisible(false).setScale(1.85, 1.35); // <-- Modifica la escala aquí
        
        // Botones e Interfaz
        // Coordenadas calculadas desde tus porcentajes relativos
        this.botonD = this.add.image(500, 180, 'botonDescripcion').setDepth(4).setVisible(false).setScale(0.55); // <-- Modifica la escala aquí
        this.botonI = this.add.image(85, 90, 'botonInventario').setDepth(10).setInteractive({ useHandCursor: true }).setVisible(false).setScale(0.85); // <-- Modifica la escala aquí
        this.botonSa = this.add.image(500, 720, 'botonSalir').setDepth(4).setInteractive({ useHandCursor: true }).setVisible(false).setScale(0.7); // <-- Modifica la escala aquí
        this.boton = this.add.image(545, 396, 'botonSiguiente').setDepth(4).setInteractive({ useHandCursor: true }).setScale(0.8); // <-- Modifica la escala aquí
        this.botonS = this.add.image(185, 396, 'botonSaltar').setDepth(4).setInteractive({ useHandCursor: true }).setScale(0.8); // <-- Modifica la escala aquí

        // ==============================================================
        // 3. PERSONAJES Y OBJETOS ANIMADOS
        // ==============================================================
        this.gato = this.add.sprite(1300, 730, claveGato).setDepth(3).setFlipX(true).setScale(1); // <-- Modifica la escala aquí
        this.mago = this.add.sprite(1000, 620, 'mago').setDepth(3).setFlipX(true).setScale(1.2); // <-- Modifica la escala aquí
        this.objetoEspejo = this.add.sprite(1200, 450, 'objetoEspejo').setDepth(10).setVisible(false).setScale(1); // <-- Modifica la escala aquí

        // Protección de animaciones dinámicas según el gato elegido
        const animGato = `caminata-${claveGato}`;
        if (!this.anims.exists(animGato)) {
            this.anims.create({ key: animGato, frames: this.anims.generateFrameNumbers(claveGato, { start: 0, end: 7 }), frameRate: 4, repeat: -1 });
        }
        if (!this.anims.exists('mago-movimiento')) {
            this.anims.create({ key: 'mago-movimiento', frames: this.anims.generateFrameNumbers('mago', { start: 0, end: 4 }), frameRate: 4, repeat: -1 });
        }
        if (!this.anims.exists('objetoEspejo-movimiento')) {
            this.anims.create({ key: 'objetoEspejo-movimiento', frames: this.anims.generateFrameNumbers('objetoEspejo', { start: 0, end: 6 }), frameRate: 3, repeat: -1 });
        }

        this.gato.play(animGato);
        this.mago.play('mago-movimiento');

        // ==============================================================
        // 4. LÓGICA DE INVENTARIO (Delegada al Store)
        // ==============================================================
        const ITEM_ID = 1;
        // La lógica interna de globals.js decidirá si guardarlo en BD o en LocalStorage
        agregarObjetoInventario(ITEM_ID); 

        // Recuperamos los datos del objeto para mostrarlos en la UI de forma segura
        const objetosGlobales = getState().objetosGlobales || [];
        const itemData = objetosGlobales.find(o => o.id == ITEM_ID) || {
            nombre: 'Espejo Mágico',
            descripcion: 'Refleja una forma diferente a la tuya.',
            cantidad: 'Sin límite',
            rareza: 'Único'
        };

        // ==============================================================
        // 5. SISTEMA DE DIÁLOGOS Y TEXTOS
        // ==============================================================
        this.dialogos = [
            'Thalor: Primero te daré un objeto que te ayudará a volver a ser humano. Déjame buscarlo.',
            'Thalor: Aquí tienes.',
            '', // Espacio para cuando se muestra el objeto en pantalla grande
            'Carlitos: ¿Cómo debo usarlo?',
            'Thalor: Abre el inventario (click en el ícono o presiona R) y equipa el objeto. Puedes colocarte hasta 6 objetos; los demás seguirán guardados.',
            'Muy bien, ahora veremos cómo funciona.'
        ];
        this.dialogoActual = 0;

        // Texto principal de diálogo
        this.texto = this.add.text(511, 171, this.dialogos[this.dialogoActual], {
            fontSize: '38px',
            color: '#000000',
            fontFamily: 'Arial',
            align: 'center',
            wordWrap: { width: 700 }
        }).setOrigin(0.5).setDepth(5).setScale(1); // <-- Modifica la escala aquí

        // Texto de descripción del objeto (UI emergente)
        const textoDescripcionObjeto = `${itemData.nombre}\n\n${itemData.descripcion}\n\nCantidad de usos máximo: ${itemData.cantidad}\n\nRareza: ${itemData.rareza}`;
        
        this.texto2 = this.add.text(500, 440, textoDescripcionObjeto, {
            fontSize: '38px',
            color: '#ffffff',
            fontFamily: 'Arial',
            align: 'center',
            wordWrap: { width: 700 }
        }).setOrigin(0.5).setDepth(20).setVisible(false).setScale(1); // <-- Modifica la escala aquí

        // ==============================================================
        // 6. EVENTOS E INTERACCIÓN
        // ==============================================================
        const abrirInventario = () => {
            this.dialogoActual++;
            window.ultimaEscenaActiva = this.scene.key;
            this.scene.launch('EscenaInventario');
            this.scene.pause();
        };

        this.botonI.on('pointerdown', abrirInventario);
        
        // El evento de teclado se vincula y limpia automáticamente con Phaser
        this.input.keyboard.on('keydown-R', abrirInventario);

        this.botonS.on('pointerdown', () => this.scene.start('EscenaTutorialUno'));

        this.boton.on('pointerdown', () => {
            this.dialogoActual++;
            if (this.dialogoActual < this.dialogos.length) {
                this.texto.setText(this.dialogos[this.dialogoActual]);
                this.actualizarEscenaPorDialogo(this.dialogoActual);
            } else {
                this.scene.start('EscenaTutorialUno');
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
        this.agregarEfectoHover(this.botonI, 1.15); // El icono de inventario crece un poco más
        this.agregarEfectoHover(this.botonSa, 1.1);
    }

    actualizarEscenaPorDialogo(dialogoIndex) {
        const mostrarMago = [0, 1, 2, 4, 5];
        const mostrarPe = [3];

        // Ocultar todo el layout inicial
        this.recuadro.setVisible(false);
        this.recuadroMa.setVisible(false);
        this.recuadroPe.setVisible(false);
        this.objetoEspejo.setVisible(false);
        
        this.mago.setVisible(true);
        this.gato.setVisible(true);
        this.boton.setVisible(true);
        this.botonS.setVisible(true);
        this.fondo.setVisible(true);
        
        // Elementos del Pop-Up del objeto
        this.fondoObjeto.setVisible(false);
        this.botonD.setVisible(false);
        this.botonI.setVisible(false);
        this.botonSa.setVisible(false);
        this.texto2.setVisible(false);

        // Lógica condicional del flujo
        if (mostrarMago.includes(dialogoIndex)) {
            this.recuadroMa.setVisible(true);
            
            // Pop-Up de obtención de objeto
            if (dialogoIndex === 2) {
                this.objetoEspejo.play('objetoEspejo-movimiento').setVisible(true);
                
                // Ocultamos el fondo y los personajes para enfocar el objeto
                this.fondo.setVisible(false);
                this.recuadroMa.setVisible(false);
                this.mago.setVisible(false);
                this.gato.setVisible(false);
                this.boton.setVisible(false);
                this.botonS.setVisible(false);
                
                // Mostramos interfaz de recolección
                this.fondoObjeto.setVisible(true);
                this.botonD.setVisible(true);
                this.botonSa.setVisible(true);
                this.texto2.setVisible(true);
            } 
            // Aparece el botón de inventario
            else if (dialogoIndex === 4) {
                this.botonI.setVisible(true);
            } 
        } else if (mostrarPe.includes(dialogoIndex)) {
            this.recuadroPe.setVisible(true);
        } else {
            this.recuadro.setVisible(true);
        }   
    }

    agregarEfectoHover(boton, multiplicador) {
        boton.escalaBase = boton.scaleX;
        boton.on('pointerover', () => boton.setScale(boton.escalaBase * multiplicador));
        boton.on('pointerout', () => boton.setScale(boton.escalaBase));
    }
}