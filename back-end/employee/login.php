<?php
    require_once "../Db.php";

    $db = new Db();

    $connection = $db->getConnection();

    $statement = $connection->prepare("
        SELECT id, isAdmin FROM employees
        WHERE email = :email AND passwordHash = :passwordHash
    ");

    $statement->execute([
        "email" => $_GET["email"],
        "passwordHash" => $_GET["passwordHash"]
    ]);

    $userData = $statement->fetch(PDO::FETCH_ASSOC);

    print_r(json_encode($userData));
?>