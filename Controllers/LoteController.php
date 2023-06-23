<?php
include_once $_SERVER["DOCUMENT_ROOT"].'/gasolero/Models/lote.php';
$lote = new Lote();

if($_POST['funcion']=='crear'){
    $id_producto = $_POST['id_producto'];
    $proveedor = $_POST['proveedor'];
    $stock = $_POST['stock'];
    $recibido = $_POST['recibido'];
    $lote->crear($id_producto,$proveedor,$stock,$recibido);
}
if($_POST['funcion']=='buscar'){
    $lote->buscar();
    $json=array();
    foreach($lote->objetos as $objeto){
        $recomprar = $objeto->stock;
        if($recomprar>5){
            $estado='light';
        }
        if($recomprar<=5){
            $estado='warning';
        }
        if($recomprar<=3){
            $estado='danger';
        }
        $json[]=array(
            'id'=>$objeto->id_lote,
            'nombre'=>$objeto->prod_nom,
            'descripcion'=>$objeto->descripcion,
            'codigo'=>$objeto->codigo,
            'recibido'=>$objeto->recibido,
            'stock'=>$objeto->stock,
            'tipo'=>$objeto->tip_nom,
            'proveedor'=>$objeto->prov_nom,
            'presentacion'=>$objeto->pre_nom,
            'avatar'=>'../img/prod'.$objeto->logo,
            'estado'=>$estado
        );
    }
    $jsonstring = json_encode($json);
    echo $jsonstring;
}
if($_POST['funcion']=='borrar'){
    $id=$_POST['id'];
    $lote->borrar($id);
}
?>