<?php
include_once $_SERVER["DOCUMENT_ROOT"].'/filippi/Models/conexion.php';
class Personal{
    var $objetos;
    public function __construct(){
        $db= new Conexion();
        $this->acceso= $db->pdo;
    }
    function crear($nombre,$direccion,$cuil,$rol,$dni,$obrasocial,$fecha_alta,$fecha_baja,$fecha_ingreso,$carnet){
        $sql = "SELECT id, estado FROM 
                personal WHERE 
                dni = :dni 
                AND nombre = :nombre
                AND direccion = :direccion
                AND cuil = :cuil
                AND rol_id = :rol
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
                ':rol' => $rol,
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
            $sql = "INSERT INTO personal (nombre, direccion, cuil, rol_id, fecha_ingreso, fecha_alta, fecha_baja, obra_social,dni,carnet, estado)
            VALUES (:nombre, :direccion, :cuil, :rol, :fecha_ingreso, :fecha_alta, :fecha_baja, :obra_social, :dni, :carnet, :estado)";
            
            
            $query = $this->acceso->prepare($sql);
            $query->execute(array(
                ':nombre' => $nombre,
                ':direccion' => $direccion,
                ':cuil' => $cuil,
                ':rol' => $rol,
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
    function editar($id,$nombre,$direccion,$dni,$cuil,$rol,$obrasocial,$fecha_alta,$fecha_ingreso,$fecha_baja,$carnet) {
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
                    cuil = :cuil,
                    rol_id = :rol,
                    fecha_ingreso = :fecha_ingreso, 
                    fecha_alta = :fecha_alta,
                    fecha_baja = :fecha_baja,
                    obra_social = :obrasocial,
                    carnet = :carnet
                    WHERE id = :id";
            $query = $this->acceso->prepare($sql);
                $query->execute(array(
                    ':id' => $id,
                    ':dni' => $dni,
                    ':nombre' => $nombre,
                    ':cuil' => $cuil,
                    ':rol' => $rol,
                    ':direccion' => $direccion,
                    ':fecha_ingreso' => $fecha_ingreso,
                    ':fecha_alta' => $fecha_alta,
                    ':fecha_baja' => $fecha_baja,
                    ':obrasocial' => $obrasocial,
                    ':carnet' => $carnet
                ));
        
                echo 'edit';
            }
    }
    function obtener_total_registros() {
        $sql = "SELECT 
                COUNT(*) AS total 
        FROM personal WHERE estado = 'A' AND nombre = nombre";
        $query = $this->acceso->prepare($sql);
        $query->execute();
    
        $result = $query->fetch(PDO::FETCH_ASSOC);
        return $result['total'];
    }
    function obtener_personal($offset, $itemsPerPage) {
        $sql = "SELECT 
                    per.id, 
                    per.nombre, 
                    per.direccion, 
                    per.cuil, 
                    per.fecha_ingreso, 
                    per.fecha_alta, 
                    per.fecha_salida, 
                    per.fecha_baja, 
                    per.obra_social, 
                    per.dni, 
                    per.carnet,
                    per.avatar,
                    rol.nombre AS nombre_rol
                FROM personal per
                LEFT JOIN roles rol ON per.rol_id = rol.id
                WHERE per.estado = 'A'
                ORDER BY per.nombre ASC
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
        $sql = "SELECT 
                    per.id as id_personal,
                    per.nombre as nombre_personal,
                    per.direccion,
                    rol.id as rol_id,
                    rol.nombre as nombre_rol
                FROM personal per
                JOIN roles rol ON per.rol_id = rol.id
                WHERE per.estado = 'A'
                ORDER BY rol.nombre ASC, per.nombre ASC";
    
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchAll();
        return $this->objetos;
    }
    
    
    function cambiarRol($personalId, $nuevoRolId) {
        $rolActual = $this->obtenerRol($personalId);

        if ($rolActual !== null) {
            return false;
        }
        $sql = "UPDATE personal SET rol_id = :nuevoRolId WHERE id = :personalId";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':nuevoRolId' => $nuevoRolId, ':personalId' => $personalId));

        return true;
    }

    function obtenerRol($personalId) {
        $sql = "SELECT rol_id FROM personal WHERE id = :personalId";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':personalId' => $personalId));

        $resultado = $query->fetch(PDO::FETCH_ASSOC);

        return $resultado ? $resultado['rol_id'] : null;
    }
    function obtener_asistencias(){
        $sql = "SELECT 
            p.id AS id_personal,
            p.nombre AS nombre_personal,
            asist.id AS asist_id,
            asist.total_dias,
            asist.fecha_inicio,
            asist.fecha_final,
            pe.id AS pago_id,
            pe.pago_semanal AS semanal_total,
            pe.pago_mensual AS mensual_total
        FROM personal p
        JOIN pagos_extras pe ON p.id = pe.personal_id
        JOIN asistencia asist ON p.id = asist.personal_id 
        WHERE p.estado = 'A'
        ORDER BY p.nombre ASC;";

        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchAll();
        return $this->objetos;
    }

    function showAsistPrint($id_impresion){
        $sql = "SELECT 
                    p.id AS id_personal,
                    p.nombre AS nombre_personal,
                    rol.id AS rol_id,
                    rol.nombre AS rol_nombre,
                    rol.sueldo_semanal AS rol_semanal,
                    rol.sueldo_mensual AS rol_mensual,
                    asist.id AS asist_id,
                    asist.total_dias,
                    asist.fecha_inicio,
                    asist.fecha_final,
                    pe.id AS pago_id,
                    pe.adelanto AS adelanto,
                    pe.viandas_valor_predeterminado AS comida,
                    pe.viandas_cantidad AS viandas_cantidad,
                    pe.viaje AS viaje,
                    pe.domingos AS domingos,
                    pe.extras AS extras,
                    pe.bonificacion AS bonificacion,
                    pe.pago_semanal AS semanal_total,
                    pe.pago_mensual AS mensual_total
                FROM personal p
                JOIN roles rol ON p.rol_id = rol.id
                LEFT JOIN pagos_extras pe ON p.id = pe.personal_id
                LEFT JOIN asistencia asist ON p.id = asist.personal_id  -- Cambio aquí
                WHERE p.estado = 'A' and p.id = :id";
    
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id'=>$id_impresion));
        $this->objetos=$query->fetchall();
        return $this->objetos; 
    }

}
?>