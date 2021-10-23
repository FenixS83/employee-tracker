--Create Database
DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

--Use Database
USE employees_db;

--Create Tables
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(50) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    department_id INT,
    PRIMARY KEY (id)
),

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR (50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    PRIMARY KEY(id)
);

--Populating tables with data
INSERT INTO department (name)
VALUES ("Sales"), ("Engineering"), ("Human Resources"), ("Legal"), ("Finance"), ("Artist");

INSERT INTO role (title, salary, department_id)
VALUES ("CEO", "100000", "7"), ("Software Developer", "70000", "2"), ("Lawyer", "60000", "3"), ("Lawyer", "60000", "4"), ("Actuary", "60000", "5"), ("Artist", "70000", "6"), ("Manager", "40000", "1");

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Ryan", "Crowder", "1", "1"), ("Julian", "Pedraza", "2", "1"), ("Dauphine", "Burns", "3", "1"), ("Taegan", "Loyelle", "4", "1"), ("David", "Pedraza", "5", "1"), ("Jason", "Bailey", "6", "1"), ("Jordan", "Vasquez", "6", "1");

