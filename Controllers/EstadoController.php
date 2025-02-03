<?php
    include_once '../Models/estado.php';
    $estado = new Estado();
    
    if($_POST['funcion']=='rellenar_estado'){
        $estado->rellenar_estado();
        $json = array();
        foreach ($estado->objetos as $objeto){
           $json[] = array(
            'id'=>$objeto->id,
            'nombre'=>$objeto->nombre
           );
        }
        $jsonstring = json_encode($json);
        echo $jsonstring;
    }
    if($_POST['funcion']=='cambiarEstado'){
        $nombre = $_POST['estado'];
        $estado->obtener_id($nombre);
        foreach ($estado->objetos as $objeto){
            $json[] = array(
             'id'=>$objeto->id
            );
         }
         $jsonstring = json_encode($json);
         echo $jsonstring;
    }
?>