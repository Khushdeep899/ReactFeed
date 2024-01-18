const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 81;

app.use(cors());

app.use(bodyParser.json());

// Creating a MySQL connection 
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password'
});

// Connect to MySQL and create the database
connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to MySQL.");

// Create the database if it doesn't exist
connection.query('CREATE DATABASE IF NOT EXISTS database4', (error) => {
  if (error) {
    console.error('Error creating database:', error);
    return;
  }
  console.log("Database 'database4' created or already exists.");



    // switch to the 'database4' database
connection.changeUser({ database: 'database4' }, (error) => {
    if (error) throw error;
    console.log("Switched to database 'database4'.");
  
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS posts (
        ID int NOT NULL AUTO_INCREMENT,
        Topic VARCHAR(255) NOT NULL,
        Data TEXT,
        PRIMARY KEY (ID)
      );
    `;
    connection.query(createTableSql, (error) => {
      if (error) {
        console.error('Error in creating the posts table:', error);
        return;
      }
      console.log('Posts table created/exists.');


    // Delete existing data in the table
    const deleteDataSql = `TRUNCATE posts`;
    connection.query(deleteDataSql, (error, deleteResults) => {
      if (error) {
        console.error('Error in clearing posts table:', error);
        return res.status(500).send('Error clearing the table');
      }
      console.log('All existing entries in the table deleted successfully.');
      
    });  
    });

    
  });
});
});


// Create/clear the table
app.post('/setup-db', (req, res) => {
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS posts (
        ID int NOT NULL AUTO_INCREMENT,
        Topic VARCHAR(255) NOT NULL,
        Data TEXT,
        PRIMARY KEY (ID)
      );
    `;
  
    connection.query(createTableSql, (error, results) => {
      if (error) {
        console.error('Error in creating posts table:', error);
        return res.status(500).send('Error in creating table');
      }
      console.log('Posts table created/exists.');
  
      // Delete existing data in the table
      const deleteDataSql = `DELETE FROM posts`;
      connection.query(deleteDataSql, (error, deleteResults) => {
        if (error) {
          console.error('Error in clearing posts table:', error);
          return res.status(500).send('Error clearing the table');
        }
        console.log('All existing entries in the table deleted successfully.');
        res.send('Table created/cleared successfully');
      });
    });
  });
  


app.post('/add', (req, res) => {
  const { Topic, Data } = req.body;
  console.log('Received data:', { Topic, Data });

  const sql = `INSERT INTO posts (Topic, Data) VALUES (?, ?)`;
  connection.query(sql, [Topic, Data], (error, results) => {
    if (error) {
      console.error('Error adding the post:', error);
      return res.status(500).send('Error adding the post');
    }
    console.log('Post added successfully:', results);
    res.send('Post added successfully');
  });
});

// Retrieve all posts
app.get('/data', (req, res) => {
  const sql = `SELECT * FROM posts`;

  connection.query(sql, (error, results) => {
    if (error) {
      return res.status(500).send('Error retrieving posts');
    }
    res.json(results);
  });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
