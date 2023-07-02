<?php
    require_once "../Db.php";

    $db = new Db();

    $connection = $db->getConnection();

    $statement = $connection->prepare("
        INSERT INTO users(email, name, familyName, passwordHash)
        VALUES (:email, :name, :familyName, :passwordHash)
    ");

    $isSuccessful = $statement->execute([
        "email" => $_POST["email"],
        "name" => $_POST["name"],
        "familyName" => $_POST["familyName"],
        "passwordHash" => $_POST["passwordHash"]
    ]);

    print_r($isSuccessful)
?>