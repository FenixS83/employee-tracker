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

// Role selection
getRoles = () => {
    connection.query("SELECT id, title FROM role", (err, res) => {
        if (err) throw err;
        roles = res;
    });
};

// Department selection
getDepartments = () => {
    connection.query("Select id, name FROM department", (err, res) => {
        if (err) throw err;
        departments = res;
    });
};

// Manager selection
getManagers = () => {
    connection.query("SELECT id, first_name, last_name, CONCAT_WS(' ', first_name, last_name) AS managers FROM employee",
        (err,res) => {
        if (err) throw err;
        managers = res;
        }    
    );
};

// Employee Selection
getEmployees = () => {
    connection.query("SELECT id, CONCAT_WS(' ', first_name, last_name) AS employee_name FROM employee",
    (err, res) => {
        if (err) throw err;
        employees = res;
        }
    );
};

// Menu for adding content
addSomething = () => {
    inquirer
        .prompt([
            {
                name: "add",
                type: "list",
                message: "What would you like to add?",
                choices: ["DEPARTMENT", "ROLE", "EMPLOYEE", "EXIT"],
            },
        ])

        .then(function (answer) {
            if (answer.add === "DEPARTMENT") {
                console.log("Add a new: " + answer.add);
                addDepartment();
            } else if (answer.add === "ROLE") {
                console.log("Add a new: " + answer.add);
                addRole();
            } else if (answer.add === "EMPLOYEE") {
                console.log("Add a new: " + answer.add);
                addEmployee();
            } else if (answer.add === "EXIT") {
                figlet("Thanks for using Employee Tracker", (err, result) => {
                    console.log(err || result);
                });

                connection.end();
            } else {
                connection.end();
            }
        });
};

//Department section of add menu
addDepartment = () => {
    inquirer
        .prompt([
            {
                name: "department",
                type: "input",
                message: "What department would you like to add?",
            },
        ])

        .then(function (answer) {
            connection.query(
                `INSERT INTO department (name) VALUES ('${answer.department}')`,
                (err, res) => {
                    if (err) throw err;
                    console.log("1 new department added: " + answer.department);
                    getDepartments();
                    start();
                }
            );
        });
};