import { getState } from '../globals.js';
// Se eliminaron las importaciones de uiHelpers.js porque Phaser.Scale.FIT hará el trabajo

export class EscenaLogros extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaLogros' });
        this.logrosNovato = [];
        this.logrosAvanzado = [];
        this.logrosMaestro = [];
        
        this.elementosLogros = []; 
        this.filtroActivo = 'todos'; 
    }

    create() {
        // ==============================================================
        // 1. UI ESTÁTICA (Posicionamiento basado en 1650x900)
        // ==============================================================
        
        // Centro exacto
        this.fondo = this.add.image(825, 450, 'fondoLogros').setDepth(1).setScale(1); // <-- Modifica la escala aquí
        
        // Título arriba al centro
        this.tituloLogros = this.add.image(825, 90, 'tituloLogros').setDepth(1).setScale(1.6,1.1); // <-- Modifica la escala aquí
        
        // Botón de regreso (Esquina superior izquierda, misma medida sugerida antes)
        this.regreso = this.add.image(83, 90, 'regreso').setDepth(100).setInteractive({ useHandCursor: true }).setScale(1.2); // <-- Modifica la escala aquí
        this.regreso.on('pointerdown', () => this.cerrarLogrosPorPausa());

        // ==============================================================
        // 2. BOTONES DE FILTRO
        // ==============================================================
        this.crearBotonesFiltro();

        // ==============================================================
        // 3. PROCESAMIENTO DE DATOS
        // ==============================================================
        this.clasificarLogros();

        // ==============================================================
        // 4. SISTEMA DE SCROLL (Contenedor y Máscara)
        // ==============================================================
        this.scrollContainer = this.add.container(0, 0).setDepth(20);
        
        // Tu máscara ya usaba valores absolutos perfectos (0, 300, 1650, 550)
        const maskShape = this.add.graphics().fillRect(0, 300, 1650, 550);
        const mask = maskShape.createGeometryMask();
        this.scrollContainer.setMask(mask);
        maskShape.setVisible(false); 

        // ==============================================================
        // 5. EVENTOS DE SCROLL
        // ==============================================================
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            this.scrollContainer.y -= deltaY * 0.5; 
            this.limitarScroll();
        });

        this.input.on('pointermove', (pointer) => {
            if (pointer.isDown) {
                const delta = pointer.position.y - pointer.prevPosition.y;
                this.scrollContainer.y += delta;
                this.limitarScroll();
            }
        });

        // 6. RENDERIZADO INICIAL
        this.renderizarLogros('todos');
        
        // ¡Adiós eventos de 'resize' y 'aplicarReescalado'!
    }

    cerrarLogrosPorPausa() {
        if (window.ultimaEscenaActiva) {
            this.scene.stop();
            this.scene.resume(window.ultimaEscenaActiva);
        }
    }

    clasificarLogros() {
        const logrosData = getState().logrosGlobales; 
        if (!logrosData || !Array.isArray(logrosData)) return;

        this.logrosNovato = [];
        this.logrosAvanzado = [];
        this.logrosMaestro = [];

        logrosData.forEach(logro => {
            const tipo = logro.tipo ? logro.tipo.toLowerCase() : '';
            if (tipo === 'novato') this.logrosNovato.push(logro);
            else if (tipo === 'avanzado') this.logrosAvanzado.push(logro);
            else if (tipo === 'maestro' || tipo === 'mitico') this.logrosMaestro.push(logro);
        });
    }

    crearBotonesFiltro() {
        // Coordenadas fijas distribuidas equitativamente a lo largo del eje X (Y: 234)
        this.botonTodos = this.add.image(330, 234, 'todosLogros').setDepth(3).setInteractive({ useHandCursor: true }).setScale(1.2); // <-- Modifica la escala aquí
        this.botonNovato = this.add.image(660, 234, 'novatoLogros').setDepth(3).setInteractive({ useHandCursor: true }).setScale(1.2); // <-- Modifica la escala aquí
        this.botonAvanzado = this.add.image(990, 234, 'avanzadoLogros').setDepth(3).setInteractive({ useHandCursor: true }).setScale(1.2); // <-- Modifica la escala aquí
        this.botonMaestro = this.add.image(1320, 234, 'maestroLogros').setDepth(3).setInteractive({ useHandCursor: true }).setScale(1.2); // <-- Modifica la escala aquí

        this.botonTodos.on('pointerdown', () => this.renderizarLogros('todos'));
        this.botonNovato.on('pointerdown', () => this.renderizarLogros('novato'));
        this.botonAvanzado.on('pointerdown', () => this.renderizarLogros('avanzado'));
        this.botonMaestro.on('pointerdown', () => this.renderizarLogros('maestro'));
    }

    limpiarLogros() {
        if (this.elementosLogros) {
            this.elementosLogros.forEach(el => el.destroy());
        }
        this.elementosLogros = [];
        
        if (this.scrollContainer) {
            this.scrollContainer.y = 0;
            this.scrollContainer.removeAll(); 
        }
    }

    renderizarLogros(filtro = 'todos') {
        this.filtroActivo = filtro;
        this.limpiarLogros(); 

        let logrosAMostrar = [];
        if (filtro === 'novato') logrosAMostrar = this.logrosNovato;
        else if (filtro === 'avanzado') logrosAMostrar = this.logrosAvanzado;
        else if (filtro === 'maestro') logrosAMostrar = this.logrosMaestro;
        else logrosAMostrar = getState().logrosGlobales || [];

        const startY = 470; 
        const espacioY = 310; 

        logrosAMostrar.forEach((logro, i) => {
            const y = startY + (i * espacioY);
            
            // 1. Imagen de Fondo (Recuadro)
            let recuadroKey = 'recuadroLogroNovato'; 
            if (logro.tipo === 'avanzado') recuadroKey = 'recuadroLogroMaestro';
            else if (logro.tipo === 'maestro' || logro.tipo === 'mitico') recuadroKey = 'recuadroLogroMitico';
            
            // Reemplacé .setDisplaySize() por .setScale() para seguir el estándar. 
            // Te sugiero exportar las cajas a su tamaño ideal de 650x280 px.
            const recuadro = this.add.image(625, y, recuadroKey).setDepth(2).setScale(1.4, 1.25); // <-- Modifica la escala aquí

            // 2. Imagen del Logro
            let img = null;
            if (logro.imagen) {
                const imgClean = logro.imagen.replace(/\.png$/i, '');
                // De igual forma, asume escala 1. Ideal exportar los iconos a 140x140 px.
                img = this.add.image(800, y, imgClean).setDepth(3).setScale(1.3); // <-- Modifica la escala aquí
            }

            // 3. Textos Nativos (Coordenadas calculadas y fijas)
            const nombre = this.add.text(335, y - 35, logro.nombre, {
                fontSize: '30px',
                color: '#000000',
                wordWrap: { width: 330 }
            }).setOrigin(0, 0.5).setDepth(4).setScale(1); // <-- Modifica la escala aquí

            const desc = this.add.text(335, y + 29, logro.descripcion, {
                fontSize: '21px',
                color: '#000000',
                wordWrap: { width: 320 }
            }).setOrigin(0, 0.5).setDepth(4).setScale(1); // <-- Modifica la escala aquí

            // Guardamos referencias
            this.scrollContainer.add([recuadro, nombre, desc]);
            this.elementosLogros.push(recuadro, nombre, desc);
            if (img) {
                this.scrollContainer.add(img);
                this.elementosLogros.push(img);
            }
        });

        const totalAltura = logrosAMostrar.length * espacioY;
        this.scrollContainer.setSize(1650, totalAltura);
    }

    limitarScroll() {
        const alturaVisible = 550; 
        const contenidoExtra = this.scrollContainer.height - alturaVisible;

        if (contenidoExtra <= 0) {
            this.scrollContainer.y = 0;
            return;
        }

        const maxY = 0;
        const minY = -contenidoExtra;

        if (this.scrollContainer.y > maxY) this.scrollContainer.y = maxY;
        if (this.scrollContainer.y < minY) this.scrollContainer.y = minY;
    }
}