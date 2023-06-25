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
else if($_POST['funcion']=='verificar_stock'){
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
else if($_POST['funcion']=='traer_productos'){
    $html="";
    $productos=json_decode($_POST['productos']);
    foreach ($productos as $resultado) {
        $producto->buscar_id($resultado->id);
        foreach ($producto->objetos as $objeto) {
            if ($resultado->cantidad=='') {
                $resultadoCantidad=0;
            }
            else{
                $resultadoCantidad = $resultado->cantidad;
            }
            $subtotal=$objeto->precio*$resultadoCantidad;
            $producto->obtener_stock($objeto->id_producto);
            foreach ($producto->objetos as $obj) {
                $stock=$obj->total;
            }
            $html.="
            <div class='card bg-ligth'>
                            <div class='card-body pt-0'>
                                <div class='row'>
                                    <div class='col-md-10 p-1 m-1'>
                                        <ul class='col-ml-4 mb-0 fa-ul'>
                                            <li class='small'><span class='fa-li'><i class='fas fa-heading'></i></i></span>Nombre: ${datos.nombre}</li>
                                            <li class='small'><span class='fa-li'><i class='fas fa-code'></i></span>Codigo: ${datos.codigo}</li>
                                        </ul>
                                    </div>
                                    <div class='col-md-2 text-center'>
                                        <button id='${datos.id}'
                                                nombre='${datos.nombre}'
                                                precio='${datos.precio}'
                                                type='button' class='borrar-producto btn btn-outline-danger btn-circle btn-lg'><i class='far fa-trash-alt'></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ";
        }
    }
    echo $html;
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
 // <tr prodId='$objeto->id_producto' prodPrecio='$objeto->precio'>
            //     <td>$objeto->nombre</td>
            //     <td>$stock</td>
            //     <td>$objeto->precio</td>
            //     <td>$objeto->codigo</td>
            //     <td>$objeto->descripcion</td>
            //     <td>$objeto->tipo</td>
            //     <td>$objeto->presentacion</td>
            //     <td>
            //         <input type='number' min='1' class='form-control cantidad_producto' value='$resultado->cantidad'>
            //     </td>
            //     <td class='subtotales'>
            //         <h5>$subtotal</h5>
            //     </td>
            //     <td><button class='borrar-producto btn btn-danger'><i class='fas fa-times-circle'></i></button></td>
            // </tr>
?>