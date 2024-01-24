<?php
include_once $_SERVER["DOCUMENT_ROOT"].'/filippi/Models/conexion.php';
class Personal{
    var $objetos;
    public function __construct(){
        $db= new Conexion();
        $this->acceso= $db->pdo;
    }
    function crear($nombre,$direccion,$cuil,$dni,$obrasocial,$fecha_alta,$fecha_baja,$fecha_ingreso,$carnet){
        $sql = "SELECT id, estado FROM 
                personal WHERE 
                dni = :dni 
                AND nombre = :nombre
                AND direccion = :direccion
                AND cuil = :cuil
                AND fecha_ingreso = :fecha_ingreso
                AND fecha_alta = :fecha_alta
                AND fecha_baja = :fecha_baja
                AND obra_social = :obrasocial
                AND carnet = :carnet";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(
                ':dni' => $dni,
                ':nombre' => $nombre,
                ':direccion' => $direccion,
                ':cuil' => $cuil,
                ':fecha_ingreso' => $fecha_ingreso,
                ':fecha_alta' => $fecha_alta,
                ':fecha_baja' => $fecha_baja,
                ':obrasocial' => $obrasocial,
                ':carnet' => $carnet
            ));
        $this->objetos = $query->fetchAll();
        if (!empty($this->objetos)) {
            foreach ($this->objetos as $perso) {
                $perso_id = $perso->id;
                $perso_estado = $perso->estado;
            }
            if ($perso_estado == 'A') {
                echo 'noadd';
            } else {
                $sql = "UPDATE personal SET estado = 'A' WHERE id = :id";
                $query = $this->acceso->prepare($sql);
                $query->execute(array(':id' => $perso_id));
                echo 'add';
            }
        } else {
            $sql = "INSERT INTO personal (nombre, direccion,cuil, fecha_ingreso, fecha_alta, fecha_baja, obra_social,dni,carnet, estado)
            VALUES (:nombre, :direccion, :cuil, :fecha_ingreso, :fecha_alta, :fecha_baja, :obra_social, :dni, :carnet, :estado)";
            
            
            $query = $this->acceso->prepare($sql);
            $query->execute(array(
                ':nombre' => $nombre,
                ':direccion' => $direccion,
                ':cuil' => $cuil,
                ':fecha_ingreso' => $fecha_ingreso,
                ':fecha_alta' => $fecha_alta,
                ':fecha_baja' => $fecha_baja,
                ':obra_social' => $obrasocial,
                ':dni' => $dni,
                ':carnet' => $carnet,
                ':estado' => 'A' 
            ));
            echo 'add';
        }
        
    }
    function editar($id,$nombre,$direccion,$dni,$obrasocial,$fecha_alta,$fecha_ingreso,$carnet) {
        $sql = "SELECT id FROM personal 
        WHERE id != :id
        AND (nombre = :nombre OR dni = :dni)";
    
        $query = $this->acceso->prepare($sql);
        $query->execute(array(
            ':id' => $id,
            ':nombre' => $nombre,
            ':dni' => $dni,
        ));

        $this->objetos=$query->fetchall();
        if(!empty($this->objetos)){
            echo 'noedit';
        } else {
            $sql = "UPDATE personal 
                    SET nombre = :nombre,
                    dni = :dni, 
                    direccion = :direccion, 
                    fecha_ingreso = :fecha_ingreso, 
                    fecha_alta = :fecha_alta,
                    obra_social = :obrasocial,
                    carnet = :carnet
                    WHERE id = :id";
            $query = $this->acceso->prepare($sql);
                $query->execute(array(
                    ':id' => $id,
                    ':dni' => $dni,
                    ':nombre' => $nombre,
                    ':direccion' => $direccion,
                    ':fecha_ingreso' => $fecha_ingreso,
                    ':fecha_alta' => $fecha_alta,
                    ':obrasocial' => $obrasocial,
                    ':carnet' => $carnet
                ));
        
                echo 'edit';
            }
    }
    function obtener_total_registros() {
        $sql = "SELECT COUNT(*) AS total FROM personal WHERE estado = 'A' AND nombre = nombre";
        $query = $this->acceso->prepare($sql);
        $query->execute();
    
        $result = $query->fetch(PDO::FETCH_ASSOC);
        return $result['total'];
    }
    function obtener_personal($offset, $itemsPerPage) {
        $sql = "SELECT id, nombre, direccion, cuil, fecha_ingreso, fecha_alta, fecha_salida, fecha_baja, obra_social, dni, carnet, avatar
                FROM personal 
                WHERE estado = 'A' AND nombre = nombre
                ORDER BY nombre ASC
                LIMIT :offset, :limit";
    
        $query = $this->acceso->prepare($sql);
        $query->bindParam(':offset', $offset, PDO::PARAM_INT);
        $query->bindParam(':limit', $itemsPerPage, PDO::PARAM_INT);
        $query->execute();
    
        $this->objetos = $query->fetchAll();
        return $this->objetos;
    }
    function cambiar_avatar($id, $nombre) {
        $sql="UPDATE personal SET avatar=:nombre WHERE id=:id";
        $query=$this->acceso->prepare($sql);
        $query->execute(array(':id'=>$id,':nombre'=>$nombre));
        return $this->objetos;
    }
    function borrar($id){
        $sql="DELETE FROM personal where id=:id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id'=>$id));
        if(!empty($query->execute(array(':id'=>$id)))){
            echo 'borrado';
        }
        else{
            echo 'noborrado';
        }
    }
    function obtenerDatos($id_impresion){
        $sql="SELECT * FROM personal WHERE id = :id";
           $query = $this->acceso->prepare($sql);
           $query->execute(array(':id'=>$id_impresion));
           $this->objetos=$query->fetchall();
           return $this->objetos;
    }
    function ver($id){
        $sql="SELECT * FROM personal WHERE id=:id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id'=>$id));
        $this->objetos=$query->fetchall();
        return $this->objetos;
    }
    function rellenar_personal(){
        $sql="SELECT * FROM personal ORDER BY nombre ASC";
        $query= $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }

    //ASISTENCIA
    function obtener_datos_empleados(){
        $sql = "SELECT id, 
                    nombre, 
                    direccion
                FROM personal 
                WHERE estado = 'A' AND nombre = nombre
                ORDER BY nombre ASC";
    
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchAll();
        return $this->objetos;
    }

}
?>