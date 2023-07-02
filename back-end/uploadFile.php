<?php
    require_once "Db.php";
    require_once "helpers.php";

    if (!isset($_FILES['file']['name'])) {
        print_r(0);
        exit;
    }

    $db = new Db();

    $connection = $db->getConnection();

    $statement = $connection->prepare("
        INSERT INTO files(name, userId, departmentId, statusId)
        VALUES (:name, :userId, :departmentId, :statusId)
    ");

    $isSuccessful = $statement->execute([
        "name" => $_POST["fileName"],
        "userId" => $_POST["userId"],
        "departmentId" => $_POST["departmentId"],
        "statusId" => $_POST["statusId"]
    ]);

    if (!$isSuccessful) {
        print_r("File cannot be added to the db");
        exit;
    }

    $fileId = $connection->lastInsertId();

    $targetLocation = getFileLocation($fileId, $_POST["fileName"]);

    $fileTempLocation = $_FILES['file']['tmp_name'];
    $isSuccessful = move_uploaded_file($fileTempLocation, $targetLocation);

    if (!$isSuccessful) {
        print_r("File cannot be saved on the server");
        exit;
    }

    print_r($isSuccessful ? $fileId : null)
?>