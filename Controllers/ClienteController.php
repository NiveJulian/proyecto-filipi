<?php 
include '../modelo/cliente.php';
$cliente = new Cliente();
if($_POST['funcion']=='crear'){
    $nombre = $_POST['nombre'];
    $apellidos = $_POST['apellido'];
    $telefono = $_POST['telefono'];
    $correo = $_POST['correo'];
    $razonsocial = $_POST['razonsocial'];
    $adicional = $_POST['adicional'];
    $avatar= '../img/avatar.png';

    $cliente->crear($nombre,$apellidos,$telefono,$correo,$razonsocial,$adicional,$avatar);
}
if($_POST['funcion']=='editar_cliente'){
    $id = $_POST['id'];
    $telefono = $_POST['telefono'];
    $correo = $_POST['correo'];
    $razonsocial = $_POST['razonsocial'];
    $adicional = $_POST['adicional'];

    $cliente->editar($id,$telefono,$correo,$razonsocial,$adicional);
}
if($_POST['funcion']=='buscar'){
    $cliente->buscar();
    $json=array();
    foreach($cliente->objetos as $objeto) {
        $json[]=array(
            'id'=>$objeto->id,
            'nombre'=>$objeto->nombre.' '.$objeto->apellido,
            'telefono'=>$objeto->telefono,
            'correo'=>$objeto->correo,
            'razonsocial'=>$objeto->razonsocial,
            'adicional'=>$objeto->adicional,
            'estado'=>$objeto->estado,
            'avatar'=>'../img/cliente/avatar5.png'
        );
    }
    $jsonstring = json_encode($json);
    echo $jsonstring;
}
if($_POST['funcion']=='borrar'){
    $id=$_POST['id'];
    $cliente->borrar($id);
}
if($_POST['funcion']=='rellenar_clientes'){
    $cliente->rellenar_clientes();
    $json = array();
    foreach ($cliente->objetos as $objeto){
       $json[] = array(
        'id'=>$objeto->id,
        'nombre'=>$objeto->nombre.' '.$objeto->apellido.' | '.$objeto->razonsocial
       );
    }
    $jsonstring = json_encode($json);
    echo $jsonstring;
}
    

?>