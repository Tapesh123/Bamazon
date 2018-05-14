var mysql = require('mysql');
var inquirer = require('inquirer');
var colors = require('colors/safe');
var colors = require('colors');
var Table = require('cli-table');
// to create connection to db
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "patkul123",
    database: "Bamazon"
})

//creating a manager view options
function start(){
    inquirer.prompt([{
      type: "list",
      name: "doThing",
      message: "Please select an option: ",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product","End Session"]
    }]).then(function(ans){
       switch(ans.doThing){
        case "View Products for Sale": vProducts();
        break;
        case "View Low Inventory": LowInventory();
        break;
        case "Add to Inventory": addToInventory();
        break;
        case "Add New Product": addNewProduct();
        break;
        case "End Session": console.log('Next time please BUY BUY BUY!!'.bold.red);
        connection.end();
        break;
      }
    });
  }

//Products for viewing
function vProducts(){

    console.log('\n')
    connection.query('SELECT * FROM Products', function(err, res){
    if(err) throw err;
      //creates a table for the information from the mysql database to be placed
      var table = new Table({
          head: ['ID', 'Product', 'Department', 'Price', 'Quantity'],
          style: {
              head: ['rainbow', 'underline','bold'],
              compact: false,
              colAligns: ['center'],
          }
      });
  
      //loops through each item in the mysql database and pushes that information into a new row in the table
      for(var i = 0; i < res.length; i++){
          table.push(
              [res[i].ItemID, res[i].ProductName,  res[i].DepartmentName, (res[i].Price).toFixed(2), res[i].StockQuantity]
          );
      }
    console.log(table.toString());
    console.log(' ');
  
    start();
    });
  }
  

  //If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.

  function LowInventory(){
      console.log('\n')
      connection.query('SELECT * FROM Products where StockQuantity < 5', function(err, res){ 
          if(err) throw err;
          var table = new Table({
              head: ['ID', 'Product', 'Department', 'Price', 'Quantity'],
              style: {
                head: ['rainbow', 'underline','bold'],
                compact: false,
                colAligns: ['center'],

             }
          });
          for(var i = 0; i < res.length; i++){
              table.push(
                  [res[i].ItemID, res[i].ProductName, res[i].DepartmentName, (res[i].Price).toFixed(2), res[i].StockQuantity]
              );
          }
          console.log(table.toString());
          console.log(' ');
          start();

        });

      }
  

    //   * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.
    function addToInventory(){
        console.log('\n')
        connection.query('SELECT * FROM Products', function(err, res) { 
            if(err) throw err;
            var itemArray = [];

            for(var i=0; i < res.length; i++){
                itemArray.push(res[i].ProductName);
            }
            inquirer.prompt([{
                type: "list",
                name: "product",
                choices: itemArray,
                message: "Which item you want to add?"
            }, { 
                type: "input",
                name: "quantity",
                message: "How many would you like to add",
                validate: function(value){
                    if(isNaN(value) === false){return true;}
                    else {return false;}

               }

            }]).then ( function (ans) { 
                var currentAmt;
                for(var i=0; i < res.length; i++){
                    if(res[i].ProductName === ans.product){ 
                        currentAmt = res[i].StockQuantity;
                    }
                }
                connection.query('UPDATE Products SET ? WHERE ?', [
                    {StockQuantity: currentAmt + parseInt(ans.quantity)},
                    {ProductName: ans.product}
                ], function (err, res){
                    if(err) throw err;
                    console.log('The quantity has been updated'.bold.red);
                    start();
                });
            })
        });
    } 
 //   * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.
function addNewProduct(){
    console.log('\n');
    var depNames = [];

    connection.query('SELECT * FROM Departments', function (err, res){
        if(err) throw err;
        for(var i = 0; i < res.length; i++){
            depNames.push(res[i].DepartmentName);
        }
    })

    inquirer.prompt([{
        type: "input",
        name: "product",
        message: "Product: ",
        validate: function(value) { 
            if(value){return true;}else{return false;}
        }
    }, { 
        type: "list",
        name: "department",
        message: "Department ",
        choices: depNames
    }, { 
        type: "input",
        name: "price",
        message: "Price ",
        validate: function(value){ 
            if(isNaN(value) === false){return true;}
            else{return false;}
        }
    }, { 
        type: "input",
        name: "quantity",
        message: "Quantity: ",
        validate: function(value){
            if(isNaN(value) == false){return true;}
            else{return false;}
        }
    }]).then(function(ans){
        connection.query('INSERT INTO Products SET ?', {
            ProductName: ans.product,
            DepartmentName: ans.department,
            Price: ans.price,
            StockQuantity: ans.quantity
        }, function(err, res){
            if(err) throw err;
            console.log('\n')
            console.log('Item was added to the store inventory'.bold.red);
        })
        console.log('\n')
        start();
    });
}
start();