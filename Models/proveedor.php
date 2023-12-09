<?php
include_once $_SERVER["DOCUMENT_ROOT"].'/filippi/Models/conexion.php';
class Proveedor{
    var $objetos;
    public function __construct(){
        $db= new Conexion();
        $this->acceso= $db->pdo;
    }
    function obtener_telefonos_por_proveedor($proveedor_id) {
        $sql = "SELECT telefono FROM proveedor_telefono WHERE proveedor_id = :proveedor_id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':proveedor_id' => $proveedor_id));
        $telefonos = $query->fetchAll(PDO::FETCH_COLUMN, 0); // Obtener los teléfonos como un array
        return $telefonos;
    }

    function crear($nombre, $direccion, $cuit, $razonsocial, $condicion_iva, $cbu, $cvu, $avatar, $telefonos) {
        $sql = "SELECT id, estado FROM proveedor 
            WHERE nombre = :nombre 
            AND direccion = :direccion 
            AND razon_social = :razon_social
            AND cuit = :cuit
            AND condicion_iva = :condicion_iva
            AND cbu = :cbu
            AND cvu = :cvu";
    
        $query = $this->acceso->prepare($sql);
        $query->execute(array(
            ':nombre' => $nombre,
            ':cuit' => $cuit,
            ':direccion' => $direccion,
            ':razon_social' => $razonsocial,
            ':condicion_iva' => $condicion_iva,
            ':cbu' => $cbu,
            ':cvu' => $cvu
        ));
    
        $this->objetos = $query->fetchAll();
    
        if (!empty($this->objetos)) {
            foreach ($this->objetos as $prov) {
                $prov_id = $prov->id;
                $prov_estado = $prov->estado;
            }
            if ($prov_estado == 'A') {
                echo 'noadd'; // El proveedor ya existe
            } else {
                $sql = "UPDATE proveedor SET estado = 'A' WHERE id = :id";
                $query = $this->acceso->prepare($sql);
                $query->execute(array(':id' => $prov_id));
                echo 'add';
            }
        } else {
            // El proveedor no existe, crea uno nuevo
            $sql = "INSERT INTO proveedor (nombre, direccion, razon_social, cuit, condicion_iva, avatar, cbu, cvu) 
            VALUES (:nombre, :direccion, :razon_social, :cuit, :condicion_iva, :avatar, :cbu, :cvu)";

    
            $query = $this->acceso->prepare($sql);
            $query->execute(array(
                ':nombre' => $nombre,
                ':cuit' => $cuit,
                ':direccion' => $direccion,
                ':razon_social' => $razonsocial,
                ':condicion_iva' => $condicion_iva,
                ':cbu' => $cbu,
                ':cvu' => $cvu,
                ':avatar' => $avatar
            ));
    
            $prov_id = $this->acceso->lastInsertId();
            if (!empty($telefonos)) {
                foreach ($telefonos as $telefono) {
                    // Verifica si el número de teléfono ya existe en la base de datos
                    $sql = "SELECT id FROM proveedor_telefono WHERE proveedor_id = :proveedor_id AND telefono = :telefono";
                    $query = $this->acceso->prepare($sql);
                    $query->execute(array(':proveedor_id' => $prov_id, ':telefono' => $telefono));
                    $result = $query->fetch();
        
                    // Si el número de teléfono no existe, agrégalo
                    if (!$result) {
                        $sql = "INSERT INTO proveedor_telefono (proveedor_id, telefono) VALUES (:proveedor_id, :telefono)";
                        $query = $this->acceso->prepare($sql);
                        $query->execute(array(':proveedor_id' => $prov_id, ':telefono' => $telefono));
                    }
                }
            }
            
            echo 'add';
        }
    }
    
    function editar($id,$nombre,$direccion,$cuit,$razonsocial,$condicion_iva,$cbu,$cvu) {
        $sql = "SELECT id FROM proveedor 
        WHERE id != :id
        AND (nombre = :nombre OR cuit = :cuit)";
    
        $query = $this->acceso->prepare($sql);
        $query->execute(array(
            ':id' => $id,
            ':nombre' => $nombre,
            ':cuit' => $cuit,
        ));

        $this->objetos=$query->fetchall();
        if(!empty($this->objetos)){
            echo 'noedit';
        } else {
            $sql = "UPDATE proveedor 
                    SET nombre = :nombre,
                    direccion = :direccion, 
                    cuit = :cuit, 
                    razon_social = :razonsocial, 
                    condicion_iva = :condicion_iva,
                    cbu = :cbu,
                    cvu = :cvu,
                    WHERE id = :id";
            $query = $this->acceso->prepare($sql);
                if ($cbu === '') {
                    $cbu = null;
                }
            
                if ($cvu === '') {
                    $cvu = null;
                }

                $query->execute(array(
                    ':id' => $id,
                    ':nombre' => $nombre,
                    ':cuit' => $cuit,
                    ':direccion' => $direccion,
                    ':razonsocial' => $razonsocial,
                    ':condicion_iva' => $condicion_iva,
                    ':cbu'=>$cbu, 
                    ':cvu'=>$cvu
                ));
        
                echo 'edit';
            }
    }
    
    function obtener_proveedores(){
        $sql="SELECT * FROM proveedor";
            $query = $this->acceso->prepare($sql);
            $query->execute();
            $this->objetos=$query->fetchall();
            return $this->objetos; 
    }

    function buscar(){
        if(!empty($_POST['consulta'])){
           $consulta=$_POST['consulta'];
           $sql="SELECT id,
           nombre,
           direccion,
           razon_social,
           cuit,
           condicion_iva,
           cbu,
           cvu,
           avatar 
           FROM proveedor where estado='A' and nombre LIKE :consulta limit 20";
           $query = $this->acceso->prepare($sql);
           $query->execute(array(':consulta'=>"%$consulta%"));
           $this->objetos=$query->fetchall();
           return $this->objetos; 
        }
        else{
            $sql="SELECT id,
            nombre,
            direccion,
            razon_social,
            cuit,
            condicion_iva,
            cbu,
            cvu,
            avatar FROM proveedor where estado='A' and nombre NOT LIKE '' ORDER BY id desc LIMIT 20";
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
        $sql="DELETE FROM proveedor where id=:id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id'=>$id));
        if(!empty($query->execute(array(':id'=>$id)))){
            echo 'borrado';
        }
        else{
            echo 'noborrado';
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