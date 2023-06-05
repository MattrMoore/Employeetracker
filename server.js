const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const table = require('console.table');
const { response } = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Milo1459$',
        database: "employee_db"
    },
    console.log(`Connected to the employee_db`)
    );
    
db.connect((error) => {
    if (error) throw error;
    console.log(`Welcome to the Employee Database`);
    promptUser();
})    

const promptUser = () => {
    inquirer.prompt([
        {
            name: 'choices',
            type: 'list',
            message: 'Please select from the following options:',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add a Department',
                'Add a Role',
                'Add an Employee',
                'Update an Employee Role',
                'Delete Employee',
                'Exit'
            ]
        }
    ])
    .then((answers) => {
        const {choices} = answers;
        switch (choices) {
            case 'View All Departments':
                viewAllDepartments();
                break;
            case 'View All Roles':
                viewAllRoles();
                break;
            case 'View All Employees':
                viewAllEmployees();
                break;
            case 'Add a Department':
                addDepartment();
                break;
            case 'Add a Role':
                addRole();
                break;
            case 'Add an Employee':
                addEmployee();
                break;
            case 'Update an Employee Role':
                updateRole();
                break;
            case 'Delete Employee':
                deleteEmployee();
                break;
            case 'Exit':
                db.end();
        }
    });
};


const viewAllDepartments = () => {
    const dbQuery = `SELECT * FROM department`;
    db.query(dbQuery, (error, results) => {
        if (error) throw error;
        console.log('\x1b[35m', `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`, '\x1b[0m');
        console.table(results);
        console.log('\x1b[35m',`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`, '\x1b[0m');
        promptUser();
    });
};

const viewAllRoles = () => {
    const dbQuery = `SELECT role.id, role.title,  department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id;`;
    db.query(dbQuery, (error, results) => {
        if (error) throw error;
        console.log('\x1b[35m', `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`, '\x1b[0m');
        console.table(results);
        console.log('\x1b[35m',`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`, '\x1b[0m');
        promptUser();
    });
};

const viewAllEmployees = () => {
    const dbQuery = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, employee.manager_id FROM employee JOIN role ON role.id = employee.role_id JOIN department ON department.id = role.department_id;`;
    db.query(dbQuery, (error, results) => {
        if (error) throw error;
        console.log('\x1b[35m', `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`, '\x1b[0m');
        console.table(results);
        console.log('\x1b[35m',`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`, '\x1b[0m');
        promptUser();
    });
};

const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the department you would like to add?'
        }
    ])
    .then((answer) => {
        const dbQuery = `INSERT INTO department(name) VALUES(?)`;
        db.query(dbQuery, answer.name, (error, results) => {
            if (error) throw error;
            console.log('\x1b[35m', `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`, '\x1b[0m');
            console.table(`${answer.name} has been added as a new department.`);
            console.log('\x1b[35m',`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`, '\x1b[0m');
            promptUser();
        })
    });
};


const addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the title of the new role?'
        },
        {
            type: 'input',
            name: 'department_id',
            message: 'What is the department id of the new role?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the new role?'
        }
    ])
    .then((answers) => {
        const { title, department_id, salary } = answers; 
        const dbQuery = `INSERT INTO role (title, department_id, salary) VALUES ('${title}', ${department_id}, ${salary})`;
        db.query(dbQuery, (error, results) => {
            if (error) throw error;       
            console.log('\x1b[35m', `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`, '\x1b[0m');
            console.table(`${answers.title} has been added as a new role.`);
            console.log('\x1b[35m',`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`, '\x1b[0m');
            promptUser();
    })
})};
 

const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'What is the first name of the new employee?'
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'What is the last name of the new employee?'
        },
        {
            type: 'input',
            name: 'role_id',
            message: 'What is the role ID of the new employee?'
        },
        {
            type: 'input',
            name: 'manager_id',
            message: 'What is the manager ID of the new employee? (Leave blank if N/A)'
        }
    ])
    .then((answers) =>{
        const { first_name, last_name, role_id, manager_id } = answers;
        const dbQuery = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${first_name}', '${last_name}', ${role_id}, NULLIF('${manager_id}', ''))`;
        db.query(dbQuery, (error, results) => {
            if (error) throw error;
            console.log('\x1b[35m', `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`, '\x1b[0m');
            console.table(`${first_name} ${last_name} has been added as a new employee.`);
            console.log('\x1b[35m',`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`, '\x1b[0m');
            promptUser();
    });
})};

const updateRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'employee_id',
            message: 'What is the ID of the employee?'
        },
        {
            type: 'input',
            name: 'new_role',
            message: "What is the ID of the new role?"
        }
    ])
    .then((answers) => {
        const { employee_id, new_role } = answers;
        const dbQuery = `UPDATE employee SET role_id = ${new_role} WHERE id = ${employee_id}`;
        db.query(dbQuery, (error, results) => {
            if (error) throw error;
            console.log('\x1b[35m', `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`, '\x1b[0m');
            console.table(results);
            console.log('\x1b[35m',`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`, '\x1b[0m');
            promptUser();
    })});
};
const deleteEmployee = () => {
    const dbQuery = `SELECT employee.id, employee.first_name, employee.last_name FROM employee`;
    db.query(dbQuery, (error, results) => {
        if (error) throw error;
        console.log('\x1b[35m', `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`, '\x1b[0m');
        console.table(results);
        console.log('\x1b[35m',`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`, '\x1b[0m');
        deleteEmployeePrompt();
        });
    };
const deleteEmployeePrompt = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'id',
            message: 'What is the ID of the employee you would like deleted?'
        }
    ])
    .then((answer) => {
        const { id } = answer;
        const dbQuery = `DELETE FROM employee WHERE employee.id = ${id}`;
            db.query(dbQuery, (error, results) => {
                if (error) throw error;
                console.log('\x1b[35m', `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`, '\x1b[0m');
                console.table(`Employee has been deleted.`);
                console.log('\x1b[35m',`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`, '\x1b[0m');
                promptUser();
        })
    })}