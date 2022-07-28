const inquirer = require("inquirer");
const consoleTable = require("console.table");
const mysql = require("mysql2");

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
  inquirer.prompt([
    {
      type: "list",
      name: "choices",
      message: "please choose one of these actions.",
      choices: [
        "Update Employee Role",
        "View All Roles",
        "AddRole",
        "View All Departments",
        "Add Department",
        "View All Employees",
        "Quit",
      ],
    },
  ]).then((res) => {
    switch(res.choices){
      case "Update Employee Role":
        updateEmployeeRole();
        break;
      case "View All Roles":
        viewAllRoles();
        break;
      case "AddRole":
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
  })
};