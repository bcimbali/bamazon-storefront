# Bamazon

An Amazon-like storefront app built with Node.js and MySQL.   The app will take in customer orders from customers and deplete stock from the store's inventory.  If logged in as a manager, the app will allow you to add inventory to items, add new products, or view the items with low inventory.

## Getting Started

- Clone the repo
- Run `npm install` to get all dependencies
- Using the Sql client of your choice, create a database using the `schema.sql` file
- Once that database and table is created, seed it with data by running the `seeds.sql` file
- Run either of the 2 node commands depending on the view you want:
    - `node customer.js` for the customer view
    - `node bamazonManager.js` for manager view

### Customer View
![customerview](./customer.svg)
- As mentioned above, run `node customer.js` 
- A list of all the items for sale will be displayed in table format (to the terminal)
- A prompt will ask you to enter the ID of the item you want to buy
- If there's enough inventory for the item you want, another prompt will ask you to enter the quantity
- If there's enough inventory for your quantity, your purchase will be completed

### Manager View
![managerview](./bamManager.svg)
- As mentioned in Getting Started, run `node bamazonManager.js`
- A list of 4 actions will be presented:
    - `View products for sale`
        - This displays all items for sale in a table format
    - `View low inventory`
        - This allows you to see all items that have a low inventory (quantities less than 5)
    - `Add to inventory`
        - Allows you to add to the quantity for each item
    - `Add a new product`
        - Allows you to add a new product to the products table



## Built With:

- Node.js
- MySQL
- [Inquirer NPM Package](https://www.npmjs.com/package/inquirer)
- [MySQL NPM Package](https://www.npmjs.com/package/mysql)
- [Console.Table NPM Package](https://www.npmjs.com/package/console.table)