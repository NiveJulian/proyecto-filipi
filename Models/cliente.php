<?php
include_once $_SERVER["DOCUMENT_ROOT"].'/gasolero/Models/conexion.php';
class Cliente{
    var $objetos;
    public function __construct(){
        $db= new Conexion();
        $this->acceso= $db->pdo;
    }

}

?>