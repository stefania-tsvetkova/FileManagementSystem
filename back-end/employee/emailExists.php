<?php
    require_once "../Db.php";

    $db = new Db();

    $connection = $db->getConnection();

    $statement = $connection->prepare("
        SELECT COUNT(*) AS count FROM employees
        WHERE email = :email
    ");

    $statement->execute([
        "email" => $_GET["email"]
    ]);

    $userCount = $statement->fetch(PDO::FETCH_ASSOC);

    print_r($userCount["count"] != 0);
?>