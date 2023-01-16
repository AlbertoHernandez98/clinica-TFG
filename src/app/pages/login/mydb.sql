-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 18-12-2022 a las 17:57:47
-- Versión del servidor: 8.0.31
-- Versión de PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `mydb`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cita`
--

CREATE TABLE `cita` (
  `idCita` int UNSIGNED NOT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `idServicio` int UNSIGNED NOT NULL,
  `historial` varchar(250) DEFAULT NULL,
  `idCliente` int UNSIGNED NOT NULL,
  `idMedico` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historialclinico`
--

CREATE TABLE `historialclinico` (
  `idHistorialClinico` int UNSIGNED NOT NULL,
  `comentarios` varchar(45) NOT NULL,
  `fecha` varchar(45) NOT NULL,
  `hora` varchar(45) NOT NULL,
  `idCliente` int UNSIGNED NOT NULL,
  `idMedico` int UNSIGNED NOT NULL,
  `idServicio` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medico_has_servicio`
--

CREATE TABLE `medico_has_servicio` (
  `idPersona` int UNSIGNED NOT NULL,
  `idServicio` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `persona`
--

CREATE TABLE `persona` (
  `idPersona` int UNSIGNED NOT NULL,
  `dni` varchar(9) NOT NULL,
  `nombre` varchar(32) NOT NULL,
  `apellidos` varchar(45) NOT NULL,
  `telefono` int DEFAULT NULL,
  `contraseña` varchar(45) DEFAULT NULL,
  `idRolNativo` int NOT NULL,
  `fotoPerfil` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `persona`
--

INSERT INTO `persona` (`idPersona`, `dni`, `nombre`, `apellidos`, `telefono`, `contraseña`, `idRolNativo`, `fotoPerfil`) VALUES
(1, '12345678A', 'root', 'root', 123456789, 'rootpass', 1, '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `persona_has_rol`
--

CREATE TABLE `persona_has_rol` (
  `idPersona` int UNSIGNED NOT NULL,
  `idRol` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `idRol` int NOT NULL,
  `descripcion` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`idRol`, `descripcion`) VALUES
(1, 'Admin'),
(2, 'Medico'),
(3, 'Recepcionista'),
(4, 'Cliente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicio`
--

CREATE TABLE `servicio` (
  `idServicio` int UNSIGNED NOT NULL,
  `servicio` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `servicio`
--

INSERT INTO `servicio` (`idServicio`, `servicio`) VALUES
(1, 'Quiropodia'),
(2, 'Biomecanica'),
(3, 'Cirugia ungeal'),
(4, 'Cirugia osea'),
(5, 'Pie diabetico'),
(6, 'Podologia infantil'),
(7, 'Podologia geriatrica'),
(8, 'Servicio a domicilio');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cita`
--
ALTER TABLE `cita`
  ADD PRIMARY KEY (`idCita`),
  ADD UNIQUE KEY `idServicio_UNIQUE` (`idServicio`),
  ADD UNIQUE KEY `idCita_UNIQUE` (`idCita`),
  ADD KEY `fk_Cita_Persona1_idx` (`idCliente`),
  ADD KEY `fk_Cita_Persona2_idx` (`idMedico`);

--
-- Indices de la tabla `historialclinico`
--
ALTER TABLE `historialclinico`
  ADD PRIMARY KEY (`idHistorialClinico`),
  ADD KEY `fk_HistorialClinico_Persona1_idx` (`idCliente`),
  ADD KEY `fk_HistorialClinico_Servicio1_idx` (`idServicio`),
  ADD KEY `fk_HClinico_Medico_idx` (`idMedico`);

--
-- Indices de la tabla `medico_has_servicio`
--
ALTER TABLE `medico_has_servicio`
  ADD PRIMARY KEY (`idPersona`,`idServicio`),
  ADD KEY `fk_Persona_has_Servicio_Servicio1_idx` (`idServicio`),
  ADD KEY `fk_Persona_has_Servicio_Persona1_idx` (`idPersona`);

--
-- Indices de la tabla `persona`
--
ALTER TABLE `persona`
  ADD PRIMARY KEY (`idPersona`);

--
-- Indices de la tabla `persona_has_rol`
--
ALTER TABLE `persona_has_rol`
  ADD PRIMARY KEY (`idPersona`,`idRol`),
  ADD KEY `fk_Persona_has_Rol_Rol1_idx` (`idRol`),
  ADD KEY `fk_Persona_has_Rol_Persona1_idx` (`idPersona`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`idRol`);

--
-- Indices de la tabla `servicio`
--
ALTER TABLE `servicio`
  ADD PRIMARY KEY (`idServicio`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cita`
--
ALTER TABLE `cita`
  MODIFY `idCita` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `historialclinico`
--
ALTER TABLE `historialclinico`
  MODIFY `idHistorialClinico` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `persona`
--
ALTER TABLE `persona`
  MODIFY `idPersona` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cita`
--
ALTER TABLE `cita`
  ADD CONSTRAINT `fk_CIta_Cliente` FOREIGN KEY (`idCliente`) REFERENCES `persona` (`idPersona`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_CIta_Medico` FOREIGN KEY (`idMedico`) REFERENCES `persona` (`idPersona`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_CIta_Servicio` FOREIGN KEY (`idServicio`) REFERENCES `servicio` (`idServicio`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `historialclinico`
--
ALTER TABLE `historialclinico`
  ADD CONSTRAINT `fk_HClinico_Cliente` FOREIGN KEY (`idCliente`) REFERENCES `persona` (`idPersona`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_HClinico_Medico` FOREIGN KEY (`idMedico`) REFERENCES `persona` (`idPersona`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_HClinico_Servicio` FOREIGN KEY (`idServicio`) REFERENCES `servicio` (`idServicio`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `medico_has_servicio`
--
ALTER TABLE `medico_has_servicio`
  ADD CONSTRAINT `fk_Medico` FOREIGN KEY (`idPersona`) REFERENCES `persona` (`idPersona`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Servicio` FOREIGN KEY (`idServicio`) REFERENCES `servicio` (`idServicio`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `persona_has_rol`
--
ALTER TABLE `persona_has_rol`
  ADD CONSTRAINT `fk_Persona` FOREIGN KEY (`idPersona`) REFERENCES `persona` (`idPersona`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Rol` FOREIGN KEY (`idRol`) REFERENCES `rol` (`idRol`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
