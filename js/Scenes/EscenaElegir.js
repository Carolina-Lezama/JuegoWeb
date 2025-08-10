import { personajeHumanoEnUso, personajeGatoEnUso, ApartadoMenu, setPersonajeHumanoEnUso, setPersonajeGatoEnUso, setApartadoMenu } from '../globals.js';
import { isMobile, getPosEscala, reescalarGlobalFlexible,cargarPersonajeActual, cargarGatoActual, createAndAdaptTextFlexible } from '../responsive.js';
//---MENU USUARIO
export class EscenaElegir extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaElegir' });
        this.iconosPersonajes = [];
    }
    preload() {
    }
    create() {
        this.fondo = this.add.image(0, 0, 'fondoVestuario');
        this.botonRegresar = this.add.image(0, 0, 'botonRegresar').setInteractive();
        this.iconoPersona = this.add.image(0, 0, 'iconoPersona').setInteractive();
        this.iconoGato = this.add.image(0, 0, 'iconoGato').setInteractive();
        this.fondoPersonajes = this.add.image(0, 0, 'fondoPersonajes').setInteractive();
        this.tituloElegir = this.add.text(0, 0, 'Elige tu personaje', {
            fontFamily: 'Silkscreen',
            fontSize: '40px',
            color: '#000000',
            backgroundColor: '#f5f0dc',
            padding: { left: 22, right: 30, top: 5, bottom: 10 },
            align: 'center',
            fixedWidth: 600
        });
        this.botonRegresar.on('pointerdown', () => this.scene.start('EscenaInicio'));
        this.iconoPersona.on('pointerdown', () => {
            setApartadoMenu(true);
            this.renderPersonajes();//actualizar lista de personajes
        });
        this.iconoGato.on('pointerdown', () => {
            setApartadoMenu(false);
            this.renderPersonajes();
        });
        this.aplicarReescalado();
        this.scale.on('resize', () => this.aplicarReescalado());
        this.renderPersonajes();
    }
    aplicarReescalado() {
        reescalarGlobalFlexible(this.scale, [
            {
                obj: this.fondo,
                posX: 0.5,
                posY: 0.5,
                autoFill: true,
                originX: 0.5,
                originY: 0.5
            },
            {
                obj: this.fondoPersonajes,
                posX: getPosEscala(0.32, 0),
                posY: getPosEscala(0.73, 0),
                escalaRelativa: getPosEscala(1.15, 0),
                originX: 0.5,
                originY: 0.5
            },
            {
                obj: this.tituloElegir,
                posX: getPosEscala(0.32, 0),
                posY: getPosEscala(0.06, 0),
                escalaRelativa: getPosEscala(0.8, 0),
                originX: 0.5,
                originY: 0.5
            },
            {
                obj: this.botonRegresar,
                posX: getPosEscala(0.77, 0),
                posY: getPosEscala(0.1, 0),
                escalaRelativa: getPosEscala(0.57, 0),
                originX: 0.5,
                originY: 0.5
            },
            {
                obj: this.iconoPersona,
                posX: getPosEscala(0.77, 0),
                posY: getPosEscala(0.35, 0),
                escalaRelativa: getPosEscala(0.27, 0),
                originX: 0.5,
                originY: 0.5
            },
            {
                obj: this.iconoGato,
                posX: getPosEscala(0.77, 0),
                posY: getPosEscala(0.65, 0),
                escalaRelativa: getPosEscala(0.27, 0),
                originX: 0.5,
                originY: 0.5
            },
        ]);
    }
    renderPersonajes() {
        if (this.iconosPersonajes.length > 0) {
            this.iconosPersonajes.forEach(icono => icono.destroy());
        }
        this.iconosPersonajes = [];

        const lista = ApartadoMenu
            ? (isMobile() ? [
                { key: 'personaje1', x: 0, y: 0 },
                { key: 'personaje2', x: 0, y: 0 },
                { key: 'personaje3', x: 0, y: 0 },
                { key: 'personaje4', x: 0, y: 0 }
            ] : [
                { key: 'personaje1', x: 0.201, y: 0.36 },
                { key: 'personaje2', x: 0.43, y: 0.36 },
                { key: 'personaje3', x: 0.201, y: 0.74 },
                { key: 'personaje4', x: 0.43, y: 0.74 }
            ])
            : (isMobile() ? [
                { key: 'gato1', x: 0, y: 0 },
                { key: 'gato2', x: 0, y: 0 },
                { key: 'gato3', x: 0, y: 0 },
                { key: 'gato4', x: 0, y: 0 }
            ] : [
                { key: 'gato1', x: 0.201, y: 0.36 },
                { key: 'gato2', x: 0.43, y: 0.36 },
                { key: 'gato3', x: 0.201, y: 0.74 },
                { key: 'gato4', x: 0.43, y: 0.74 }
            ]);
        lista.forEach(item => {
            this.iconosPersonajes.push(this.crearIconoPersonaje(item, ApartadoMenu));
        });
    }
    crearIconoPersonaje(item, esHumano) {
        const icono = this.add.image(0, 0, item.key)
            .setInteractive()
            .setOrigin(0.5)
            .on('pointerdown', () => {
                if (esHumano) {
                    setPersonajeHumanoEnUso(item.key); // Usar setter
                } else {
                    setPersonajeGatoEnUso(item.key); // Usar setter
                }
                this.renderPersonajes();
            });
        reescalarGlobalFlexible(this.scale, [
            {
                obj: icono,
                posX: item.x,
                posY: item.y,
                escalaRelativa: isMobile() ? 0 : 0.37,
                originX: 0.5,
                originY: 0.5
            }
        ]);
        icono.setDepth(3);
        const seleccionado = esHumano
            ? personajeHumanoEnUso === item.key
            : personajeGatoEnUso === item.key;
        if (seleccionado) {
            icono.setTint(0xc6b7ff);
        } else {
            icono.clearTint();
        }
        return icono;
    }
    update() {}
}