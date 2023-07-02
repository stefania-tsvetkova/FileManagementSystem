<?php
    require_once "Db.php";

    parse_str(file_get_contents("php://input"), $put);

    $db = new Db();

    $connection = $db->getConnection();

    $statement = $connection->prepare("
        UPDATE users
        SET passwordHash = :passwordHash
        WHERE id = :userId
    ");

    $isSuccessful = $statement->execute([
        "userId" => $put["userId"],
        "passwordHash" => $put["passwordHash"]
    ]);

    print_r($isSuccessful)
?>