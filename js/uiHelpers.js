/**
 * Utilidades de Interfaz de Usuario y Responsividad
 */

export function isMobile(scene) {
    // Uso nativo de Phaser: Más rápido y seguro que Regex en el UserAgent
    if (scene && scene.sys) {
        const device = scene.sys.game.device;
        return device.os.android || device.os.iOS || device.os.windowsPhone;
    }
    // Fallback por si se llama fuera de una escena
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

export function getPosEscala(pc, movil, scene) {
    return isMobile(scene) ? movil : pc;
}

/**
 * Posiciona y escala elementos.
 * NOTA DE ARQUITECTURA: Dado que usas Phaser.Scale.FIT, el canvas interno
 * siempre es 1650x900. Esta función se simplificó para evitar cálculos innecesarios.
 */
export function reescalarGlobalFlexible(scene, elementos = []) {
    const isMovil = isMobile(scene);
    // Usamos las dimensiones base reales, no las escaladas por el navegador
    const width = scene.scale.gameSize.width; 
    const height = scene.scale.gameSize.height;

    elementos.forEach(({
        obj,
        posX = 0.5, posY = 0.5,
        posXMovil = null, posYMovil = null,
        escalaRelativa = 1, escalaRelativaMovil = null,
        originX = 0.5, originY = 0.5
    }) => {
        if (!obj) return;

        const finalPosX = (isMovil && posXMovil !== null) ? posXMovil : posX;
        const finalPosY = (isMovil && posYMovil !== null) ? posYMovil : posY;
        const finalEscala = (isMovil && escalaRelativaMovil !== null) ? escalaRelativaMovil : escalaRelativa;

        if (typeof obj.setOrigin === 'function') {
            obj.setOrigin(originX, originY);
        }

        // Posicionamiento absoluto basado en la resolución base (1650x900)
        obj.setPosition(width * finalPosX, height * finalPosY);

        if (obj.setScale) {
            obj.setScale(finalEscala);
        }
    });
}

/**
 * Crea texto con ajuste automático optimizado.
 */
export function createAndAdaptTextFlexible(scene, {
    text,
    posX = 0.5, posY = 0.5,
    maxWidth,
    fontSizeInicial = 40,
    color = '#000000',
    originX = 0.5, originY = 0.5
}) {
    const width = scene.scale.gameSize.width;
    const height = scene.scale.gameSize.height;

    // Aprovechamos el wordWrap nativo de Phaser en lugar de un costoso bucle while
    const textObj = scene.add.text(width * posX, height * posY, text, {
        fontFamily: 'Silkscreen',
        color: color,
        fontSize: `${fontSizeInicial}px`,
        align: 'center',
        wordWrap: { width: maxWidth, useAdvancedWrap: true }
    });

    textObj.setOrigin(originX, originY);

    return textObj;
}