<?php
    require_once 'helpers.php';

    $file = getFileLocation($_GET["fileId"], $_GET["fileName"]);
    
    // if (file_exists($file)) {
    //     header('Content-Description: File Transfer');
    //     header('Content-Type: application/octet-stream');
    //     header('Content-Disposition: attachment; filename='.basename($file));
    //     header('Content-Transfer-Encoding: binary');
    //     header('Expires: 0');
    //     header('Cache-Control: must-revalidate');
    //     header('Pragma: public');
    //     header('Content-Length: ' . filesize($file));
    //     ob_clean();
    //     flush();
    //     readfile($file);
    //     exit;
    // }

    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="'.basename($file).'"');
    header('Content-Length: ' . filesize($file));

    readfile($file);
?>