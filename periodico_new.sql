/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.11-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: periodico
-- ------------------------------------------------------
-- Server version	10.11.11-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `CATEGORIAS`
--

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
/*!40000 ALTER TABLE `CATEGORIAS` ENABLE KEYS */;
UNLOCK TABLES;

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
/*!40000 ALTER TABLE `NOVEDADES` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `POSTS_ADMIN`
--

LOCK TABLES `POSTS_ADMIN` WRITE;
/*!40000 ALTER TABLE `POSTS_ADMIN` DISABLE KEYS */;
INSERT INTO `POSTS_ADMIN` VALUES
(6,'asdadada','dsadaaa','Admin','2025-10-19 23:53:35');
/*!40000 ALTER TABLE `POSTS_ADMIN` ENABLE KEYS */;
UNLOCK TABLES;

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
  PRIMARY KEY (`id_publicacion`),
  KEY `autorpublicacion` (`autor_publicacion`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PUBLICACIONES`
--

LOCK TABLES `PUBLICACIONES` WRITE;
/*!40000 ALTER TABLE `PUBLICACIONES` DISABLE KEYS */;
INSERT INTO `PUBLICACIONES` VALUES
(16,'andres','Hola ','2025-10-20 02:02:36','Probando Funcionalidad de Base de datos y conexion al backend, pag hecha con node, express, ejs, etc...');
/*!40000 ALTER TABLE `PUBLICACIONES` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TEMAS`
--

DROP TABLE IF EXISTS `TEMAS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `TEMAS` (
  `id_tema` int(4) NOT NULL,
  `autor_tema` int(10) NOT NULL,
  `titulo_tema` varchar(30) NOT NULL,
  `mensaje_tema` varchar(700) NOT NULL,
  PRIMARY KEY (`id_tema`),
  KEY `autortema` (`autor_tema`),
  CONSTRAINT `autortema` FOREIGN KEY (`autor_tema`) REFERENCES `USUARIOS` (`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TEMAS`
--

LOCK TABLES `TEMAS` WRITE;
/*!40000 ALTER TABLE `TEMAS` DISABLE KEYS */;
/*!40000 ALTER TABLE `TEMAS` ENABLE KEYS */;
UNLOCK TABLES;

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
INSERT INTO `USUARIOS` VALUES
(1111111111,'Admin','$2b$10$7zysLMnwPkLMciZKswNvFOjrOB7nTMLi6GM2p0PtRXmRMxoZUzON6','admin@iecomfamiliar.edu.co','2025-10-20 03:57:10','Administrador'),
(1142921625,'andres','$2b$10$rSrTivOZ38bYW23fZXt2J.eo71hsqr19nmf8AWHc4JaF2d5C8TbHS','andres.leon@iecomfamiliar.edu.co','2025-10-20 03:56:23','Estudiante');
/*!40000 ALTER TABLE `USUARIOS` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-20  0:00:00
