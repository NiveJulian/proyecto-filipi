<?php
include_once $_SERVER["DOCUMENT_ROOT"].'/gasolero/Models/conexion.php';
class Producto{
    var $objetos;
    public function __construct(){
        $db= new Conexion();
        $this->acceso=$db->pdo;
    }
    function obtener_productos(){
        $sql="SELECT *
        FROM productos 
        WHERE estado='A' ORDER BY nombre asc";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos=$query->fetchall();
        return $this->objetos;
    }
    function obtener_stock($id){
        $sql="SELECT SUM(cantidad_lote) as total FROM lote where id_producto=:id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id'=>$id));
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }

    
    /************************************************* */
    function crear($nombre,$descripcion,$codigo,$precio,$tipo,$proveedor,$presentacion,$avatar){
        $sql="SELECT id_producto 
        FROM producto where nombre=:nombre and descripcion=:descripcion 
        and codigo=:codigo and prod_tip=:tipo and prod_prov=:proveedor 
        and prod_pre=:presentacion";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':nombre'=>$nombre, ':descripcion'=>$descripcion, ':codigo'=>$codigo, ':tipo'=>$tipo, ':proveedor'=>$proveedor, ':presentacion'=>$presentacion));
        $this->objetos=$query->fetchall();
        if(!empty($this->objetos)){
            echo 'noadd';
        }
        else{
            $sql="INSERT INTO producto(nombre,descripcion,codigo,precio,prod_tip,prod_prov,prod_pre,avatar) values (:nombre,:descripcion,:codigo,:precio,:tipo,:proveedor,:presentacion,:avatar)";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':nombre'=>$nombre, ':descripcion'=>$descripcion, ':codigo'=>$codigo, ':tipo'=>$tipo, ':proveedor'=>$proveedor, ':presentacion'=>$presentacion,':precio'=>$precio, ':avatar'=>$avatar));
            echo 'add';
        }
    }
    function editar($id,$nombre,$descripcion,$codigo,$precio,$tipo,$proveedor,$presentacion){
        $sql="SELECT id_producto FROM producto where id_producto != :id and nombre=:nombre and descripcion=:descripcion and codigo=:codigo and prod_tip=:tipo and prod_prov=:proveedor and prod_pre=:presentacion";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id'=>$id,':nombre'=>$nombre,':descripcion'=>$descripcion,':codigo'=>$codigo,':tipo'=>$tipo,':proveedor'=>$proveedor,':presentacion'=>$presentacion));
        $this->objetos=$query->fetchall();
        if(!empty($this->objetos)){
            echo 'noedit';
        }
        else{
            $sql="UPDATE producto SET nombre=:nombre, descripcion=:descripcion, codigo=:codigo, prod_tip=:tipo, prod_prov=:proveedor, prod_pre=:presentacion, precio=:precio where id_producto=:id";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':id'=>$id,':nombre'=>$nombre,':descripcion'=>$descripcion,':codigo'=>$codigo,':tipo'=>$tipo,':proveedor'=>$proveedor,':presentacion'=>$presentacion,':precio'=>$precio));
            echo 'edit';
        }
    }    
    function cambiar_avatar($id,$nombre){
        $sql="SELECT avatar FROM producto where id_producto=:id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id'=>$id));
        $this->objetos = $query->fetchall();

            $sql="UPDATE producto SET avatar=:nombre WHERE id_producto=:id";
            $query=$this->acceso->prepare($sql);
            $query->execute(array(':id'=>$id,':nombre'=>$nombre));
        return $this->objetos;
    }
    function borrar($id){
        $sql="DELETE FROM producto where id_producto=:id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id'=>$id));
        if (!empty($query->execute(array(':id'=>$id)))){
            echo 'borrado';
        }
        else {
            echo 'noborrado';
        }
    }
    function buscar_id($id){
        $sql="SELECT id_producto, producto.nombre as nombre, descripcion, codigo, precio, tipo.nombre as tipo, proveedor.nombre as proveedor, presentacion.nombre as presentacion, producto.avatar as avatar, prod_tip, prod_prov, prod_pre 
            FROM producto
            join tipo on prod_tip=id_tipo
            join proveedor on prod_prov=id_proveedor
            join presentacion on prod_pre=id_presentacion where id_producto=:id";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':id'=>$id));
            $this->objetos=$query->fetchall();
            return $this->objetos;
    }
}
?>