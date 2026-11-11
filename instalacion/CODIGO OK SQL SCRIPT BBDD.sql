-- Esquema completo para una instalación nueva, incluidas las migraciones 001-010.
-- No ejecutar sobre una base existente: este archivo NO es una migración.
-- Detener la ejecución ante cualquier error y crear una copia de seguridad antes
-- de modificar una base con datos. No incluye usuarios ni contraseñas.

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema test
-- -----------------------------------------------------
CREATE SCHEMA `test` DEFAULT CHARACTER SET utf8 ;
USE `test`;

-- -----------------------------------------------------
-- Table `test`.`persona`
-- -----------------------------------------------------
CREATE TABLE `test`.`persona` (
  `idPersona` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `dni` VARCHAR(9) NOT NULL,
  `nombre` VARCHAR(32) NOT NULL,
  `apellidos` VARCHAR(45) NOT NULL,
  `telefono` INT(11) NULL DEFAULT NULL,
  `password` VARCHAR(255) NULL DEFAULT NULL,
  `idRolNativo` INT(11) NOT NULL,
  `fotoPerfil` VARCHAR(250) NULL,
  `email` VARCHAR(254) NULL DEFAULT NULL,
  PRIMARY KEY (`idPersona`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `test`.`servicio`
-- -----------------------------------------------------
CREATE TABLE `test`.`servicio` (
  `idServicio` INT(10) UNSIGNED NOT NULL,
  `servicio` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`idServicio`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `test`.`cita`
-- -----------------------------------------------------
CREATE TABLE `test`.`cita` (
  `idCita` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `fecha` DATE NULL DEFAULT NULL,
  `hora` TIME NULL DEFAULT NULL,
  `idServicio` INT(10) UNSIGNED NOT NULL,
  `historial` VARCHAR(250) NULL DEFAULT NULL,
  `idCliente` INT(10) UNSIGNED NOT NULL,
  `idMedico` INT(10) UNSIGNED NOT NULL,
  `duracion` INT NULL DEFAULT NULL,
  PRIMARY KEY (`idCita`)
  )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE UNIQUE INDEX `idCita_UNIQUE` ON `test`.`cita` (`idCita` ASC);
CREATE INDEX `idx_cita_medico_fecha` ON `test`.`cita` (`idMedico`, `fecha`, `hora`);


-- -----------------------------------------------------
-- Table `test`.`historialclinico`
-- -----------------------------------------------------
CREATE TABLE `test`.`historialclinico` (
  `idHistorialClinico` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `comentarios` TEXT NOT NULL,
  `fecha` VARCHAR(45) NOT NULL,
  `hora` VARCHAR(45) NOT NULL,
  `idCliente` INT(10) UNSIGNED NOT NULL,
  `idMedico` INT(10) UNSIGNED NOT NULL,
  `idServicio` INT(10) UNSIGNED NOT NULL,
  `idCita` INT(10) UNSIGNED NULL,
  `anulada` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`idHistorialClinico`)
  )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;



-- -----------------------------------------------------
-- Table `test`.`medico_has_servicio`
-- -----------------------------------------------------
CREATE TABLE `test`.`medico_has_servicio` (
  `idPersona` INT(10) UNSIGNED NOT NULL,
  `idServicio` INT(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`idPersona`, `idServicio`)
  )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;



-- -----------------------------------------------------
-- Table `test`.`rol`
-- -----------------------------------------------------
CREATE TABLE `test`.`rol` (
  `idRol` INT(11) NOT NULL,
  `descripcion` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idRol`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `test`.`persona_has_rol`
-- -----------------------------------------------------
CREATE TABLE `test`.`persona_has_rol` (
  `idPersona` INT(10) UNSIGNED NOT NULL,
  `idRol` INT(11) NOT NULL,
  PRIMARY KEY (`idPersona`, `idRol`)
  )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


CREATE TABLE `test`.`vacaciones_medico` (
  `idVacacion` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `idMedico` INT UNSIGNED NOT NULL,
  `fechaInicio` DATE NOT NULL,
  `fechaFin` DATE NOT NULL,
  PRIMARY KEY (`idVacacion`),
  KEY `idx_vacaciones_medico_fechas` (`idMedico`, `fechaInicio`, `fechaFin`),
  CONSTRAINT `fk_vacaciones_medico` FOREIGN KEY (`idMedico`) REFERENCES `persona` (`idPersona`)
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8;

CREATE TABLE `test`.`historialclinicohistorico` (
  `idVersionHistorial` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `idHistorialClinico` INT UNSIGNED NOT NULL,
  `comentarios` TEXT NOT NULL,
  `fecha` VARCHAR(45) NULL,
  `hora` VARCHAR(45) NULL,
  `idMedico` INT UNSIGNED NULL,
  `idServicio` INT UNSIGNED NOT NULL,
  `idCita` INT UNSIGNED NULL,
  `tipoOperacion` ENUM('EDICION', 'ANULACION') NOT NULL,
  `motivo` VARCHAR(1000) NOT NULL,
  `idUsuario` INT UNSIGNED NOT NULL,
  `fechaOperacion` DATETIME NOT NULL,
  PRIMARY KEY (`idVersionHistorial`),
  INDEX `idx_historial_historico_entrada` (`idHistorialClinico`, `idVersionHistorial`),
  INDEX `idx_historial_historico_usuario` (`idUsuario`, `fechaOperacion`)
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8;

CREATE TABLE `test`.`auth_refresh_session` (
  `idSesion` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `idPersona` INT UNSIGNED NOT NULL,
  `tokenHash` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `expiresAt` DATETIME NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `revokedAt` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`idSesion`),
  UNIQUE KEY `uq_refresh_token` (`tokenHash`),
  KEY `idx_refresh_persona` (`idPersona`),
  KEY `idx_refresh_expiry` (`expiresAt`)
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8;

CREATE TABLE `test`.`auth_refresh_used_token` (
  `tokenHash` CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `idSesion` BIGINT UNSIGNED NOT NULL,
  `usedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`tokenHash`),
  KEY `idx_refresh_used_session` (`idSesion`),
  CONSTRAINT `fk_refresh_used_session` FOREIGN KEY (`idSesion`)
    REFERENCES `test`.`auth_refresh_session` (`idSesion`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8;

CREATE TABLE `test`.`auditoria_historial` (
  `idAuditoria` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `fecha` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `idUsuario` INT UNSIGNED NOT NULL,
  `rolUsuario` INT NOT NULL,
  `operacion` ENUM('CONSULTA', 'ALTA', 'EDICION', 'ANULACION') NOT NULL,
  `resultado` ENUM('PERMITIDO', 'DENEGADO') NOT NULL,
  `idPaciente` INT UNSIGNED NULL,
  `idHistorialClinico` INT UNSIGNED NULL,
  PRIMARY KEY (`idAuditoria`),
  KEY `idx_auditoria_fecha` (`fecha`, `idAuditoria`),
  KEY `idx_auditoria_paciente` (`idPaciente`, `idAuditoria`),
  KEY `idx_auditoria_usuario` (`idUsuario`, `idAuditoria`)
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


-- -----------------------------------------------------
-- Data for table `test`.`servicio`
-- -----------------------------------------------------
START TRANSACTION;
USE `test`;
INSERT INTO `test`.`servicio` (`idServicio`, `servicio`) VALUES (1, 'Quiropodia');
INSERT INTO `test`.`servicio` (`idServicio`, `servicio`) VALUES (2, 'Biomecanica');
INSERT INTO `test`.`servicio` (`idServicio`, `servicio`) VALUES (3, 'Cirugia ungeal');
INSERT INTO `test`.`servicio` (`idServicio`, `servicio`) VALUES (4, 'Cirugia osea');
INSERT INTO `test`.`servicio` (`idServicio`, `servicio`) VALUES (5, 'Pie diabetico');
INSERT INTO `test`.`servicio` (`idServicio`, `servicio`) VALUES (6, 'Podologia infantil');
INSERT INTO `test`.`servicio` (`idServicio`, `servicio`) VALUES (7, 'Podologia geriatrica');
INSERT INTO `test`.`servicio` (`idServicio`, `servicio`) VALUES (8, 'Domicilio');

COMMIT;


-- -----------------------------------------------------
-- Data for table `test`.`rol`
-- -----------------------------------------------------
START TRANSACTION;
USE `test`;
INSERT INTO `test`.`rol` (`idRol`, `descripcion`) VALUES (1, 'Admin');
INSERT INTO `test`.`rol` (`idRol`, `descripcion`) VALUES (2, 'Medico');
INSERT INTO `test`.`rol` (`idRol`, `descripcion`) VALUES (3, 'Recepcionista');
INSERT INTO `test`.`rol` (`idRol`, `descripcion`) VALUES (4, 'Cliente');

COMMIT;
