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
            'nombre' => $objeto->nombre_personal,
            'asist_id' => $objeto->asist_id,
            'total_dias' => $objeto->total_dias,
            'fecha_inicio' => $objeto->fecha_inicio,
            'fecha_final' => $objeto->fecha_final,
            'pago_id' => $objeto->pago_id,
            'semanal_total' => $objeto->semanal_total,
            'mensual_total' => $objeto->mensual_total
        );
    }

    $jsonstring = json_encode($json);
    echo $jsonstring;
}
if ($_POST['funcion'] === 'obtener_datos_empleados') {
    $personal->obtener_datos_empleados();

    $json = array();

    foreach ($personal->objetos as $objeto) {
        $json[] = array(
            'id' => $objeto->id_personal,
            'nombre' => $objeto->nombre_personal,
            'rol_id' => $objeto->rol_id
        );
    }

    $jsonstring = json_encode($json);
    echo $jsonstring;
}
if ($_POST['funcion'] === 'registrarAsistencia') {
    $personalId = $_POST['id'];
    $datosAsistencias = json_decode($_POST['json'], true); 
    if (isset($datosAsistencias['rol'])) {
        $nuevoRolId = $datosAsistencias['rol'];
        
        $personal->cambiarRol($personalId, $nuevoRolId);
    }
    $idPagoExtra = $asistencia->registrarPagosExtras($datosAsistencias);
    $asistencia->registrarAsistencia($personalId, $datosAsistencias);
    
    echo $idPagoExtra;
}

if($_POST['funcion']=='imprimir'){
    require ('../vendor/autoload.php');
    $id_impresion = $_POST['id'];
    $mpdf = new \Mpdf\Mpdf();
    date_default_timezone_set('America/Argentina/Buenos_Aires');
    $fecha = date('d-m-Y');
    
    for ($i = 0; $i < 3; $i++) {
        
        $detalles = $personal->showAsistPrint($id_impresion);
        $identificador = ($i == 0) ? 'ORIGINAL' : (($i == 1) ? 'DUPLICADO' : 'TRIPLICADO');
        $plantilla = '';
        $plantilla = '
            <body>
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
                            <td>' . $detalles[0]->nombre_personal . '</td>
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

                foreach ($detalles as $detalle) {
                    $conceptos = array(
                        'Adelanto' => $detalle->adelanto,
                        'Viandas' => $detalle->comida * $detalle->viandas_cantidad,
                        'Viaje' => $detalle->viaje,
                        'Domingos' => $detalle->domingos,
                        'Extras' => $detalle->extras,
                        'Bonificacion' => $detalle->bonificacion,
                        'Sueldo Semanal' => $detalle->semanal_total,
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
                                $plantilla .= $detalle->total_dias . ' Dias<br>';
                            } else if ($concepto_nombre == 'Viandas') {
                                $plantilla .= $detalle->viandas_cantidad . '<br>';
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
                }

                $plantilla .= '</tbody>';
                $plantilla .= '</table>';

                

                $plantilla .= '
                <table>
                    <tfoot>
                        <tr>
                            <td colspan="4">TOTALES</td>
                            <td>$ ' . $detalles[0]->semanal_total . '</td>
                        </tr>
                    </tfoot>
                </table>

                <div class="footer">
                    <p>PASO DE LOS LIBRES Ctes</p>
                    <p>TOTAL: $' . $detalles[0]->semanal_total . '</p>
                    <p>_______________________</p>
                    <p>FIRMA EMPLEADO</p>
                </div>

            </body>';
            $css = file_get_contents("../Util/css/style_print_asist.css");
            $mpdf->writeHTML($css, \Mpdf\HTMLParserMode::HEADER_CSS);
            $mpdf->writeHTML($plantilla, \Mpdf\HTMLParserMode::HTML_BODY);
            if ($i < 2) {
                $mpdf->AddPage();
            }
    }

        $mpdf->output("../Util/pdf/recibo-sueldo/pdf-recibo-n" . $id_impresion . ".pdf", "F");
}
?>
