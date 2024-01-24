<?php
include_once $_SERVER["DOCUMENT_ROOT"] . '/filippi/Models/conexion.php';

class Roles
{
    var $objetos;

    public function __construct()
    {
        $db = new Conexion();
        $this->acceso = $db->pdo;
    }

    function obtenerRoles()
    {
        $sql = "SELECT * FROM roles";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchAll();
    }
}
?>
