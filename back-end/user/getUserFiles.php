<?php
    require_once "../Db.php";
    require_once "../helpers.php";

    $db = new Db();

    $connection = $db->getConnection();

    $statement = $connection->prepare("
        SELECT 
            f.id, 
            f.name, 
            d.name AS 'department', 
            s.name AS 'status', 
            f.uploadDate, 
            f.statusDate 
        FROM files AS f
        JOIN statuses AS s
        ON s.id = f.statusId
        JOIN departments AS d
        ON d.id = f.departmentId
        WHERE userId = :userId
    ");

    $statement->execute([
        "userId" => $_GET["userId"]
    ]);

    printQueryResult($statement);
?>