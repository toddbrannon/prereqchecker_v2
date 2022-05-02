const express = require('express');
const ejs = require('ejs');
const methodOverride = require('method-override');
const morgan = require('morgan');
const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();
//const { CLIENT_FOUND_ROWS } = require('mysql/lib/protocol/constants/client');
//const request = require('request');
//--------

const port = process.env.PORT;  

const app = express();

app.use(morgan('short'));

app.use(express.json());

app.use(express.urlencoded({ extended: false }))

app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(methodOverride("_method"));

const QueryExec = require('./QueryExec')

const Query01 = require('./queries/query01')
const Query02 = require('./queries/query02')
const Query03 = require('./queries/query03')
const Query04a = require('./queries/query04a')
const Query04c = require('./queries/query04c')
const Query04d = require('./queries/query04d')
const Query04f = require('./queries/query04f')
const Query05 = require('./queries/query05')
const Query06 = require('./queries/query06')
//-----------
let instance = null;


//array with all queries
const queries = [
    new Query01()
    //  new Query02(),
    //  new Query03(),
    //  new Query04a(),
    //  new Query04c(),
    //  new Query04d(),
    //  new Query04f(),
    //  new Query05(),
    //  new Query06()
]

class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }

    // Step 1 (query 1 - enrollmentrefesh delete) - DELETE
    // Step 2 (query 2 - insert into enrollmentrefresh) - INSERT(NESTED SELECT)
    // Step 3 (query 3 - delete from tb_elr_refesh) - DELETE
    // Step 4a (query 4a - select email from enrollmentrefresh) - SELECT
    // Step 4b (query 4b - get eLearningRecords) - SELECT (DEPENDENT UPON 4a)
    // Step 4c (query 4c - insert into tb_elr_results) - INSERT (DEPENDENT UPON 4b)
    // Step 4d (query 4d - delete from tb_learndot_enrollments) - DELETE
    // Step 4e (query 4e - get eLearningRecords) - SELECT
    // Step 4f (query 4f - insert into tb_enrollments_learndot) - INSERT (DEPENDENT UPON 4e)
    // Step 5 (query 5 - DELETE FROM tb_credlybadgeresult) - DELETE
    // Step 6 (query 6 - INSERT INTO tb_credlybadgeresult) - INSERT (DEPENDENT UPON API CALL)
    // Step 7 (query 7 - DELETE FROM tb_prereqs) - DELETE
    // Step 8 (query 8 - INSERT names, emails into tb_prereqs) - INSERT (DEPENDENT UPON 2)
    // Step 9 (query 9 - update ANsR column to 'NO') - UPDATE (DEPENDENT UPON 4f)
    // Step 10 (query 10 - update F3 to 'YES' from tb_elr_results) - UPDATE (DEPENDENT UPON 4c)
    // Step 11 (query 11 - update F3 to 'YES' from tb_enrollments_learndot) - UPDATE (DEPENDENT UPON 4e)
    // Step 12 (query 12 - update ANsR column to 'YES') - UPDATE ((DEPENDENT UPON 4f)


    async getAllData() {
        const queryExec = new QueryExec(); //Create a sql executor  
        let previous; //previous query result
        for (let i = 0; i < queries.length; ++i) {
            const query = queries[i]
            previous = await queryExec.exec(connection, query, previous)
        }
        if (process.env.DB_DISABLED !== '1') {
            connection.end();
        }
    }
}

let connection;

if (process.env.DB_DISABLED !== '1') {
    connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });

    // connection.connect((err) => {
    //     if (err) {
    //         console.log(err.message)
    //     }
    //     console.log('db ' + connection.state);

    //     const srv = DbService.getDbServiceInstance();
    //     srv.getAllData()
    // })
    connection.connect((err) => {
        if (err) {
            console.log(err.message)
        }
        console.log('db ' + connection.state);
    })
}


app.get('/getAll', (request, response) => {
    const db = DbService.getDbServiceInstance();
    const result = db.getAllData();
    result
    .then(data => response.json({ data : data }))
    .catch(err => console.log(err));
});

// listen for requests
app.listen(process.env.PORT, () => {
  console.log(`The server is running on port ${port}...`);
  });


//   47.185.14.89



