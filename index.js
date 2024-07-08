import express from 'express';
import pool from './config/db.js';//cuando se importa se coloca la extencion
import 'dotenv/config'

const app = express();
const puerto = process.env.PORT || 3000;//puerto dinamico para el deploy
//en package.json requiere "scripts": {
    //"start": "node index.js", requerido para iniciar el deploy


// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //toma informacion de formularios. req.body

app.use(express.static('public'))

// app.get('/', (req, res) => {
//     res.status(200).send('Estoy vivo :p');
// });

//--seccion usuarios--

app.get('/usuarios', async (req, res) => {
    const sql = 'SELECT * FROM usuarios'
    
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(sql);
        connection.release();
        res.json(rows);
    } catch (err) {
        res.send(500).send('Hubo un error al consultar la base de datos');
    }
});


    app.get('/usuarios/:id', async (req, res) => {
        const id = req.params.id
        const sql = 'SELECT * FROM usuarios WHERE id_usuario = ?';

        try {
            const connection = await pool.getConnection();
            const [rows] = await connection.query(sql, [id]);
            connection.release();
            if (rows.length === 0) {
                res.status(404).send('Usuario no encontrado');
            } else {
                console.log("UN USUARIO", rows[0])
                res.json(rows[0]);
            }
        } catch (err) {
            res.send(500).send('Hubo un error al consultar la base de datos');
        }
    });


app.post('/usuarios', async (req, res) => {
    const userData = req.body;
    
    const sql = 'INSERT INTO usuarios SET ?'; // (name, lastname, mail, password, tipo_usuario) VALUES (?, ?, ?, ?, ?)';
    
    
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(sql, [userData]);;
        connection.release();
        res.send(`
            <h1>Usuario creado con id:' ${rows.insertId}</h1>
                `);
     
    } catch (err) {
        res.send(500).send('Hubo un error al consultar la base de datos');
    }
    
});



    app.put('/usuarios/:id', async (req, res) => {
        const id = req.params.id;
        const userData = req.body; 
        
        const sql = 'UPDATE usuarios SET ? WHERE id = ?';
        
        
        try {
            const connection = await pool.getConnection();
            const [rows] = await connection.query(sql, [userData, id]);
            connection.release();
            console.log(rows)
            res.send(`
                <h1>Usuario actualizado con id:' ${id}</h1>
                    `);
        } catch (err) {
            res.send(500).send('Hubo un error al consultar la base de datos');
        }
    });


app.delete('/usuarios/borrar/:id', async (req, res) => {
        const id = req.params.id;
        const sql = 'DELETE FROM usuarios WHERE id = ?';
    
        try {
            const connection = await pool.getConnection();
            const [rows] = await connection.query(sql, [id]);
            connection.release();
            if (rows.affectedRows === 0) {
                res.send(404).send('User not found');
            } else {
                console.log(rows)
                res.send(`
                    <h1>Usuario borrado con id:' ${id}</h1>
                        `);
            }
        } catch (err) {
            res.send(500).send('Hubo un error al consultar la base de datos');
        }
 
});

//--seccion aprender--
// leer todos los registros
app.get('/aprender', async (req, res) => {//async para manejar promesas con try and carch
    
    try {
        const connection = await pool.getConnection();//getConnection es una promesa pendiente
        const sql = 'SELECT * FROM aprender'
        const [rows, fields] = await connection.query(sql);
        //hace una destructuracion en filas y capos.
        //console.log("FIELDS -->", fields)
        // `id_aprender` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        // `titulo` VARCHAR(100) NOT NULL,
        // `cuerpo` VARCHAR(6000) NOT NULL,
        // `imagen` VARCHAR(1000) NOT NULL
        connection.release();
        res.json(rows);//devuelve un arrary de objetos
    } catch (err) {
        console.error('Error al consultar la base de datos:', err);
        res.status(500).send('Error al consultar la base de datos');
    }
});

//presentar un articulo en particular
app.get('/aprender/:id', async (req, res) => {
        try {
            const connection = await pool.getConnection();
            const id = req.params.id;//arry que va a reemplasar por los signo de preguntas
            const sql = 'SELECT * FROM aprender WHERE id_aprender = ?';

            const [rows, fields] = await connection.query(sql, [id]);
            connection.release();
            if (rows.length === 0) {//array generado, rows, de longitud cero
                res.status(404).send('Articulo no encontrado');
            } else {
                res.json(rows[0]);
            }
        } catch (err) {
            console.error('Error al consultar la base de datos:', err);
            res.status(500).send('Error al consultar la base de datos');
        }
});

//insertar un articulo
app.post('/aprender', async (req, res) => {//obtiene los datros del form enviados con post
    try {
        const connection = await pool.getConnection();

        const userData = req.body; // toma la info del formulario en orden a como es enviado
  
        const sql = 'INSERT INTO aprender SET ?'; // set permite utilizar un solo gino en lugar de (nombre, email, password, rol) VALUES (?, ?, ?, ?)';
        const [rows] = await connection.query(sql, [userData]);//al utilizar set un solo signo reemplaza todos los calores de la var userData
        connection.release();
        res.json({mensaje: 'Articulo creado', id: rows.insertId});
        //redireccion a un frontend de confirmacion
       // res.redirect('/users.html' + "?mensaje=Usuario creado");
    } catch (err) {
        console.error('Error al consultar la base de datos:', err);
        res.status(500).send('Error al consultar la base de datos');
    }
    
});

//actualizar un registro
app.put('/aprender/:id', async (req, res) => {//obtiene los datos del registro y se actualiza con update
        try {
            const connection = await pool.getConnection();

            const id = req.params.id; //toma el id de la dire
            const userData = req.body; // toma la info del formulario
            
            const sql = 'UPDATE aprender SET ? WHERE id_aprender = ?'; //requiere set luego id
            const [rows] = await connection.query(sql, [userData, id]);//reemplaza set luego id
            connection.release();
            res.json({ mensaje: 'Articulo actualizado'});
        } catch (err) {
            console.error('Error al consultar la base de datos:', err);
            res.status(500).send('Error al consultar la base de datos');
        }
});

//borrar un registro
app.delete('/aprender/borrar/:id', async (req, res) => {//en la url se especifica el id que luego con sql se borra utilizando delete
//con un link q direccione se ejecuta el borrado    
        try {
            const connection = await pool.getConnection();
            const id = req.params.id;
            const sql = 'DELETE FROM aprender WHERE id_aprender = ?';
            const [rows] = await connection.query(sql, [id]);
            connection.release();
            if (rows.affectedRows === 0) {
                res.status(404).send('Articulo no encontrado');
            } else {
                res.json({ mensaje: 'Articulo eliminado' });
            }
        } catch (err) {
            console.error('Error al consultar la base de datos:', err);
            res.status(500).send('Error al consultar la base de datos');
        }
 
});

//--seccion noticias--
//Leer
app.get('/noticias', async (req, res) => {
    
    try {
        const connection = await pool.getConnection();
        const sql = 'SELECT * FROM noticias'
        const [rows, fields] = await connection.query(sql);
        connection.release();
        res.json(rows);
    } catch (err) {
        console.error('Error al consultar la base de datos:', err);
        res.status(500).send('Error al consultar la base de datos');
    }
});

//insert
app.post('/noticias', async (req, res) => {
    try {
        const connection = await pool.getConnection();

        const userData = req.body; 
  
        const sql = 'INSERT INTO noticias SET ?'; 
        const [rows] = await connection.query(sql, [userData]);
        connection.release();
        res.json({mensaje: 'noticia agregada', id: rows.insertId});

    } catch (err) {
        console.error('Error al consultar la base de datos:', err);
        res.status(500).send('Error al consultar la base de datos');
    }    
});

//actulizar
app.put('/noticias/:id', async (req, res) => {
    try {
        const connection = await pool.getConnection();

        const id = req.params.id; 
        const userData = req.body; 
        
        const sql = 'UPDATE noticias SET ? WHERE id_noticia = ?'; 
        const [rows] = await connection.query(sql, [userData, id]);
        connection.release();
        if (rows.affectedRows === 0) {
            res.status(404).send('Noticia no encontrada');
        } else {
            res.json({ mensaje: 'Noticia actulizada' });
        }
    } catch (err) {
        console.error('Error al consultar la base de datos:', err);
        res.status(500).send('Error al consultar la base de datos');
    }
});

//borrar

app.delete('/noticias/borrar/:id', async (req, res) => {   
    try {
        const connection = await pool.getConnection();
        const id = req.params.id;

        const sql = 'DELETE FROM noticias WHERE id_noticia = ?';
        const [rows] = await connection.query(sql, [id]);
        connection.release();
        if (rows.affectedRows === 0) {
            res.status(404).send('Noticia no encontrada');
        } else {
            res.json({ mensaje: 'Noticia eliminada' });
        }
    } catch (err) {
        console.error('Error al consultar la base de datos:', err);
        res.status(500).send('Error al consultar la base de datos');
    }     
});

app.listen(puerto, () => {
    console.log('Server is running on port: ', puerto);
});