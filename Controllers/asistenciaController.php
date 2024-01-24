<?php
include_once $_SERVER["DOCUMENT_ROOT"] . '/filippi/Models/personal.php';
include_once $_SERVER["DOCUMENT_ROOT"] . '/filippi/Models/asistencia.php';

$personal = new Personal();
$asistencia = new Asistencia();

if ($_POST['funcion'] === 'obtener_datos_empleados') {
    $personal->obtener_datos_empleados();

    $json = array();

    foreach ($personal->objetos as $objeto) {
        $json[] = array(
            'id' => $objeto->id,
            'nombre' => $objeto->nombre,
        );
    }

    $jsonstring = json_encode($json);
    echo $jsonstring;
} elseif ($_POST['funcion'] === 'registrar_asistencia_semana') {
    $asistencias = $_POST['asistencias'];

    foreach ($asistencias as $asistenciaEmpleado) {
        $personalId = $asistenciaEmpleado['empleadoId'];
        $semanaInicio = $asistenciaEmpleado['semanaInicio'];
        $semanaFin = $asistenciaEmpleado['semanaFin'];

        // Puedes ajustar este bloque según tus necesidades
        $result = $asistencia->registrarAsistencia($personalId, $semanaInicio, $semanaFin, $asistenciaEmpleado['turnos'], $asistenciaEmpleado);

    }
}
?>
