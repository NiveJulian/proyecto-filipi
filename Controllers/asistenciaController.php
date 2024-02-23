<?php
include_once $_SERVER["DOCUMENT_ROOT"] . '/filippi/Models/personal.php';
include_once $_SERVER["DOCUMENT_ROOT"] . '/filippi/Models/asistencia.php';

$personal = new Personal();
$asistencia = new Asistencia();

if ($_POST['funcion'] === 'obtener_asistencias') {
    $personal->obtener_asistencias();

    $json = array();

    foreach ($personal->objetos as $objeto) {
        $json[] = array(
            'id' => $objeto->id_personal,
            'fecha_inicio' => $objeto->fecha_inicio,
            'fecha_final' => $objeto->fecha_final,
            'creacion_asistencias' => $objeto->fecha_creacion,
            'creacion_pagos' => $objeto->creacion_pagos,
            'cantidad_recibos' => $objeto->cantidad_recibos,
            'semanal_total' => $objeto->total_sueldos_semanales
        );
    }

    $jsonstring = json_encode($json);
    echo $jsonstring;
}

else
if ($_POST['funcion'] === 'obtener_datos_empleados') {
    $personal->obtener_datos_empleados();

    $json = array();

    foreach ($personal->objetos as $objeto) {
        $json[] = array(
            'id' => $objeto->id_personal,
            'nombre' => $objeto->nombre_personal,
            'rol_id' => $objeto->rol_id,
            'nombre_rol' => $objeto->nombre_rol
        );
    }

    $jsonstring = json_encode($json);
    echo $jsonstring;
}
else
if ($_POST['funcion'] === 'registrarAsistencia') {
    $personalId = $_POST['id'];
    $datosAsistencias = json_decode($_POST['json'], true);
    $idPagoExtra = $asistencia->registrarPagosExtras($datosAsistencias);
    $asistencia->registrarAsistencia($personalId, $datosAsistencias);
    
    echo $idPagoExtra;
}
else
if ($_POST['funcion'] == 'imprimir') {
    require('../vendor/autoload.php');
    $fechaCreacion = $_POST['fechaCreacion'];
    $mpdf = new \Mpdf\Mpdf();
    $css = file_get_contents("../Util/css/style_print_asist.css");

    date_default_timezone_set('America/Argentina/Buenos_Aires');
    $fecha = date('d-m-Y');

    $empleados = $personal->showAsistPrint($fechaCreacion);

    foreach ($empleados as $empleado) {
        // Verificar si las fechas de inicio y final coinciden con las proporcionadas
        if ($empleado->creacion_asistencias == $fechaCreacion && $empleado->creacion_pagos == $fechaCreacion) {
                    $plantilla = '<body>
                                <style>' . $css . '</style> <!-- Incluir el CSS -->
                                <div class="header">
                                    <h2>JL SRL</h2>
                                    <p>RECIBO DE REMUNERACIONES</p>
                                    <p>RUTA 117 KM 7,5</p>
                                    <p>C.U.I.T 30-71598338-5</p>
                                    <p>FECHA: ' . $fecha . '</p>
                                </div>
                                
                                <table>
                                    <thead>
                                        <tr>
                                            <th>APELLIDO & NOMBRE</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>' . $empleado->nombre_personal . '</td>
                                        </tr>
                                    </tbody>
                                </table>';

                $plantilla .= '<div class="seccion">';
                $plantilla .= '<table class="tabla">';
                $plantilla .= '<thead>';
                $plantilla .= '<tr>';
                $plantilla .= '<th>COD</th>';
                $plantilla .= '<th>CONCEPTO</th>';
                $plantilla .= '<th>UNID.</th>';
                $plantilla .= '<th>DESCUENTOS</th>';
                $plantilla .= '<th>HABERES</th>';
                $plantilla .= '</tr>';
                $plantilla .= '</thead>';
                $plantilla .= '<tbody>';

                $contador = 1; // Inicializar el contador

                $conceptos = array(
                    'Adelanto' => $empleado->adelanto,
                    'Viandas' => $empleado->comida * $empleado->viandas_cantidad,
                    'Viaje' => $empleado->viaje,
                    'Domingos' => $empleado->domingos,
                    'Extras' => $empleado->extras,
                    'Bonificacion' => $empleado->bonificacion,
                    'Sueldo Semanal' => $empleado->semanal_total,
                );

                // Calcular el valor del Sueldo Semanal sumando el Adelanto y restando el resto de conceptos
                $conceptos['Sueldo Semanal'] += $conceptos['Adelanto'];
                $conceptos['Sueldo Semanal'] -= array_sum(array_slice($conceptos, 1, -1));

                $conceptos_con_valores = array_filter($conceptos, function ($valor, $concepto) {
                    return $valor !== null && $valor !== '0.00';
                }, ARRAY_FILTER_USE_BOTH);

                if (!empty($conceptos_con_valores)) {
                    foreach ($conceptos_con_valores as $concepto_nombre => $concepto_valor) {
                        $plantilla .= '<tr>';
                        $plantilla .= '<td>' . $contador . '</td>'; // Mostrar el contador
                        $plantilla .= '<td>' . $concepto_nombre . '</td>';
                        $plantilla .= '<td>';

                        // Agregar lógica para obtener UNID y la cantidad de días
                        if ($concepto_nombre == 'Sueldo Semanal') {
                            $plantilla .= $empleado->total_dias . ' Dias<br>';
                        } else if ($concepto_nombre == 'Viandas') {
                            $plantilla .= $empleado->viandas_cantidad . '<br>';
                        } else {
                            // En otros casos, mostrar algún valor específico de UNID
                            $plantilla .= '1 <br>';
                        }

                        $plantilla .= '</td>';

                        // Ajustar la lógica para determinar en qué columna debe ir cada valor
                        $plantilla .= '<td>';
                        $plantilla .= ($concepto_nombre == 'Adelanto') ? '$ ' . $concepto_valor : ''; // En DESCUENTOS si es Adelanto
                        $plantilla .= '</td>';

                        $plantilla .= '<td>';
                        $plantilla .= ($concepto_nombre != 'Adelanto') ? '$ ' . $concepto_valor : ''; // En HABERES si no es Adelanto
                        $plantilla .= '</td>';

                        $plantilla .= '</tr>';

                        $contador++; // Incrementar el contador
                    }
                }

                $plantilla .= '</tbody>';
                $plantilla .= '</table>';

                $plantilla .= '
                        <table>
                            <tfoot>
                                <tr>
                                    <td colspan="4">TOTALES</td>';
                $plantilla .= '<td>$ ' . $empleado->semanal_total . '</td>';
                $plantilla .= '
                                </tr>
                            </tfoot>
                        </table>

                        <div class="footer">
                            <p>PASO DE LOS LIBRES Ctes</p>
                            <p>TOTAL: $' . $empleado->semanal_total . '</p>
                            <p>_______________________</p>
                            <p>FIRMA EMPLEADO</p>
                        </div>

                    </body>';

                $mpdf->WriteHTML($plantilla);
                $mpdf->AddPage();
            }
    }
        

    $nombreArchivoPDF = "pdf-recibo-" . uniqid() . ".pdf";
    $mpdf->output("../Util/pdf/recibo-sueldo/{$nombreArchivoPDF}", "F");

    echo $nombreArchivoPDF;
}
if ($_POST['funcion'] == 'borrar') {
    $fechaCreacion = $_POST['creacion'];

    try {
        // Intenta borrar los registros
        $asistencia->borrarAsistencia($fechaCreacion);
        $asistencia->borrarPagosExtra($fechaCreacion);
        echo "borrado";
    } catch (PDOException $e) {
        // Captura cualquier excepción y maneja el error
        echo "Error al borrar los registros: " . $e->getMessage();
    }
}


?>
