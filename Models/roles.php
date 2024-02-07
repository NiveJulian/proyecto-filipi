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
    function actualizarValorRoles($rolesId, $valor_sueldo_semanal, $valor_sueldo_mensual){
        try {
            $sql="UPDATE roles SET sueldo_semanal=:sueldo_semanal, sueldo_mensual = :sueldo_mensual WHERE id=:rolesId";
            $query=$this->acceso->prepare($sql);
            $query->execute(array(':rolesId'=>$rolesId, ':sueldo_semanal'=>$valor_sueldo_semanal, ':sueldo_mensual'=>$valor_sueldo_mensual));
    
            return true;
        } catch (PDOException $e) {
            echo "Error en la actualización: " . $e->getMessage();
            return false;
        }
    }
    
}
?>
