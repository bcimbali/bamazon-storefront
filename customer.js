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
    displayItems();
    // updateItem();
});

function promptCustomerForItem(inventory) {
    inquirer.prompt([
        {
            name: 'choice',
            type: 'input',
            message: 'Enter the ID of the item you would like to buy'
        }
    ]).then(function(val) {
        let choiceId = parseInt(val.choice);
        // query products to see if have enough
        let product = checkInventory(choiceId, inventory);
        console.log(product);
        if (product) {
            promptCustomerForQuantity(product);
        }
        else {
            console.log('\nThat item is not in our inventory.\n');
            console.log('This is what we have for sale:\n');
            displayItems();
        }
    });
};

function promptCustomerForQuantity(product) {
    inquirer.prompt([
        {
            name: 'quantity',
            type: 'input',
            message: 'How much of this item do you want to buy?'
        }
    ]).then(function(val) {
        let quantity = parseInt(val.quantity);
        if (quantity > product.stock_quantity) {
            console.log('\nSorry, we do not have enough of that item in stock.\n');
            console.log('Would you like less of that amount? We only have ' + product.stock_quantity + ' in stock.\n');
            displayItems();
        }
        else {
            makePurchase(product, quantity);
        }
    })
};

function makePurchase(product, quantity) {
    connection.query(
        // Update database
        'UPDATE products SET stock_quantity = ' +  (product.stock_quantity - quantity) + ' WHERE item_id = ' + product.item_id,
        function(err, res) {
            console.log('\nYour order has been placed.\n\nYour order total is $' + (product.price * quantity));
            console.log('\nThank you for shopping with us!');
            console.log('\n-----------------------------------------------------------------------\n');
            continueShopping();
        }
    )
}

function checkInventory(choiceId, inventory) {
    for (var i = 0; i < inventory.length; i++) {
        if (inventory[i].item_id === choiceId) {
            return inventory[i];
        }
    }
    return null;
}

function displayItems() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);

        // prompt customer for product
        promptCustomerForItem(res);

        // connection.end();
    });
}

function continueShopping() {
    inquirer.prompt([
        {
            name: 'continue',
            type: 'confirm',
            message: 'Would you like to continue shopping?'
        }
    ]).then(function(val) {
        if (val.continue) {
            // Stuff
            displayItems();
        }
        else {
            // Stuff
            connection.end();
        }
    })
};



