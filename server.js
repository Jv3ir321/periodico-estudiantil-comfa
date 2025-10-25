// IMPORTE DE LIBRERIAS A NODEJS

const bcrypt = require('bcrypt')
const session = require('express-session')
const express = require("express");
const app = express();
const path = require('path');
const mysql = require("mysql");
const multer  = require('multer');
const { log } = require('console');
const MySQLStore = require('express-mysql-session')(session);
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })


const conexion = mysql.createConnection({
    host:"localhost",
    database:"periodico",
    user:"nodeuser",
    password:"12345"
});

conexion.connect((err) => {
    if (err) {
        throw err
    } else {
        console.log("Conexion satisfactoria")
    }
});

const SESSION_MAX = 7 * 24 * 60 * 60 * 1000 // 7 días


const sessionStore = new MySQLStore({
  host: 'localhost',
  port: 3306,
  user: 'nodeuser',
  password: '12345',
  database: 'periodico',
  clearExpired: true,
  checkExpirationInterval: 900000, // 15 minutos
  expiration: SESSION_MAX,
    createDatabaseTable: true,
});

// PARAMETROS DE LA APP
app.use(session({
    key: 'session_cookie_name',
    secret: "tu_contraseña",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: SESSION_MAX,
        httpOnly: true,
        secure: false, // Cambia a true en prduccion 
        sameSite: 'lax'
    }
}));

app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// DIRECTORIOS

app.get("/", (req, res) => {
    if (!req.session.login) {
        res.render("login")
    } else {
        res.redirect("/inicio")
    }
    
});

app.get("/inicio", (req, res) => {
    if (!req.session.login) {
        res.redirect("/")
    } else if (req.session.rolusr === "Administrador") {
        res.render("inicioadmin", {datos1: req.session})
    } else {
        res.render("inicio", {datos1: req.session})
    }
})

app.get("/registro", (req, res) => {
    if (!req.session.login) {
        res.redirect("/")
    } else if (req.session.rolusr === "Administrador") {
        res.render("registro", {datos1: req.session})
    } else {
        res.redirect("/inicio")
    }
})

app.get("/foro", (req, res) => {
    if (!req.session.login) {
        res.redirect("/")
    } else {
        const consulta = "SELECT * FROM PUBLICACIONES WHERE estado = 'aprobado' ORDER BY id_publicacion DESC";
        
        conexion.query(consulta, (err, publicaciones) => {
            if (err) {
                console.log("Error al obtener publicaciones:", err)
                return res.status(500).send("Error al cargar publicaciones")
            } else {
                res.render("foro", {datos1: req.session, publicaciones: publicaciones})
            }
            
        })
    }
})

app.get("/novedades", (req, res) => {
    if (!req.session.login) {
        res.redirect("/")
    } else {
        const consulta1 = "SELECT * FROM POSTS_ADMIN ORDER BY id_post DESC"

        conexion.query(consulta1, (err, posts) => {
            if(err){
                console.log("Error al obtener los posts:", err)
                return res.status(500).send("Error al cargar publicaciones")
            }
            
            if (req.session.rolusr === "Administrador") {
                res.render("novedadesadmin", {datos1: req.session, posts: posts})
            } else {
                res.render("novedades", {datos1: req.session, posts: posts})
            }
        })
    }
})

app.get("/subir-trabajos", (req, res) => {
    if (!req.session.login) {
        res.redirect("/")
    } else {
        res.render("subir-trabajos", {datos1: req.session})
    }
})

app.get("/trabajos", (req, res) => {
       if (!req.session.login) {
           res.redirect("/")
       } else {
           const consulta = "SELECT * FROM POSTS_TRABS ORDER BY fecha_subida DESC";
           
           conexion.query(consulta, (err, trabajos) => {
               if (err) {
                   console.log("Error al obtener trabajos:", err)
                   return res.status(500).send("Error al cargar trabajos")
               }
               
               res.render("trabajos", {datos1: req.session, trabajos: trabajos})
           })
       }
   })


app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log("Error al cerrar sesión", err)
        }
        res.redirect("/")
    })
})

app.get("/reqadmin", (req, res) => {
    if (!req.session.login) {
        res.redirect("/")
    } else if (req.session.rolusr === "Administrador") {
        const consulta = "SELECT * FROM PUBLICACIONES_REQADMIN ORDER BY fecha_publicacion DESC";
        
        conexion.query(consulta, (err, publicaciones_reqadmin) => {
            if (err) {
                console.log("Error al obtener publicaciones pendientes:", err)
                return res.status(500).send("Error al cargar publicaciones")
            }
            
            res.render("reqadmin", {datos1: req.session, publicaciones_reqadmin: publicaciones_reqadmin})
        })
    } else {
        res.redirect("/inicio")
    }
})

// POSTS EXPRESS
app.post("/validar", async (req, res) => {
    const datos = req.body; 
    let idusuario = datos.id
    let usuario = datos.usuario;
    let correo = datos.mail;
    let password = datos.contraseña;
    let rolusuario = datos.rol;

    try {
        let buscar = "SELECT * FROM USUARIOS WHERE id_usuario = ?";
        
        conexion.query(buscar, [idusuario], async (err, row) => {
            if (err) {
                console.log("Error al buscar usuario:", err)
                return res.status(500).send("Error en el servidor")
            }
            
            if (row.length > 0) {
                console.log("No se puede registrar, identificación ya está en uso")
                return res.render("registro", {error: "La identificación ya está registrada"})
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            let registro = "INSERT INTO USUARIOS (id_usuario, nombre_usuario, password_usuario, correo_usuario, rol_usuario) VALUES(?, ?, ?, ?, ?)";
            
            conexion.query(registro, [idusuario, usuario, hashedPassword, correo, rolusuario], (err) => {
                if (err) {
                    console.log("Error al insertar usuario:", err)
                    return res.status(500).send("Error al registrar usuario")
                }
                
                console.log("Usuario registrado satisfactoriamente")
                res.render("login", {mensaje: "Registro exitoso. Ahora puedes iniciar sesión"})
            })
        })
    } catch (error) {
        console.log("Error en el proceso de registro:", error)
        res.status(500).send("Error en el servidor")
    }
})

app.post("/verLogin", (req, res) => {
    const datos = req.body;
    let correo = datos.correo
    let password = datos.contraseña

    if (!correo || !password) {
        return res.render("login", {error: "Por favor complete todos los campos"})
    }

    const validar = "SELECT * FROM USUARIOS WHERE correo_usuario = ?";
    
    conexion.query(validar, [correo], async (err, rows) => {
        if (err) {
            console.log("Error al validar el correo:", err)
            return res.status(500).send("Error en el servidor")
        }             
           
        if (rows.length < 1) {
            return res.render("login", {error: "Correo no registrado"})
        }
        
        const user = rows[0]
        
        try {
            const match = await bcrypt.compare(password, user.password_usuario);

            if (!match) {
                return res.render("login", {error: "Contraseña incorrecta"})
            }
            
            req.session.login = true
            req.session.id = user.id_usuario
            req.session.nomusr = user.nombre_usuario
            req.session.mailusr = user.correo_usuario
            req.session.frusr = user.fr_usuario
            req.session.rolusr = user.rol_usuario
            req.session.cookie.maxAge = SESSION_MAX

            console.log("Inicio de sesión exitoso:", req.session.nomusr)
            res.redirect("/inicio")
            
        } catch (error) {
            console.log("Error al comparar contraseñas:", error)
            return res.status(500).send("Error en el servidor")
        }
    })
})

app.post("/enviar", (req, res) => {
    const datapub = req.body

    let titulo = datapub.titulo;
    let mensaje = datapub.mensaje;

    if (req.session.rolusr === "Administrador") {
        const consultaEnviar = "INSERT INTO PUBLICACIONES (autor_publicacion, nombre_publicacion, contenido_publicacion) VALUES (?, ?, ?)";
        conexion.query(consultaEnviar, [req.session.nomusr, titulo, mensaje], (err) => {
            if (err) {
                console.log("Ha ocurrido un error al publicar", err);
                return res.status(500).send("Error al publicar");
            } else{
                console.log("Mensaje enviado correctamente")
                res.redirect("/foro")
            } 
        });
    } else {
        const publi = "INSERT INTO PUBLICACIONES_REQADMIN(autor_publicacion, nombre_publicacion, contenido_publicacion) VALUES(?, ?, ?)";

        conexion.query(publi, [req.session.nomusr, titulo, mensaje], (err) => {
            if (err) {
            console.log("Error al enviar mensaje:", err);
            return res.status(500).send("Error al publicar");
        } else {
            console.log("Mensaje enviado correctamente");
            res.redirect("/foro");
        }
    })
    }

    
})

app.post("/publicar", (req, res)=>{
    const databod = req.body
    let titulo = databod.titulopub
    let contenido = databod.mensajepub

    const consult = "INSERT INTO POSTS_ADMIN(titulo, contenido, autor_post) VALUES(?, ?, ?)"
    conexion.query(consult, [titulo, contenido, req.session.nomusr], (err) => {
        if(err){
            console.log("Error al enviar el mensaje", err)
            return res.status(500).send("Error al publicar")
        } else {
            console.log("Publicado Correctamente")
            res.redirect("/novedades")
        }
    })
})

app.post("/upload",upload.single('archivostrab'), (req, res)=>{

    const archdata = req.file
    const datatrab = req.body

    let titulotrab = datatrab.titulotrab
    let materia = datatrab.materia
    let descripcion = datatrab.trabajodesc

    let nomorig = archdata.originalname
   // let nomsaved = archdata.filename
    let rutafile = archdata.path
    let mimetype = archdata.mimetype
    let sizefile = archdata.size

    
    const consulta2 = 
    "INSERT INTO POSTS_TRABS(titulo, descripcion, materia, nombre_original, autor_post, ruta, tipo_mime, tamaño) VALUES(?,?,?,?,?,?,?,?)"
    conexion.query(consulta2,[titulotrab, descripcion, materia, nomorig, req.session.nomusr, rutafile, mimetype, sizefile], (err) => {

        if (err) {
            console.log("Error al enviar archivo", err)
            return res.status(500).send("Error al enviar")
        } else {
            console.log("Enviado con exito")
            res.redirect("/trabajos")
        }
    } )
})

app.post("/aprobar-publicacion", (req, res) => {
    if (!req.session.login || req.session.rolusr !== "Administrador") {
        return res.redirect("/")
    }

    const id_publicacion = req.body.id_publicacion;

    // Primero obtener los datos de la publicación pendiente
    const consultaObtener = "SELECT * FROM PUBLICACIONES_REQADMIN WHERE id_publicacion = ?";
    
    conexion.query(consultaObtener, [id_publicacion], (err, rows) => {
        if (err) {
            console.log("Error al obtener publicación:", err)
            return res.status(500).send("Error al procesar solicitud")
        }

        if (rows.length === 0) {
            return res.status(404).send("Publicación no encontrada")
        }

        const publicacion = rows[0];

        // Insertar en la tabla PUBLICACIONES
        const consultaInsertar = "INSERT INTO PUBLICACIONES (autor_publicacion, nombre_publicacion, contenido_publicacion) VALUES (?, ?, ?)";
        
        conexion.query(consultaInsertar, [publicacion.autor_publicacion, publicacion.nombre_publicacion, publicacion.contenido_publicacion], (err) => {
            if (err) {
                console.log("Error al aprobar publicación:", err)
                return res.status(500).send("Error al aprobar publicación")
            }

            // Eliminar de la tabla de solicitudes
            const consultaEliminar = "DELETE FROM PUBLICACIONES_REQADMIN WHERE id_publicacion = ?";
            
            conexion.query(consultaEliminar, [id_publicacion], (err) => {
                if (err) {
                    console.log("Error al eliminar solicitud:", err)
                }
                
                console.log("Publicación aprobada exitosamente")
                res.redirect("/reqadmin")
            })
        })
    })
})

app.post("/rechazar-publicacion", (req, res) => {
    if (!req.session.login || req.session.rolusr !== "Administrador") {
        return res.redirect("/")
    }

    const id_publicacion = req.body.id_publicacion;

    const consultaEliminar = "DELETE FROM PUBLICACIONES_REQADMIN WHERE id_publicacion = ?";
    
    conexion.query(consultaEliminar, [id_publicacion], (err) => {
        if (err) {
            console.log("Error al rechazar publicación:", err)
            return res.status(500).send("Error al rechazar publicación")
        }
        
        console.log("Publicación rechazada exitosamente");
        res.redirect("/reqadmin");
    })
})

app.post("/eliminar",(req, res) => {
    if (!req.session.login) {
        return res.redirect("/foro")        
    }

    const id_publicacion = req.body.id_publicacion

    const consultaVerificar = "SELECT autor_publicacion FROM PUBLICACIONES WHERE id_publicacion = ?"
    conexion.query(consultaVerificar, [id_publicacion], (err, resultado) => {
        if (err) {
            console.log("Error al obtener peticion")
            res.status(500).send("Error al obtener peticion", err)
        } 

        if (resultado.length === 0) {
            console.log("Trabajo no encontrado")
            res.status(500).send("Trabajo no encontrado", err)
        }

        const autorPublicacion = resultado[0].autor_publicacion

        if (req.session.rolusr === "Administrador" || req.session.nomusr === autorPublicacion) {
        
            const consultaEliminarPost = "DELETE FROM PUBLICACIONES WHERE id_publicacion = ?";

            conexion.query(consultaEliminarPost, [id_publicacion], (err) => {

                if (err) {
                    console.log("Error al eliminar el post", err)
                    return res.status(500).send("Error al rechazar publicación")
                } else {
                    console.log("Publicacion eliminada con exito")
                    res.redirect("/foro")
                }
            })
        }  
    })
})


app.post("/eliminartrabajo", (req, res) => {
     if (!req.session.login) {
        return res.redirect("/trabajos")        
    } 

    const id_post = req.body.id_post

    const consultaVerificar = "SELECT autor_post FROM POSTS_TRABS WHERE id_post = ?"

    conexion.query(consultaVerificar, [id_post], (err, resultado) => {
        if (err) {
            console.log("Error al obtener peticion")
            res.status(500).send("Error al verificar")
        } 

        if (resultado.length === 0) {
            console.log("Trabajo no encontrado")
            res.status(404).send("Trabajo no encontrado")
        }
    
    const autorTrabajo = resultado[0].autor_post

    if (req.session.rolusr === "Administrador" || req.session.nomusr === autorTrabajo) {

    const consultaEliminarTrabajo = "DELETE FROM POSTS_TRABS WHERE id_post = ?"
    
    conexion.query(consultaEliminarTrabajo, [id_post], (err) => {
        if (err) {
            console.log("Error al eliminar el trabajo")
            res.status(500).send("Error al rechazar publicacion")
        } else {
            console.log("Trabajo eliminado con exito")
            res.redirect("/trabajos")
        }
    })
    } else {
        res.redirect("/trabajos")
    }

    })
})

app.post("/eliminarnovedad", (req,res) => {
  if (!req.session.login) {
    return res.redirect("/")
  }
  
  const id_post = req.body.id_post;

  const validarNovedad = "SELECT titulo FROM POSTS_ADMIN WHERE id_post = ?"
  conexion.query(validarNovedad, [id_post], (err, rows) => {
    if (err) {
      console.log("Error al obtener peticion")
     return res.status(500).send("Error al obtener la novedad")
    }
    
    let row = rows[0]

    if (row.length === 0) {
     console.log("Novedad no encontrada")
     return res.status(404).send("Novedad no encontrada")
    }
    
    const eliminarNovedad = "DELETE FROM POSTS_ADMIN WHERE id_post = ?"
    
    conexion.query(eliminarNovedad, [id_post], (err) => {
      if (err) {
        console.log("Ha ocurrido un error", err)
        return res.status(500).send("Error al eliminar la novedad")
      } else {
        console.log("Se ha eliminado la novedad con exito") 
        res.redirect("/novedades")
      }
    } )

  } )

})


app.listen(4000, () => {
    console.log("Servidor creado en http://localhost:4000")
});
