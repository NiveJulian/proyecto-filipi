<?php
include_once $_SERVER["DOCUMENT_ROOT"].'/gasolero/Models/producto.php';
$producto = new Producto();

if($_POST['funcion']=='obtener_productos'){
    $producto->obtener_productos();
    $json= array();
    foreach($producto->objetos as $objeto){
        $producto->obtener_stock($objeto->id);
        $stock = $producto->objetos[0]->total;
        $json[]=array(
            'id'=>$objeto->id,
            'nombre'=>$objeto->nombre,
            'codigo'=>$objeto->codigo,
            'precio'=>$objeto->precio,
            'avatar'=>$objeto->avatar,
            'stock'=>$stock
        );
    }
    $jsonstring = json_encode($json);
    echo $jsonstring;
}
if($_POST['funcion']=='verificar_stock'){
    $error=0;
    $productos=json_decode($_POST['productos']);
    foreach ($productos as $objeto) {
        $producto->obtener_stock($objeto->id);

        foreach ($producto->objetos as $obj) {
            $total=$obj->total;
        }
        if($total>=$objeto->cantidad && $objeto->cantidad>0){
            $error=$error+0;
        }
        else{
            $error=$error+1;
        }
    }
    echo $error;
}

/*****************************/
if($_POST['funcion']=='crear'){
    $nombre = $_POST['nombre'];
    $descripcion = $_POST['descripcion'];
    $codigo = $_POST['codigo'];
    $precio = $_POST['precio'];
    $tipo = $_POST['tipo'];
    $proveedor = $_POST['proveedor'];
    $presentacion = $_POST['presentacion'];
    $avatar='prod_default.png';
    $producto->crear($nombre,$descripcion,$codigo,$precio,$tipo,$proveedor,$presentacion,$avatar);
}
if($_POST['funcion']=='editar'){
    $id = $_POST['id'];
    $nombre = $_POST['nombre'];
    $descripcion = $_POST['descripcion'];
    $codigo = $_POST['codigo'];
    $precio = $_POST['precio'];
    $tipo = $_POST['tipo'];
    $proveedor = $_POST['proveedor'];
    $presentacion = $_POST['presentacion'];
    
    $producto->editar($id,$nombre,$descripcion,$codigo,$precio,$tipo,$proveedor,$presentacion);
}
if($_POST['funcion']=='cambiar_avatar'){
    $id=$_POST['id_logo_prod'];
    $avatar=$_POST['avatar'];
    if(($_FILES['photo']['type']=='image/jpeg')||($_FILES['photo']['type']=='image/png')||($_FILES['photo']['type']=='image/gif')){
        $nombre=uniqid().'-'.$_FILES['photo']['name'];
        $ruta='/gasolero/Util/img/productos/'.$nombre;
        move_uploaded_file($_FILES['photo']['tmp_name'],$ruta);
        $producto->cambiar_avatar($id,$nombre);
        if ($avatar != '../img/prod/prod_default.png'){
                unlink($avatar);
            }
        $json=array();
        $json[]=array(
            'ruta'=>$ruta,
            'alert'=>'edit'
        );
        $jsonstring = json_encode($json[0]);
        echo $jsonstring;
    }
    else{
        $json=array();
        $json[]=array(
            'alert'=>'noedit'
        );
        $jsonstring = json_encode($json[0]);
        echo $jsonstring;
    }
}
if($_POST['funcion']=='borrar'){
    $id=$_POST['id'];
    $producto->borrar($id);
}
if($_POST['funcion']=='buscar_id'){
    $id=$_POST['id_producto'];
    $producto->buscar_id($id);
    $json=array();
    foreach($producto->objetos as $objeto){
        $producto->obtener_stock($objeto->id_producto);
        foreach($producto->objetos as $obj){
            $total =$obj->total;
        };
        $json[]=array(
            'id'=>$objeto->id_producto,
            'nombre'=>$objeto->nombre,
            'descripcion'=>$objeto->descripcion,
            'codigo'=>$objeto->codigo,
            'precio'=>$objeto->precio,
            'stock'=>$total,
            'tipo'=>$objeto->tipo,
            'proveedor'=>$objeto->proveedor,
            'presentacion'=>$objeto->presentacion,
            'tipo_id'=>$objeto->prod_tip,
            'proveedor_id'=>$objeto->prod_prov,
            'presentacion_id'=>$objeto->prod_pre,
            'avatar'=>'../img/prod'.$objeto->avatar,
        );
    }
    $jsonstring = json_encode($json[0]);
    echo $jsonstring;
}

?>