<?php
include_once $_SERVER["DOCUMENT_ROOT"].'/filippi/Models/conexion.php';

class Asistencia {
    var $objetos;
    public function __construct() {
        $db = new Conexion();
        $this->acceso = $db->pdo;
    }

    function registrarAsistencia($personalId, $datosAsistencias) {
        $sql = "INSERT INTO asistencia (personal_id, fecha_inicio, fecha_final, total_dias, lunes_manana, lunes_tarde, martes_manana, martes_tarde, miercoles_manana, miercoles_tarde, jueves_manana, jueves_tarde, viernes_manana, viernes_tarde, sabado_manana) 
        VALUES (:personalId, :fecha_inicio, :fecha_final, :total_dias, :lunes_manana, :lunes_tarde, :martes_manana, :martes_tarde, :miercoles_manana, :miercoles_tarde, :jueves_manana, :jueves_tarde, :viernes_manana, :viernes_tarde, :sabado_manana)";
    
        $query = $this->acceso->prepare($sql);
    
        // Establecer los valores para la consulta
        $query->bindParam(':personalId', $personalId);
        $query->bindValue(':fecha_inicio', $datosAsistencias['fecha_inicio'] ?? null);
        $query->bindValue(':fecha_final', $datosAsistencias['fecha_final'] ?? null);
        
        // Asegúrate de proporcionar valores para todas las columnas correspondientes a los días de la semana
        $query->bindValue(':total_dias', $datosAsistencias['totalDias'] ?? 0);
        $query->bindValue(':lunes_manana', $datosAsistencias['turnos']['lunes']['manana'] ?? 0);
        $query->bindValue(':lunes_tarde', $datosAsistencias['turnos']['lunes']['tarde'] ?? 0);
        $query->bindValue(':martes_manana', $datosAsistencias['turnos']['martes']['manana'] ?? 0);
        $query->bindValue(':martes_tarde', $datosAsistencias['turnos']['martes']['tarde'] ?? 0);
        $query->bindValue(':miercoles_manana', $datosAsistencias['turnos']['miercoles']['manana'] ?? 0);
        $query->bindValue(':miercoles_tarde', $datosAsistencias['turnos']['miercoles']['tarde'] ?? 0);
        $query->bindValue(':jueves_manana', $datosAsistencias['turnos']['jueves']['manana'] ?? 0);
        $query->bindValue(':jueves_tarde', $datosAsistencias['turnos']['jueves']['tarde'] ?? 0);
        $query->bindValue(':viernes_manana', $datosAsistencias['turnos']['viernes']['manana'] ?? 0);
        $query->bindValue(':viernes_tarde', $datosAsistencias['turnos']['viernes']['tarde'] ?? 0);
        $query->bindValue(':sabado_manana', $datosAsistencias['turnos']['sabado']['manana'] ?? 0);
    
        $query->execute();
    
        return 'registrado';
    }
    function registrarPagosExtras($datos) {
        $sql = "INSERT INTO pagos_extras 
                (personal_id, adelanto, viandas_cantidad, viaje, domingos, extras, bonificacion, pago_semanal, pago_mensual)
                VALUES
                (:personal_id, :adelanto, :viandas_cantidad, :viaje, :domingos, :extras, :bonificacion, :pago_semanal, :pago_mensual)";
        
        $query = $this->acceso->prepare($sql);

        // Bind de parámetros
        $query->bindParam(':personal_id', $datos['empleadoId'], PDO::PARAM_INT);
        $query->bindParam(':adelanto', $datos['adelanto'], PDO::PARAM_STR);
        $query->bindParam(':viandas_cantidad', $datos['comida'], PDO::PARAM_STR);
        $query->bindParam(':viaje', $datos['viaje'], PDO::PARAM_STR);
        $query->bindParam(':domingos', $datos['domingos'], PDO::PARAM_STR);
        $query->bindParam(':extras', $datos['extras'], PDO::PARAM_STR);
        $query->bindParam(':bonificacion', $datos['bonificacion'], PDO::PARAM_STR);
        $query->bindParam(':pago_semanal', $datos['sueldoSemanal'], PDO::PARAM_STR);
        $query->bindParam(':pago_mensual', $datos['sueldoMensual'], PDO::PARAM_STR);

        // Ejecutar la consulta
        $query->execute();

        // Obtener el ID del último registro insertado
        $idPagoExtra = $this->acceso->lastInsertId();

        return $idPagoExtra;
    }
    function borrarAsistencia($fechaCreacion) {
        $sql = "DELETE FROM asistencia WHERE fecha_creacion = :fecha_creacion";
        $query = $this->acceso->prepare($sql);
        $query->bindParam(':fecha_creacion', $fechaCreacion);
        $query->execute();
        if ($query->rowCount() > 0) {
            return 'borrado';
        } else {
            return 'noborrado';
        }
    }
    
    function borrarPagosExtra($fechaCreacion) {
        $sql = "DELETE FROM pagos_extras WHERE fecha_creacion = :fecha_creacion";
        $query = $this->acceso->prepare($sql);
        $query->bindParam(':fecha_creacion', $fechaCreacion);
        $query->execute();
        if ($query->rowCount() > 0) {
            return 'borrado';
        } else {
            return 'noborrado';
        }
    }
    
}
?>