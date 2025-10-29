// ========== IMPORTACIÓN DE DEPENDENCIAS ==========
const bcrypt = require('bcrypt')           // Para encriptar contraseñas
const session = require('express-session') // Manejo de sesiones
const express = require("express");        // Framework web
const app = express();
const path = require('path');             // Manejo de rutas
const mysql = require("mysql");           // Base de datos MySQL
const multer = require('multer');         // Manejo de archivos
const { log } = require('console');
const MySQLStore = require('express-mysql-session')(session);

// ========== CONFIGURACIÓN DE MULTER PARA SUBIDA DE ARCHIVOS ==========
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './uploads'),
    filename: (req, file, cb) => cb(null, file.originalname)
})
const upload = multer({ storage: storage })

// ========== CONFIGURACIÓN DE BASE DE DATOS ==========
const conexion = mysql.createConnection({
    host: "localhost",
    database: "periodico",
    user: "nodeuser",
    password: "12345"
});

// Verificar conexión
conexion.connect((err) => {
    if (err) throw err;
    console.log("Conexión a MySQL satisfactoria")
});

// ========== CONFIGURACIÓN DE SESIONES ==========
const SESSION_MAX = 7 * 24 * 60 * 60 * 1000 // 7 días en milisegundos

// Configurar almacenamiento de sesiones en MySQL
const sessionStore = new MySQLStore({
    host: 'localhost',
    port: 3306,
    user: 'nodeuser',
    password: '12345',
    database: 'periodico',
    clearExpired: true,
    checkExpirationInterval: 900000, // Limpiar sesiones expiradas cada 15 min
    expiration: SESSION_MAX,
    createDatabaseTable: true,
});

// ========== MIDDLEWARE Y CONFIGURACIÓN DE EXPRESS ==========
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
        secure: false, // Cambiar a true en producción (HTTPS)
        sameSite: 'lax'
    }
}));

// Configuración de parser y archivos estáticos
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuración del motor de vistas
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");

if (process.env.NODE_ENV !== 'production') {
    app.disable('view cache');
}

// ========== RUTAS GET ==========
// Middleware de autenticación
const requireLogin = (req, res, next) => {
    if (!req.session.login) {
        return res.redirect("/")
    }
    next();
}

// Ruta raíz - Login
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
// 26/10/25 Detalle de publicación en foro  feat(server.js) -Se agrega ruta para detalle de publicacion -Se agrega vista foro-detalle.ejs
app.get("/foro/:nombre_publicacion", (req, res) => {
    if (!req.session.login) {
        res.redirect("/")
    } else {
        const consulta = "SELECT * FROM PUBLICACIONES WHERE nombre_publicacion = ?";

        conexion.query(consulta, [req.params.nombre_publicacion], (err, rows) => {
            if (err) {
                console.log("Error al obtener publicación:", err)
                return res.status(500).send("Error al cargar publicación")
            }

            publicacion = rows[0]

            if (!publicacion) {
                return res.status(404).send("Publicación no encontrada")
            }
            const id_publicacion = publicacion.id_publicacion
            const consultaRespuestas = "SELECT * FROM RESPUESTAS_FORO WHERE id_publicacion = ? ORDER BY fecha_respuesta ASC";

            conexion.query(consultaRespuestas, [id_publicacion], (err, response) => {
                if (err) {
                    console.log("Error al obtener respuestas:", err)
                    return res.status(500).send("Error al cargar respuestas")
                } if (!response) {
                    return res.status(404).send("Respuestas no encontradas")
                }
                
                const respuestas = response;

                res.render("foro-detalle", {datos1: req.session, publicacion: publicacion, respuestas: respuestas})
            })
        })
    }
})

app.get("/usuarios/:nombre_usuario", (req, res) => {
    if (!req.session.login) {
        res.redirect("/")
    } else {

        const nombre_usuario = req.params.nombre_usuario;

        const consultaPublicaciones = "SELECT * FROM PUBLICACIONES WHERE autor_publicacion = ? ORDER BY fecha_publicacion DESC";
        
        const consultaPendientes = "SELECT * FROM PUBLICACIONES_REQADMIN WHERE autor_publicacion = ? ORDER BY fecha_publicacion DESC";
        
        const consultaTrabajos = "SELECT * FROM POSTS_TRABS WHERE autor_post = ? ORDER BY fecha_subida DESC";

        // Ejecutar las tres consultas
        conexion.query(consultaPublicaciones, [nombre_usuario], (err, publicaciones) => {
            if (err) {
                console.log("Error al obtener publicaciones:", err);
                return res.status(500).send("Error al cargar publicaciones");
            }

            conexion.query(consultaPendientes, [nombre_usuario], (err, publicacionesPendientes) => {
                if (err) {
                    console.log("Error al obtener publicaciones pendientes:", err);
                    return res.status(500).send("Error al cargar publicaciones pendientes");
                }

                conexion.query(consultaTrabajos, [nombre_usuario], (err, trabajos) => {
                    if (err) {
                        console.log("Error al obtener trabajos:", err);
                        return res.status(500).send("Error al cargar trabajos");
                    }

                    // Calcular estadísticas
                    const stats = {
                        totalPublicaciones: publicaciones.length + publicacionesPendientes.length,
                        aprobadas: publicaciones.length,
                        pendientes: publicacionesPendientes.length,
                        trabajos: trabajos.length
                    };

                    res.render("usuarios", {
                        datos1: req.session,
                        publicaciones: publicaciones,
                        publicacionesPendientes: publicacionesPendientes,
                        trabajos: trabajos,
                        stats: stats
                    });
                });
            });
        });
    }
});

// ========== RUTAS POST ==========
// Registro de usuarios
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

// Login de usuarios  
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

// Publicaciones en foro
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

app.post("/editar-post", (req, res) => {
    if (!req.session.login) {
        res.redirect("/")
    }

    const id_publicacion = req.body.id_publicacion;

    const consultaPost = "SELECT * FROM PUBLICACIONES WHERE id_publicacion = ?"

    conexion.query(consultaPost, [id_publicacion], (err, rows) => {
        if (err) {
            console.log("Hubo un error al encontrar la publicacion")
            res.status(500).send("Hubo un error", err)
        } 

        let publicacion = rows[0];

        if (publicacion.length === 0) {
            console.log("La publicacion no existe")
            res.status(500).send("La publicacion no existe")
        } else {
            if (req.session.rolusr === "Administrador" || req.session.nomusr === publicacion.autor_publicacion) {
                res.render("editar-post", {datos1: req.session, publicacion: publicacion})
            } else {
                res.redirect("/foro")
            }   
        }
});

app.post("/guardar-cambios", (req, res) => {
    if (!req.session.login) {
        res.redirect("/")
    } 
      const data = req.body
            let nuevoTitulo = data.nuevo_titulo
            let nuevoContenido = data.nuevo_contenido

            const consultaActualizar = "UPDATE PUBLICACIONES SET nombre_publicacion = ?, contenido_publicacion = ? WHERE id_publicacion = ?"
            conexion.query(consultaActualizar, [nuevoTitulo, nuevoContenido, id_publicacion], (err) => {
                if (err) {
                    console.log("Error al actualizar la publicacion", err)
                    res.status(500).send("Error al actualizar la publicacion")
                } else {
                    console.log("Publicacion actualizada con exito")
                    res.redirect("/foro")
                }
            })
    })
});

app.post("/responder", (req, res) => {
    if (!req.session.login) {
        res.redirect("/")
    }
    const nombre_publicacion = req.body.nombre_publicacion;
    const id_publicacion = req.body.id_publicacion;
    const contenido_respuesta = req.body.contenido_respuesta;

    const consultaInsertarRespuesta = "INSERT INTO RESPUESTAS_FORO (id_publicacion, contenido_respuesta, autor_respuesta) VALUES (?, ?, ?)"
    conexion.query(consultaInsertarRespuesta, [id_publicacion, contenido_respuesta, req.session.nomusr], (err) => {
        if (err) {
            console.log("Error al insertar la respuesta", err)
            res.status(500).send("Error al insertar la respuesta")
        } else {
            console.log("Respuesta insertada con exito")
            res.redirect("/foro/" + nombre_publicacion)
        }
    })
});






// ========== INICIAR SERVIDOR ==========   
app.listen(5500, () => {
    console.log(`Servidor creado en http://localhost:5500`);
});
