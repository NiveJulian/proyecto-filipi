<?php
include_once $_SERVER["DOCUMENT_ROOT"].'/filippi/Models/conexion.php';

class Asistencia {
    var $objetos;
    public function __construct() {
        $db = new Conexion();
        $this->acceso = $db->pdo;
    }

    function registrarAsistencia($personalId, $semanaInicio, $semanaFin, $turnos, $asistenciaEmpleado)
        {
            // Validación de datos (puedes agregar más validaciones según tus necesidades)
            if (empty($personalId) || empty($semanaInicio) || empty($semanaFin) || empty($turnos)) {
                return 'error';
            }

            // Verificar si ya existe una asistencia registrada para la misma semana
            $sqlExistencia = "SELECT COUNT(*) as count FROM asistencia WHERE personal_id = :personal_id AND fecha_inicio = :semanaInicio";
            $queryExistencia = $this->acceso->prepare($sqlExistencia);
            $queryExistencia->execute(array(':personal_id' => $personalId, ':semanaInicio' => $semanaInicio));
            $resultadoExistencia = $queryExistencia->fetch(PDO::FETCH_ASSOC);

            if ($resultadoExistencia['count'] > 0) {
                return 'asistencia_existente';
            }

            // Obtener los valores de los turnos y días
            $dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
            $sqlValues = [];
            
            foreach ($dias as $dia) {
                foreach (['manana', 'tarde'] as $turno) {
                    $sqlValues[":{$dia}_{$turno}"] = in_array(['dia' => $dia, 'turno' => $turno], $turnos) ? 1 : 0;
                }
            }

            // Insertar nueva asistencia
            $sql = "INSERT INTO asistencia (personal_id, fecha_inicio, fecha_final,
                    lunes_manana, lunes_tarde, martes_manana, martes_tarde, miercoles_manana, miercoles_tarde,
                    jueves_manana, jueves_tarde, viernes_manana, viernes_tarde, sabado_manana, sabado_tarde)
                    VALUES (:personal_id, :semanaInicio, :semanaFin,
                    :lunes_manana, :lunes_tarde, :martes_manana, :martes_tarde, :miercoles_manana, :miercoles_tarde,
                    :jueves_manana, :jueves_tarde, :viernes_manana, :viernes_tarde, :sabado_manana, :sabado_tarde)";

            $query = $this->acceso->prepare($sql);

            $query->execute(array_merge(
                [':personal_id' => $personalId, ':semanaInicio' => $semanaInicio, ':semanaFin' => $semanaFin],
                $sqlValues
            ));

            return 'asistencia_registrada';
        }

}
?>