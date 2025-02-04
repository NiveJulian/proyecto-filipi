<?php
include_once 'conexion.php';
class VentaProducto{
    var $objetos;
    public function __construct(){
        $db= new Conexion();
        $this->acceso=$db->pdo;
    }
    function ver($id){
        $sql="SELECT precio,cantidad,producto.nombre as producto,descripcion,codigo, tipo.nombre as tipo, presentacion.nombre as presentacion, subtotal
        FROM venta_producto
        JOIN producto on producto_id_prod = id_producto and venta_id_venta=:id
        JOIN tipo on prod_tip = id_tipo
        JOIN presentacion on prod_pre = id_presentacion";
           $query = $this->acceso->prepare($sql);
           $query->execute(array(':id'=>$id));
           $this->objetos=$query->fetchall();
           return $this->objetos;
    }
    function borrar($id_venta){
        $sql="DELETE FROM venta_producto where venta_id_venta=:id_venta";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id_venta'=>$id_venta));
    }
}
?>