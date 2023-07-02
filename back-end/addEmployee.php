<?php
    require_once "Db.php";

    $db = new Db();

    $connection = $db->getConnection();

    $statement = $connection->prepare("
        INSERT INTO employees(email, name, familyName, passwordHash, departmentId, isAdmin)
        VALUES (:email, :name, :familyName, :passwordHash, :departmentId, :isAdmin)
    ");

    $isSuccessful = $statement->execute([
        "email" => $_POST["email"],
        "name" => $_POST["name"],
        "familyName" => $_POST["familyName"],
        "passwordHash" => $_POST["passwordHash"],
        "departmentId" => $_POST["departmentId"],
        "isAdmin" => $_POST["isAdmin"]
    ]);

    print_r($isSuccessful)
?>