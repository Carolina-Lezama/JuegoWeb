-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-08-2025 a las 20:25:47
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `videojuego`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `configuracion_jugador`
--

CREATE TABLE `configuracion_jugador` (
  `id` int(11) NOT NULL,
  `id_jugador` int(11) NOT NULL,
  `id_idioma` int(11) NOT NULL,
  `volumen_musica` tinyint(1) NOT NULL,
  `volumen_efectos` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dialogos`
--

CREATE TABLE `dialogos` (
  `id` int(11) NOT NULL,
  `introduccion_uno` varchar(160) DEFAULT NULL,
  `introduccion_dos` varchar(160) DEFAULT NULL,
  `introduccion_tres` varchar(160) DEFAULT NULL,
  `id_usuarios` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `dialogos`
--

INSERT INTO `dialogos` (`id`, `introduccion_uno`, `introduccion_dos`, `introduccion_tres`, `id_usuarios`) VALUES
(1, 'y despue s el tu j qwon fqn ca o qe jcd wej', 'wdqcewww     wwwwwwwwwwwwwwww', 'swqq            1111111111', 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `escenarios`
--

CREATE TABLE `escenarios` (
  `id` int(11) NOT NULL,
  `e_inicio` varchar(255) DEFAULT NULL,
  `e_juego` varchar(255) DEFAULT NULL,
  `e_puntuacion` varchar(255) DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `escenarios`
--

INSERT INTO `escenarios` (`id`, `e_inicio`, `e_juego`, `e_puntuacion`, `usuario_id`) VALUES
(1, 'inicio_4.png', 'juego_4.png', 'puntuacion_4.png', 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `idiomas`
--

CREATE TABLE `idiomas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `idiomas`
--

INSERT INTO `idiomas` (`id`, `nombre`) VALUES
(5, 'alemán'),
(2, 'español'),
(3, 'francés'),
(1, 'inglés'),
(4, 'italiano'),
(6, 'ruso');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jugadores`
--

CREATE TABLE `jugadores` (
  `id` int(11) NOT NULL,
  `nombre_jugador` varchar(50) NOT NULL,
  `email` varchar(110) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_nacimiento` date NOT NULL,
  `genero` enum('hombre','mujer','no binario','otro') DEFAULT NULL,
  `nivel` int(11) DEFAULT 1,
  `puntos` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `jugadores`
--

INSERT INTO `jugadores` (`id`, `nombre_jugador`, `email`, `contrasena`, `fecha_registro`, `fecha_nacimiento`, `genero`, `nivel`, `puntos`) VALUES
(1, 'pepito', 'guadalupecarrera8987@gmail.com', 'hola', '2025-06-18 18:04:24', '2005-12-06', 'mujer', 1, 0),
(2, 'caro', 'gesenigan@gmail.com', '$2y$10$g7X/gGjXlS1XF5mU1zWhe.jBLbRPJ83.spjtakvj0DVTn7qY7D132', '2025-07-08 16:38:35', '0000-00-00', NULL, 1, 0),
(4, 'carodw', 'gesenigawqdn@gmail.com', '$2y$10$rUUNnTLc.EfSBf4cHxl0I.OVSvoS22GH3YnwSM0fFen1U.5LPzbC2', '2025-07-08 16:52:42', '0000-00-00', NULL, 1, 0),
(5, 'fwe', 'wqd@gmail.com', '$2y$10$plAFRm4jZOTOuxXxfxlRDuWoLd4Key7WYT4AQ/oN1Y0zSHeHhPM6O', '2025-07-08 16:57:20', '0000-00-00', NULL, 1, 35),
(10, 'luisito1', 'wq22d@gmail.com', '$2y$10$9E2VBiihnhmFkEoDI/bMWuu3bbcVRHbWagWNH/DflvjXNgEtBLKXi', '2025-08-10 16:47:57', '0000-00-00', NULL, 1, 0),
(11, 'lui3sito1', 'wqd22d@gmail.com', '$2y$10$oH.ari8.cKD/lALgPL.X6.MVlarok/SR/zZFMuDtXA8svHnVE1LJm', '2025-08-10 16:49:16', '0000-00-00', NULL, 1, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `logros`
--

CREATE TABLE `logros` (
  `id` int(11) NOT NULL,
  `nombre` varchar(70) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `imagen` varchar(150) DEFAULT NULL,
  `tipo` enum('novato','avanzado','maestro') NOT NULL DEFAULT 'novato',
  `puntos` int(255) DEFAULT 0,
  `usuarios_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `logros`
--

INSERT INTO `logros` (`id`, `nombre`, `descripcion`, `imagen`, `tipo`, `puntos`, `usuarios_id`) VALUES
(1, 'El comienzo de un gran explorador.', 'Da una vuelta a los alrededores por primera vez.', 'L1', 'novato', 30, 4),
(7, 'Vínculo Inesperado', 'Formaste una alianza con un personaje que parecía irrelevante al inicio.', 'L2', 'avanzado', 50, 4),
(8, 'Eco de los Olvidados', 'Descubriste una carta escondida que revela el destino de un personaje perdido.', 'L3', 'maestro', 80, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `logros_jugador`
--

CREATE TABLE `logros_jugador` (
  `id` int(11) NOT NULL,
  `id_jugador` int(11) NOT NULL,
  `id_logro` int(11) NOT NULL,
  `fecha_obtenido` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `niveles`
--

CREATE TABLE `niveles` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `nivel_dificultad` enum('facil','medio','dificil') NOT NULL DEFAULT 'medio'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `objetos`
--

CREATE TABLE `objetos` (
  `id` int(11) NOT NULL,
  `nombre_objeto` varchar(150) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `cantidad_max_uso` int(11) DEFAULT NULL,
  `rareza` enum('comun','raro','especial','legendario','mitico') NOT NULL,
  `users_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `objetos`
--

INSERT INTO `objetos` (`id`, `nombre_objeto`, `descripcion`, `cantidad_max_uso`, `rareza`, `users_id`) VALUES
(1, 'Espejo transformante', 'Un espejo capaz de cambiarte de forma, el mago decidio que esta sea un gato.', NULL, 'especial', 4),
(2, 'Espada del héroe', 'Capaz de cortar todo con un poco de fe.', NULL, 'especial', 5),
(3, 'Mapa del reino', 'Por si te sientes perdido, quiza te ayude a saber donde ir ahora.', NULL, 'comun', 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `objetos_jugador`
--

CREATE TABLE `objetos_jugador` (
  `id` int(11) NOT NULL,
  `usos` int(11) DEFAULT NULL,
  `jugadores_id` int(11) DEFAULT NULL,
  `objetos_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `objetos_jugador`
--

INSERT INTO `objetos_jugador` (`id`, `usos`, `jugadores_id`, `objetos_id`) VALUES
(2, 0, 5, 1),
(4, 0, 5, 2),
(5, NULL, 5, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `progreso`
--

CREATE TABLE `progreso` (
  `id` int(11) NOT NULL,
  `id_jugador` int(11) NOT NULL,
  `id_nivel` int(11) NOT NULL,
  `completado` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_ultima_jugada` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `puntuacion`
--

CREATE TABLE `puntuacion` (
  `id` int(11) NOT NULL,
  `id_jugador` int(11) NOT NULL,
  `puntos` int(11) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `usuario` varchar(30) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `correo` varchar(50) NOT NULL,
  `nombres` varchar(50) DEFAULT NULL,
  `apellido_paterno` varchar(30) DEFAULT NULL,
  `apellido_materno` varchar(30) DEFAULT NULL,
  `telefono` varchar(10) DEFAULT NULL,
  `rol` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `usuario`, `contrasena`, `correo`, `nombres`, `apellido_paterno`, `apellido_materno`, `telefono`, `rol`) VALUES
(4, 'caro', '$2y$10$exx2K.y3AYzzWFGUwlqyb.33fL7/4r9AphitJ0W63MS/x4mxCDff6', 'gesenigan@gmail.com', 'GUADALUPE CAROLINA', 'CARRERA', 'LEZAMA', '2241084873', 'Admin'),
(5, 'carlos', 'freya', 'carlos@gmail.com', NULL, NULL, NULL, NULL, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `configuracion_jugador`
--
ALTER TABLE `configuracion_jugador`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_jugador` (`id_jugador`),
  ADD KEY `id_idioma` (`id_idioma`);

--
-- Indices de la tabla `dialogos`
--
ALTER TABLE `dialogos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_id_usuarios` (`id_usuarios`);

--
-- Indices de la tabla `escenarios`
--
ALTER TABLE `escenarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_usuario` (`usuario_id`);

--
-- Indices de la tabla `idiomas`
--
ALTER TABLE `idiomas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `jugadores`
--
ALTER TABLE `jugadores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre_usuario` (`nombre_jugador`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `logros`
--
ALTER TABLE `logros`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD KEY `fk_logros_usuarios` (`usuarios_id`);

--
-- Indices de la tabla `logros_jugador`
--
ALTER TABLE `logros_jugador`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_jugador` (`id_jugador`),
  ADD KEY `id_logro` (`id_logro`);

--
-- Indices de la tabla `niveles`
--
ALTER TABLE `niveles`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `objetos`
--
ALTER TABLE `objetos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `users_id` (`users_id`);

--
-- Indices de la tabla `objetos_jugador`
--
ALTER TABLE `objetos_jugador`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jugadores_id` (`jugadores_id`),
  ADD KEY `objetos_id` (`objetos_id`);

--
-- Indices de la tabla `progreso`
--
ALTER TABLE `progreso`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_jugador` (`id_jugador`,`id_nivel`),
  ADD KEY `id_nivel` (`id_nivel`);

--
-- Indices de la tabla `puntuacion`
--
ALTER TABLE `puntuacion`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_jugador` (`id_jugador`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario` (`usuario`),
  ADD UNIQUE KEY `correo_electronico` (`correo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `configuracion_jugador`
--
ALTER TABLE `configuracion_jugador`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `dialogos`
--
ALTER TABLE `dialogos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `escenarios`
--
ALTER TABLE `escenarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `idiomas`
--
ALTER TABLE `idiomas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `jugadores`
--
ALTER TABLE `jugadores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `logros`
--
ALTER TABLE `logros`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `logros_jugador`
--
ALTER TABLE `logros_jugador`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `niveles`
--
ALTER TABLE `niveles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `objetos`
--
ALTER TABLE `objetos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `objetos_jugador`
--
ALTER TABLE `objetos_jugador`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `progreso`
--
ALTER TABLE `progreso`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `puntuacion`
--
ALTER TABLE `puntuacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `configuracion_jugador`
--
ALTER TABLE `configuracion_jugador`
  ADD CONSTRAINT `configuracion_jugador_ibfk_1` FOREIGN KEY (`id_jugador`) REFERENCES `jugadores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `configuracion_jugador_ibfk_2` FOREIGN KEY (`id_idioma`) REFERENCES `idiomas` (`id`);

--
-- Filtros para la tabla `dialogos`
--
ALTER TABLE `dialogos`
  ADD CONSTRAINT `fk_id_usuarios` FOREIGN KEY (`id_usuarios`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `escenarios`
--
ALTER TABLE `escenarios`
  ADD CONSTRAINT `fk_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `logros`
--
ALTER TABLE `logros`
  ADD CONSTRAINT `fk_logros_usuarios` FOREIGN KEY (`usuarios_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `logros_jugador`
--
ALTER TABLE `logros_jugador`
  ADD CONSTRAINT `logros_jugador_ibfk_1` FOREIGN KEY (`id_jugador`) REFERENCES `jugadores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `logros_jugador_ibfk_2` FOREIGN KEY (`id_logro`) REFERENCES `logros` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `objetos`
--
ALTER TABLE `objetos`
  ADD CONSTRAINT `objetos_ibfk_1` FOREIGN KEY (`users_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `objetos_jugador`
--
ALTER TABLE `objetos_jugador`
  ADD CONSTRAINT `objetos_jugador_ibfk_1` FOREIGN KEY (`jugadores_id`) REFERENCES `jugadores` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `objetos_jugador_ibfk_2` FOREIGN KEY (`objetos_id`) REFERENCES `objetos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `progreso`
--
ALTER TABLE `progreso`
  ADD CONSTRAINT `progreso_ibfk_1` FOREIGN KEY (`id_jugador`) REFERENCES `jugadores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `progreso_ibfk_2` FOREIGN KEY (`id_nivel`) REFERENCES `niveles` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `puntuacion`
--
ALTER TABLE `puntuacion`
  ADD CONSTRAINT `puntuacion_ibfk_1` FOREIGN KEY (`id_jugador`) REFERENCES `jugadores` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
