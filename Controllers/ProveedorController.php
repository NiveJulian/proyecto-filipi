<?php
include_once '../Models/proveedor.php';
$proveedor = new Proveedor();

if ($_POST['funcion'] == 'obtener_proveedores') {
    $proveedores = $proveedor->obtener_proveedores();
    $json = array();
    foreach ($proveedores as $objeto) {
        $telefonos = $proveedor->obtener_telefonos_por_proveedor($objeto->id);

        $json[] = array(
            'id' => $objeto->id,
            'nombre' => $objeto->nombre,
            'direccion' => $objeto->direccion,
            'razon_social' => $objeto->razon_social,
            'cuit' => $objeto->cuit,
            'condicion_iva' => $objeto->condicion_iva,
            'cbu' => $objeto->cbu,
            'cvu' => $objeto->cvu,
            'avatar' => '../Util/img/proveedores/' . $objeto->avatar,
            'telefonos' => $telefonos // Incluir los teléfonos en la respuesta JSON
        );
    }
    $jsonstring = json_encode($json);
    echo $jsonstring;
}

if ($_POST['funcion'] == 'buscar') {
    $proveedores = $proveedor->buscar();
    $json = array();
    foreach ($proveedores as $objeto) {
        $telefonos = $proveedor->obtener_telefonos_por_proveedor($objeto->id);

        $json[] = array(
            'id' => $objeto->id,
            'nombre' => $objeto->nombre,
            'direccion' => $objeto->direccion,
            'razon_social' => $objeto->razon_social,
            'cuit' => $objeto->cuit,
            'condicion_iva' => $objeto->condicion_iva,
            'cbu' => $objeto->cbu,
            'cvu' => $objeto->cvu,
            'avatar' => '../Util/img/proveedores/' . $objeto->avatar,
            'telefonos' => $telefonos // Incluir los teléfonos en la respuesta JSON
        );
    }
    $jsonstring = json_encode($json);
    echo $jsonstring;
}
if($_POST['funcion']=='crear'){
    $razonsocial = $_POST['razonsocial'];
    $nombre = $_POST['nombre'];
    $direccion = $_POST['direccion'];
    $cuit = $_POST['cuit'];
    $condicion_iva = $_POST['condicion_iva'];
    $cbu = $_POST['cbu'];
    $cvu = $_POST['cvu'];
    $avatar = 'prov_default.png';
    $telefonos = isset($_POST['telefonos']) ? $_POST['telefonos'] : array(); 

    $respuesta = $proveedor->crear($nombre, $direccion, $cuit, $razonsocial, $condicion_iva, $cbu, $cvu, $avatar, $telefonos);
    echo $respuesta;
}
if($_POST['funcion']=='rellenar_proveedores'){
    $proveedor->rellenar_proveedores();
    $json = array();
    foreach ($proveedor->objetos as $objeto){
        $json[]=array(
            'id'=>$objeto->id,
            'nombre'=>$objeto->nombre,
            'razon_social'=>$objeto->razon_social,
            'cuit'=>$objeto->cuit,
        );
    };
    $jsonstring=json_encode($json);
    echo $jsonstring;
}
if($_POST['funcion']=='editar'){
    $id = $_POST['id'];
    $razonsocial = $_POST['razonsocial'];
    $nombre = $_POST['nombre'];
    $direccion = $_POST['direccion'];
    $cuit = $_POST['cuit'];
    $condicion_iva = $_POST['condicion_iva'];
    $cbu = $_POST['cbu'];
    $cvu = $_POST['cvu'];
    $proveedor->editar($id,$nombre,$direccion,$cuit,$razonsocial,$condicion_iva,$cbu,$cvu);
}
if($_POST['funcion']=='cambiar_logo'){
    $id=$_POST['id_logo_prov'];
    $avatar=$_POST['avatar'];
    if(($_FILES['photo']['type']=='image/jpeg')||($_FILES['photo']['type']=='image/png')||($_FILES['photo']['type']=='image/gif')){
        $nombre=uniqid().'-'.$_FILES['photo']['name'];
        $ruta='../img/prov/'.$nombre;
        move_uploaded_file($_FILES['photo']['tmp_name'],$ruta);
        $proveedor->cambiar_logo($id,$nombre);
        if ($avatar != '../img/prov/prov_default.png'){
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
    $proveedor->borrar($id);
}
?>