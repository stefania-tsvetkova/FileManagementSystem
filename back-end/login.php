<?php
require_once 'Db.php';

$db = new Db();

$connection = $db->getConnection();

$statement = $connection->prepare("
    SELECT id, email, name, familyName AS count FROM users
    WHERE email = :email AND passwordHash = :passwordHash
");

$statement->execute([
    "email" => $_GET["email"],
    "passwordHash" => $_GET["passwordHash"]
]);

$userCount = $statement->fetch(PDO::FETCH_ASSOC);

print_r($userCount ? json_encode($userCount) : null);
?>