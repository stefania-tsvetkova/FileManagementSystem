<?php
require_once "Db.php";

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
    print_r($isSuccessful);
    exit;
}

$fileId = $connection->lastInsertId();

$currentDirectory = getcwd();
$uploadDirectory = '../uploads/';

$file_extension = strtolower(pathinfo($_POST["fileName"], PATHINFO_EXTENSION));
$targetLocation = $uploadDirectory . $fileId . '.' . $file_extension;

$fileTempLocation = $_FILES['file']['tmp_name'];
$isSuccessful = move_uploaded_file($fileTempLocation, $targetLocation);

print_r($isSuccessful ? $fileId : null)
?>