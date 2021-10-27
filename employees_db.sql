-- Create Database
DROP DATABASE IF EXISTS delete_these_employees_db;
CREATE DATABASE delete_these_employees_db;

-- Activate Database
USE delete_these_employees_db;

-- Create Tables

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
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR (50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  role_id INT NOT NULL, 
  manager_id INT, 
  PRIMARY KEY (id)
);

-- Populating the tables
INSERT INTO department (name)
VALUES ("Sales"), ("Engineering"), ("Human Resources"), ("Legal"), ("Finance"), ("Artist");

INSERT INTO role (title, salary, department_id)
VALUES ("CEO", "100000", "7"), ("Software Developer", "70000", "2"), ("Lawyer", "60000", "3"), ("Lawyer", "60000", "4"), ("Actuary", "60000", "5"), ("Artist", "70000", "6"), ("Manager", "40000", "1");

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Fenix", "Sampson", "1", "1"), ("Brent", "Graves", "2", "1"), ("Gabriel", "Cavalcante Causin", "3", "1"), ("Thor", "Odinson", "4", "1"), ("Loki", "Laufeyson", "5", "1"), ("Lily", "Bell", "6", "1"), ("Tatum", "Head", "6", "1");

