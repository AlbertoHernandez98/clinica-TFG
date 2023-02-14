-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `mydb` ;

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`persona`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`persona` ;

CREATE TABLE IF NOT EXISTS `mydb`.`persona` (
  `idPersona` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `dni` VARCHAR(9) NOT NULL,
  `nombre` VARCHAR(32) NOT NULL,
  `apellidos` VARCHAR(45) NOT NULL,
  `telefono` INT(11) NULL DEFAULT NULL,
  `contraseña` VARCHAR(45) NULL DEFAULT NULL,
  `idRolNativo` INT(11) NOT NULL,
  `fotoPerfil` VARCHAR(250) NULL,
  PRIMARY KEY (`idPersona`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`servicio`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`servicio` ;

CREATE TABLE IF NOT EXISTS `mydb`.`servicio` (
  `idServicio` INT(10) UNSIGNED NOT NULL,
  `servicio` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`idServicio`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`cita`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`cita` ;

CREATE TABLE IF NOT EXISTS `mydb`.`cita` (
  `idCita` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `fecha` DATE NULL DEFAULT NULL,
  `hora` TIME NULL DEFAULT NULL,
  `idServicio` INT(10) UNSIGNED NOT NULL,
  `historial` VARCHAR(250) NULL DEFAULT NULL,
  `idCliente` INT(10) UNSIGNED NOT NULL,
  `idMedico` INT(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`idCita`),
  CONSTRAINT `fk_CIta_Cliente`
    FOREIGN KEY (`idCliente`)
    REFERENCES `mydb`.`persona` (`idPersona`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_CIta_Medico`
    FOREIGN KEY (`idMedico`)
    REFERENCES `mydb`.`persona` (`idPersona`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_CIta_Servicio`
    FOREIGN KEY (`idServicio`)
    REFERENCES `mydb`.`servicio` (`idServicio`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE UNIQUE INDEX `idServicio_UNIQUE` ON `mydb`.`cita` (`idServicio` ASC);

CREATE UNIQUE INDEX `idCita_UNIQUE` ON `mydb`.`cita` (`idCita` ASC);

CREATE INDEX `fk_Cita_Persona1_idx` ON `mydb`.`cita` (`idCliente` ASC);

CREATE INDEX `fk_Cita_Persona2_idx` ON `mydb`.`cita` (`idMedico` ASC);


-- -----------------------------------------------------
-- Table `mydb`.`historialclinico`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`historialclinico` ;

CREATE TABLE IF NOT EXISTS `mydb`.`historialclinico` (
  `idHistorialClinico` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `comentarios` VARCHAR(45) NOT NULL,
  `fecha` VARCHAR(45) NOT NULL,
  `hora` VARCHAR(45) NOT NULL,
  `idCliente` INT(10) UNSIGNED NOT NULL,
  `idMedico` INT(10) UNSIGNED NOT NULL,
  `idServicio` INT(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`idHistorialClinico`),
  CONSTRAINT `fk_HClinico_Cliente`
    FOREIGN KEY (`idCliente`)
    REFERENCES `mydb`.`persona` (`idPersona`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_HClinico_Medico`
    FOREIGN KEY (`idMedico`)
    REFERENCES `mydb`.`persona` (`idPersona`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_HClinico_Servicio`
    FOREIGN KEY (`idServicio`)
    REFERENCES `mydb`.`servicio` (`idServicio`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE INDEX `fk_HistorialClinico_Persona1_idx` ON `mydb`.`historialclinico` (`idCliente` ASC);

CREATE INDEX `fk_HistorialClinico_Servicio1_idx` ON `mydb`.`historialclinico` (`idServicio` ASC);

CREATE INDEX `fk_HClinico_Medico_idx` ON `mydb`.`historialclinico` (`idMedico` ASC);


-- -----------------------------------------------------
-- Table `mydb`.`medico_has_servicio`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`medico_has_servicio` ;

CREATE TABLE IF NOT EXISTS `mydb`.`medico_has_servicio` (
  `idPersona` INT(10) UNSIGNED NOT NULL,
  `idServicio` INT(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`idPersona`, `idServicio`),
  CONSTRAINT `fk_Medico`
    FOREIGN KEY (`idPersona`)
    REFERENCES `mydb`.`persona` (`idPersona`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Servicio`
    FOREIGN KEY (`idServicio`)
    REFERENCES `mydb`.`servicio` (`idServicio`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE INDEX `fk_Persona_has_Servicio_Servicio1_idx` ON `mydb`.`medico_has_servicio` (`idServicio` ASC);

CREATE INDEX `fk_Persona_has_Servicio_Persona1_idx` ON `mydb`.`medico_has_servicio` (`idPersona` ASC);


-- -----------------------------------------------------
-- Table `mydb`.`rol`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`rol` ;

CREATE TABLE IF NOT EXISTS `mydb`.`rol` (
  `idRol` INT(11) NOT NULL,
  `descripcion` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idRol`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `mydb`.`persona_has_rol`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`persona_has_rol` ;

CREATE TABLE IF NOT EXISTS `mydb`.`persona_has_rol` (
  `idPersona` INT(10) UNSIGNED NOT NULL,
  `idRol` INT(11) NOT NULL,
  PRIMARY KEY (`idPersona`, `idRol`),
  CONSTRAINT `fk_Persona`
    FOREIGN KEY (`idPersona`)
    REFERENCES `mydb`.`persona` (`idPersona`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Rol`
    FOREIGN KEY (`idRol`)
    REFERENCES `mydb`.`rol` (`idRol`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE INDEX `fk_Persona_has_Rol_Rol1_idx` ON `mydb`.`persona_has_rol` (`idRol` ASC);

CREATE INDEX `fk_Persona_has_Rol_Persona1_idx` ON `mydb`.`persona_has_rol` (`idPersona` ASC);


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `mydb`.`persona`
-- -----------------------------------------------------
START TRANSACTION;
USE `mydb`;
INSERT INTO `mydb`.`persona` (`idPersona`, `dni`, `nombre`, `apellidos`, `telefono`, `contraseña`, `idRolNativo`, `fotoPerfil`) VALUES (0, '12345678', 'root', 'root', 123456789, 'root', 1, NULL);

COMMIT;


-- -----------------------------------------------------
-- Data for table `mydb`.`servicio`
-- -----------------------------------------------------
START TRANSACTION;
USE `mydb`;
INSERT INTO `mydb`.`servicio` (`idServicio`, `servicio`) VALUES (1, 'Quiropodia');
INSERT INTO `mydb`.`servicio` (`idServicio`, `servicio`) VALUES (2, 'Biomecanica');
INSERT INTO `mydb`.`servicio` (`idServicio`, `servicio`) VALUES (3, 'Cirugia ungeal');
INSERT INTO `mydb`.`servicio` (`idServicio`, `servicio`) VALUES (4, 'Cirugia osea');
INSERT INTO `mydb`.`servicio` (`idServicio`, `servicio`) VALUES (5, 'Pie diabetico');
INSERT INTO `mydb`.`servicio` (`idServicio`, `servicio`) VALUES (6, 'Podologia infantil');
INSERT INTO `mydb`.`servicio` (`idServicio`, `servicio`) VALUES (7, 'Podologia geriatrica');
INSERT INTO `mydb`.`servicio` (`idServicio`, `servicio`) VALUES (8, 'Domicilio');

COMMIT;


-- -----------------------------------------------------
-- Data for table `mydb`.`rol`
-- -----------------------------------------------------
START TRANSACTION;
USE `mydb`;
INSERT INTO `mydb`.`rol` (`idRol`, `descripcion`) VALUES (1, 'Admin');
INSERT INTO `mydb`.`rol` (`idRol`, `descripcion`) VALUES (2, 'Medico');
INSERT INTO `mydb`.`rol` (`idRol`, `descripcion`) VALUES (3, 'Recepcionista');
INSERT INTO `mydb`.`rol` (`idRol`, `descripcion`) VALUES (4, 'Cliente');

COMMIT;

