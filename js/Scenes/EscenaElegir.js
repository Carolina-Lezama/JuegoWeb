import { getState, setPersonajesEnUso } from '../globals.js';

export class EscenaElegir extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaElegir' });
        this.iconosPersonajes = [];
        // Estado LOCAL de la interfaz: True = Humanos, False = Gatos
        this.mostrandoHumanos = true; 
    }

    create() {
        // ==============================================================
        // 1. CREACIÓN DE FONDOS Y ELEMENTOS ESTÁTICOS
        // ==============================================================
        
        // Fondos centrados (825, 450)
        this.fondo = this.add.image(825, 450, 'fondoVestuario').setDepth(1).setScale(1); 
        
        // Panel izquierdo donde van los personajes
        this.fondoPersonajes = this.add.image(528, 500, 'fondoPersonajes').setDepth(2).setScale(1.5); 
        
        // Título estilizado (Arriba, alineado con el panel izquierdo)
        this.tituloElegir = this.add.text(528, 80, 'Elige tu personaje', {
            fontFamily: 'Silkscreen',
            fontSize: '45px',
            color: '#000000',
            backgroundColor: '#f5f0dc',
            padding: { left: 22, right: 30, top: 5, bottom: 10 },
            align: 'center',
            fixedWidth: 600
        }).setDepth(3).setOrigin(0.5).setScale(1); 

        // ==============================================================
        // 2. BOTONES DE INTERFAZ (Panel derecho)
        // ==============================================================
        
        // Botón Regresar
        this.botonRegresar = this.add.image(1300, 75, 'botonRegresar')
            .setDepth(3)
            .setInteractive({ useHandCursor: true })
            .setScale(0.9); 

        // Pestañas / Iconos de selección
        this.iconoPersona = this.add.image(1270, 315, 'iconoPersona')
            .setDepth(3)
            .setInteractive({ useHandCursor: true })
            .setScale(1.7); 
            
        this.iconoGato = this.add.image(1270, 585, 'iconoGato')
            .setDepth(3)
            .setInteractive({ useHandCursor: true })
            .setScale(1.7); 

        // ==============================================================
        // 3. EVENTOS DE INTERFAZ
        // ==============================================================
        this.botonRegresar.on('pointerdown', () => this.scene.start('EscenaInicio'));

        this.iconoPersona.on('pointerdown', () => {
            this.mostrandoHumanos = true;
            this.renderPersonajes();
        });

        this.iconoGato.on('pointerdown', () => {
            this.mostrandoHumanos = false;
            this.renderPersonajes();
        });

        // 4. RENDERIZADO INICIAL DE LA CUADRÍCULA
        this.renderPersonajes();
    }

    renderPersonajes() {
        // Limpiamos los iconos anteriores antes de dibujar la nueva pestaña
        if (this.iconosPersonajes.length > 0) {
            this.iconosPersonajes.forEach(icono => icono.destroy());
        }
        this.iconosPersonajes = [];

        // Definimos la lista a renderizar con COORDENADAS FIJAS (Pixeles reales)
        const lista = this.mostrandoHumanos ? [
            { key: 'personaje1', x: 331, y: 324 },
            { key: 'personaje2', x: 709, y: 324 },
            { key: 'personaje3', x: 331, y: 666 },
            { key: 'personaje4', x: 709, y: 666 }
        ] : [
            { key: 'gato1', x: 331, y: 324 },
            { key: 'gato2', x: 709, y: 324 },
            { key: 'gato3', x: 331, y: 666 },
            { key: 'gato4', x: 709, y: 666 }
        ];

        lista.forEach(item => {
            this.iconosPersonajes.push(this.crearIconoPersonaje(item, this.mostrandoHumanos));
        });
    }

    crearIconoPersonaje(item, esHumano) {
        // Creamos el icono directamente en su posición de cuadrícula
        const icono = this.add.image(item.x, item.y, item.key)
            .setInteractive({ useHandCursor: true })
            .setDepth(4)
            .setScale(1.4); 

        // Evento de selección
        icono.on('pointerdown', () => {
            if (esHumano) {
                // Guarda el humano en global y deja el gato intacto
                setPersonajesEnUso(item.key, null); 
            } else {
                // Guarda el gato en global y deja el humano intacto
                setPersonajesEnUso(null, item.key); 
            }
            this.renderPersonajes(); // Re-renderizamos para aplicar el tinte
        });

        // Tinte de selección visual (Morado claro)
        const seleccionado = esHumano
            ? getState().personajeHumanoEnUso === item.key
            : getState().personajeGatoEnUso === item.key;

        if (seleccionado) {
            icono.setTint(0xc6b7ff); 
        } else {
            icono.clearTint();
        }

        return icono;
    }
}