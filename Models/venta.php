<?php
include_once '../Models/conexion.php';

class Venta
{
    var $objetos;
    var $acceso;
    public function __construct()
    {
        $db = new Conexion();
        $this->acceso = $db->pdo;
    }
    function Crear($fecha, $total, $vendedor, $cliente)
    {
        $sql = "INSERT INTO venta(fecha, total, vendedor, id_cliente) VALUES (:fecha, :total, :vendedor, :cliente)";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':fecha' => $fecha, ':total' => $total, ':vendedor' => $vendedor, ':cliente' => $cliente));
        echo 'add';
    }
    function ultima_venta()
    {
        $sql = "SELECT MAX(id_venta) as ultima_venta FROM venta";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }
    function borrar($id_venta)
    {
        $sql = "DELETE FROM venta where id_venta=:id_venta";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id_venta' => $id_venta));
        echo 'delete';
    }
    function buscar()
    {
        $sql = "SELECT id_venta, fecha, cliente, firma, total, CONCAT(usuario.nombre_us,' ',usuario.apellido_us) as vendedor,id_cliente 
            FROM venta 
            join usuario on vendedor=id";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }
    function verificar($id_venta, $id_usuario)
    {
        $sql = "SELECT * FROM venta WHERE vendedor=:id_usuario and id_venta=:id_venta";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id_usuario' => $id_usuario, ':id_venta' => $id_venta));
        $this->objetos = $query->fetchall();
        if (!empty($this->objetos)) {
            return 1;
        } else {
            return 0;
        }
    }
    function recuperar_vendedor($id_venta)
    {
        $sql = "SELECT us_tipo FROM venta join usuario on id_usuario=vendedor WHERE id_venta=:id_venta";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id_venta' => $id_venta));
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }
    function buscar_id($id_venta)
    {
        $sql = "SELECT id_venta, fecha, cliente, firma, total, CONCAT(usuario.nombre_us,' ',usuario.apellido_us) as vendedor,id_cliente FROM venta join usuario on vendedor=id_usuario and id_venta=:id_venta";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id_venta' => $id_venta));
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }
}
