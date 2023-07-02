<?php
    require_once 'Db.php';
    require_once 'helpers.php';

    $db = new Db();

    $connection = $db->getConnection();

    $statement = $connection->prepare("
        SELECT 
            e.email,
            e.name,
            e.familyName,
            d.name AS 'department',
            e.isAdmin
        FROM employees AS e
        JOIN departments AS d
        ON d.id = e.departmentId
    ");

    $statement->execute();

    printQueryResult($statement);
?>