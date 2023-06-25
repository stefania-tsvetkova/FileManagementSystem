<?php

function printQueryResult($statement): void {
    print_r('[');

    $element = $statement->fetch(PDO::FETCH_ASSOC);
    print_r($element ? json_encode($element) : null);

    while ($element = $statement->fetch(PDO::FETCH_ASSOC)) {
        print_r(',');
        print_r($element ? json_encode($element) : null);
    }

    print_r(']');
}
?>