CREATE DATABASE file_management_system;

USE file_management_system;

CREATE TABLE users(
	id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL,
    familyName VARCHAR(50) NOT NULL,
    passwordHash VARCHAR(64) NOT NULL
);