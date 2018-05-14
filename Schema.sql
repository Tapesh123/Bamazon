DROP DATABASE IF EXISTS Bamazon;
CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE Products(
    ItemID MEDIUMINT AUTO_INCREMENT NOT NULL,
    ProductName VARCHAR(100) NOT NULL,
    DepartmentName VARCHAR(50) NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    StockQuantity INT(10) NOT NULL,
    primary key(ItemID)
);

select * from Products;

INSERT INTO Products(ProductName,DepartmentName,Price,StockQuantity)
VALUES ('Dog Food','PETS',9.95,150),
    ('iPAD','ELECTRONICS',59.99,200),
    ('Total Bran Cereal','GROCERY',24.50,4),
    ('Women Flannel Shirt','CLOTHING',75.00,5),
    ('Worn Denim Jeans','CLOTHING',54.25,35),
    ('Bike','SPORTS & OUTDOORS',350.42,42),
    ('Jeans - Black','CLOTHING',15.00,25),
    ('Glass Dish','HOME',25.50,57),
    ('Monopoly','ENTERTAINMENT',30.50,35),
    ('Chess Board Game','ENTERTAINMENT',19.95,23);

CREATE TABLE Departments(
    DepartmentID MEDIUMINT AUTO_INCREMENT NOT NULL,
    DepartmentName VARCHAR(50) NOT NULL,
    OverHeadCosts DECIMAL(10,2) NOT NULL,
    TotalSales DECIMAL(10,2) NOT NULL,
    PRIMARY KEY(DepartmentID));

INSERT INTO Departments(DepartmentName, OverHeadCosts, TotalSales)
VALUES ('ENTERTAINMENT', 70000.00, 15000.00),
    ('ELECTRONICS', 50000.00, 12000.00),
    ('HOME', 50000.00, 15000.00),
    ('PETS', 5000.00, 12000.00),
    ('GROCERY', 1400.00, 15000.00),
    ('KIDS', 60000.00, 12000.00),
    ('CLOTHING', 55000.00, 15000.00),
    ('SPORTS & OUTDOORS', 12000.00, 12000.00);
