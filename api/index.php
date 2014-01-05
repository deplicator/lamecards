<?php
require '../libs/Slim/Slim.php';
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();
include('config.php');
$db = new PDO($DB_PDO, $DB_USER, $DB_PASS);

$app->get('/:name', function($name) use ($app, $db) {
    $app->response()->header('Content-Type', 'application/json');
    $sql = "SELECT * from `occasions` WHERE `name` = '$name'";
    $STH = $db->query($sql);
    $STH->setFetchMode(PDO::FETCH_OBJ);
    $result = [];
    while ($obj = $STH->fetch()) {
        array_push($result, $obj);;
    }
    echo json_encode($result);
});

$app->get('/:name/:id', function($name, $cardId) use ($app, $db) {
    $app->response()->header('Content-Type', 'application/json');
    $sql = "SELECT * from `occasions` WHERE  `name` = '$name' AND `cardId` = $cardId";
    $STH = $db->query($sql);
    $STH->setFetchMode(PDO::FETCH_OBJ);
    echo json_encode($STH->fetch());
});

$app->run();