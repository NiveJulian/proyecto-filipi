<?php
include_once $_SERVER["DOCUMENT_ROOT"].'/filippi/Models/conexion.php';
class Vehiculo{
    var $objetos;
    public function __construct(){
        $db= new Conexion();
        $this->acceso=$db->pdo;
    }
    function tipos_vehiculos(){
        $sql="SELECT * FROM tipo_vehiculo ORDER BY nombre asc";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos=$query->fetchall();
        return $this->objetos;
    }
    function cambiar_avatar($id,$nombre) {
        $sql="UPDATE vehiculos SET avatar=:nombre WHERE id=:id";
        $query=$this->acceso->prepare($sql);
        $query->execute(array(':id'=>$id,':nombre'=>$nombre));
        return $this->objetos;
    }
    function ver($id){
        $sql="SELECT * FROM vehiculos WHERE id=:id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id'=>$id));
        $this->objetos=$query->fetchall();
        return $this->objetos;
    }
    function obtener_vehiculos(){
        $sql="SELECT id,
        codigo,
        vehiculo,
        vtv,
        motor,
        cedula,
        vencimiento_cedula,
        logistica,
        matafuego,
        senasa,
        seguro,
        num_poliza,
        poliza,
        avatar
        FROM vehiculos 
        WHERE estado = 'A' AND vehiculo = vehiculo AND codigo = codigo
        ORDER BY vehiculo ASC";;
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos=$query->fetchall();
        return $this->objetos;
    }
    function obtener_fecha_vencida(){
        $sql="SELECT * FROM vehiculos WHERE estado='A' ORDER BY vehiculo asc";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos=$query->fetchall();
        return $this->objetos;
    }
    function obtener_resumen(){
        $sql="SELECT * FROM vehiculos WHERE estado='A' ORDER BY vehiculo asc";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos=$query->fetchall();
        return $this->objetos;
    }
    function crear($codigo, $nombre_vehiculo, $vencimiento_vtv, $cedula, $motor, $vencimiento_cedula, $vencimiento_logistica, $vencimiento_senasa, $vencimiento_matafuego, $vencimiento_seguro, $numero_poliza, $vencimiento_poliza){
        $sql = "SELECT id, estado FROM 
        vehiculos WHERE 
        vehiculo = :vehiculo
        AND codigo = :codigo";
        
        $query = $this->acceso->prepare($sql);
        $query->execute(array(
                ':codigo' => $codigo,
                ':vehiculo' => $nombre_vehiculo,
            ));
        $vehiculoExistente = $query->fetch(PDO::FETCH_OBJ); 
    
        if (!empty($vehiculoExistente)) {
            if ($vehiculoExistente->estado == 'A') {
                echo 'noadd';
            } else {
                // Reactivar vehículo si está inactivo
                $sql = "UPDATE vehiculos SET estado = 'A' WHERE id = :id";
                $query = $this->acceso->prepare($sql);
                $query->execute(array(':id' => $vehiculoExistente->id));
                echo 'add';
            }
        } else {
            // Inserta el nuevo vehículo en la tabla
            $sql = "INSERT INTO vehiculos (codigo, vehiculo, vtv, cedula, motor, vencimiento_cedula, logistica, senasa, matafuego, seguro, num_poliza, poliza, estado)
            VALUES (:codigo, :vehiculo, :vtv, :cedula, :motor, :vencimiento_cedula, :logistica, :senasa, :matafuego, :seguro, :num_poliza, :poliza, :estado)";
            

            $query = $this->acceso->prepare($sql);
            $query->execute(array(
                ':codigo' => $codigo,
                ':vehiculo' => $nombre_vehiculo,
                ':vtv' => $vencimiento_vtv,
                ':cedula' => $cedula,
                ':motor' => $motor,
                ':vencimiento_cedula' => $vencimiento_cedula,
                ':logistica' => $vencimiento_logistica,
                ':senasa' => $vencimiento_senasa,
                ':matafuego' => $vencimiento_matafuego,
                ':seguro' => $vencimiento_seguro,
                ':num_poliza'=> $numero_poliza,
                ':poliza' => $vencimiento_poliza,
                ':estado' => 'A' // Reemplaza esto con el valor correcto de estado
            ));
            echo 'add';
        }
    }
    function editar($id, $codigo, $nombre_vehiculo, $vencimiento_vtv, $cedula, $motor, $vencimiento_cedula, $vencimiento_logistica, $vencimiento_senasa, $vencimiento_matafuego, $vencimiento_seguro, $numero_poliza, $vencimiento_poliza){
        $sql="SELECT id FROM vehiculos 
        WHERE id != :id
        AND codigo = :codigo 
        AND vehiculo = :vehiculo";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(
            ':id'=>$id,
            ':codigo'=>$codigo,
            ':vehiculo'=>$nombre_vehiculo,
        ));
        $this->objetos=$query->fetchall();
        if(!empty($this->objetos)){
            echo 'noedit';
        }
        try {
            $sql="UPDATE vehiculos 
            SET codigo=:codigo,
            vehiculo=:vehiculo, 
            vtv=:vtv, 
            cedula=:cedula, 
            motor=:motor, 
            vencimiento_cedula=:vencimiento_cedula,
            logistica=:logistica,
            senasa=:senasa,
            matafuego=:matafuego,
            seguro=:seguro,
            num_poliza=:num_poliza,
            poliza=:poliza
            WHERE id=:id";
            $query = $this->acceso->prepare($sql);
            if ($vencimiento_vtv === '') {
                $vencimiento_vtv = null;
            }
        
            if ($vencimiento_cedula === '') {
                $vencimiento_cedula = null;
            }
        
            if ($vencimiento_logistica === '') {
                $vencimiento_logistica = null;
            }
        
            if ($vencimiento_senasa === '') {
                $vencimiento_senasa = null;
            }
        
            if ($vencimiento_seguro === '') {
                $vencimiento_seguro = null;
            }
        
            if ($vencimiento_poliza === '') {
                $vencimiento_poliza = null;
            }
            if ($vencimiento_matafuego === '') {
                $vencimiento_matafuego = null;
            }

            $query->execute(array(
                ':id' => $id,
                ':codigo' => $codigo,
                ':vehiculo' => $nombre_vehiculo,
                ':vtv' => $vencimiento_vtv,
                ':cedula' => $cedula,
                ':motor' => $motor,
                ':vencimiento_cedula' => $vencimiento_cedula,
                ':logistica' => $vencimiento_logistica,
                ':senasa' => $vencimiento_senasa,
                ':matafuego' => $vencimiento_matafuego,
                ':seguro' => $vencimiento_seguro,
                ':num_poliza' => $numero_poliza,
                ':poliza' => $vencimiento_poliza,
            ));
            echo 'edit';
        } catch (PDOException $e) {
            return 'Error al actualizar los datos: ' . $e->getMessage();
        }
            
    }
    function borrar($id){
        $sql="DELETE FROM vehiculos where id=:id";
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
        $sql="SELECT  
        codigo,
        vehiculo,
        vtv,
        cedula,
        motor,
        vencimiento_cedula,
        logistica,
        matafuego,
        senasa,
        seguro,
        num_poliza,
        poliza
        FROM vehiculos WHERE id = :id";
           $query = $this->acceso->prepare($sql);
           $query->execute(array(':id'=>$id_impresion));
           $this->objetos=$query->fetchall();
           return $this->objetos;
    }
    
    //CONSUMO
    function registrarConsumo($idVehiculo, $cantidadCombustible, $precioCombustible, $distancia, $fechaRegistro) {
        // SQL para insertar el consumo en la tabla de consumo_combustible
        $sql = "INSERT INTO consumo_combustible (id_vehiculo, fecha, cantidad_combustible, precio_combustible, distancia_recorrida) 
                VALUES (:idVehiculo, :fecha, :cantidadCombustible, :precioCombustible, :distancia)";
        
        // Preparar la consulta
        $query = $this->acceso->prepare($sql);
        
        // Ejecutar la consulta con los parámetros proporcionados
        $query->execute(array(
            ':idVehiculo' => $idVehiculo,
            ':fecha' => $fechaRegistro,
            ':cantidadCombustible' => $cantidadCombustible,
            ':precioCombustible' => $precioCombustible,
            ':distancia' => $distancia
        ));
        
        
        if ($query->rowCount() > 0) {
            echo 'add'; // Registro exitoso
        } else {
            echo 'error'; // Error al registrar el consumo
        }
    }
}    
?>