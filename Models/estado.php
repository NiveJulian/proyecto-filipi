<?php
include_once '../Models/conexion.php';
class Estado {
    var $acceso;
    var $objetos;
    public function __construct(){
        $db= new Conexion();
        $this->acceso= $db->pdo;
    }
    function rellenar_estado(){
        $sql="SELECT * FROM estado_pago";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos=$query->fetchall();
        return $this->objetos;
    }
    function obtener_id($nombre){
        $sql="SELECT * FROM estado_pago where nombre=:nombre";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':nombre'=>$nombre));
        $this->objetos=$query->fetchall();
        return $this->objetos;
    }
}
?>