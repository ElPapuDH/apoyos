const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const puerto = 3030; 

const corsOptions = {
    origin: '*', // Permitir cualquier origen
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
};

app.use(cors(corsOptions));
app.use(express.json());


const dbConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: '3521321522',
    database: 'Presidencia'
};

// Conexión a la base de datos
const connectDB = async () => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Conectado a la base de datos MySQL');
        return connection;
    } catch (err) {
        console.error('Error conectando a la base de datos:', err);
    }
};

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente. Usa /api/registros para las solicitudes POST y GET.');
});

// Modificar la ruta para insertar datos en la tabla "apoyos"
app.post('/api/registros', async (req, res) => {
    const connection = await connectDB();
    const {
        Registro, id_usuario, Fecha, Nombre, Domicilio_Calle, Colonia_Comunidad,
        Seccion, Contacto, TipoDeApoyo, Descripcion_Apoyo, Status,
        Monto_Autorizado, Otro_Tipo_De_Ayuda, Turnado_A, Historial, Nube, Observaciones
    } = req.body;

    const query = `INSERT INTO apoyos (Registro, id_usuario, Fecha, Nombre, Domicilio_Calle,
                   Colonia_Comunidad, Seccion, Contacto, TipoDeApoyo, Descripcion_Apoyo,
                   Status, Monto_Autorizado, Otro_Tipo_De_Ayuda, Turnado_A, Historial, Nube, Observaciones) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;


    try {
        const [result] = await connection.execute(query, [Registro, id_usuario, Fecha, Nombre, Domicilio_Calle,
            Colonia_Comunidad, Seccion, Contacto, TipoDeApoyo, Descripcion_Apoyo, Status,
            Monto_Autorizado, Otro_Tipo_De_Ayuda, Turnado_A, Historial, Nube, Observaciones]);
        res.status(201).json({ message: 'Registro guardado exitosamente', id: result.insertId });
    } catch (err) {
        console.error('Error al insertar registro:', err);
        res.status(500).json({ error: 'Error al guardar el registro' });
    } finally {
        await connection.end();
    }
});

// Nueva ruta para verificar duplicados
app.get('/api/registros/validate', async (req, res) => {
    const connection = await connectDB();
    const { Domicilio_Calle, Colonia_Comunidad, Registro } = req.query;

    // Normaliza las entradas para la comparación
    const normalizedCalle = Domicilio_Calle.toLowerCase().trim().replace(/\s+/g, ' ');
    const normalizedColonia = Colonia_Comunidad.toLowerCase().trim().replace(/\s+/g, ' ');

    const query = `SELECT COUNT(*) AS count FROM apoyos 
                   WHERE (LOWER(TRIM(REPLACE(Domicilio_Calle, ' ', ' '))) = ? 
                   AND LOWER(TRIM(REPLACE(Colonia_Comunidad, ' ', ' '))) = ?) 
                   OR (Registro = ?)`;

    try {
        const [results] = await connection.execute(query, [normalizedCalle, normalizedColonia, Registro]);
        const exists = results[0].count > 0;
        res.status(200).json({ exists });
    } catch (err) {
        console.error('Error al verificar registro:', err);
        res.status(500).json({ error: 'Error al verificar el registro' });
    } finally {
        await connection.end();
    }
});

// Nueva ruta GET para obtener todos los registros
app.get('/api/registros', async (req, res) => {
    const connection = await connectDB();
    const query = 'SELECT * FROM apoyos';

    try {
        const [rows] = await connection.execute(query);
        res.status(200).json(rows);
    } catch (err) {
        console.error('Error al obtener registros:', err);
        res.status(500).json({ error: 'Error al obtener los registros' });
    } finally {
        await connection.end();
    }
});

// Ruta para eliminar un registro
app.delete('/api/registros/:id', async (req, res) => {
    const connection = await connectDB();
    const registroId = req.params.id;
    const query = 'DELETE FROM apoyos WHERE Registro = ?';

    try {
        const [result] = await connection.execute(query, [registroId]);
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Registro no encontrado' });
            return;
        }
        res.status(200).json({ message: 'Registro eliminado exitosamente' });
    } catch (err) {
        console.error('Error al eliminar registro:', err);
        res.status(500).json({ error: 'Error al eliminar el registro' });
    } finally {
        await connection.end();
    }
});

// Ruta para actualizar un registro
app.put('/api/registros/:id', async (req, res) => {
    const connection = await connectDB();
    const registroId = req.params.id;
    const {
        id_usuario, Fecha, Nombre, Domicilio_Calle, Colonia_Comunidad,
        Seccion, Contacto, TipoDeApoyo, Descripcion_Apoyo, Status,
        Monto_Autorizado, Turnado_A, Historial, Nube, Observaciones
    } = req.body;

    const fechaFormateada = new Date(Fecha).toISOString().split('T')[0];

    const query = `UPDATE apoyos SET 
                   id_usuario = ?, Fecha = ?, Nombre = ?, Domicilio_Calle = ?, Colonia_Comunidad = ?,
                   Seccion = ?, Contacto = ?, TipoDeApoyo = ?, Descripcion_Apoyo = ?, Status = ?,
                   Monto_Autorizado = ?, Turnado_A = ?, Historial = ?, Nube = ?, Observaciones = ?
                   WHERE Registro = ?`;

    try {
        const [result] = await connection.execute(query, [id_usuario, fechaFormateada, Nombre, Domicilio_Calle, Colonia_Comunidad,
            Seccion, Contacto, TipoDeApoyo, Descripcion_Apoyo, Status,
            Monto_Autorizado, Turnado_A, Historial, Nube, Observaciones, registroId]);
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Registro no encontrado' });
            return;
        }
        res.status(200).json({ message: 'Registro actualizado correctamente' });
    } catch (err) {
        console.error('Error al actualizar el registro:', err);
        res.status(500).json({ error: 'Error al actualizar el registro' });
    } finally {
        await connection.end();
    }
});

// Ruta para obtener gastos agrupados para la gráfica
app.get('/api/gastos', async (req, res) => {
    const connection = await connectDB();
    const query = `
        SELECT 
            Seccion,
            SUM(Monto_Autorizado) AS Total,
            DATE_FORMAT(Fecha, '%Y-%m') AS Mes
        FROM 
            apoyos
        GROUP BY 
            Seccion, Mes
        ORDER BY 
            Seccion, Mes
    `;

    try {
        const [rows] = await connection.execute(query);
        res.status(200).json(rows);
    } catch (err) {
        console.error('Error al obtener gastos agrupados:', err);
        res.status(500).json({ error: 'Error al obtener los gastos agrupados' });
    } finally {
        await connection.end();
    }
});

// Ruta para registrar nuevos usuarios
app.post('/api/registro_usuarios', async (req, res) => {
    const connection = await connectDB();
    const { nombre, correo, rol, codigo_acceso, id_usuario } = req.body;

    // Verificar si el correo ya existe
    const emailCheckQuery = 'SELECT * FROM usuarios WHERE correo = ?';
    const [existingUser] = await connection.execute(emailCheckQuery, [correo]);
    if (existingUser.length > 0) {
        return res.status(400).json({ error: 'El correo ya está registrado.' });
    }

    // Asegurarse de que el id_usuario sea nulo para admin o gerente
    let userId = id_usuario; // Tomar id_usuario del cuerpo de la solicitud
    if (rol === 'admin' || rol === 'gerente') {
        userId = null; // No se necesita id_usuario para admin o gerente
    } else if (!userId) {
        return res.status(400).json({ error: 'El id_usuario es requerido para usuarios normales.' });
    }

    // Inserción en la tabla usuarios
    const insertQuery = `INSERT INTO usuarios (id_usuario, nombre, correo, codigo_acceso, rol) 
                         VALUES (?, ?, ?, ?, ?)`;
    try {
        const [result] = await connection.execute(insertQuery, [
            userId, // Asegurarse de que sea nulo si no se proporciona para admin o gerente
            nombre,
            correo,
            codigo_acceso,
            rol,
        ]);
        res.status(201).json({ message: 'Usuario registrado exitosamente', codigo_acceso: codigo_acceso });
    } catch (err) {
        console.error('Error al registrar usuario:', err);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    } finally {
        await connection.end();
    }
});

// Ruta para obtener todos los usuarios registrados
app.get('/api/registro_usuarios', async (req, res) => {
    const connection = await connectDB();

    try {
        // Consulta para obtener todos los usuarios
        const [rows] = await connection.execute('SELECT * FROM usuarios');
        console.log('Usuarios obtenidos:', rows); // Verifica qué datos se obtienen
        res.status(200).json(rows); // Devolver los usuarios en formato JSON
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    } finally {
        await connection.end();
    }
});
// Ruta para eliminar un usuario por ID
app.delete('/api/registro_usuarios/:id', async (req, res) => {
    const connection = await connectDB();
    const { id } = req.params;

    try {
        const [result] = await connection.execute('DELETE FROM usuarios WHERE id = ?', [id]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Usuario eliminado correctamente' });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({ error: 'Error al eliminar el usuario' });
    } finally {
        await connection.end();
    }
});

// Ruta para editar un usuario por ID
app.put('/api/registro_usuarios/:id', async (req, res) => {
    const connection = await connectDB();
    const { id } = req.params;
    const { nombre, correo, rol, codigo_acceso } = req.body;

    try {
        const [result] = await connection.execute(
            'UPDATE usuarios SET nombre = ?, correo = ?, rol = ?, codigo_acceso = ? WHERE id = ?',
            [nombre, correo, rol, codigo_acceso, id]
        );
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Usuario actualizado correctamente' });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ error: 'Error al actualizar el usuario' });
    } finally {
        await connection.end();
    }
});
// Ruta para iniciar sesión
app.post('/api/login', async (req, res) => {
    const connection = await connectDB();
    const { nombre, codigoAcceso } = req.body;

    try {
        // Consulta para verificar si el usuario existe con el nombre y código de acceso proporcionados
        const query = 'SELECT * FROM usuarios WHERE nombre = ? AND codigo_acceso = ?';
        const [rows] = await connection.execute(query, [nombre, codigoAcceso]);

        if (rows.length === 0) {
            // Si no se encuentra un usuario con esos datos, devuelve un error
            return res.status(401).json({ success: false, message: 'Nombre o código de acceso inválido' });
        }

        // Si se encuentra el usuario, devuelve éxito y su información
        const user = rows[0];
        res.status(200).json({ success: true, message: 'Sesión iniciada', user });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ success: false, message: 'Error al iniciar sesión' });
    } finally {
        await connection.end();
    }
});



// Iniciar el servidor
app.listen(puerto, () => {
    console.log(`Servidor corriendo en http://localhost:${puerto}`);
});
