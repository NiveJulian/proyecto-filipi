<?php
include_once $_SERVER["DOCUMENT_ROOT"].'/gasolero/Models/ventaProducto.php';
include_once $_SERVER["DOCUMENT_ROOT"].'/gasolero/Models/detalleVenta.php';
include_once $_SERVER["DOCUMENT_ROOT"].'/gasolero/Models/venta.php';
include_once $_SERVER["DOCUMENT_ROOT"].'/gasolero/Models/lote.php';
$lote = new Lote();
$venta = new Venta();
$detalle_venta = new DetalleVenta();
$venta_producto = new VentaProducto();
session_start();
$id_usuario = $_SESSION['id'];
$tipo_usuario = $_SESSION['id_tipo'];

if($_POST['funcion']=='borrar_venta'){
    $id_venta=$_POST['id'];
    if($venta->verificar($id_venta,$id_usuario)==1){
        $venta_producto->borrar($id_venta);
        $detalle_venta->recuperar($id_venta);
        foreach ($detalle_venta->objetos as $det) {
            $lote->devolver($det->id,$det->cantidad,$det->salida,$det->producto,$det->proveedor);
            $detalle_venta->borrar($det->id);
        }
        $venta->borrar($id_venta);
    }
    else{
        if($tipo_usuario==3){
            $venta_producto->borrar($id_venta);
            $detalle_venta->recuperar($id_venta);
            foreach ($detalle_venta->objetos as $det) {
            $lote->devolver($$det->id,$det->cantidad,$det->salida,$det->producto,$det->proveedor);
            $detalle_venta->borrar($det->id);
        }
        $venta->borrar($id_venta);
        }
        else if($tipo_usuario==1){
            $venta->recuperar_vendedor($id_venta);
            foreach ($venta->objetos as $objeto) {
                if($objeto->us_tipo==2){
                    $venta_producto->borrar($id_venta);
                    $detalle_venta->recuperar($id_venta);
                    foreach ($detalle_venta->objetos as $det) {
                    $lote->devolver($det->id,$det->cantidad,$det->salida,$det->producto,$det->proveedor);
                    $detalle_venta->borrar($det->id);
                }
                $venta->borrar($id_venta);
                }
                else{
                    echo 'nodelete';
                }
            }
        }
        else{
            echo 'nodelete';
        }
    }
}
?>