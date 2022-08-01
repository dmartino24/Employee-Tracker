const inquirer = require("inquirer");
const cTable = require("console.table");
const mysql = require("mysql2");
const validate = require("./utils/validator");
const { validateString } = require("./utils/validator");

require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "employee_db",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Database connected");
  startApp();
});

startApp = () => {
  console.log("*------------------*");
  console.log("|                  |");
  console.log("| EMPLOYEE MANAGER |");
  console.log("|                  |");
  console.log("*------------------*");
  startPrompt();
};
const startPrompt = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choices",
        message:
          "please choose one of these actions.(Navigate with arrow keys)",
        choices: [
          "Update Employee Role",
          "Add Employee",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
          "View All Employees",
          "Quit",
        ],
      },
    ])
    .then((res) => {
      switch (res.choices) {
        case "Update Employee Role":
          updateEmployeeRole();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "View All Roles":
          viewAllRoles();
          break;
        case "Add Role":
          addRole();
          break;
        case "View All Departments":
          viewAllDepartments();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "View All Employees":
          viewAllEmployees();
          break;
        default:
          process.exit();
      }
    });
};
const updateEmployeeRole = () => {
  db.query("SELECT * FROM employee", (err, employeeData) => {
    if (err) {
      console.log(err);
    }
    db.query("SELECT * FROM role", (err, roleData) => {
      if (err) {
        console.log(err);
      }

      inquirer
        .prompt([
          {
            name: "employeeName",
            type: "list",
            message: "Which employee role are you updating?",
            choices: employeeData.map(function (data) {
              return `${data.first_name} ${data.last_name}`;
            }),
          },
          {
            name: "role",
            type: "list",
            message: "Which role would you like to assign to this employee?",
            choices: roleData.map(function (data) {
              return data.title;
            }),
          },
        ])
        .then((res) => {
          new Promise((resolve, reject) => {
            const ids = [];
            roleData.forEach((element) => {
              if (element.title === res.role) {
                ids.push(element.id);
              }
            });
            employeeData.forEach((element) => {
              if (
                `${element.first_name} ${element.last_name}` ===
                res.employeeName
              ) {
                ids.push(element.id);
              }
            });
            resolve(ids);
          }).then((res) => {
            db.query(
              `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`,
              [res[0], res[1]],
              function (err) {
                if (err) {
                  console.log(err);
                }
                console.log("Updated employee role");
                startPrompt();
              }
            );
          });
        });
    });
  });
};
const addEmployee = () => {
  let roleArray = getEmployeeRoles();
  let managerArray = getEmployeeManagers();
  inquirer
    .prompt([
      {
        type: "string",
        name: "firstName",
        message: "What is this employee's first name?",
      },
      {
        type: "string",
        name: "lastName",
        message: "What is this employee's last name?",
      },
      {
        type: "list",
        name: "role",
        message: "What is this employee's role?",
        choices: roleArray,
      },
      {
        type: "list",
        name: "manager",
        message: "Who is this employee's manager?",
        choices: managerArray,
      },
    ])
    .then((input) => {
      const roleID = roleArray.indexOf(input.role) + 1;
      let managerID;
      if (input.manager === "None") {
        managerID = null;
      } else {
        managerID = managerArray.indexOf(input.manager);
      }
      console.log(managerID);
      const sql =
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)";
      const newInput = [input.firstName, input.lastName, roleID, managerID];
      db.query(sql, newInput, (err, res) => {
        if (err) {
          console.log(err);
        }
        console.log(`Added ${newInput[0]} ${newInput[1]} to the database`);
        startPrompt();
      });
    });
};

const getEmployeeRoles = () => {
  const sql = "SELECT * FROM role";
  const roleArray = [];

  db.query(sql, (err, res) => {
    if (err) {
      console.log(err);
    }
    res.forEach((role) => {
      roleArray.push(role.title);
    });
  });
  return roleArray;
};
const getEmployeeManagers = () => {
  const sql =
    "SELECT first_name, last_name FROM employee WHERE manager_id IS NULL";
  const managerArray = ["None"];
  db.query(sql, (err, res) => {
    if (err) {
      console.log(err);
    }
    res.forEach((manager) => {
      managerArray.push(`${manager.first_name} ${manager.last_name}`);
    });
  });
  return managerArray;
};
const viewAllRoles = () => {
  const sql = "SELECT * from role";

  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
    }
    console.log("\n");
    console.log("Role");
    console.table(rows);
    startPrompt();
  });
};
const addRole = () => {
  db.query("SELECT * FROM department", (err, res) => {
    if (err) {
      console.log(err);
    }
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "What is the name of the role?",
          validate: validate.validateString,
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary of the role?",
          validate: validate.validateSalary,
        },
        {
          name: "department",
          type: "list",
          message: "Which department does the role belong to?",
          choices: function () {
            const departmentArray = [];
            res.forEach((department) => {
              departmentArray.push(department.name);
            });
            return departmentArray;
          },
        },
      ])
      .then((input) => {
        let department_id;
        console.log(input);
        res.forEach((department) => {
          if (input.department === department.name) {
            department_id = department.id;
          }
        });
        const sql =
          "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
        const newInput = [input.title, input.salary, department_id];
        db.query(sql, newInput, (err, res) => {
          if (err) {
            console.log(err);
          }
          console.log(`Added ${input.title} to the database`);
          startPrompt();
        });
      });
  });
};
const viewAllDepartments = () => {
  const sql = "SELECT * from department";

  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
    }
    console.log("\n");
    console.log("Departments");
    console.table(rows);
    startPrompt();
  });
};
const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What is the name of the department?",
        validate: validate.validateString,
      },
    ])
    .then((input) => {
      const sql = "INSERT INTO department (name) VALUES (?)";
      db.query(sql, input.name, (err, res) => {
        if (err) {
          console.log(err);
        }
        console.log(`Added ${input.name} to the database.`);
        startPrompt();
      });
    });
};
const viewAllEmployees = () => {
  const sql = `SELECT employee.id, 
  employee.first_name, 
  employee.last_name, 
  role.title, 
  department.name AS 'department', 
  role.salary
  FROM employee, role, department 
  WHERE department.id = role.department_id 
  AND role.id = employee.role_id
  ORDER BY employee.id ASC`;

  db.query(sql, (err, res) => {
    if (err) {
      console.log(err);
    }
    console.log("\n");
    console.log("Employee");
    console.table(res);
    startPrompt();
  });
};
