<?php 
include_once '../modelo/usuario.php';
session_start();
$user = $_POST['username'];
$pass= $_POST['password'];
$usuario = new Usuario();   
if(!empty($_SESSION['us_tipo'])){
    switch ($_SESSION['us_tipo']) {
        case 1:
            header('Location: ../vistas/adm_catalogo.php');
            break;
        case 2:
            header('Location: ../vistas/vendedor_catalogo.php');
            break;
        case 3:
            header('Location: ../vistas/adm_catalogo.php');
            break;
    }
}
else{
    $usuario->Loguearse($user,$pass);
    if(!empty($usuario->objetos)){
        foreach($usuario->objetos as $objeto){
            $_SESSION['usuario']=$objeto->id_usuario;
            $_SESSION['us_tipo']=$objeto->us_tipo;
            $_SESSION['nombre_us']=$objeto->nombre_us;
        }
        switch ($_SESSION['us_tipo']) {
            case 1:
                header('Location: ../vistas/adm_catalogo.php');
                break;
            case 2:
                header('Location: ../vistas/vendedor_catalogo.php');
                break;
            case 3:
                header('Location: ../vistas/adm_catalogo.php');
                break;
        }}
        else{
            header('Location: ../index.php');
        }
    
}

?>  