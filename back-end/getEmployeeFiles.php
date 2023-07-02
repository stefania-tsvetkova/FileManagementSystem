<?php
require_once 'Db.php';
require_once 'helpers.php';

$db = new Db();

$connection = $db->getConnection();

$statement = $connection->prepare("
    SELECT 
        f.id, 
        f.name, 
        d.name AS 'department', 
        u.email AS 'userEmail', 
        s.name AS 'status',
        f.uploadDate,
        f.statusDate
    FROM files AS f
    JOIN employees AS e
    ON e.isAdmin OR e.departmentId = f.departmentId
    JOIN users AS u
    ON u.id = f.userId
    JOIN statuses AS s
    ON s.id = f.statusId
    JOIN departments AS d
    ON d.id = f.departmentId
    WHERE e.id = :employeeId
");

$statement->execute([
    "employeeId" => $_GET["employeeId"]
]);

printQueryResult($statement);
?>