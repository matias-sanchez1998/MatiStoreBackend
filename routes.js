const express = require('express');
const routes = express.Router();

routes.get('/', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err);
        conn.query('SHOW VARIABLES LIKE "max_connections"', (err, rows) => {
            if (err) return res.send(err);

            res.json(rows)
            connection.end();
        })
    })
});



module.exports = routes
