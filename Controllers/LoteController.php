<?php
include '../Models/lote.php';
$lote = new Lote();

if ($_POST['funcion'] == 'crear_almacen') {
    $nombre = $_POST['nombre'];
    $ubicacion = $_POST['ubicacion'];
    $tipo_producto = $_POST['tipo_producto'];
    $estado = $_POST['estado'];
    $lote->crear($nombre, $ubicacion, $tipo_producto, $estado);
}

if ($_POST['funcion'] == 'editar_almacen') {
    $id = $_POST['id'];
    $nombre = $_POST['nombre'];
    $ubicacion = $_POST['ubicacion'];
    $tipo_producto = $_POST['tipo_producto'];
    $estado = $_POST['estado'];
    $lote->editar($id, $nombre, $ubicacion, $tipo_producto, $estado);
}

if ($_POST['funcion'] == 'eliminar_almacen') {
    $id = $_POST['id'];
    $lote->eliminar($id);
}

if ($_POST['funcion'] == 'listar_almacenes') {
    $lote->listar();
    $json = array();
    foreach ($lote->objetos as $objeto) {
        $json[] = array(
            'id' => $objeto->id,
            'nombre' => $objeto->nombre,
            'ubicacion' => $objeto->ubicacion,
            'tipo_producto' => $objeto->tipo_producto,
            'estado' => $objeto->estado
        );
    };
    $jsonstring = json_encode($json);
    echo $jsonstring;
}

if ($_POST['funcion'] == 'rellenar_tipo_producto') {
    $lote->rellenar_tipo_producto();
    $json = array();
    foreach ($lote->objetos as $objeto) {
        $json[] = array(
            'id' => $objeto->id,
            'nombre' => $objeto->nombre
        );
    };
    $jsonstring = json_encode($json);
    echo $jsonstring;
}

if ($_POST['funcion'] == 'obtener_almacen') {
    $id = $_POST['id'];
    $lote->obtenerPorId($id);
    $json = array();
    foreach ($lote->objetos as $objeto) {
        $json[] = array(
            'id' => $objeto->id,
            'nombre' => $objeto->nombre,
            'ubicacion' => $objeto->ubicacion,
            'tipo_producto' => $objeto->tipo_producto,
            'estado' => $objeto->estado
        );
    };
    $jsonstring = json_encode($json);
    echo $jsonstring;
}
