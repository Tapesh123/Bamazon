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

//print the items that are for sale with their details
function start(){ 
    connection.query('SELECT * FROM Products', function(err, res){
        if(err) throw err;

       // create a table for the info from mysql workbench database to be placed
        var table = new Table({
            head: ['ID', 'Product Name', 'Department', 'Price'],
            style: {
                head: ['rainbow', 'underline','bold'],
                compact: false,
                colAligns: ['center'],

            }
        });
    //create a loop through each item in mysql database and pushes information in to a new row in the table
    for(var i= 0; i < res.length; i++) { 
        table.push(
            [res[i].ItemID, res[i].ProductName, res[i].DepartmentName, res[i].Price]
    );
    }
    console.log(table.toString());
 
    console.log(' ');
inquirer.prompt([
    {
        type: "input",
        name: "id",
        message: "What is the ID of the product you would like to purchase?",
        validate: function(value){
            if(isNaN(value) == false && parseInt(value) <= res.length && parseInt(value) > 0) {
                return true;
            }else {
                return false;
            }
        }
    },
    {
            type: "input",
            name: "qty",
            message: "How many would you like to purchase?",
            validate: function(value){
                if(isNaN(value)){
                    return false;
                }else{
                    return true;
                }

                }
            }

        ]).then(function(ans){
            var whatToBuy = (ans.id)-1;
            var howManyToBuy = parseInt(ans.qty);
            var Total = parseFloat(((res[whatToBuy].Price) * howManyToBuy).toFixed(2));
    //check if the quantity is truly sufficient?
    
    if(res[whatToBuy].StockQuantity >= howManyToBuy){
        //after purchase, update this quantity
        connection.query("UPDATE Products SET ? WHERE ?", [
            {StockQuantity: (res[whatToBuy].StockQuantity - howManyToBuy)},
            {ItemID: ans.id}
        ], function(err, result){
            if(err) throw err;
            console.log("Awesome! Your total is $ " + Total.toFixed(2).bold.red);
            reprompt();
                });
        connection.query("SELECT * FROM Departments", function(err, deptRes){
            if(err) throw err;
            var index;
            for(var i = 0; i < deptRes.length; i++){
                if(deptRes[i].DepartmentName === res[whatToBuy].DepartmentName){
                    index = i;
                }
            }
            //update department total sale section
            connection.query("UPDATE Departments SET ? WHERE ?", [
                {TotalSales: deptRes[index].TotalSales + Total},
                {DepartmentName: res[whatToBuy].DepartmentName}
            ], function (err, deptRes){
                if(err) throw err;

            });
        });
    } else {
        console.log("Nope, There is not enough in stock! \n\n");
        reprompt();

    }
})
})
     }
//asks if they would like to purchase another item
function reprompt(){
    inquirer.prompt([{
      type: "confirm",
      name: "reply",
      message: "Would you like to purchase another item?"
    }]).then(function(ans){
      if(ans.reply){
        start();
      } else{
        console.log("Make sure you buy a lot next time BUY BUY BUY!".blue.bold);
        connection.end();
      }
    });
  }    
start(); //calling the function 