<?php 
include_once $_SERVER["DOCUMENT_ROOT"].'/filippi/Models/tipo.php';
$tipo = new Tipo();
if($_POST['funcion']=='crear'){
    $nombre = $_POST['nombre_tipo'];
    $avatar='avatar-m2.svg';
    $tipo->crear($nombre);
}
if($_POST['funcion']=='editar'){
    $nombre = $_POST['nombre_tipo'];
    $id_editado = $_POST['id_editado'];
    $tipo->editar($nombre,$id_editado);
}

if($_POST['funcion']=='buscar'){
    $tipo->buscar();
    $json=array();
    foreach ($tipo->objetos as $objeto) {
       $json[]=array(
        'id'=>$objeto->id,
        'nombre'=>$objeto->nombre,
       );
    }
    $jsonstring=json_encode($json);
    echo $jsonstring;
}
if($_POST['funcion']=='borrar'){
    $id = $_POST['id'];
    $tipo->borrar($id);
}
if($_POST['funcion']=='rellenar_tipos'){
    $tipo->rellenar_tipos();
    $json = array();
    foreach ($tipo->objetos as $objeto){
        $json[]=array(
            'id'=>$objeto->id,
            'nombre'=>$objeto->nombre
        );
    };
    $jsonstring=json_encode($json);
    echo $jsonstring;
}

?>