<?php
include '../modelo/proveedor.php';
$proveedor = new Proveedor();
if($_POST['funcion']=='crear'){
    $nombre = $_POST['nombre'];
    $telefono = $_POST['telefono'];
    $correo = $_POST['correo'];
    $localidad = $_POST['localidad'];
    $avatar = 'prov_default.png';

    $proveedor->crear($nombre,$telefono,$correo,$localidad,$avatar);
}
if($_POST['funcion']=='rellenar_proveedores'){
    $proveedor->rellenar_proveedores();
    $json = array();
    foreach ($proveedor->objetos as $objeto){
        $json[]=array(
            'id'=>$objeto->id_proveedor,
            'nombre'=>$objeto->nombre
        );
    };
    $jsonstring=json_encode($json);
    echo $jsonstring;
}
if($_POST['funcion']=='rellenar_lotes'){
    $proveedor->rellenar_lotes();
    $json = array();
    foreach ($proveedor->objetos as $objeto){
        $json[]=array(
            'id'=>$objeto->id_proveedor,
            'nombre'=>$objeto->nombre
        );
    };
    $jsonstring=json_encode($json);
    echo $jsonstring;
}
if($_POST['funcion']=='editar'){
    $id = $_POST['id'];
    $nombre = $_POST['nombre'];
    $telefono = $_POST['telefono'];
    $correo = $_POST['correo'];
    $localidad = $_POST['localidad'];
    $proveedor->editar($id,$nombre,$telefono,$correo,$localidad);
}

if($_POST['funcion']=='buscar'){
    $proveedor->buscar();
    $json=array();
    foreach($proveedor->objetos as $objeto) {
        $json[]=array(
            'id'=>$objeto->id_proveedor,
            'nombre'=>$objeto->nombre,
            'telefono'=>$objeto->telefono,
            'correo'=>$objeto->correo,
            'localidad'=>$objeto->localidad,
            'avatar'=>'../img/prov/'.$objeto->avatar
        );
    }
    $jsonstring = json_encode($json);
    echo $jsonstring;
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