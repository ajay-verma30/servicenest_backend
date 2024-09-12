const express = require('express');
const router = express.Router();
const mysqli = require('../db/conn');
const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId({ length: 10 });
const verifyToken = require('../verificaiton/verification');

const dataConnection = mysqli();
const promiseConn = dataConnection.promise();

router.post('/newticket', verifyToken, async(req,res)=>{
    const ticketId = uid.rnd();
    const createdDate = new Date();
    const {ticketTitle, ticketDescription, createdBy} = req.body;

    const [searchQuery] = await promiseConn.query("SELECT ticketNumber FROM tickets ORDER BY createdAt DESC LIMIT 1");

    let newTicketNumber = 'TIC001';

    if(searchQuery.length >0){
        const lastNumber = searchQuery[0].ticketNumber;
        const numericData = lastNumber.slice(3);
        const incrementNumber = String(parseInt(numericData, 10)+1).padStart(numericData.length, '0');
        newTicketNumber = `TIC${incrementNumber}`;
        const addQuery = "INSERT INTO tickets (tID, ticketNumber, ticketTitle, ticketDescription, createdAt, createdBy) VALUES (?,?,?,?,?,?)";
        const [result] = await promiseConn.query(addQuery, [ticketId, newTicketNumber, ticketTitle, ticketDescription, createdDate, createdBy]);
        if(result.affectedRows === 1){
            res.status(201).send("Ticket Created successfully");
        }
    }
})


router.get('/alltickets', verifyToken, async(req,res)=>{
    const [result] = await promiseConn.query("SELECT * FROM tickets");
    if(result){
        res.status(200).send(result)    
    }
})

router.get('/:tID', verifyToken, async(req,res)=>{
    const tID = req.params.tID;
    const [result] =await promiseConn.query("SELECT * FROM tickets WHERE tID = ?", [tID]);
    if(result.length > 0){
        res.json(result[0])
    }
    else{
        res.status(404).send("Ticket does not exists")
    }
})

module.exports = router;
