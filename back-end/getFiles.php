<?php
require_once 'Db.php';

$db = new Db();

$connection = $db->getConnection();

$statement = $connection->prepare("
    SELECT id, name FROM files
    WHERE user_id = :user_id
");

$statement->execute([
    "user_id" => $_GET["userId"]
]);

print_r('[');

$file = $statement->fetch(PDO::FETCH_ASSOC);
print_r($file ? json_encode($file) : null);

while ($file = $statement->fetch(PDO::FETCH_ASSOC)) {
    print_r(',');
    print_r($file ? json_encode($file) : null);
}

print_r(']');
?>