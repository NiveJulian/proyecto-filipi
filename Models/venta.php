<?php
include_once $_SERVER["DOCUMENT_ROOT"].'/gasolero/Models/conexion.php';
class Venta{
    var $objetos;
    public function __construct(){
        $db= new Conexion();
        $this->acceso=$db->pdo;
    }
    
    function obtener_ventas(){
        $sql="SELECT
        id,
        fecha,
        cliente,
        total
        FROM venta ORDER BY id ASC";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos= $query->fetchall();
        return $this->objetos;
    }
    function Crear($fecha,$cliente,$total,$vendedor){
        $sql="INSERT INTO venta(fecha,cliente,total,id_usuario) values(:fecha,:cliente,:total,:id_usuario)";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':fecha'=>$fecha,':cliente'=>$cliente,':total'=>$total,':id_usuario'=>$vendedor));
    }
    function ultima_venta(){
        $sql="SELECT MAX(id) as ultima_venta FROM venta";
           $query = $this->acceso->prepare($sql);
           $query->execute();
           $this->objetos=$query->fetchall();
           return $this->objetos;
    }
    function borrar($id_venta){
        $sql="DELETE FROM venta where id_venta=:id_venta";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':id_venta'=>$id_venta));
            echo 'delete';
    }
    function verificar($id_venta,$id_usuario){
        $sql="SELECT * FROM venta WHERE vendedor=:id_usuario and id_venta=:id_venta";
           $query = $this->acceso->prepare($sql);
           $query->execute(array(':id_usuario'=>$id_usuario, ':id_venta'=>$id_venta));
           $this->objetos=$query->fetchall();
           if(!empty($this->objetos)){
                return 1;
           }
           else{
                return 0;
           }
    }
    
}
?>