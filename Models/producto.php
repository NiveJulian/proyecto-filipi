<?php
include_once '../Models/conexion.php';
class Producto{
    var $acceso;
    var $objetos;
    public function __construct(){
        $db= new Conexion();
        $this->acceso=$db->pdo;
    }
    function obtener_productos(){
        $sql="SELECT * FROM productos WHERE estado='A' ORDER BY nombre asc";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos=$query->fetchall();
        return $this->objetos;
    }
    function obtener_stock($id){
        $sql="SELECT SUM(cantidad_lote) as total FROM lote WHERE id=:id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id'=>$id));
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }
    function buscar_id($id){
        $sql="SELECT id,
            nombre,
            codigo,
            precio
            FROM productos where id=:id";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':id'=>$id));
            $this->objetos=$query->fetchall();
            return $this->objetos;
    }
    
    /************************************************* */
    function crear($nombre,$descripcion,$codigo,$precio,$tipo,$categoria,$avatar){
        $sql="SELECT * 
        FROM productos where nombre=:nombre 
        and descripcion=:descripcion 
        and codigo=:codigo 
        and precio=:precio
        and id_tipo=:tipo 
        and id_categoria=:categoria";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':nombre'=>$nombre, ':descripcion'=>$descripcion, ':codigo'=>$codigo, ':precio'=>$precio, ':tipo'=>$tipo, ':categoria'=>$categoria));
        $this->objetos=$query->fetchall();
        if(!empty($this->objetos)){
            foreach ($this->objetos as $prod) {
                $prod_id=$prod->id;
                $prod_estado=$prod->estado;
            }
            if($prod_estado=='A'){
                echo 'noadd';
            }
            else{
                $sql="UPDATE productos SET estado='A' where id=:id";
                $query = $this->acceso->prepare($sql);
                $query->execute(array(':id'=>$prod_id));
                echo 'add';
            }
        }
        else{
            $sql="INSERT INTO productos(nombre,descripcion,codigo,precio,id_tipo,id_categoria,avatar) values (:nombre,:descripcion,:codigo,:precio,:tipo,:categoria,:avatar)";
                $query = $this->acceso->prepare($sql);
                $query->execute(array(':nombre'=>$nombre, ':descripcion'=>$descripcion, ':codigo'=>$codigo, ':precio'=>$precio, ':tipo'=>$tipo, ':categoria'=>$categoria, ':avatar'=>$avatar));
                echo 'add';
        }
    }
    function editar($id,$nombre,$descripcion,$precio,$codigo,$tipo,$categoria){
        $sql="SELECT id 
            FROM productos 
            where id!=:id 
            and nombre=:nombre
            and descripcion=:descripcion 
            and codigo=:codigo
            and precio=:precio 
            and id_tipo=:tipo
            and id_categoria=:categoria";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':id'=>$id,':nombre'=>$nombre,':descripcion'=>$descripcion,':codigo'=>$codigo,':precio'=>$precio,':tipo'=>$tipo,':categoria'=>$categoria));
            $this->objetos=$query->fetchall();
        if(!empty($this->objetos)){
            echo 'noedit';
        }
        else{
            $sql="UPDATE productos 
            SET nombre=:nombre, 
            descripcion=:descripcion, 
            codigo=:codigo, 
            precio=:precio, 
            id_tipo=:tipo,
            id_categoria=:categoria where id=:id";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':id'=>$id,':nombre'=>$nombre,':descripcion'=>$descripcion,':codigo'=>$codigo,':precio'=>$precio,':tipo'=>$tipo,':categoria'=>$categoria));
            echo 'edit';
        }
    }        
    function buscar(){
        if(!empty($_POST['consulta'])){
           $consulta=$_POST['consulta'];
           $sql="SELECT productos.id, 
           productos.nombre as nombre, 
           descripcion, 
           codigo, 
           precio, 
           t.nombre as tipo, 
           c.nombre as categoria, 
           productos.avatar as avatar, 
           id_tipo, 
           id_categoria
           FROM productos 
           JOIN tipo t on id_tipo=t.id and estado = 'A'
           JOIN categoria c on id_categoria=c.id 
           where estado='A' and productos.nombre like :consulta limit 25";
           $query = $this->acceso->prepare($sql);
           $query->execute(array(':consulta'=>"%$consulta%"));
           $this->objetos=$query->fetchall();
           return $this->objetos; 
        }
        else{
            $sql="SELECT productos.id, 
            productos.nombre as nombre, 
            descripcion, 
            codigo, 
            precio, 
            t.nombre as tipo, 
            c.nombre as categoria, 
            productos.avatar as avatar, 
            id_tipo, 
            id_categoria
            FROM productos 
            JOIN tipo t on id_tipo=t.id and estado = 'A'
            JOIN categoria c on id_categoria=c.id 
            where estado='A' and productos.nombre not like '' order by productos.nombre limit 25";
            $query = $this->acceso->prepare($sql);
            $query->execute();
            $this->objetos=$query->fetchall();
            return $this->objetos; 
        };
    }
    function cambiar_avatar($id,$nombre){
        $sql="UPDATE productos SET avatar=:nombre WHERE id=:id";
        $query=$this->acceso->prepare($sql);
        $query->execute(array(':id'=>$id,':nombre'=>$nombre));
        return $this->objetos;
    }
    function borrar($id){
        $sql="SELECT * FROM lote where id=:id and estado='A'";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id'=>$id));
        $lote=$query->fetchall();
        if (!empty($lote)){
            echo 'noborrado';
        }
        else {
            $sql="UPDATE productos SET estado='I' where id=:id";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':id'=>$id));
            if (!empty($query->execute(array(':id'=>$id)))) {
                echo 'borrado';
            }
            else{
            echo 'noborrado';
            }
        }
    }
    function rellenar_productos(){
        $sql="SELECT productos.id, 
            productos.nombre as nombre, 
            descripcion, 
            codigo,
            precio, 
            t.nombre as tipo, 
            c.nombre as categoria
            FROM productos
            JOIN tipo t on id_tipo=t.id and estado = 'A'
            JOIN categoria c on id_categoria=c.id 
            order by nombre asc";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos=$query->fetchall();
        return $this->objetos;
    }
    
}
?>