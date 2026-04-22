-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 22 avr. 2026 à 04:06
-- Version du serveur : 10.4.32-MariaDB-log
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `videojuego`
--

-- --------------------------------------------------------

--
-- Structure de la table `configuracion_jugador`
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
-- Structure de la table `dialogos`
--

CREATE TABLE `dialogos` (
  `id` int(11) NOT NULL,
  `introduccion_uno` varchar(160) DEFAULT NULL,
  `introduccion_dos` varchar(160) DEFAULT NULL,
  `introduccion_tres` varchar(160) DEFAULT NULL,
  `id_usuarios` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Déchargement des données de la table `dialogos`
--

INSERT INTO `dialogos` (`id`, `introduccion_uno`, `introduccion_dos`, `introduccion_tres`, `id_usuarios`) VALUES
(1, 'fff', 'wdqcewww     wwwwwwwwwwwwwwww', 'swqq            1111111111', 4);

-- --------------------------------------------------------

--
-- Structure de la table `escenarios`
--

CREATE TABLE `escenarios` (
  `id` int(11) NOT NULL,
  `e_inicio` varchar(255) DEFAULT NULL,
  `e_juego` varchar(255) DEFAULT NULL,
  `e_puntuacion` varchar(255) DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Déchargement des données de la table `escenarios`
--

INSERT INTO `escenarios` (`id`, `e_inicio`, `e_juego`, `e_puntuacion`, `usuario_id`) VALUES
(1, 'inicio_4.jpeg', 'juego_4.png', 'puntuacion_4.png', 4);

-- --------------------------------------------------------

--
-- Structure de la table `idiomas`
--

CREATE TABLE `idiomas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Déchargement des données de la table `idiomas`
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
-- Structure de la table `jugadores`
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
-- Déchargement des données de la table `jugadores`
--

INSERT INTO `jugadores` (`id`, `nombre_jugador`, `email`, `contrasena`, `fecha_registro`, `fecha_nacimiento`, `genero`, `nivel`, `puntos`) VALUES
(5, 'fwe', 'caro@gmail.com', '$2y$10$plAFRm4jZOTOuxXxfxlRDuWoLd4Key7WYT4AQ/oN1Y0zSHeHhPM6O', '2025-07-08 16:57:20', '0000-00-00', NULL, 1, 30),
(10, 'luisito1', 'gesenigan@gmail.com', '$2y$10$9E2VBiihnhmFkEoDI/bMWuu3bbcVRHbWagWNH/DflvjXNgEtBLKXi', '2025-08-10 16:47:57', '0000-00-00', NULL, 1, 100),
(11, 'lui3sito1', 'guadalupe@gmail.com', '$2y$10$9E2VBiihnhmFkEoDI/bMWuu3bbcVRHbWagWNH/DflvjXNgEtBLKXi', '2025-08-10 16:49:16', '0000-00-00', NULL, 1, 0),
(12, 'carol', '2321082746@alumno.utpuebla.edu.mx', '$2y$10$fksYAlEGhn/hmiQaD2epSOu/ZoEhOLy3vR6J.tthYOp8PMBKO.qvW', '2026-01-14 22:23:02', '0000-00-00', NULL, 1, 20),
(14, 'yareth', 'yareth@gmail.com', '$2y$10$E/TN702r2ox0PDtajVb2gOd.5C1JvNy1LxbKe43LjS4tsjUiG0rBi', '2026-03-11 20:53:56', '0000-00-00', NULL, 22, 0),
(15, 'nuevo', 'nuevo@gmail.com', '$2y$10$Az.hdCddhD1Q/MZ4asAorul.FKEd1HzWrx9phfIeHWI0hF0u0H2Dy', '2026-03-12 21:27:55', '0000-00-00', NULL, 1, 0),
(16, 'hoy', 'hoy@gmail.com', '$2y$10$NlKb4SNJ7pHH5iPyGhYI/O.bj6FXmls3gafywMW8bmWWOWMWzIqRm', '2026-03-20 23:16:32', '0000-00-00', NULL, 1, 30),
(17, 'fernando', 'fernando@gmail.com', '$2y$10$.FiNR6HT46b3UJOMx7bus.WWrIjNnYheKU.OJiA/GL4qNjF8T21.K', '2026-03-20 23:54:25', '0000-00-00', NULL, 1, 30),
(18, 'hola', 'hola@gmail.com', '$2y$10$wVSnj8VesK/Nr2bxD//jsubNQKpyAwAx0fseQaNUtYztq9JaRm8LS', '2026-03-23 04:05:24', '0000-00-00', NULL, 1, 0),
(19, 'Maria Mendieta Mendez', 'maria@gmail.com', '$2y$10$vRs/6R2fa6l6YW/qvMXeDOWzAMytqsvYMVTFfC43vSepAHo5FcauG', '2026-03-23 22:09:21', '0000-00-00', NULL, 1, 0),
(20, 'guadalupe garcia garcia', 'guadalupe10@gmail.com', '$2y$10$0fh2XzyNwj.F6mlV9Gooku6uLHgF76JnhpniVhWLE.qABOpBvYsZW', '2026-03-23 22:11:25', '0000-00-00', NULL, 1, 0),
(21, 'naranja', 'naranja@gmail.com', '$2y$10$dURQf.KCcRKbmkMjRT1gAOZABdQXN3Alq.OVN/ag4vPemG2XFXC9m', '2026-03-25 05:16:42', '0000-00-00', NULL, 1, 90);

-- --------------------------------------------------------

--
-- Structure de la table `logros`
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
-- Déchargement des données de la table `logros`
--

INSERT INTO `logros` (`id`, `nombre`, `descripcion`, `imagen`, `tipo`, `puntos`, `usuarios_id`) VALUES
(1, 'El comienzo de un gran explorador.', 'Da una vuelta a los alrededores por primera vez.', 'L1.png', 'novato', 30, 4),
(7, 'Vínculo Inesperado', 'Formaste una alianza con un personaje que parecía irrelevante al inicio.', 'L2.png', 'avanzado', 50, 4),
(8, 'Eco de los Olvidados', 'Descubriste una carta escondida que revela el destino de un personaje perdido.', 'L3.png', 'maestro', 80, 5),
(12, 'Caballero valiente', 'Derrota a un enemigo por primera vez', 'logro_4_3.png', 'novato', 27, 4),
(13, 'Cambiaformas', 'Usa tu forma fatuna por primera vez durante una partida', 'logro_4_4.png', 'novato', 15, 4),
(14, 'No me dejaré vencer', 'Ante el riesgo de una muerte, consumen una posion de curacion.', 'logro_4_5.png', 'avanzado', 50, 4);

-- --------------------------------------------------------

--
-- Structure de la table `logros_jugador`
--

CREATE TABLE `logros_jugador` (
  `id` int(11) NOT NULL,
  `id_jugador` int(11) NOT NULL,
  `id_logro` int(11) NOT NULL,
  `fecha_obtenido` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Structure de la table `niveles`
--

CREATE TABLE `niveles` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `nivel_dificultad` enum('facil','medio','dificil') NOT NULL DEFAULT 'medio'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Structure de la table `objetos`
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
-- Déchargement des données de la table `objetos`
--

INSERT INTO `objetos` (`id`, `nombre_objeto`, `descripcion`, `cantidad_max_uso`, `rareza`, `users_id`) VALUES
(1, 'Espejo transformante', 'Un espejo capaz de cambiarte de forma, el mago decidio que esta sea un gato.', NULL, 'especial', 4),
(2, 'Espada del héroe', 'Capaz de cortar todo con un poco de fe.', NULL, 'especial', 5),
(3, 'Mapa del reino', 'Por si te sientes perdido, quiza te ayude a saber donde ir ahora.', NULL, 'comun', 5);

-- --------------------------------------------------------

--
-- Structure de la table `objetos_jugador`
--

CREATE TABLE `objetos_jugador` (
  `id` int(11) NOT NULL,
  `usos` int(11) DEFAULT NULL,
  `jugadores_id` int(11) DEFAULT NULL,
  `objetos_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Déchargement des données de la table `objetos_jugador`
--

INSERT INTO `objetos_jugador` (`id`, `usos`, `jugadores_id`, `objetos_id`) VALUES
(2, 0, 5, 1),
(4, 0, 5, 2),
(5, NULL, 5, 3),
(6, 0, 12, 1),
(7, 0, 12, 2),
(8, 0, 12, 3),
(10, 0, 10, 1),
(11, 0, 10, 2),
(12, 0, 16, 1),
(13, 0, 16, 2),
(14, 0, 17, 1),
(15, 0, 17, 2),
(16, 0, 19, 1),
(17, 0, 19, 2),
(18, 0, 19, 3),
(24, 0, 21, 1),
(25, 0, 21, 2),
(26, 0, 21, 3);

-- --------------------------------------------------------

--
-- Structure de la table `progreso`
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
-- Structure de la table `puntuacion`
--

CREATE TABLE `puntuacion` (
  `id` int(11) NOT NULL,
  `id_jugador` int(11) NOT NULL,
  `puntos` int(11) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Structure de la table `usuarios`
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
-- Déchargement des données de la table `usuarios`
--

INSERT INTO `usuarios` (`id`, `usuario`, `contrasena`, `correo`, `nombres`, `apellido_paterno`, `apellido_materno`, `telefono`, `rol`) VALUES
(4, 'caro', '$2y$10$YqPagcCK637tTCIPtEUsp.gHdeIWeeUcPqQVD1OnFxDq2bsZNF6Fe', 'gesenigan@gmail.com', 'gu', 'CARRERA', 'LEZAMA', '2222222222', 'Admin'),
(5, 'carlos', 'freya', 'carlos@gmail.com', NULL, NULL, NULL, NULL, NULL);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `configuracion_jugador`
--
ALTER TABLE `configuracion_jugador`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_jugador` (`id_jugador`),
  ADD KEY `id_idioma` (`id_idioma`);

--
-- Index pour la table `dialogos`
--
ALTER TABLE `dialogos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_id_usuarios` (`id_usuarios`);

--
-- Index pour la table `escenarios`
--
ALTER TABLE `escenarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_usuario` (`usuario_id`);

--
-- Index pour la table `idiomas`
--
ALTER TABLE `idiomas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Index pour la table `jugadores`
--
ALTER TABLE `jugadores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre_usuario` (`nombre_jugador`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `logros`
--
ALTER TABLE `logros`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD KEY `fk_logros_usuarios` (`usuarios_id`);

--
-- Index pour la table `logros_jugador`
--
ALTER TABLE `logros_jugador`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_jugador` (`id_jugador`),
  ADD KEY `id_logro` (`id_logro`);

--
-- Index pour la table `niveles`
--
ALTER TABLE `niveles`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `objetos`
--
ALTER TABLE `objetos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `users_id` (`users_id`);

--
-- Index pour la table `objetos_jugador`
--
ALTER TABLE `objetos_jugador`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jugadores_id` (`jugadores_id`),
  ADD KEY `objetos_id` (`objetos_id`);

--
-- Index pour la table `progreso`
--
ALTER TABLE `progreso`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_jugador` (`id_jugador`,`id_nivel`),
  ADD KEY `id_nivel` (`id_nivel`);

--
-- Index pour la table `puntuacion`
--
ALTER TABLE `puntuacion`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_jugador` (`id_jugador`);

--
-- Index pour la table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario` (`usuario`),
  ADD UNIQUE KEY `correo_electronico` (`correo`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `configuracion_jugador`
--
ALTER TABLE `configuracion_jugador`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `dialogos`
--
ALTER TABLE `dialogos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `escenarios`
--
ALTER TABLE `escenarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `idiomas`
--
ALTER TABLE `idiomas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `jugadores`
--
ALTER TABLE `jugadores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT pour la table `logros`
--
ALTER TABLE `logros`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `logros_jugador`
--
ALTER TABLE `logros_jugador`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `niveles`
--
ALTER TABLE `niveles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `objetos`
--
ALTER TABLE `objetos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `objetos_jugador`
--
ALTER TABLE `objetos_jugador`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT pour la table `progreso`
--
ALTER TABLE `progreso`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `puntuacion`
--
ALTER TABLE `puntuacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `configuracion_jugador`
--
ALTER TABLE `configuracion_jugador`
  ADD CONSTRAINT `configuracion_jugador_ibfk_1` FOREIGN KEY (`id_jugador`) REFERENCES `jugadores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `configuracion_jugador_ibfk_2` FOREIGN KEY (`id_idioma`) REFERENCES `idiomas` (`id`);

--
-- Contraintes pour la table `dialogos`
--
ALTER TABLE `dialogos`
  ADD CONSTRAINT `fk_id_usuarios` FOREIGN KEY (`id_usuarios`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `escenarios`
--
ALTER TABLE `escenarios`
  ADD CONSTRAINT `fk_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `logros`
--
ALTER TABLE `logros`
  ADD CONSTRAINT `fk_logros_usuarios` FOREIGN KEY (`usuarios_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `logros_jugador`
--
ALTER TABLE `logros_jugador`
  ADD CONSTRAINT `logros_jugador_ibfk_1` FOREIGN KEY (`id_jugador`) REFERENCES `jugadores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `logros_jugador_ibfk_2` FOREIGN KEY (`id_logro`) REFERENCES `logros` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `objetos`
--
ALTER TABLE `objetos`
  ADD CONSTRAINT `objetos_ibfk_1` FOREIGN KEY (`users_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `objetos_jugador`
--
ALTER TABLE `objetos_jugador`
  ADD CONSTRAINT `objetos_jugador_ibfk_1` FOREIGN KEY (`jugadores_id`) REFERENCES `jugadores` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `objetos_jugador_ibfk_2` FOREIGN KEY (`objetos_id`) REFERENCES `objetos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `progreso`
--
ALTER TABLE `progreso`
  ADD CONSTRAINT `progreso_ibfk_1` FOREIGN KEY (`id_jugador`) REFERENCES `jugadores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `progreso_ibfk_2` FOREIGN KEY (`id_nivel`) REFERENCES `niveles` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `puntuacion`
--
ALTER TABLE `puntuacion`
  ADD CONSTRAINT `puntuacion_ibfk_1` FOREIGN KEY (`id_jugador`) REFERENCES `jugadores` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
