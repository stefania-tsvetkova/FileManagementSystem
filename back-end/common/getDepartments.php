<?php
    require_once "../Db.php";
    require_once "../helpers.php";

    $db = new Db();

    $connection = $db->getConnection();

    $statement = $connection->prepare("
        SELECT id, name FROM departments
    ");

    $statement->execute();

    printQueryResult($statement);
?>