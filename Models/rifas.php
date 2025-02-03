<?php
include_once '../Models/conexion.php';

class Rifa{
    var $objetos;
    public function __construct(){
        $db= new Conexion();
        $this->acceso= $db->pdo;
    }
    function obtenerDatosArchivoPDF($archivoId){
        $sql="SELECT nombre, ruta FROM archivos WHERE id = :archivoId";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':archivoId' => $archivoId));
        $this->objetos = $query->fetchAll();
        return $this->objetos;
    }


}
?>