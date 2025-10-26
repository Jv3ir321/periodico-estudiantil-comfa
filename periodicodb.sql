/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-12.0.2-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: periodico
-- ------------------------------------------------------
-- Server version	12.0.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `CATEGORIAS`
CREATE DATABASE IF NOT EXISTS `periodico` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `periodico`;

DROP TABLE IF EXISTS `CATEGORIAS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `CATEGORIAS` (
  `id_categoria` int(3) NOT NULL,
  `nom_categoria` varchar(15) NOT NULL,
  `publicaciones_categoria` int(4) DEFAULT NULL,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CATEGORIAS`
--

LOCK TABLES `CATEGORIAS` WRITE;
/*!40000 ALTER TABLE `CATEGORIAS` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `CATEGORIAS` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `NOVEDADES`
--

DROP TABLE IF EXISTS `NOVEDADES`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `NOVEDADES` (
  `id_novedad` int(5) NOT NULL,
  `titulo_novedad` tinytext NOT NULL,
  `mensaje_novedad` varchar(300) NOT NULL,
  `categoria_novedad` int(3) NOT NULL,
  PRIMARY KEY (`id_novedad`),
  KEY `categorianovedad` (`categoria_novedad`),
  CONSTRAINT `categorianovedad` FOREIGN KEY (`categoria_novedad`) REFERENCES `CATEGORIAS` (`id_categoria`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `NOVEDADES`
--

LOCK TABLES `NOVEDADES` WRITE;
/*!40000 ALTER TABLE `NOVEDADES` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `NOVEDADES` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `POSTS_ADMIN`
--

DROP TABLE IF EXISTS `POSTS_ADMIN`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `POSTS_ADMIN` (
  `id_post` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(400) NOT NULL,
  `contenido` text NOT NULL,
  `autor_post` varchar(50) DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_post`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `POSTS_ADMIN`
--

LOCK TABLES `POSTS_ADMIN` WRITE;
/*!40000 ALTER TABLE `POSTS_ADMIN` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `POSTS_ADMIN` VALUES
(6,'asdadada','dsadaaa','Admin','2025-10-19 23:53:35'),
(10,'Periodico Estudiantil de la I.E COMFAMILIAR BETA!!','Las primeras funciones del periodico estudiantil de la I.E COMFAMILIAR CARTAGENA, en pro de mejorar el desarrollo comunicativo de los estudiantes de la institucion','Admin','2025-10-24 20:41:44');
/*!40000 ALTER TABLE `POSTS_ADMIN` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `POSTS_TRABS`
--

DROP TABLE IF EXISTS `POSTS_TRABS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `POSTS_TRABS` (
  `id_post` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(400) NOT NULL,
  `descripcion` text NOT NULL,
  `materia` varchar(20) NOT NULL,
  `nombre_original` varchar(255) NOT NULL,
  `autor_post` varchar(50) DEFAULT NULL,
  `ruta` varchar(500) NOT NULL,
  `tipo_mime` varchar(100) DEFAULT NULL,
  `tamaño` int(11) DEFAULT NULL,
  `fecha_subida` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_post`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `POSTS_TRABS`
--

LOCK TABLES `POSTS_TRABS` WRITE;
/*!40000 ALTER TABLE `POSTS_TRABS` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `POSTS_TRABS` VALUES
(14,'dasdsa','dadadadadad','dadadada','22656108.pdf','Admin','uploads/22656108.pdf','application/pdf',113861,'2025-10-26 14:01:41');
/*!40000 ALTER TABLE `POSTS_TRABS` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `PUBLICACIONES`
--

DROP TABLE IF EXISTS `PUBLICACIONES`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `PUBLICACIONES` (
  `id_publicacion` int(11) NOT NULL AUTO_INCREMENT,
  `autor_publicacion` varchar(10) DEFAULT NULL,
  `nombre_publicacion` varchar(45) NOT NULL,
  `fecha_publicacion` timestamp NULL DEFAULT current_timestamp(),
  `contenido_publicacion` varchar(500) DEFAULT NULL,
  `respuestas` varchar(400) DEFAULT NULL,
  `estado` varchar(20) DEFAULT 'aprobado',
  PRIMARY KEY (`id_publicacion`),
  KEY `autorpublicacion` (`autor_publicacion`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PUBLICACIONES`
--

LOCK TABLES `PUBLICACIONES` WRITE;
/*!40000 ALTER TABLE `PUBLICACIONES` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `PUBLICACIONES` VALUES
(22,'Admin','Foro estudiantil BETA CERRADA!!','2025-10-25 04:37:37','Probando las funcionalidades CRUD del periodico estudiantil de la I.E COMFAMILIAR',NULL,'aprobado'),
(23,'Admin','Probando el editaaaar','2025-10-25 05:04:08','XDXDXDDDDDDDD',NULL,'aprobado'),
(25,'Admin','CRUD con NodeJS , y ExpressJS','2025-10-25 23:13:28','Puliendo las caracteristicas del Periodico Estudiantil Comfamiliar Cartagena',NULL,'aprobado');
/*!40000 ALTER TABLE `PUBLICACIONES` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `PUBLICACIONES_REQADMIN`
--

DROP TABLE IF EXISTS `PUBLICACIONES_REQADMIN`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `PUBLICACIONES_REQADMIN` (
  `id_publicacion` int(11) NOT NULL AUTO_INCREMENT,
  `autor_publicacion` varchar(10) DEFAULT NULL,
  `nombre_publicacion` varchar(45) NOT NULL,
  `fecha_publicacion` timestamp NULL DEFAULT current_timestamp(),
  `contenido_publicacion` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id_publicacion`),
  KEY `autorpublicacion` (`autor_publicacion`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PUBLICACIONES_REQADMIN`
--

LOCK TABLES `PUBLICACIONES_REQADMIN` WRITE;
/*!40000 ALTER TABLE `PUBLICACIONES_REQADMIN` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `PUBLICACIONES_REQADMIN` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `RESPUESTAS_FORO`
--

DROP TABLE IF EXISTS `RESPUESTAS_FORO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `RESPUESTAS_FORO` (
  `id_respuesta` int(11) NOT NULL AUTO_INCREMENT,
  `id_publicacion` int(11) NOT NULL,
  `autor_respuesta` varchar(10) DEFAULT NULL,
  `contenido_respuesta` varchar(400) DEFAULT NULL,
  `fecha_respuesta` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_respuesta`),
  KEY `id_publicacion` (`id_publicacion`),
  CONSTRAINT `RESPUESTAS_FORO_ibfk_1` FOREIGN KEY (`id_publicacion`) REFERENCES `PUBLICACIONES` (`id_publicacion`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RESPUESTAS_FORO`
--

LOCK TABLES `RESPUESTAS_FORO` WRITE;
/*!40000 ALTER TABLE `RESPUESTAS_FORO` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `RESPUESTAS_FORO` VALUES
(3,25,'Admin','dsadadada','2025-10-26 17:34:50'),
(4,25,'Admin','sadadadadaadaa','2025-10-26 18:13:04'),
(5,23,'Admin','JDJSAJDAJDSJAJDA','2025-10-26 18:31:20');
/*!40000 ALTER TABLE `RESPUESTAS_FORO` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `USUARIOS`
--

DROP TABLE IF EXISTS `USUARIOS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `USUARIOS` (
  `id_usuario` int(10) NOT NULL,
  `nombre_usuario` tinytext NOT NULL,
  `password_usuario` varchar(100) DEFAULT NULL,
  `correo_usuario` varchar(45) NOT NULL,
  `fr_usuario` timestamp NULL DEFAULT current_timestamp(),
  `rol_usuario` varchar(20) NOT NULL,
  PRIMARY KEY (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USUARIOS`
--

LOCK TABLES `USUARIOS` WRITE;
/*!40000 ALTER TABLE `USUARIOS` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `USUARIOS` VALUES
(1111111111,'Admin','$2b$10$7zysLMnwPkLMciZKswNvFOjrOB7nTMLi6GM2p0PtRXmRMxoZUzON6','admin@iecomfamiliar.edu.co','2025-10-20 08:57:10','Administrador'),
(1142921625,'andres','$2b$10$rSrTivOZ38bYW23fZXt2J.eo71hsqr19nmf8AWHc4JaF2d5C8TbHS','andres.leon@iecomfamiliar.edu.co','2025-10-20 08:56:23','Estudiante');
/*!40000 ALTER TABLE `USUARIOS` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `sessions` VALUES
('CfAVtls3wr2ZXR-OLnWJ5gR5WU5g2mWh',1762111759,'{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-11-02T18:54:15.129Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"login\":true,\"nomusr\":\"Admin\",\"mailusr\":\"admin@iecomfamiliar.edu.co\",\"frusr\":\"2025-10-20T08:57:10.000Z\",\"rolusr\":\"Administrador\"}'),
('Fh44x51JfQ0ssilMIPrOiX0nnjDJfb-7',1762039709,'{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2025-11-01T23:28:28.456Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"login\":true,\"nomusr\":\"Admin\",\"mailusr\":\"admin@iecomfamiliar.edu.co\",\"frusr\":\"2025-10-20T08:57:10.000Z\",\"rolusr\":\"Administrador\"}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;
commit;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2025-10-26 14:31:32
