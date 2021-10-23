//Dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const {printTable} = require("console-table-printer");
const figle = require("figlet");


const Sequelize = require("sequelize");
const { startsWith } = require("sequelize/types/lib/operators");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: "localhost",
        dialect: "mysql",
        port: 3001,
    }
);

//Variables
let roles;
let departments;
let managers;
let employees;

var connection = mysql.createConnection({
    host: "localhost",

    //Port
    port: 3001,

    //Username
    user: process.env.DB_USER,

    //Password
    password: process.env.DB_PASSWORD,
    database: "employees_db",
});

figlet("EMPLOYEE TRACKER", (err, result) => {
    console.log(err || result);
});

// Connect functions
connection.connect(function (err) {
    if (err) throw err;
    start();
    getDepartments();
    getRoles();
    getManagers();
    getEmployees();
});

// Initiating prompts
start = () => {
    inquirer
        .prompt({
            name: "choices",
            type: "list",
            message: "What wouuld you like to do?"
            choices: ["ADD", "VIEW", "UPDATE", "DELETE", "EXIT"],
        })
        .then(function (answer) {
            if (answer.choices === "ADD") {
                addSomething();
            } else if (answer.choices === "VIEW") {
                viewSomething();
            } else if (answer.choices === "UPDATE") {
                updateSomething();
            } else if (answer.choices === "DELETE") {
                deleteSomething();
            } else if (answer.choices === "EXIT") {
                figlet("Thanks for using the Employee Tracker", (err, result) => {
                    console.log(err || result);
                });

                connection.end();
            } else {
                connection.end();
            }
        });
};

