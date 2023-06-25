<?php
include_once $_SERVER["DOCUMENT_ROOT"].'/gasolero/Models/conexion.php';
class VentaProducto{
    var $objetos;
    public function __construct(){
        $db= new Conexion();
        $this->acceso=$db->pdo;
    }
    function ver($id){
        $sql="SELECT 
        precio,
        cantidad,
        p.nombre as producto,
        subtotal
        FROM venta_producto
        JOIN productos p on id_producto = p.id and id_venta=:id";
           $query = $this->acceso->prepare($sql);
           $query->execute(array(':id'=>$id));
           $this->objetos=$query->fetchall();
           return $this->objetos;
    }
    function borrar($id_venta){
        $sql="DELETE FROM venta_producto where id_venta=:id_venta";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id_venta'=>$id_venta));
    }
}
?>