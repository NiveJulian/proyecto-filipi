<?php
include_once $_SERVER["DOCUMENT_ROOT"] . '/filippi/Models/controlSalida.php';

$control = new Control();

if ($_POST['funcion'] == 'crear') {
    $fecha = $_POST['fecha'];
    $hora = $_POST['hora'];
    $vehiculo = $_POST['vehiculo'];
    $cantidad = $_POST['cantidad'];
    $motivo = $_POST['motivo'];
    $observacion = $_POST['observacion'];
    $empresa = $_POST['empresa'];
    $chofer = $_POST['chofer'];

    $control->crear($fecha, $hora, $vehiculo, $cantidad, $motivo, $observacion, $chofer, $empresa);
}

if ($_POST['funcion'] == 'obtener_todos_control_salida') {
    $resultados = $control->obtener_todos_control_salida();
    echo json_encode($resultados);
}

if ($_POST['funcion'] == 'eliminar_control_salida') {
    $id = $_POST['id'];
    $control->eliminar_control_salida($id);
}

if ($_POST['funcion'] == 'imprimir-remito') {
    require('../vendor/autoload.php');
    $remitoNumero = $_POST['remitoNumero'];
    $cliente = $_POST['cliente'];
    $cuit = $_POST['cuit'];
    $correo = $_POST['correo'];
    $fecha = $_POST['fecha'];
    $detalles = $_POST['detalles'];
    $transportista = $_POST['transportista'];

    $mpdf = new \Mpdf\Mpdf();

    // Generar dos instancias de la plantilla para Original y Duplicado
    for ($i = 0; $i < 2; $i++) {
        $identificador = ($i == 0) ? 'ORIGINAL' : 'DUPLICADO';
        $backgroundColor = ($i == 0) ? 'yellow' : 'green';
        $color = ($i == 0) ? 'black' : 'white';

        // Inicializar la suma total de los valores
        $sumaTotal = 0;

        // Generar el HTML del remito
        $remitoHTML = "
        <div class='remito'>
            <div class='header'>
                <div class='header-right'>
                    <img src='../Util/img/Filippi.jpeg' alt='Logo'>
                </div>
                <div class='header-middle'>
                    <p>REMITO N°: 000000$remitoNumero</p>
                </div>
                <div class='header-left'>
                    <p><strong>Razón Soc JL srl</strong></p>
                    <p>CUIT: 30-71598338-5</p>
                    <p>Correo: gestionjlsrl@gmail.com</p>
                    <p>Localidad: Paso de los Libres Ctes</p>
                </div>
            </div>
            <div class='middle-details'>
                <div class='details'>
                    <h4>DATOS DEL CLIENTE</h4>
                    <p><label>Cliente:</label> $cliente</p>
                    <p><label>Fecha:</label> $fecha</p>
                    <p><label>CUIT:</label> $cuit</p>
                    <p><label>Correo:</label> $correo</p>
                </div>
                <hr>
                <table class='table'>
                    <thead>
                        <tr>
                            <th>CANTIDAD</th>
                            <th>DETALLE</th>
                            <th>VALOR</th>
                        </tr>
                    </thead>
                    <tbody>";

        foreach ($detalles as $detalle) {
            $remitoHTML .= "
                        <tr>
                            <td>{$detalle['cantidad']}</td>
                            <td>{$detalle['descripcion']}</td>
                            <td>{$detalle['valor']}</td>
                        </tr>";
            // Sumar el valor al total
            $sumaTotal += $detalle['valor'];
        }

        $remitoHTML .= "
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan='2' style='text-align: right;'><strong>TOTAL</strong></td>
                            <td><strong>{$sumaTotal}</strong></td>
                        </tr>
                    </tfoot>
                </table>
                <div class='identificador' style='background-color: $backgroundColor; color: $color;'>$identificador</div>

            </div>
            <div class='footer'>
                <p><strong>TRANSPORTISTA</strong></p>
                <p><label>EMPRESA:</label> {$transportista['empresa']}</p>
                <p><label>CHOFER:</label> {$transportista['chofer']}</p>
                <p><label>PATENTE:</label> {$transportista['patente']}</p>
                <div class='firma'>
                    <span>..................................</span>
                    <p>Firma</p>
                </div>
            </div>
        </div>";

        // Cargar el CSS
        $stylesheet = file_get_contents('../Util/css/remito.css');
        $mpdf->WriteHTML($stylesheet, \Mpdf\HTMLParserMode::HEADER_CSS);

        // Escribir el HTML
        $mpdf->WriteHTML($remitoHTML, \Mpdf\HTMLParserMode::HTML_BODY);

        // Agregar una nueva página excepto después de la última iteración
        if ($i < 1) {
            $mpdf->AddPage();
        }
    }

    // Guardar el PDF en el servidor
    $pdfFilePath = '../Util/pdf/remito_' . time() . '.pdf';
    $mpdf->Output($pdfFilePath, 'F');

    // Devolver la URL del PDF generado
    echo json_encode(['pdfUrl' => $pdfFilePath]);
}
