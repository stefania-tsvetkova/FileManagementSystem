CREATE DATABASE file_management_system;

USE file_management_system;

CREATE TABLE users(
	id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL,
    familyName VARCHAR(50) NOT NULL,
    passwordHash VARCHAR(64) NOT NULL
);

CREATE TABLE statuses(
	id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

INSERT INTO statuses(id, name)
VALUES  (1, 'Uploaded'), 
        (2, 'Reviewed');

CREATE TABLE files(
	id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    user_id INT,
    status_id INT,
    CONSTRAINT fk_files_users FOREIGN KEY(user_id) REFERENCES users(id),
    CONSTRAINT fk_files_statuses FOREIGN KEY(status_id) REFERENCES statuses(id)
);