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

INSERT INTO employees(email, name, familyName, passwordHash, isAdmin, departmentId)
VALUES ('stefania@my-employees.com', 'Stefania', 'Tsvetkova', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', 1, 1);

CREATE TABLE statuses(
	id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

INSERT INTO statuses(name)
VALUES  ('Uploaded'),
        ('Approved'),
        ('Rejected'), 
        ('Reviewing');

CREATE TABLE files(
	id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    userId INT NOT NULL,
    departmentId INT NOT NULL,
    statusId INT NOT NULL,
    uploadDate DATETIME NOT NULL,
    statusDate DATETIME NOT NULL,
    CONSTRAINT fk_files_users FOREIGN KEY(userId) REFERENCES users(id),
    CONSTRAINT fk_files_departments FOREIGN KEY(departmentId) REFERENCES departments(id),
    CONSTRAINT fk_files_statuses FOREIGN KEY(statusId) REFERENCES statuses(id)
);

DELIMITER ;;
CREATE TRIGGER files_before_insert BEFORE INSERT ON files FOR EACH ROW
BEGIN
	SET NEW.uploadDate = NOW();
    SET NEW.statusDate = NEW.uploadDate;
END;;

CREATE TRIGGER files_before_update BEFORE UPDATE ON files FOR EACH ROW
BEGIN
    SET NEW.statusDate = NOW();
END;;
DELIMITER ;