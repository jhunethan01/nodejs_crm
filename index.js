const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT
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
        const data = await pool.query(
            `SELECT *  from customers;`
        );
        res.status(202).json({
            customers: data.rows,
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
        const [{ insertId }] = await pool.query(
            `INSERT INTO customers (first_name, last_name, email) 
            VALUES ($1, $2, $3)`,
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
        const data = await pool.query(
            `SELECT *  from customers where id = $1`, [id]
        );
        res.status(200).json({
            customer: data.rows[0],
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
        const update = await pool
            
            .query(
                `UPDATE customers set first_name = $1, last_name = $2, email = $3, number_courses_completed = $4 where id = $5`,
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
        const update = await pool
            
            .query(
                `DELETE FROM  customers where id = $1`,
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
        const { userId } = req.query; 

        let query = `SELECT * FROM results`;
        if (userId) {
            query += ` WHERE user_id = ${userId}`;
        }

        const data = await pool.query(query);
        res.status(202).json({
            results: data.rows,
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
        const [{ insertId }] = await pool.query(
            `INSERT INTO results (user_id, course_id, score) 
            VALUES ($1, $2, $3)`,
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
        const { score, user_id, course_id, } = req.body;
        const update = await pool
            .query(
                `UPDATE results set score = $1 where user_id = $2 AND course_id = $3`,
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
        const update = await pool
            
            .query(
                `DELETE FROM  results where course_id = $1 AND user_id = $2`,
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

app.listen(process.env.PORT || 8000, () => {
    console.log(`app listening at http://localhost:${port}`);
});