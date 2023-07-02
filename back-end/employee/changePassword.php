<?php
    require_once "../Db.php";

    parse_str(file_get_contents("php://input"), $put);

    $db = new Db();

    $connection = $db->getConnection();

    $statement = $connection->prepare("
        UPDATE employees
        SET passwordHash = :passwordHash
        WHERE id = :employeeId
    ");

    $isSuccessful = $statement->execute([
        "employeeId" => $put["employeeId"],
        "passwordHash" => $put["passwordHash"]
    ]);

    print_r($isSuccessful)
?>