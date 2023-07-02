<?php
    require_once "../helpers.php";

    $file = getFileLocation($_GET["fileId"], $_GET["fileName"]);

    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="'.basename($file).'"');
    header('Content-Length: ' . filesize($file));

    readfile($file);
?>