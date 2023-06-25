<?php
include_once $_SERVER["DOCUMENT_ROOT"].'/gasolero/Models/cliente.php';
include_once $_SERVER["DOCUMENT_ROOT"].'/gasolero/Models/venta.php';
$cliente = new Cliente();
$venta = new Venta();
session_start();
date_default_timezone_set('America/Argentina/Buenos_Aires');
$fecha_actual = date('d-m-Y');

if($_POST['funcion']=='obtener_ventas'){
    $json=array();
    $venta->obtener_ventas();
    foreach ($venta->objetos as $objeto) {
        $fecha_actual = date('d-m-Y');
        $fecha_actual = new DateTime($fecha_actual);
        $json[]=array(
            'id_venta'=>$objeto->id,
            'fecha'=>$objeto->fecha,
            'cliente'=>$objeto->cliente,
            'direccion'=>$objeto->direccion,
            'total'=>$objeto->total
        );
    }
    $jsonstring = json_encode($json);
    echo $jsonstring;
}
/***********************************/

?>