const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;

app.use(express.json());
app.use(cors()); 

require('dotenv').config();

const mysql = require('mysql2');

// connecting Database
const connection = mysql.createPool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
});


app.get('/', (req, res) => {
    res.send(`
    Welcome to the backend of my React Customer Relationships Manager using Node.js<br/>
    Available endpoints and methods:<br/>
    GET /customers<br/>
    POST /customers<br/>
    GET /customer/:id<br/>
    PATCH /customer/:id<br/>
    DELETE /customer/:id<br/>
    <br/>
    GET /results<br/>
    POST /results<br/>
    DELETE /result<br/>
    PATCH /result<br/>
    `);
});

app.get("/customers", async (req, res) => {
    try {
        const data = await connection.promise().query(
            `SELECT *  from customers;`
        );
        res.status(202).json({
            customers: data[0],
        });
    } catch (err) {
        res.status(500).json({
            message: err,
        });
    }
});

app.post("/customers", async (req, res) => {
    try {
        const { first_name, last_name, email } = req.body;
        const [{ insertId }] = await connection.promise().query(
            `INSERT INTO customers (first_name, last_name, email) 
            VALUES (?, ?,?)`,
            [first_name, last_name, email]
        );
        res.status(202).json({
            message: "Customer Created",
        });
    } catch (err) {
        res.status(500).json({
            message: err,
            body: req.body,
        });
    }
});

app.get("/customer/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const data = await connection.promise().query(
            `SELECT *  from customers where id = ?`, [id]
        );
        res.status(200).json({
            customer: data[0][0],
        });
    } catch (err) {
        res.status(500).json({
            message: err,
        });
    }
});

app.patch("/customer/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, email, number_courses_completed } = req.body;
        const update = await connection
            .promise()
            .query(
                `UPDATE customers set first_name = ?, last_name = ?, email = ?, number_courses_completed = ? where id = ?`,
                [first_name, last_name, email, number_courses_completed, id]
            );
        res.status(200).json({
            message: `updated customer ${id}`,
        });
    } catch (err) {
        res.status(500).json({
            message: err,
        });
    }
});

app.delete("/customer/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const update = await connection
        .promise()
        .query(
          `DELETE FROM  customers where id = ?`,
          [id]
        );
      res.status(200).json({
        message: "deleted",
      });
    } catch (err) {
      res.status(500).json({
        message: err,
      });
    }
  });

app.get("/results", async (req, res) => {
    try {
        const data = await connection.promise().query(
            `SELECT *  from results;`
        );
        res.status(202).json({
            results: data[0],
        });
    } catch (err) {
        res.status(500).json({
            message: err,
        });
    }
});

app.post("/results", async (req, res) => {
    try {
        const { user_id, course_id, score } = req.body;
        const [{ insertId }] = await connection.promise().query(
            `INSERT INTO results (user_id, course_id, score) 
            VALUES (?, ?,?)`,
            [user_id, course_id, score]
        );
        res.status(202).json({
            message: "Result Created",
        });
    } catch (err) {
        res.status(500).json({
            message: err,
        });
    }
});

app.patch("/result", async (req, res) => {
    try {
        const { score, user_id, course_id,  } = req.body;
        const update = await connection
            .promise()
            .query(
                `UPDATE results set score = ? where user_id = ? AND course_id = ?`,
                [score, user_id, course_id]
            );
        res.status(200).json({
            message: `updated course_id: ${course_id}, user_id: ${user_id}`,
        });
    } catch (err) {
        res.status(500).json({
            message: err,
        });
    }
});

app.delete("/result", async (req, res) => {
    try {
      const { course_id, user_id } = req.body;
      const update = await connection
        .promise()
        .query(
          `DELETE FROM  results where course_id = ? AND user_id = ?`,
          [course_id, user_id]
        );
      res.status(200).json({
        message: `deleted record with course_id: ${course_id}, USER_ID: ${user_id}`,
      });
    } catch (err) {
      res.status(500).json({
        message: err,
      });
    }
  });

app.listen(process.env.PORT || 3000, () => {
    console.log(`app listening at http://localhost:${port}`);
});