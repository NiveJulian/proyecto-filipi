<?php
include_once $_SERVER["DOCUMENT_ROOT"].'/filippi/Models/usuario.php';
$usuario = new Usuario();
session_start();
if($_POST['funcion']=='login'){
    $dni=$_POST['dni'];
    $pass=$_POST['pass'];
    $usuario->login($dni);
    $mensaje= '';
    if (!empty($usuario->objetos)) {
        $contrasena = $usuario->objetos[0]->contrasena;
        if ($pass==$contrasena ) {
            $_SESSION['id']=    $usuario->objetos[0]->id;
            $_SESSION['nombre']=$usuario->objetos[0]->nombre;
            $_SESSION['apellido']=$usuario->objetos[0]->apellido;
            $_SESSION['dni']=$usuario->objetos[0]->dni;
            $_SESSION['id_tipo']=$usuario->objetos[0]->id_tipo;
            $_SESSION['tipo']=$usuario->objetos[0]->tipo;
            $mensaje= 'success';
        }
        else {
            $mensaje= 'error';
        }
    }
    else {
        $mensaje= 'error';
    }
    // echo $dni.' '.$pass;
    $json = array(
        'mensaje'=>$mensaje
    );
    $jsonstring=json_encode($json);
    echo $jsonstring;
}
else
if($_POST['funcion']=='verificar_sesion'){
    if (!empty($_SESSION['id'])) {
        $json = array(
            'id'=>$_SESSION['id'],
            'nombre'=>$_SESSION['nombre'],
            'apellido'=>$_SESSION['apellido'],
            'dni'=>$_SESSION['dni'],
            'id_tipo'=>$_SESSION['id_tipo'],
            'tipo'=>$_SESSION['tipo']
        );
    } else {
        $json = array();
    }
    $jsonstring=json_encode($json);
    echo $jsonstring;
}

/***********************************/
if($_POST['funcion']=='crear_usuario'){
    $nombre = $_POST['nombre'];
    $apellido = $_POST['apellido'];
    $telefono = $_POST['telefono'];
    $correo = $_POST['correo'];
    $dni = $_POST['dni'];
    $pass = $_POST['pass'];
    $tipo = 2;
    $avatar='user_default.png';
    $usuario->crear($nombre,$apellido,$dni,$correo,$telefono,$pass,$avatar,$tipo);
}
if ($_POST['funcion']=='buscar_usuario') {
    $json=array();
    $fecha_actual = new DateTime();
    $usuario->obtener_datos($_POST['dato']);

    foreach ($usuario->objetos as $objeto) {
        $nacimiento = new DateTime($objeto->edad_us);
        $edad= $nacimiento->diff($fecha_actual);
        $edad_years = $edad->y;
        $json[]=array(
            'nombre'=>$objeto->nombre,
            'apellido'=>$objeto->apellido,
            'edad'=>$edad_years,
            'dni'=>$objeto->dni,
            'tipo'=>$objeto->nombre_tipo,
            'telefono'=>$objeto->telefono,
            'correo'=>$objeto->correo,
            'avatar'=>'../img/'.$objeto->avatar
        );
    }
    $jsonstring = json_encode($json[0]);
    echo $jsonstring;
}
if ($_POST['funcion']=='buscar_usuarios_adm') {
    $json=array();
    $fecha_actual = new DateTime();
    $usuario->buscar();
    foreach ($usuario->objetos as $objeto) {
        $json[]=array(
            'id'=>$objeto->id_usuario,
            'nombre'=>$objeto->names,
            'apellido'=>$objeto->apellido,
            'dni'=>$objeto->dni,
            'telefono'=>$objeto->telefono,
            'tipo'=>$objeto->nombre_tipo,
            'correo'=>$objeto->correo,
            'avatar'=>'/filippi/Util/img/'.$objeto->avatar,
            'tipo_usuario'=>$objeto->tipos
        );
    }
    $jsonstring = json_encode($json);
    echo $jsonstring;
}
if ($_POST['funcion']=='capturar_datos') {
    $json=array();
    $id_usuario=$_POST['id_usuario'];
    $usuario->obtener_datos($id_usuario);
    foreach ($usuario->objetos as $objeto) {
        $json[]=array(
            'telefono'=>$objeto->telefono_us, 
            'localidad'=>$objeto->localidad_us,
            'correo'=>$objeto->correo_us,
            'sexo'=>$objeto->sexo_us,
            'adicional'=>$objeto->adicional_us
        );
    }
    $jsonstring = json_encode($json[0]);
    echo $jsonstring;
}
if ($_POST['funcion']=='editar_usuario') {
    $id_usuario=$_POST['id_usuario'];
    $telefono=$_POST['telefono'];
    $localidad=$_POST['localidad'];
    $correo=$_POST['correo'];
    $sexo=$_POST['sexo'];
    $adicional=$_POST['adicional'];
    $usuario->editar($id_usuario,$funcion,$telefono,$localidad,$correo,$sexo,$adicional);
    echo 'editado';
}
if ($_POST['funcion']=='cambiar_contra') {
    $id_usuario=$_POST['id_usuario'];
    $oldpass= $_POST['oldpass'];
    $newpass= $_POST['newpass'];
    $usuario->cambiar_contra($id_usuario,$newpass,$oldpass);
}
if($_POST['funcion']=='cambiar_foto'){
    if(($_FILES['photo']['type']=='image/jpeg')||($_FILES['photo']['type']=='image/png')||($_FILES['photo']['type']=='image/gif')){
        $nombre=uniqid().'-'.$_FILES['photo']['name'];
        $ruta='../img/'.$nombre;
        move_uploaded_file($_FILES['photo']['tmp_name'],$ruta);
        $usuario->cambiar_photo($id_usuario,$nombre);
        foreach ($usuario->objetos as $objeto){
                unlink('../img/'.$objeto->avatar);
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
if($_POST['funcion']=='ascender'){
    $pass = $_POST['pass'];
    $id_ascendido=$_POST['id_usuario'];
    $usuario->ascender($pass,$id_ascendido,$id_usuario);
}
if($_POST['funcion']=='descender'){
    $pass = $_POST['pass'];
    $id_descendido=$_POST['id_usuario'];
    $usuario->descender($pass,$id_descendido,$id_usuario);
}
if($_POST['funcion']=='borrar_usuario'){
    $pass = $_POST['pass'];
    $id_borrado=$_POST['id_usuario'];
    $usuario->borrar($pass,$id_borrado);
}
?>