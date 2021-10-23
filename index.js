//Dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const {printTable} = require("console-table-printer");
const figle = require("figlet");


const Sequelize = require("sequelize");
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

