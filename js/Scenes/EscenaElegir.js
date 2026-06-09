import { getState, setPersonajesEnUso } from '../globals.js';
import { reescalarGlobalFlexible } from '../uiHelpers.js';

export class EscenaElegir extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaElegir' });
        this.iconosPersonajes = [];
        // Estado LOCAL de la interfaz: True = Humanos, False = Gatos
        this.mostrandoHumanos = true; 
    }

    create() {
        // 1. CREACIÓN DE FONDOS Y ELEMENTOS ESTÁTICOS
        this.fondo = this.add.image(0, 0, 'fondoVestuario').setDepth(1);
        this.fondoPersonajes = this.add.image(0, 0, 'fondoPersonajes').setDepth(2);
        
        // Título estilizado
        this.tituloElegir = this.add.text(0, 0, 'Elige tu personaje', {
            fontFamily: 'Silkscreen',
            fontSize: '40px',
            color: '#000000',
            backgroundColor: '#f5f0dc',
            padding: { left: 22, right: 30, top: 5, bottom: 10 },
            align: 'center',
            fixedWidth: 600
        }).setDepth(3);

        // 2. BOTONES DE INTERFAZ
        this.botonRegresar = this.add.image(0, 0, 'botonRegresar').setDepth(3).setInteractive({ useHandCursor: true });
        this.iconoPersona = this.add.image(0, 0, 'iconoPersona').setDepth(3).setInteractive({ useHandCursor: true });
        this.iconoGato = this.add.image(0, 0, 'iconoGato').setDepth(3).setInteractive({ useHandCursor: true });

        // 3. EVENTOS DE INTERFAZ
        this.botonRegresar.on('pointerdown', () => this.scene.start('EscenaInicio'));

        this.iconoPersona.on('pointerdown', () => {
            this.mostrandoHumanos = true;
            this.renderPersonajes();
        });

        this.iconoGato.on('pointerdown', () => {
            this.mostrandoHumanos = false;
            this.renderPersonajes();
        });

        // 4. RESPONSIVIDAD Y RENDERIZADO INICIAL
        this.aplicarReescalado();
        this.scale.on('resize', () => this.aplicarReescalado());
        
        this.renderPersonajes();
    }

    aplicarReescalado() {
        // Modo FIT: Posicionamiento limpio y directo
        reescalarGlobalFlexible(this, [
            { obj: this.fondo, posX: 0.5, posY: 0.5, escalaRelativa: 1, autoFill: true },
            { obj: this.fondoPersonajes, posX: 0.32, posY: 0.73, escalaRelativa: 1.15 },
            { obj: this.tituloElegir, posX: 0.32, posY: 0.06, escalaRelativa: 0.8 },
            { obj: this.botonRegresar, posX: 0.77, posY: 0.1, escalaRelativa: 0.57 },
            { obj: this.iconoPersona, posX: 0.77, posY: 0.35, escalaRelativa: 0.27 },
            { obj: this.iconoGato, posX: 0.77, posY: 0.65, escalaRelativa: 0.27 }
        ]);
    }

    renderPersonajes() {
        // Limpiamos los iconos anteriores antes de dibujar la nueva pestaña
        if (this.iconosPersonajes.length > 0) {
            this.iconosPersonajes.forEach(icono => icono.destroy());
        }
        this.iconosPersonajes = [];

        // Definimos la lista a renderizar (Humanos o Gatos)
        // Ya no verificamos isMobile() para forzar (0,0), el FIT resuelve la posición automáticamente.
        const lista = this.mostrandoHumanos ? [
            { key: 'personaje1', x: 0.201, y: 0.36 },
            { key: 'personaje2', x: 0.43, y: 0.36 },
            { key: 'personaje3', x: 0.201, y: 0.74 },
            { key: 'personaje4', x: 0.43, y: 0.74 }
        ] : [
            { key: 'gato1', x: 0.201, y: 0.36 },
            { key: 'gato2', x: 0.43, y: 0.36 },
            { key: 'gato3', x: 0.201, y: 0.74 },
            { key: 'gato4', x: 0.43, y: 0.74 }
        ];

        lista.forEach(item => {
            this.iconosPersonajes.push(this.crearIconoPersonaje(item, this.mostrandoHumanos));
        });
    }

    crearIconoPersonaje(item, esHumano) {
        const icono = this.add.image(0, 0, item.key)
            .setInteractive({ useHandCursor: true })
            .setDepth(4);

        icono.on('pointerdown', () => {
            // Guardamos la selección en el estado global unificado
            if (esHumano) {
                setPersonajesEnUso(item.key, null); 
            } else {
                setPersonajesEnUso(null, item.key); 
            }
            
            // Re-renderizamos para que se aplique el "Tinte" visual al seleccionado
            this.renderPersonajes();
        });

        // Escala y posicionamiento para los iconos generados dinámicamente
        reescalarGlobalFlexible(this, [
            { obj: icono, posX: item.x, posY: item.y, escalaRelativa: 0.37 }
        ]);

        // Leemos el estado global actual para saber si este ícono debe brillar/estar seleccionado
        const seleccionado = esHumano
            ? getState().personajeHumanoEnUso === item.key
            : getState().personajeGatoEnUso === item.key;

        if (seleccionado) {
            icono.setTint(0xc6b7ff); // Color morado claro
        } else {
            icono.clearTint();
        }

        return icono;
    }
}