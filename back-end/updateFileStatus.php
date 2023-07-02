<?php
    require_once "Db.php";

    parse_str(file_get_contents("php://input"), $put);

    $db = new Db();

    $connection = $db->getConnection();

    $statement = $connection->prepare("
        UPDATE files AS f
        SET f.statusId = :statusId
        WHERE f.id = :fileId
    ");

    $isSuccessful = $statement->execute([
        "fileId" => $put["fileId"],
        "statusId" => $put["statusId"]
    ]);

    print_r($isSuccessful)
?>