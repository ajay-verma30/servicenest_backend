const express = require('express');
const router = express.Router();
const mysqli = require('../db/conn');
const ShortUniqueId = require('short-unique-id');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
require('dotenv').config();

const uid = new ShortUniqueId({ length: 10 });

const dataConnection = mysqli();
const promiseConn = dataConnection.promise();

router.post('/newuser', async (req, res) => {
    try {
        const userId = uid.rnd();
        const createdAt = new Date();
        const { firstName, lastName, email, password, city, country, contact, roles } = req.body;

        const searchQuery = "SELECT email FROM users WHERE email = ?";
        const [searchResult] = await promiseConn.query(searchQuery, [email]);
        if(searchResult.length > 0){
            return res.status(400).json({ message: "Email already exists" });
        }
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);
        const addquery = `
            INSERT INTO users 
            (userID, firstName, lastName, email, password, city, country, contact, createdAt, roles) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [results] = await promiseConn.query(addquery, [
            userId, firstName, lastName, email, hashPassword, city, country, contact, createdAt, JSON.stringify(req.body.roles)
        ]);
        if (results.affectedRows === 1) {
            res.status(201).send("User Created Successfully");
        } else {
            res.status(400).send("Unable to create user");
        }
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send("Internal Server Error");
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const loginQuery = "SELECT * FROM users WHERE email = ?";
      const [result] = await promiseConn.query(loginQuery, [email]);
      if (result.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      const user = result[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const token = jwt.sign(user, process.env.JWT_SECRET, {expiresIn: '1h'})
      res.status(200).json({user,token});
  
    } catch (err) {
      console.error(err);
      res.status(500).send("Error logging in");
    }
  });


  

module.exports = router;
