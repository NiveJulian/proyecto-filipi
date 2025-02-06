<?php
include_once '../Models/conexion.php';
class Cliente
{
    var $acceso;
    var $objetos;
    public function __construct()
    {
        $db = new Conexion();
        $this->acceso = $db->pdo;
    }
    function buscar()
    {
        if (!empty($_POST['consulta'])) {
            $consulta = $_POST['consulta'];
            $sql = "SELECT id,
            nombre,
            telefono,
            direccion,
            razon_social,
            cuit,
            condicion_iva,
            avatar 
            FROM cliente where estado='A' and nombre LIKE :consulta limit 20";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':consulta' => "%$consulta%"));
            $this->objetos = $query->fetchall();
            return $this->objetos;
        } else {
            $sql = "SELECT id,
             nombre,
             telefono,
             direccion,
             razon_social,
             cuit,
             condicion_iva,
             avatar FROM cliente where estado='A' and nombre NOT LIKE '' ORDER BY id desc LIMIT 20";
            $query = $this->acceso->prepare($sql);
            $query->execute();
            $this->objetos = $query->fetchall();
            return $this->objetos;
        };
    }
    function obtener_clientes()
    {
        $sql = "SELECT * FROM cliente";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }
    function crear($nombre, $direccion, $telefono, $cuit, $razonsocial, $condicion_iva, $avatar)
    {
        $sql = "SELECT id,estado FROM cliente 
        where nombre=:nombre 
        and telefono=:telefono 
        and direccion=:direccion 
        and razon_social=:razon_social
        and cuit=:cuit
        and condicion_iva=:condicion_iva";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':nombre' => $nombre, ':telefono' => $telefono, ':cuit' => $cuit, ':direccion' => $direccion, ':razon_social' => $razonsocial, ':condicion_iva' => $condicion_iva));
        $this->objetos = $query->fetchall();
        if (!empty($this->objetos)) {
            echo 'noadd';
        } else {
            $sql = "INSERT INTO cliente(nombre,telefono,direccion, razon_social, cuit, condicion_iva,avatar) values (:nombre,:telefono, :direccion, :razon_social, :cuit, :condicion_iva, :avatar);";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':nombre' => $nombre, ':telefono' => $telefono, ':cuit' => $cuit, ':direccion' => $direccion, ':razon_social' => $razonsocial, ':condicion_iva' => $condicion_iva, ':avatar' => $avatar));
            echo 'add';
        }
    }

    function editar($id, $nombre, $direccion, $telefono, $cuit, $razonsocial, $condicion_iva)
    {
        $sql = "SELECT id FROM cliente where id != :id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $id));
        $this->objetos = $query->fetchall();
        if (!empty($this->objetos)) {
            echo 'noedit';
        } else {
            $sql = "UPDATE cliente 
            SET nombre=:nombre, 
            telefono=:telefono, 
            direccion=:direccion, 
            cuit=:cuit, 
            razon_social=:razon_social, 
            condicion_iva=:condicion_iva
            where id=:id";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(
                ':id' => $id,
                ':nombre' => $nombre,
                ':telefono' => $telefono,
                ':cuit' => $cuit,
                ':direccion' => $direccion,
                ':razon_social' => $razonsocial,
                ':condicion_iva' => $condicion_iva
            ));
            echo 'edit';
        }
    }
    function borrar($id)
    {
        $sql = "DELETE FROM cliente where id=:id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $id));
        if (!empty($query->execute(array(':id' => $id)))) {
            echo 'borrado';
        } else {
            echo 'noborrado';
        }
    }
    function rellenar_clientes()
    {
        $sql = "SELECT * FROM cliente ORDER BY nombre ASC";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }
}
