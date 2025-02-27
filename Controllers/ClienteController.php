<?php
include_once '../Models/cliente.php';

$cliente = new Cliente();

if ($_POST['funcion'] == 'crear') {
    $razonsocial = $_POST['razonsocial'];
    $nombre = $_POST['nombre'];
    $direccion = $_POST['direccion'];
    $email = $_POST['email'];
    $telefono = $_POST['telefono'];
    $cuit = $_POST['cuit'];
    $condicion_iva = $_POST['condicion_iva'];
    $avatar = 'cliente_default.png';

    $cliente->crear($nombre, $direccion, $email, $telefono, $cuit, $razonsocial, $condicion_iva, $avatar);
}
if ($_POST['funcion'] == 'editar') {
    $id = $_POST['id'];
    $razonsocial = $_POST['razonsocial'];
    $nombre = $_POST['nombre'];
    $direccion = $_POST['direccion'];
    $email = $_POST['email'];
    $telefono = $_POST['telefono'];
    $cuit = $_POST['cuit'];
    $condicion_iva = $_POST['condicion_iva'];

    $cliente->editar($id, $nombre, $direccion, $telefono, $cuit, $razonsocial, $condicion_iva, $email);
}
if ($_POST['funcion'] == 'obtener_clientes') {
    $cliente->obtener_clientes();
    $json = array();
    foreach ($cliente->objetos as $objeto) {
        $json[] = array(
            'id' => $objeto->id,
            'nombre' => $objeto->nombre,
            'telefono' => $objeto->telefono,
            'direccion' => $objeto->direccion,
            'razon_social' => $objeto->razon_social,
            'cuit' => $objeto->cuit,
            'condicion_iva' => $objeto->condicion_iva,
            'avatar' => '../Util/img/clientes/' . $objeto->avatar
        );
    }
    $jsonstring = json_encode($json); // Indicar que es una respuesta JSON
    echo $jsonstring;
}
if ($_POST['funcion'] == 'obtener_cliente_id') {
    $cuit = $_POST['cuit'];
    $cliente->obtener_clientes_id($cuit);
}
if ($_POST['funcion'] == 'enviar_codigo') {
    $cuit = $_POST['cuit'];
    $cliente->enviar_codigo_otp($cuit);
}


if ($_POST['funcion'] == 'buscar') {
    $cliente->buscar();
    $json = array();
    foreach ($cliente->objetos as $objeto) {
        $json[] = array(
            'id' => $objeto->id,
            'nombre' => $objeto->nombre,
            'telefono' => $objeto->telefono,
            'direccion' => $objeto->direccion,
            'razonsocial' => $objeto->razon_social,
            'cuit' => $objeto->cuit,
            'condicion_iva' => $objeto->condicion_iva,
            'avatar' => '../Util/img/clientes/' . $objeto->avatar
        );
    }
    $jsonstring = json_encode($json);
    echo $jsonstring;
}
if ($_POST['funcion'] == 'borrar') {
    $id = $_POST['id'];
    $cliente->borrar($id);
}
if ($_POST['funcion'] == 'rellenar_clientes') {
    $cliente->rellenar_clientes();
    $json = array();
    foreach ($cliente->objetos as $objeto) {
        $json[] = array(
            'id' => $objeto->id,
            'cuit' => $objeto->cuit,
            'razon_social' => $objeto->razon_social
        );
    }
    $jsonstring = json_encode($json);
    echo $jsonstring;
}
