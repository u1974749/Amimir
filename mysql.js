const mysql = require('msql');


const conection = mysql.createConnection({
    host:'amimirsql.mysql.database.azure.com',
    user:'Amimir',
    password:'Cloud123',
    database:'amimir',
    ssl: {
        rejectUnauthorized: true
      }

})

conection.connect((err) =>{
    if(err) throw err
    console.log('La conexion funciona')
})



conection.query('INSERT INTO ranking (score) VALUES(111);', (err,rows) =>{
    if(err) throw err
    console.log('Insersion exitosa')
  
})


conection.query('SELECT * from ranking', (err,rows) =>{
    if(err) throw err
    console.log('Los datos de la tabla son estos:')
    console.log(rows)
})

conection.end()