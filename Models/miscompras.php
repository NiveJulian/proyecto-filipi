<?php
include_once $_SERVER["DOCUMENT_ROOT"].'/filippi/Models/conexion.php';
class MisCompras {
    var $objetos;
    public function __construct(){
        $db= new Conexion();
        $this->acceso=$db->pdo;
    }
    function crear($codigo,$fecha_compra,$fecha_entrega,$total,$id_estado,$id_proveedor){
        $sql="INSERT INTO compra(codigo,fecha_compra,fecha_entrega,total,estado_pago,proveedor) values (:codigo,:fecha_compra,:fecha_entrega,:total,:estado_pago,:proveedor);";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':codigo'=>$codigo,':fecha_compra'=>$fecha_compra,':fecha_entrega'=>$fecha_entrega,':total'=>$total,':estado_pago'=>$id_estado,':proveedor'=>$id_proveedor));
    }
    function ultima_compra(){
        $sql="SELECT MAX(id) as ultima_compra FROM compra";
           $query = $this->acceso->prepare($sql);
           $query->execute();
           $this->objetos=$query->fetchall();
           return $this->objetos;
    }
    function listar_compras(){
        $sql="SELECT concat(c.id,' | ', c.codigo) as codigo, fecha_compra, fecha_entrega, total, e.nombre as estado, p.nombre as proveedor FROM compra as c
        join estado_pago as e on e.id = estado_pago
        join proveedor as p on p.id = c.proveedor";
           $query = $this->acceso->prepare($sql);
           $query->execute();
           $this->objetos=$query->fetchall();
           return $this->objetos;
    }
    function editarEstado($id_compra, $id_estado){
        $sql="UPDATE compra SET estado_pago=:id_compra where id=:id_estado";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id_estado'=>$id_estado,':id_compra'=>$id_compra));
    }
    function obtenerDatos($id_compra){
        $sql="SELECT concat(c.id,' | ', c.codigo) as codigo, fecha_compra, fecha_entrega, total, 
        e.nombre as estado, p.nombre as proveedor, telefono, correo, localidad, p.avatar as avatar FROM compra as c
        join estado_pago as e on e.id = estado_pago and c.id=:id
        join proveedor as p on p.id_proveedor = c.proveedor";
           $query = $this->acceso->prepare($sql);
           $query->execute(array(':id'=>$id_compra));
           $this->objetos=$query->fetchall();
           return $this->objetos;
    }
    
}
?>