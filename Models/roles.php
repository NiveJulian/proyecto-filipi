<?php
include_once '../Models/conexion.php';

class Roles
{
    var $objetos;
    var $acceso;

    public function __construct()
    {
        $db = new Conexion();
        $this->acceso = $db->pdo;
    }

    function crearRol($rol, $valor_sueldo_semanal, $valor_sueldo_mensual)
    {
        $sql = "SELECT * FROM roles where nombre=:nombre";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':nombre' => $rol));
        $this->objetos = $query->fetchall();
        if (!empty($this->objetos)) {
            echo 'noadd';
        } else {
            $sql = "INSERT INTO roles(nombre, sueldo_semanal, sueldo_mensual) VALUES (:nombre, :sueldo_semanal, :sueldo_mensual)";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':nombre' => $rol, ':sueldo_semanal' => $valor_sueldo_semanal, ':sueldo_mensual' => $valor_sueldo_mensual));
            echo 'add';
        }
    }

    function obtenerRoles()
    {
        $sql = "SELECT * FROM roles";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchAll();
    }
    function actualizarValorRoles($rolesId, $valor_sueldo_semanal, $valor_sueldo_mensual)
    {
        try {
            $sql = "UPDATE roles SET sueldo_semanal=:sueldo_semanal, sueldo_mensual = :sueldo_mensual WHERE id=:rolesId";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':rolesId' => $rolesId, ':sueldo_semanal' => $valor_sueldo_semanal, ':sueldo_mensual' => $valor_sueldo_mensual));

            return true;
        } catch (PDOException $e) {
            echo "Error en la actualización: " . $e->getMessage();
            return false;
        }
    }
}
