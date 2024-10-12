const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const puerto = 3000;

app.use(cors());
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

// Ruta para insertar datos en la tabla "apoyos"
app.post('/api/registros', async (req, res) => {
    const connection = await connectDB();
    const {
        Registro, Fecha, Nombre, Domicilio_Calle, Colonia_Comunidad,
        Seccion, Contacto, TipoDeApoyo, Descripcion_Apoyo, Status,
        Monto_Autorizado, Otro_Tipo_De_Ayuda, Turnado_A, Historial, Nube, Observaciones
    } = req.body;

    const query = `INSERT INTO apoyos (Registro, Fecha, Nombre, Domicilio_Calle,
                   Colonia_Comunidad, Seccion, Contacto, TipoDeApoyo, Descripcion_Apoyo,
                   Status, Monto_Autorizado, Otro_Tipo_De_Ayuda, Turnado_A, Historial, Nube, Observaciones) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    try {
        const [result] = await connection.execute(query, [Registro, Fecha, Nombre, Domicilio_Calle,
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

    const query = `SELECT COUNT(*) AS count FROM apoyos 
                   WHERE (Domicilio_Calle = ? AND Colonia_Comunidad = ?) 
                   OR (Registro = ?)`;

    try {
        const [results] = await connection.execute(query, [Domicilio_Calle, Colonia_Comunidad, Registro]);
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
        Fecha, Nombre, Domicilio_Calle, Colonia_Comunidad,
        Seccion, Contacto, TipoDeApoyo, Descripcion_Apoyo, Status,
        Monto_Autorizado, Turnado_A, Historial, Nube, Observaciones
    } = req.body;

    // Formatear la fecha
    const fechaFormateada = new Date(Fecha).toISOString().split('T')[0]; // 'YYYY-MM-DD'

    const query = `UPDATE apoyos SET 
                   Fecha = ?, Nombre = ?, Domicilio_Calle = ?, Colonia_Comunidad = ?,
                   Seccion = ?, Contacto = ?, TipoDeApoyo = ?, Descripcion_Apoyo = ?, Status = ?,
                   Monto_Autorizado = ?, Turnado_A = ?, Historial = ?, Nube = ?, Observaciones = ?
                   WHERE Registro = ?`;

    try {
        const [result] = await connection.execute(query, [fechaFormateada, Nombre, Domicilio_Calle, Colonia_Comunidad,
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




// Servidor escuchando
app.listen(puerto, () => {
    console.log(`Servidor escuchando en http://localhost:${puerto}`);
});
