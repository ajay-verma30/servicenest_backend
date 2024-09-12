const mysql = require('mysql2')

const myconnection = () =>{
   const connection =  mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Plmnko@109',
        database: 'TicketingSystem'
    })

    connection.connect((err)=>{
        if(!err){
           return console.log("Connected")
        }
        return console.log("Error in connection");
    })
    return connection;
}


module.exports = myconnection;

