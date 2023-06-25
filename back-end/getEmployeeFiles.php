<?php
require_once 'Db.php';
require_once 'helpers.php';

$db = new Db();

$connection = $db->getConnection();

$statement = $connection->prepare("
    SELECT f.id, f.name, u.email AS 'userEmail', s.name AS 'status' FROM files AS f
    JOIN employees AS e
    ON e.departmentId = f.departmentId
    JOIN users AS u
    ON u.id = f.userId
    JOIN statuses AS s
    ON s.id = f.statusId
    WHERE e.id = :employeeId
");

$statement->execute([
    "employeeId" => $_GET["employeeId"]
]);

printQueryResult($statement);
?>