CREATE DATABASE file_management_system;

USE file_management_system;

CREATE TABLE users(
	id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL,
    familyName VARCHAR(50) NOT NULL,
    passwordHash VARCHAR(64) NOT NULL
);

CREATE TABLE departments(
	id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

INSERT INTO departments(name)
VALUES	('Website administration'),
		('Administration'),
        ('Students'),
        ('Employees');

CREATE TABLE employees(
	id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL,
    familyName VARCHAR(50) NOT NULL,
    passwordHash VARCHAR(64) NOT NULL,
    isAdmin BIT NOT NULL,
    departmentId INT NOT NULL,
    CONSTRAINT fk_employees_departments FOREIGN KEY(departmentId) REFERENCES departments(id)
);

CREATE TABLE statuses(
	id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

INSERT INTO statuses(name)
VALUES  ('Uploaded'), 
        ('Approved'),
        ('Rejected');

CREATE TABLE files(
	id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    userId INT,
    departmentId INT,
    statusId INT,
    CONSTRAINT fk_files_users FOREIGN KEY(userId) REFERENCES users(id),
    CONSTRAINT fk_files_departments FOREIGN KEY(departmentId) REFERENCES departments(id),
    CONSTRAINT fk_files_statuses FOREIGN KEY(statusId) REFERENCES statuses(id)
);