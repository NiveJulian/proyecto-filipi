<?php
include '../Models/lote.php';
$lote = new Lote();

if ($_POST['funcion'] == 'crear_almacen') {
    $nombre = $_POST['nombre'];
    $ubicacion = $_POST['ubicacion'];
    $tipo_producto = $_POST['tipo_producto'];
    $estado = $_POST['estado'];
    $resultado = $lote->crear($nombre, $ubicacion, $tipo_producto, $estado);
    echo json_encode($resultado);
} else
if ($_POST['funcion'] == 'editar_almacen') {
    $id = $_POST['id'];
    $nombre = $_POST['nombre'];
    $ubicacion = $_POST['ubicacion'];
    $tipo_producto = $_POST['tipo_producto'];
    $estado = $_POST['estado'];
    $resultado = $lote->editar($id, $nombre, $ubicacion, $tipo_producto, $estado);
    echo json_encode($resultado);
} else
if ($_POST['funcion'] == 'eliminar_almacen') {
    $id = $_POST['id'];
    $lote->eliminar($id);
} else
if ($_POST['funcion'] == 'listar_almacenes') {
    $lote->listar();
    $json = array();
    foreach ($lote->objetos as $objeto) {
        $json[] = array(
            'id' => $objeto->id,
            'nombre' => $objeto->nombre,
            'ubicacion' => $objeto->ubicacion,
            'tipo_producto' => $objeto->tipo_producto,
            'estado' => $objeto->estado,
            'cantidad_productos' => $objeto->cantidad_productos
        );
    }
    $jsonstring = json_encode($json);
    echo $jsonstring;
} else
if ($_POST['funcion'] == 'rellenar_almacenes') {
    $lote->listar();
    $json = array();
    foreach ($lote->objetos as $objeto) {
        $json[] = array(
            'id' => $objeto->id,
            'nombre' => $objeto->nombre,
            'ubicacion' => $objeto->ubicacion,
            'tipo_producto' => $objeto->tipo_producto,
            'estado' => $objeto->estado,
            'cantidad_productos' => $objeto->cantidad_productos
        );
    }
    $jsonstring = json_encode($json);
    echo $jsonstring;
} else
if ($_POST['funcion'] == 'listar_productos') {
    $idAlmacen = $_POST['idAlmacen'];
    $lote->listarProductosPorAlmacen($idAlmacen);
    $json = array();
    foreach ($lote->objetos as $objeto) {
        $json[] = array(
            'id' => $objeto->id,
            'nombre' => $objeto->nombre,
            'descripcion' => $objeto->descripcion,
            'codigo' => $objeto->codigo,
            'precio' => $objeto->precio,
            'stock' => $objeto->stock,
        );
    }
    $jsonstring = json_encode($json);

    echo $jsonstring;
} else
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
} else
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
