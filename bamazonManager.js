let mysql = require('mysql');
require('console.table');
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon",
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    promptManagerForSelection();
    // updateItem();
});

function displayItems() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);

    });
}

function viewLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);

        // prompt customer for product
    });
}

function promptManagerForSelection() {
    inquirer.prompt([
        {
            name: 'managerselection',
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View products for sale', 'View low inventory', 'Add to inventory', 'Add a new product']
        }
    ]).then(function(val) {
        if (val.managerselection == 'View products for sale') {
            // Stuff
            displayItems();
            continueManagerView();
        }
        if (val.managerselection == 'View low inventory') {
            viewLowInventory();
            continueManagerView();
        }
        if (val.managerselection == 'Add to inventory') {
            addToInventory();
        }
        if (val.managerselection == 'Add a new product') {
            addNewProduct();
        }
    })
}

function addToInventory() {
    displayItems();
    inquirer
    .prompt([
        {
            name: "idtoselect",
            type: "input",
            message: "What is the ID of the product you want to add?\n"
        },
        {
            name: "quantitytoadd",
            type: "input",
            message: "How much of the item do you want to add?\n"
        }
        ])
        .then(function(answer) {
        // when finished prompting, insert a new item into the db with that info
        connection.query(
            "UPDATE products SET stock_quantity = stock_quantity + " + answer.quantitytoadd +" WHERE item_id = " + answer.idtoselect, function(err, res) {
            if (err) throw err;
            console.log("Your quantity was updated successfully!");
            // console.log(res);
            continueManagerView();
            }
        );
    });
}

function addNewProduct() {
    inquirer
    .prompt([
        {
            name: "productname",
            type: "input",
            message: "What is the name of the item you want to add?"
        },
        {
            name: "departmentname",
            type: "input",
            message: "What is the department name for the item?"
        },
        {
            name: "productprice",
            type: "input",
            message: "What is the price for the item?",
        },
        {
            name: "quantity",
            type: "input",
            message: "How much of the item would you like to sell?"
        }
        ])
        .then(function(answer) {
        // when finished prompting, insert a new item into the db with that info
        connection.query(
            "INSERT INTO products SET ?",
            {
            product_name: answer.productname,
            department_name: answer.departmentname,
            price: answer.productprice,
            stock_quantity: answer.quantity
            },
            function(err) {
            if (err) throw err;
            console.log("Your item was added successfully!");
            // re-prompt the user for if they want to bid or post
            continueManagerView();
            }
        );
    });
}

function continueManagerView() {
    inquirer.prompt([
        {
            name: 'continue',
            type: 'confirm',
            message: 'Would you like to continue in Manager view?'
        }
    ]).then(function(val) {
        if (val.continue) {
            // Stuff
            promptManagerForSelection();
        }
        if (val.continue == false) {
            // Stuff
            connection.end();
        }
    })
};