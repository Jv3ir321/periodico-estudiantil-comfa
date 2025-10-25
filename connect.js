const mysql = require("mysql");

const conexion = mysql.createConnection({
    host:"localhost",
    database:"periodico",
    user:"root",
    password:""
});

conexion.connect( (err)=> {
    if (err) {
        throw err
    } else {
        console.log("Conexion satisfactoria")
    }
});

