<?php
include_once $_SERVER["DOCUMENT_ROOT"].'/gasolero/Models/conexion.php';
class Lote {
    var $objetos;
    public function __construct(){
        $db= new Conexion();
        $this->acceso= $db->pdo;
    }
    function crear($id_producto,$id_compra,$stock,$recibido){
        $sql="INSERT INTO lote(cantidad_lote,fecha_entrega,id_compra,id_producto) values (:cantidad_lote,:fecha_entrega,:id_compra,:id_producto) ";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':cantidad_lote'=>$stock,':fecha_entrega'=>$recibido,':id_compra'=>$id_compra,':id_producto'=>$id_producto));
        echo 'add';
    }
    function buscar(){
        if(!empty($_POST['consulta'])){
           $consulta=$_POST['consulta'];
           $sql="SELECT l.id as id_lote,
           concat(l.id,' | ', l.codigo) as codigo,
           cantidad,
           cantidad_lote,
           fecha_entrega,
           precio_compra, 
           producto.nombre as prod_nom,
           producto.avatar as logo
           FROM lote as l
           join compra on l.id_compra = compra.id and l.estado='A'
           join producto on producto.id=l.id_producto and producto.nombre LIKE :consulta ORDER BY producto.nombre limit 25;";
           $query = $this->acceso->prepare($sql);
           $query->execute(array(':consulta'=>"%$consulta%"));
           $this->objetos=$query->fetchall();
           return $this->objetos; 
        }
        else{
            $sql="SELECT l.id as id_lote,
            concat(l.id,' | ', l.codigo) as codigo,
            cantidad,
            cantidad_lote,
            fecha_entrega,
            precio_compra, 
            producto.nombre as prod_nombre,
            producto.avatar as logo
            FROM lote as l
            join compra on l.id_compra = compra.id and l.estado='A'
            join producto on producto.id=l.id_producto and producto.nombre NOT LIKE '' ORDER BY producto.nombre limit 25;";
            $query = $this->acceso->prepare($sql);
            $query->execute();
            $this->objetos=$query->fetchall();
            return $this->objetos; 
        };
    }
    function devolver($id_lote,$cantidad,$recibido,$producto,$proveedor){
        $sql="SELECT * FROM lote WHERE id=:id_lote";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':id_lote'=>$id_lote));
            $lote=$query->fetchall();

                $sql="UPDATE lote SET cantidad_lote=cantidad_lote+:cantidad,estado='A' where id=:id_lote";
                $query = $this->acceso->prepare($sql);
                $query->execute(array(':cantidad'=>$cantidad,':id_lote'=>$id_lote));
    }
    /////////////////////////////////////////////////////////////////////
    
    function borrar($id){
        $sql="DELETE FROM lote where id_lote=:id"; //and estado='A' 
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id'=>$id));
        if (!empty($query->execute(array(':id'=>$id)))){
            echo 'borrado';
        }
        else {
            echo 'noborrado';
        }
    }
}
?>