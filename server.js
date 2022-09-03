const express = require('express');
const mysql = require('mysql');
const myconn = require('express-myconnection');
const cors = require('cors');




const routes = require('./routes');

const app = express();
app.set('port', process.env.PORT || 9000)

const dbOption = {
    host: 'mdb-test.c6vunyturrl6.us-west-1.rds.amazonaws.com',
    user: 'bsale_test',
    password: 'bsale_test',
    database: 'bsale_test',

}


var connection = mysql.createConnection(dbOption);


function handleDisconnect() {

    connection = mysql.createConnection(dbOption); // Recreate the connection, since
    connection.connect(() => {
        console.log('HOLA');
        connection.query("SHOW VARIABLES LIKE 'max_connections'")                           
        setTimeout(handleDisconnect, 2000); 
    });
  
    connection.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();                       
        } else {                                      
            throw err;                                
        }
    });
}

//middlewares-------------------
app.use(myconn(mysql, dbOption, 'single'))

app.use(cors());


//routes---------------
app.get('/', (req, res) => {
    res.send('Welcome to my API')
})

app.use('/api/product',routes);

app.get('/api/category', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err);
        conn.query('SELECT * from category', (err, rows) => {
            if (err) return res.send(err);

            res.json(rows)
            connection.end();
        })
    })
});



//server-running---------
app.listen(app.get('port'), () => {
    console.log('server running on port ', app.get('port'));

})




handleDisconnect();
