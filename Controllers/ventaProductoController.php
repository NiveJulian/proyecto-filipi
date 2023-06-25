<?php
include_once $_SERVER["DOCUMENT_ROOT"].'/gasolero/Models/ventaProducto.php';
$venta_producto = new VentaProducto();
if($_POST['funcion']=='ver'){
    $id=$_POST['id'];
    $venta_producto->ver($id);
    $json=array();
    foreach ($venta_producto->objetos as $objeto) {
        $json[]=array(
            'precio'=>$objeto->precio,
            'cantidad'=>$objeto->cantidad,
            'producto'=>$objeto->producto,
            'subtotal'=>$objeto->subtotal,
        );
    }
    $jsonstring = json_encode($json);
    echo $jsonstring;
}
?>