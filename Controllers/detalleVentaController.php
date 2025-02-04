<?php
include_once '../modelo/ventaProducto.php';
include_once '../modelo/detalleVenta.php';
include_once '../modelo/venta.php';
include_once '../modelo/lote.php';
$lote = new Lote();
$venta = new Venta();
$detalle_venta = new DetalleVenta();
$venta_producto = new VentaProducto();
session_start();
$id_usuario = $_SESSION['usuario'];
$tipo_usuario = $_SESSION['us_tipo'];
if($_POST['funcion']=='borrar_venta'){
    $id_venta=$_POST['id'];
    if($venta->verificar($id_venta,$id_usuario)==1){
        $venta_producto->borrar($id_venta);
        $detalle_venta->recuperar($id_venta);
        foreach ($detalle_venta->objetos as $det) {
            $lote->devolver($det->id_det_lote,$det->det_cantidad,$det->det_salida,$det->id_det_prod,$det->lote_id_prov);
            $detalle_venta->borrar($det->id_detalle);
        }
        $venta->borrar($id_venta);
    }
    else{
        if($tipo_usuario==3){
            $venta_producto->borrar($id_venta);
            $detalle_venta->recuperar($id_venta);
            foreach ($detalle_venta->objetos as $det) {
            $lote->devolver($det->id_det_lote,$det->det_cantidad,$det->det_salida,$det->id_det_prod,$det->lote_id_prov);
            $detalle_venta->borrar($det->id_detalle);
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
                    $lote->devolver($det->id_det_lote,$det->det_cantidad,$det->det_salida,$det->id_det_prod,$det->lote_id_prov);
                    $detalle_venta->borrar($det->id_detalle);
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