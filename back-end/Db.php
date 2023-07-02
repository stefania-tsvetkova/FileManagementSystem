<?php
    require_once "constants.php";

    class Db
    {
        private $connection;

        public function __construct()
        {
            $this->connection = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
                DB_USER,
                DB_PASSWORD,
                [
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8",
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]);
        }

        public function getConnection()
        {
            return $this->connection;
        }
    }
?>