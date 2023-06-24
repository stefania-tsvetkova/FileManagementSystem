<?php
require_once 'Db.php';

$db = new Db();

$connection = $db->getConnection();

$statement = $connection->prepare("
    SELECT f.id, f.name, s.name AS 'status' FROM files AS f
    JOIN statuses AS s
    ON s.id = f.status_id
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