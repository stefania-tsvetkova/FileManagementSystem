<?php
    require_once "Db.php";

    $db = new Db();

    $connection = $db->getConnection();

    $statement = $connection->prepare("
        INSERT INTO employees(email, name, familyName, passwordHash, departmentId, isAdmin)
        VALUES (:email, :name, :familyName, :passwordHash, :departmentId, :isAdmin)
    ");

    $statement->bindValue(':email', $_POST["email"]);
    $statement->bindValue(':name', $_POST["name"]);
    $statement->bindValue(':familyName', $_POST["familyName"]);
    $statement->bindValue(':passwordHash', $_POST["passwordHash"]);
    $statement->bindValue(':departmentId', $_POST["departmentId"], PDO::PARAM_INT);
    $statement->bindValue(':isAdmin', $_POST["isAdmin"], PDO::PARAM_INT);

    $isSuccessful = $statement->execute();

    print_r($isSuccessful)
?>