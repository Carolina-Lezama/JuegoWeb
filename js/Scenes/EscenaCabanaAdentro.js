import { getState, agregarObjetoInventario } from '../globals.js';
import { reescalarGlobalFlexible, createAndAdaptTextFlexible, agregarEfectoHover } from '../uiHelpers.js';

export class EscenaCabanaAdentro extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaCabanaAdentro' });
    }

    create() {
        // 1. ELEMENTOS VISUALES Y FONDOS
        this.fondo = this.add.image(0, 0, 'FondoCabanaAdentro').setDepth(1);
        this.fondoObjeto = this.add.image(0, 0, 'FondoObjeto').setDepth(4).setVisible(false);
        
        // Recuadros de diálogo
        this.recuadro = this.add.image(0, 0, 'recuadro').setDepth(2).setVisible(false);
        this.recuadroMa = this.add.image(0, 0, 'recuadroM').setDepth(2).setVisible(true);
        this.recuadroPe = this.add.image(0, 0, 'recuadroP').setDepth(2).setVisible(false);
        
        // Botones e Interfaz
        this.botonD = this.add.image(0, 0, 'botonDescripcion').setDepth(4).setVisible(false);
        this.botonI = this.add.image(0, 0, 'botonInventario').setDepth(10).setInteractive({ useHandCursor: true }).setVisible(false);
        this.botonSa = this.add.image(0, 0, 'botonSalir').setDepth(4).setInteractive({ useHandCursor: true }).setVisible(false);
        this.boton = this.add.image(0, 0, 'botonSiguiente').setDepth(4).setInteractive({ useHandCursor: true });
        this.botonS = this.add.image(0, 0, 'botonSaltar').setDepth(4).setInteractive({ useHandCursor: true });

        // 2. PERSONAJES Y OBJETOS ANIMADOS
        this.gato = this.add.sprite(0, 0, 'gato').setDepth(3).setFlipX(true);
        this.mago = this.add.sprite(0, 0, 'mago').setDepth(3).setFlipX(true);
        this.objetoEspejo = this.add.sprite(0, 0, 'objetoEspejo').setDepth(10).setVisible(false);

        // Protección de animaciones
        if (!this.anims.exists('gato-movimiento')) {
            this.anims.create({ key: 'gato-movimiento', frames: this.anims.generateFrameNumbers('gato', { start: 0, end: 7 }), frameRate: 3, repeat: -1 });
        }
        if (!this.anims.exists('mago-movimiento')) {
            this.anims.create({ key: 'mago-movimiento', frames: this.anims.generateFrameNumbers('mago', { start: 0, end: 4 }), frameRate: 5, repeat: -1 });
        }
        if (!this.anims.exists('objetoEspejo-movimiento')) {
            this.anims.create({ key: 'objetoEspejo-movimiento', frames: this.anims.generateFrameNumbers('objetoEspejo', { start: 0, end: 6 }), frameRate: 3, repeat: -1 });
        }

        this.gato.play('gato-movimiento');
        this.mago.play('mago-movimiento');

        // 3. LÓGICA DE INVENTARIO (Delegada al Store)
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

        // 4. SISTEMA DE DIÁLOGOS Y TEXTOS
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

        // 6. RESPONSIVIDAD Y EFECTOS
        this.aplicarReescalado();
        this.scale.on('resize', () => this.aplicarReescalado());

        agregarEfectoHover(this.boton);
        agregarEfectoHover(this.botonS);
        agregarEfectoHover(this.botonI, 1.15); // El icono de inventario puede crecer un poco más
        agregarEfectoHover(this.botonSa);
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

    aplicarReescalado() {
        reescalarGlobalFlexible(this, [
            { obj: this.fondo, posX: 0.5, posY: 1, originX: 0.5, originY: 1, escalaRelativa: 1, autoFill: true },
            
            // Layout de diálogo
            { obj: this.recuadro, posX: 0.85, posY: 0.22, escalaRelativa: 1.5 },
            { obj: this.recuadroPe, posX: 0.73, posY: 0.19, escalaRelativa: 1.03 },
            { obj: this.recuadroMa, posX: 0.73, posY: 0.19, escalaRelativa: 1.04 },
            
            // Botones de diálogo
            { obj: this.boton, posX: 0.73, posY: 0.42, escalaRelativa: 0.32 },
            { obj: this.botonS, posX: 0.9, posY: 0.41, escalaRelativa: 0.32 },
            
            // Actores
            { obj: this.gato, posX: 0.44, posY: 0.81, escalaRelativa: 0.24 },
            { obj: this.mago, posX: 0.24, posY: 0.67, escalaRelativa: 0.3 },
            
            // Pop-Up Objeto
            { obj: this.objetoEspejo, posX: 0.73, posY: 0.5, escalaRelativa: 0.7 },
            { obj: this.fondoObjeto, posX: 0.5, posY: 0.5, escalaRelativa: 2 },
            { obj: this.botonD, posX: 0.3, posY: 0.2, escalaRelativa: 0.55 },
            { obj: this.botonSa, posX: 0.3, posY: 0.8, escalaRelativa: 0.3 },
            
            // UI Global
            { obj: this.botonI, posX: 0.05, posY: 0.1, escalaRelativa: 0.15 }
        ]);

// Guardamos las escalas para el efecto hover
        this.boton.escalaBase = this.boton.scale;
        this.botonS.escalaBase = this.botonS.scale;
        this.botonI.escalaBase = this.botonI.scale;
        this.botonSa.escalaBase = this.botonSa.scale;
    }
}