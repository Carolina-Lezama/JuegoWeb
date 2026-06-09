import { getState } from '../globals.js';
import { reescalarGlobalFlexible, createAndAdaptTextFlexible } from '../uiHelpers.js';

export class EscenaLogros extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaLogros' });
        // Arreglos para filtrar rápidamente sin volver a consultar el State
        this.logrosNovato = [];
        this.logrosAvanzado = [];
        this.logrosMaestro = [];
        
        this.elementosLogros = []; // Guarda las referencias visuales para destruirlas al filtrar
        this.filtroActivo = 'todos'; 
    }

    create() {
        // 1. UI ESTÁTICA
        this.fondo = this.add.image(0, 0, 'fondoLogros').setDepth(1);
        this.tituloLogros = this.add.image(0, 0, 'tituloLogros').setDepth(1);
        
        this.regreso = this.add.image(0, 0, 'regreso').setDepth(100).setInteractive({ useHandCursor: true });
        this.regreso.on('pointerdown', () => this.cerrarLogrosPorPausa());

        // 2. BOTONES DE FILTRO
        this.crearBotonesFiltro();

        // 3. PROCESAMIENTO DE DATOS
        this.clasificarLogros();

        // 4. SISTEMA DE SCROLL (Contenedor y Máscara)
        // Creamos un contenedor global para los logros. Todo lo que metamos aquí se moverá junto.
        this.scrollContainer = this.add.container(0, 0).setDepth(20);
        
        // Máscara: Solo se verá lo que esté dentro de este rectángulo (Corte superior e inferior)
        // Medidas fijas basadas en el FIT (1650x900)
        const maskShape = this.add.graphics().fillRect(0, 300, 1650, 550);
        const mask = maskShape.createGeometryMask();
        this.scrollContainer.setMask(mask);
        maskShape.setVisible(false); // Ocultamos el gráfico, solo necesitamos su propiedad de máscara

        // 5. EVENTOS DE SCROLL (Rueda del ratón y arrastre táctil)
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            this.scrollContainer.y -= deltaY * 0.5; // Ajusta la velocidad de scroll
            this.limitarScroll();
        });

        this.input.on('pointermove', (pointer) => {
            if (pointer.isDown) {
                const delta = pointer.position.y - pointer.prevPosition.y;
                this.scrollContainer.y += delta;
                this.limitarScroll();
            }
        });

        // 6. RENDERIZADO INICIAL Y RESPONSIVIDAD
        this.renderizarLogros('todos');
        this.aplicarReescaladoInicial();
        
        this.scale.on('resize', () => this.aplicarReescaladoInicial());
    }

    cerrarLogrosPorPausa() {
        if (window.ultimaEscenaActiva) {
            this.scene.stop();
            this.scene.resume(window.ultimaEscenaActiva);
        }
    }

    clasificarLogros() {
        const logrosData = getState().logrosGlobales; // Usamos nuestro nuevo Gestor de Estado
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
        this.botonTodos = this.add.image(0, 0, 'todosLogros').setDepth(3).setInteractive({ useHandCursor: true });
        this.botonNovato = this.add.image(0, 0, 'novatoLogros').setDepth(3).setInteractive({ useHandCursor: true });
        this.botonAvanzado = this.add.image(0, 0, 'avanzadoLogros').setDepth(3).setInteractive({ useHandCursor: true });
        this.botonMaestro = this.add.image(0, 0, 'maestroLogros').setDepth(3).setInteractive({ useHandCursor: true });

        // Eventos de filtrado
        this.botonTodos.on('pointerdown', () => this.renderizarLogros('todos'));
        this.botonNovato.on('pointerdown', () => this.renderizarLogros('novato'));
        this.botonAvanzado.on('pointerdown', () => this.renderizarLogros('avanzado'));
        this.botonMaestro.on('pointerdown', () => this.renderizarLogros('maestro'));
    }

    limpiarLogros() {
        // Destruye físicamente las imágenes y textos del DOM/Canvas
        if (this.elementosLogros) {
            this.elementosLogros.forEach(el => el.destroy());
        }
        this.elementosLogros = [];
        
        // Resetea la posición del scroll al inicio cuando cambias de filtro
        if (this.scrollContainer) {
            this.scrollContainer.y = 0;
            this.scrollContainer.removeAll(); // Limpia el contenedor lógicamente
        }
    }

    renderizarLogros(filtro = 'todos') {
        this.filtroActivo = filtro;
        this.limpiarLogros(); // Borramos lo visual antes de dibujar lo nuevo

        let logrosAMostrar = [];
        if (filtro === 'novato') logrosAMostrar = this.logrosNovato;
        else if (filtro === 'avanzado') logrosAMostrar = this.logrosAvanzado;
        else if (filtro === 'maestro') logrosAMostrar = this.logrosMaestro;
        else logrosAMostrar = getState().logrosGlobales || [];

        // Geometría del renderizado
        const startY = 430; // Posición Y inicial del primer logro
        const espacioY = 310; // Separación vertical entre logros

        logrosAMostrar.forEach((logro, i) => {
            const y = startY + (i * espacioY);
            
            // 1. Imagen de Fondo (Recuadro)
            let recuadroKey = 'recuadroLogroNovato'; // Fallback por defecto
            if (logro.tipo === 'avanzado') recuadroKey = 'recuadroLogroMaestro';
            else if (logro.tipo === 'maestro' || logro.tipo === 'mitico') recuadroKey = 'recuadroLogroMitico';
            
            const recuadro = this.add.image(825, y, recuadroKey).setDisplaySize(650, 280).setDepth(2);

            // 2. Imagen del Logro
            let img = null;
            if (logro.imagen) {
                // Removemos extensión .png por si la trae la BD, igual que en el preload
                const imgClean = logro.imagen.replace(/\.png$/i, '');
                img = this.add.image(590, y, imgClean).setDisplaySize(140, 140).setDepth(3);
            }

            // 3. Textos (Usando medidas absolutas basadas en 1650x900)
            const nombre = createAndAdaptTextFlexible(this, {
                text: logro.nombre,
                posX: 0.43, // X = 709px aprox
                posY: (y - 45) / 900, // Calculamos el % en base al height (900)
                maxWidth: 330,
                fontSizeInicial: 24,
                originX: 0, originY: 0.5,
                color: '#000000'
            }).setDepth(4);

            const desc = createAndAdaptTextFlexible(this, {
                text: logro.descripcion,
                posX: 0.43,
                posY: (y + 19) / 900,
                maxWidth: 320,
                fontSizeInicial: 15,
                originX: 0, originY: 0.5,
                color: '#000000'
            }).setDepth(4);

            // Guardamos referencias
            this.scrollContainer.add([recuadro, nombre, desc]);
            this.elementosLogros.push(recuadro, nombre, desc);
            if (img) {
                this.scrollContainer.add(img);
                this.elementosLogros.push(img);
            }
        });

        // Actualizamos el tamaño interno del contenedor para que la función limitarScroll sepa el límite
        const totalAltura = logrosAMostrar.length * espacioY;
        this.scrollContainer.setSize(1650, totalAltura);
    }

    limitarScroll() {
        // La altura del contenedor dinámico menos la altura visible permitida
        const alturaVisible = 550; // El tamaño de nuestra máscara
        const contenidoExtra = this.scrollContainer.height - alturaVisible;

        // Si hay muy pocos logros, no permitimos scroll
        if (contenidoExtra <= 0) {
            this.scrollContainer.y = 0;
            return;
        }

        // Límites: el scroll 'maxY' es 0 (hasta arriba). El 'minY' es el final de la lista hacia abajo (negativo)
        const maxY = 0;
        const minY = -contenidoExtra;

        if (this.scrollContainer.y > maxY) this.scrollContainer.y = maxY;
        if (this.scrollContainer.y < minY) this.scrollContainer.y = minY;
    }

    aplicarReescaladoInicial() {
        reescalarGlobalFlexible(this, [
            { obj: this.fondo, posX: 0.5, posY: 0.5, escalaRelativa: 1, autoFill: true },
            { obj: this.tituloLogros, posX: 0.5, posY: 0.1, escalaRelativa: 0.8 },
            { obj: this.regreso, posX: 0.05, posY: 0.1, escalaRelativa: 0.16 },
            { obj: this.botonTodos, posX: 0.2, posY: 0.26, escalaRelativa: 0.13 },
            { obj: this.botonNovato, posX: 0.4, posY: 0.26, escalaRelativa: 0.13 },
            { obj: this.botonAvanzado, posX: 0.6, posY: 0.26, escalaRelativa: 0.13 },
            { obj: this.botonMaestro, posX: 0.8, posY: 0.26, escalaRelativa: 0.13 }
        ]);
        
        // Nota: Los elementos dentro de this.scrollContainer no se envían al reescalador global,
        // ya que sus posiciones fueron calculadas manualmente de forma relativa dentro de renderizarLogros().
    }
}