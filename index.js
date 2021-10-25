//Dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const {printTable} = require("console-table-printer");
const figlet = require("figlet");
const app = require("express");
const PORT = 3001;

const Sequelize = require("sequelize");
require("dotenv").config();

app.listen(PORT, () =>
  console.log(`Listening for requests on port ${PORT}! 🏎️`)
);


const sequelize = new Sequelize(
    process.env.employees_db,
    process.env.root,
    process.env.rootroot,
    {
        host: "localhost:3001",
        dialect: "mysql",
        port: 3001,
    }
);

//Variables
let roles;
let department;
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
    getDepartment();
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
            message: "What wouuld you like to do?",
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
    connection.query("SELECT id, title FROM roles", (err, res) => {
             if (err) throw err;
        roles = res;
    });
};

// Department selection
getDepartment = () => {
    connection.query("Select id, name FROM department", (err, res) => {
             if (err) throw err;
        department = res;
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
                choices: ["DEPARTMENT", "ROLES", "EMPLOYEE", "EXIT"],
            },
        ])

        .then(function (answer) {
            if (answer.add === "DEPARTMENT") {
                console.log("Add a new: " + answer.add);
                addDepartment();
            } else if (answer.add === "ROLES") {
                console.log("Add a new: " + answer.add);
                addRoles();
              } else if (answer.add === "EMPLOYEE") {
                console.log("Add a new: " + answer.add);
                addEmployee();
              } else if (answer.add === "EXIT") {
                figlet("Thanks for using UNCC Employee Tracker", (err, result) => {
                  console.log(err || result);
                });
        
                connection.end();
              } else {
                connection.end();
              }
            });
        };
        
        // Department section of adding menu
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
                //   if (err) throw err;
                  console.log("1 new department added: " + answer.department);
                  getDepartment();
                  start();
                }
              );
            });
        };
        
        // Roles section of adding menu
        addRoles = () => {
          let departmentOptions = [];
          for (i = 0; i<department.length; i++) {
            departmentOptions.push(Object(department[i]));
          }
        
          inquirer
    .prompt([
        {
            name: "title",
            type: "input",
            message: "What role would you like to add?",
        },
        {
            name: "salary",
            type: "input",
            message: "What is the salary for this position?",
        },
        {
            name: "department_id",
            type: "list",
            message: "What is department does this postition belong to?",
            choices: departmentOptions,
        },
    ])

    .then(function (answer) {
        for (i = 0; i < departmentOptions.length; i++) {
          if (departmentOptions[i].name === answer.department_id) {
            department_id = departmentOptions[i].id;
          }
        }
        connection.query(
          `INSERT INTO roles (title, salary, department_id) VALUES ('${answer.title}', '${answer.salary}', ${department_id})`,
          (err, res) => {
                 if (err) throw err;
  
            console.log("1 new role added: " + answer.title);
            getRoles();
            start();
          }
        );
      });
  };

// Employee section of add menu
addEmployee = () => {
    getRoles();
    getManagers();
    let rolesOptions = [];
    for (i = 0; i < roles.length; i++) {
      rolesOptions.push(Object(roles[i]));
    }
    let managerOptions = [];
    for (i = 0; i < managers.length; i++) {
      managerOptions.push(Object(managers[i]));
    }
    inquirer
        .prompt([
            {
                name: "first_name",
                type: "input",
                message: "What is the employee's first name?",
            },
            {
                name: "last_name",
                type: "input",
                message: "What is the employee's last name?",
            },
            {
                name: "roles_id",
                type: "list",
                message: "What is the role for this employee?",
                choices: function () {
                    var choiceArray = [];
                    for (var i = 0; i < rolesOptions.length; i++) {
                      choiceArray.push(rolesOptions[i].title);
                    }
                    return choiceArray;
                },
            },
            {
                name: "manager_id",
                type: "list",
                message: "Who is the employee's manager?",
                choices: function () {
                    var choiceArray = [];
                    for (var i=0; i<managerOptions.length; i++) {
                        choiceArray.push(managerOptions[i].managers);
                    }
                    return choiceArray;
                },
            },
        ])
        
        .then (function (answer) {
            for (i=0; i<rolesOptions.length; i++) {
                if (rolesOptions[i].title === answer.roles_id) {
                    roles_id = rolesOptions[i].id;
                }
            }

            for (i=0; i<managerOptions.length; i++) {
                if (managerOptions[i].managers === answer.manager_id) {
                    manager_id = managerOptions[i].id;
                }
            }

            connection.query(
                `INSERT INTO employee (first_name, last_name, roles_id, manager_id) VALUES ('${answer.first_name}', '${answer.last_name}', ${roles_id}, ${manager_id})`,
                (err, res) => {
                         if (err) throw err;

                    console.log(
                        "1 new employee added: " + 
                        answer.first_name +
                        " " +
                        answer.last_name
                    );
                    getEmployees();
                    start();
                }
            );
        });
};

// Menu for viewing content
viewSomething = () => {
    inquirer 
    .prompt([
        {
            name: "viewChoice",
            type: "list",
            message: "What would you like to view?",
            choices: ["DEPARTMENT", "ROLES", "EMPLOYEES", "EXIT"],
        },
    ])

    .then((answer) => {
        if (answer.viewChoice === "DEPARTMENT") {
            viewDepartment();
        } else if (answer.viewChoice === "ROLES") {
            viewRoles();
        } else if (answer.viewChoice === "EMPLOYEES") {
            viewEmployees();
        } else if (answer.viewChoice === "EXIT") {
            figlet("Thanks for using Employee Tracker", (err, result) => {
                console.log(err || result);
            });

            connection.end();
        }   else {
            connection.end();
        }
    });
};

// Department section of view menu
viewDepartment = () => {
    connection.query("SELECT * FROM department", (err, res) => {
             if (err) throw err;
        figlet("Department", (err, result) => {
            console.log(err || result);
        });

        printTable(res);
        start();
    });
};

//Roles section of viewing menu
viewRoles = () => {
    connection.query(
        "SELECT r.id, r.title, r.salary, d.name as department_name FROM roles AS r INNER JOIN department AS d on r.department_id = d.id",
        (err, res) => {
                 if (err) throw err;
            figlet("Roles", (err, result) => {
                console.log(err || result);
            });

            printTable(res);
            start();
        }
    );
};

// Employees section of viewing menu
viewEmployees = () => {
    connection.query(
        'SELECT  e.id, e.first_name, e.last_name, d.name AS department, r.title, r.salary, CONCAT_WS(" ", m.first_name, m.last_name) AS manager FROM employee e LEFT JOIN employee m ON m.id = e.manager_id INNER JOIN roles r ON e.roles_id = r.id INNER JOIN department d ON r.department_id = d.id ORDER BY e.id ASC',
        (err, res) => {
                 if (err) throw err;
            figlet("Employees", (err, result) => {
                console.log(err || result);
            });

            printTable(res);
            start();
        }
    );
};

// Menu for updating content
updateSomething = () => {
    inquirer
        .prompt([
            {
                name: "update",
                type: "list",
                message: "What would you like to update?",
                choices: ["Update Employee Roles", "Update Employee Managers", "EXIT"],
            },
        ])

        .then((answer) => {
            if (answer.update === "Update Employee Roles") {
                updateEmployeeRoles();
            } else if (answer.update === "Update Employee Managers") {
                updateEmployeeManager();
            } else if (answer.update === "EXIT") {
                figlet("Thanks for using Employee Tracker", (err, result) => {
                    console.log(err || result);
                });

                connection.end();
            } else {
                connection.end();
            }
        });
};

// Employee section of update menu 
updateEmployeeRoles = () => {
    let employeeOptions = [];

    for (var i=0; i<employees.length; i++) {
        employeeOptions.push(Object(employee[i]));
    }
    inquirer
        .prompt([
            {
                name: "updateRoles",
                type: "list",
                message: "Which employee role would you like to update?",
                choices: function () {
                    var choiceArray = [];
                    for (var i=0; i<employeeOptions.length; i++) {
                        choiceArray.push(employeeOptions[i].Employee_Name);
                    }
                    return choiceArray;
                },
            },
        ])   
        .then((answer) => {
            let rolesOptions = [];
            for (i=0; i<roles.length; i++) {
                rolesOptions.push(Object(roles[i]));
            }
            for (i=0; i< employeeOptions.length; i++) {
                if (employeeOptions[i].Employee_Name === answer.updateRoles) {
                    employeeSelected = employeeOptions[i].id;
                }
            }
            inquirer
            .prompt([
                {
                    name: "newRoles",
                    type: "list",
                    message: "Select a new role:",
                    choices: function () {
                        var choiceArray = [];
                        for (var i=0; i<rolesOptions.length; i++) {
                            choiceArray.push(rolesOptions[I].title);
                        }
                        return choiceArray;
                    },
                },
            ])

            .then((answer) => {
                for (i=0; i<rolesOptions.length; i++) {
                    if (answer.newRoles === rolesOptions[i].title) {
                        newChoice = rolesOptions[i].id;
                        connection.query(
                            `UPDATE employee SET roles_id = ${newChoice} WHERE id = ${employeeSelected}`
                        ),
                        (err, res) => {
                                 if (err) throw err;
                        };
                    }
                }
                console.log("Role updated successfully");
                getEmployees();
                getRoles();
                start();
            });
        });
};

// Manager section of update menu
updateEmployeeManager = () => {
    let employeeOptions = [];

    for (var i=0; i<employees.length; i++) {
        employeeOptions.push(Object(employees[i]));
    }
    inquirer
    .prompt ([
        {
            name: "updateManager",
            type: "list",
            message: "Which employee's manager would you like to update?",
            choices: function () {
                var choiceArray = [];
                for (var i=0; i<employeeOptions.length; i++) {
                    choiceArray.push(employeeOptions[i].Employee_Name);
                }
                return choiceArray;
            },
        },
    ])
    .then((answer) => {
        getEmployees();
        getManagers();
        let managerOptions = [];
        for (i=0; i<managers.length; i++) {
            managerOptions.push(Object(manager[i]));
        }
        for (i=0; i<employeeOptions.length; i++) {
            if (employeeOptions[i].Employee_Name === answer.updateManager) {
                empllyeeSelected = employeeOptions[i].id;
            }
        }
        inquirer
        .prompt([
            {
                name: "newManager",
                type: "list",
                message: "Select a new manager:",
                choices: function () {
                    var choiceArray = [];
                    for (var i=0; i<managerOptions.length; i++) {
                        choiceArray.push(managerOptions[i].managers);
                    }
                    return choiceArray;
                },
            },
        ])
        then((answer) => {
            for (i=0; i<managerOptions.length; i++) {
                if (answer.newManager === managerOptions[i].managers) {
                    newChoice = managerOptions[i].id;
                    connection.query(
                        `UPDATE employee SET manager_id = ${newChoice} WHERE id = ${employeeSelected}`
                    ),
                    (err, res) => {
                             if (err) throw err;
                    };
                    console.log("Manager Updated Successfully");
                }
            }
            getEmployees();
            getManagers();
            start();
        });
    });
};

// Menu for deleting content
deleteSomething = () => {
    inquirer
        .prompt([
            {
                name: "delete",
                type: "list",
                message: "What would you like to delete?",
                choices: [
                    "Delete Department",
                    "Delete Roles",
                    "Delete Employee",
                    "Exit",
                ],
            },
        ])
        .then((answer) => {
            if (answer.delete === "Delete Department") {
                deleteDepartment();
            } else if (answer.delete === "Delete Roles") {
                deleteRoles();
            } else if (answer.delete === "Delete Employee") {
                deleteEmployee();
            } else if (answer.delete === "EXIT") {
                figlet("Thanks for using Employee Tracker", (err, result) => {
                    console.log(err || result);
                });

                connection.end();
            } else {
                connection.end();
            }
        });
};

// Department section of Delete Menu
deleteDepartment = () => {
    let departmentOptions = [];
    for (var i=0; i<department.length; i++) {
        departmentOptions.push(Object(department[i]));
    }
    inquirer
        .prompt([
            {
                name: "deleteDepartment",
                type: "list",
                message: "Which department would you like to delete?",
                choices: function () {
                    var choiceArray = [];
                    for (var i=0; i<departmentOptions.length; i++) {
                        choiceArray.push(departmentOptions[i]);
                    }
                    return choiceArray;
                },
            },
        ])
        .then((answer) => {
            for (i=0; i<departmentOptions.length; i++) {
                if (answer.deleteDepartment === departmentOptions[i].name) {
                    newChoice = departmentOptions[i].id;
                    connection.query(`DELETE FROM department WHERE id = ${newChoice}`),
                    (err, res) => {
                             if (err) throw err;
                    };
                    console.log(
                        "Department: " + answer.deleteDepartment + " Deleted Successfully"
                    );
                }
            }
            getDepartment();
            start();
        });
};

// Role section of Delete Menu
deleteRoles = () => {
    let rolesOptions = [];
    for (var i=0; i<roles.length; i++) {
        rolesOptions.push(Object(roles[i]));
    }

    inquirer
        .prompt([
            {
                name: "deleteRoles",
                type: "list",
                message: "Which role would you like to delete?",
                choices: function () {
                    var choiceArray = [];
                    for (var i=0; i<rolesOptions.length; i++) {
                        choiceArray.push(rolesOptions[i].title);
                    }
                    return choiceArray;
                },
            },
        ])

        .then((answer) => {
            for (i=0; i<rolesOptions.length; i++) {
                if (answer.deleteRoles === rolesOptions[i].title) {
                    newChoice = rolesOptions[i].id;
                    connection.query(`DELETE FROM roles WHERE id = ${newChoice}`),
                    (err,res) => {
                             if (err) throw err;
                    };
                    console.log("Role: " + answer.deleteRole + " Deleted Successfully");
                }
            }
            getRoles();
            start();
        });
};

// Employee section of Delete Menu
deleteEmployee = () => {
    let employeeOptions = [];
    for (var i = 0; i < employees.length; i++) {
      employeeOptions.push(Object(employees[i]));
    }

    inquirer
        .prompt([
            {
                name: "deleteEmployee",
                type: "list",
                message: "Which employee would you like to delete?",
                choices: function () {
                    var choiceArray = [];
                    for (var i=0; i<employeeOptions.length; i++) {
                        choiceArray.push(employeeOptions[i].Employee_Name);
                    }
                    return choiceArray;
                },
            },
        ])
        .then((answer) => {
            for (i=0; i<employeeOptions.length; i++) {
                if (answer.deleteEmployee === employeeOptions[i].Employee_Name) {
                    newChoice = employeeOptions[i].id;
                    connection.query(`DELETE FROM employees WHERE id = ${newChoice}`),
                    (err, res) => {
                             if (err) throw err;
                    };
                    console.log(
                      "Employee: " + answer.deleteEmployee + " Deleted Successfully"
                  );
                }
            }
            getEmployees();
            start();
        });
    };