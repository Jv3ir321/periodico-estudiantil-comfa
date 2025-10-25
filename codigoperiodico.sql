Create database if not exists periodico;

create table if not exists periodico.USUARIOS(
    id_usuario int(10) not null PRIMARY KEY,
    nombre_usuario text(40) not null,
    password_usuario varchar(45) not null,
    correo_usuario varchar(45) not null,
    fr_usuario timestamp null,
    rol_usuario varchar(20) not null)
ENGINE = InnoDB;

create table if not exists periodico.CATEGORIAS(
    id_categoria int(3) not null PRIMARY KEY,
    nom_categoria varchar(15) not null,
    publicaciones_categoria int(4) null)
ENGINE = InnoDB;

create table if not exists periodico.NOVEDADES(
    id_novedad int(5) not null PRIMARY KEY,
    titulo_novedad text (20) not null,
    mensaje_novedad varchar(300) not null,
    categoria_novedad int(3) not null,
    CONSTRAINT categorianovedad
	    FOREIGN KEY (categoria_novedad)
        REFERENCES periodico.CATEGORIAS(id_categoria)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION)
ENGINE = InnoDB;

create table if not exists periodico.TEMAS(
    id_tema int(4) not null PRIMARY KEY,
    autor_tema int(10) not null,
    titulo_tema varchar(30) not null,
    mensaje_tema varchar(700) not null,
    CONSTRAINT autortema
	    FOREIGN KEY(autor_tema)
        REFERENCES periodico.USUARIOS(id_usuario)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION)
ENGINE = InnoDB;

CREATE TABLE if not exists periodico.POSTS_ADMIN (
    id_post INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(400) NOT NULL,
    contenido TEXT NOT NULL,
    autor_post VARCHAR(50),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
)
ENGINE = InnoDB;

CREATE TABLE if not exists periodico.POSTS_TRABS (
    id_post INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(400) NOT NULL,
    descripcion TEXT NOT NULL,
    materia varchar(20) not null,
    nombre_original VARCHAR(255) NOT NULL,
    nombre_guardado VARCHAR(255) NOT NULL,
    autor_post VARCHAR(50),
    ruta VARCHAR(500) NOT NULL,
    tipo_mime VARCHAR(100),
    tamaño INT,
    fecha_subida DATETIME DEFAULT CURRENT_TIMESTAMP
)
ENGINE = InnoDB;


create table if not exists periodico.PUBLICACIONES(
    id_publicacion int(9) not null PRIMARY KEY,
    autor_publicacion int(10) not null,
    categoria_publicacion int(3) not null,
    nombre_publicacion varchar(45) not null,
    curso_publicacion int(1) not null,
    adjunto_publicacion BLOB null,
    valoracion_publicacion decimal(2) null,
    fecha_publicacion timestamp null,
CONSTRAINT autorpublicacion
	FOREIGN KEY (autor_publicacion)
    REFERENCES periodico.USUARIOS (id_usuario)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION,
CONSTRAINT categoriapublicacion
	FOREIGN KEY (categoria_publicacion)
    REFERENCES periodico.CATEGORIAS (id_categoria)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION)
ENGINE = InnoDB;
----------------------------------------------------------------------------------------------
insert into periodico.USUARIOS (id_usuario, nombre_usuario, password_usuario, correo_usuario, rol_usuario)
values ("1043659980", "William Garcia", "v3si38", "willian.garcia@gmail.com", "Estudiante");

update periodico.USUARIOS SET fr_usuario = timestamp(now()) WHERE (id_usuario=1043659980);

Create user "William García" Identified by "v3si38";
