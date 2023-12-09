<?php
include_once $_SERVER["DOCUMENT_ROOT"].'/filippi/Models/conexion.php';
class Vehiculo{
    var $objetos;
    public function __construct(){
        $db= new Conexion();
        $this->acceso=$db->pdo;
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
        codigo != :codigo 
        AND vehiculo = :vehiculo
        AND vtv = :vtv
        AND cedula = :cedula
        AND motor = :motor
        AND vencimiento_cedula = :vencimiento_cedula
        AND logistica = :logistica
        AND senasa = :senasa
        AND matafuego = :matafuego
        AND senasa = :senasa
        AND seguro = :seguro
        AND num_poliza = :num_poliza
        AND poliza = :poliza";
        
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
                ':poliza' => $vencimiento_poliza));
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
        AND (codigo = :codigo OR vehiculo = :vehiculo)";
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
        else{
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
    

}
?>