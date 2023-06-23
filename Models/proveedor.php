<?php
include 'conexion.php';
class Proveedor{
    var $objetos;
    public function __construct(){
        $db= new Conexion();
        $this->acceso= $db->pdo;
    }
    function crear($nombre,$telefono,$correo,$localidad,$avatar){
        $sql="SELECT id_proveedor,estado FROM proveedor where nombre=:nombre and telefono=:telefono and correo=:correo and direccion=:direccion";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':nombre'=>$nombre,':telefono'=>$telefono,':correo'=>$correo,':direccion'=>$direccion));
        $this->objetos=$query->fetchall();
        if(!empty($this->objetos)){
            foreach ($this->objetos as $prov) {
                $prov_id = $prov->id_proveedor;
                $prov_estado = $prov->estado;
            }
            if($prov_estado=='A'){
                echo 'noadd';
            }
            else{
                $sql="UPDATE proveedor SET estado='A' where id_proveedor=:id";
                $query = $this->acceso->prepare($sql);
                $query->execute(array(':id'=>$prov_id));
                echo 'add';
            }
        }
        else{
            $sql="INSERT INTO proveedor(nombre,telefono,correo,localidad,avatar) values (:nombre,:telefono,:correo,:localidad,:avatar);";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':nombre'=>$nombre,':telefono'=>$telefono,':correo'=>$correo,':localidad'=>$localidad,':avatar'=>$avatar));
            echo 'add';
        }
    }
    
    function editar($id,$nombre,$telefono,$correo,$localidad){
        $sql="SELECT id_proveedor FROM proveedor where id_proveedor!=:id and nombre=:nombre";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id'=>$id,':nombre'=>$nombre));
        $this->objetos=$query->fetchall();
        if(!empty($this->objetos)){
            echo 'noedit';
        }
        else{
            $sql="UPDATE proveedor SET nombre=:nombre, telefono=:telefono, correo=:correo, localidad=:localidad where id_proveedor=:id";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':id'=>$id,':nombre'=>$nombre,':telefono'=>$telefono,':correo'=>$correo,':localidad'=>$localidad));
            echo 'edit';
        }
    }
    function buscar(){
        if(!empty($_POST['consulta'])){
           $consulta=$_POST['consulta'];
           $sql="SELECT * FROM proveedor where nombre LIKE :consulta";
           $query = $this->acceso->prepare($sql);
           $query->execute(array(':consulta'=>"%$consulta%"));
           $this->objetos=$query->fetchall();
           return $this->objetos; 
        }
        else{
            $sql="SELECT * FROM proveedor where nombre NOT LIKE '' ORDER BY id_proveedor desc LIMIT 10";
            $query = $this->acceso->prepare($sql);
            $query->execute();
            $this->objetos=$query->fetchall();
            return $this->objetos; 
        };
    }
    function cambiar_logo($id,$nombre){
        $sql="UPDATE proveedor SET avatar=:nombre WHERE id_proveedor=:id";
        $query=$this->acceso->prepare($sql);
        $query->execute(array(':id'=>$id,':nombre'=>$nombre));
        return $this->objetos;
    }
    function borrar($id){
        $sql="SELECT * FROM lote where lote_id_prov=:id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id'=>$id));
        if(!empty($lote)){
            echo 'noborrado';
        }
        else{
            $sql="UPDATE proveedor SET estado='I' where id_proveedor=:id";
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
    function rellenar_proveedores(){
        $sql="SELECT * FROM proveedor ORDER BY nombre ASC";
        $query= $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }
    function rellenar_lotes(){
        $sql="SELECT * FROM proveedor ORDER BY nombre ASC";
        $query= $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }
}
?>