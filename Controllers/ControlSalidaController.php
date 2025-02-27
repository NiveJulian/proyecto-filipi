<?php
include_once '../Models/controlSalida.php';
include_once '../Util/config/config.php';

$control = new Control();

if ($_POST['funcion'] == 'crear') {
    $fecha = $_POST['fecha'];
    $hora = $_POST['hora'];
    $vehiculo_id = $_POST['vehiculo'];
    $idDescrypt = decrypt($vehiculo_id);
    $motivo = $_POST['motivo'];
    $observacion = $_POST['observacion'];
    $personal_id = $_POST['chofer'];
    $empresa = $_POST['empresa'];

    // Decodificar la cadena JSON
    $productos = json_decode($_POST['productos'], true);
    if (json_last_error() === JSON_ERROR_NONE) {
        $control_salida_id = $control->registrar_control_salida($fecha, $hora, $idDescrypt, $motivo, $observacion, $personal_id, $empresa);

        if ($control_salida_id) {
            foreach ($productos as $producto) {
                $producto_id = $producto['id'];
                $cantidad = $producto['cantidad'];
                $lote_id = $producto['lote_id'];

                $control->registrar_producto_salida($control_salida_id, $producto_id, $cantidad);
                $control->disminuir_stock($producto_id, $lote_id, $cantidad);
            }

            echo json_encode(["status" => "success", "message" => "Control de salida registrado correctamente"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error al registrar el control de salida"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Error al decodificar los productos"]);
    }
} else if ($_POST['funcion'] == 'verificar_stock') {
    $productos = json_decode($_POST['productos'], true);
    $mensaje = "Los siguientes productos tendrán stock negativo:\n";

    $productos_en_negativo = [];

    foreach ($productos as $producto) {
        $producto_id = $producto['id'];
        $cantidad = $producto['cantidad'];
        $lote_id = $producto['lote_id'];

        $stock_actual = $control->obtener_stock($producto_id, $lote_id);

        if ($stock_actual - $cantidad < 0) {
            $productos_en_negativo[] = "Producto ID: $producto_id (Stock actual: $stock_actual, Se intenta restar: $cantidad)";
        }
    }

    if (!empty($productos_en_negativo)) {
        $mensaje .= implode("\n", $productos_en_negativo);
        echo json_encode(["status" => "warning", "message" => $mensaje]);
    } else {
        echo json_encode(["status" => "success"]);
    }
    exit();
} else
if ($_POST['funcion'] == 'obtener_todos_control_salida') {
    $controlesSalida = $control->obtener_todos_control_salida();
    $json = array();

    foreach ($controlesSalida as $control) {
        $json[] = array(
            'id' => $control->id,
            'fecha' => $control->fecha,
            'hora' => $control->hora,
            'empresa' => $control->empresa,
            'motivo' => $control->motivo,
            'observacion' => $control->observacion,
            'vehiculo_codigo' => $control->vehiculo_codigo,
            'vehiculo_nombre' => $control->vehiculo_nombre,
            'chofer_nombre' => $control->chofer_nombre,
            'productos' => $control->productos
        );
    }

    $jsonstring = json_encode($json);
    echo $jsonstring;
} else
if ($_POST['funcion'] == 'eliminar_control_salida') {
    $id = $_POST['id'];
    $control->eliminar_control_salida($id);
} else
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


    for ($i = 0; $i < 2; $i++) {
        $identificador = ($i == 0) ? 'ORIGINAL' : 'DUPLICADO';
        $backgroundColor = ($i == 0) ? 'yellow' : 'green';
        $color = ($i == 0) ? 'black' : 'white';


        $sumaTotal = 0;


        $remitoHTML = "
        <div class='remito'>
            <div class='header'>
                <div class='header-right'>
                    <img src='../Util/img/logo.svg' alt='Logo'>
                </div>
                <div class='header-middle'>
                    <p>REMITO N°: 000000$remitoNumero</p>
                </div>
                <div class='header-left'>
                    <p><strong>Razón Soc NEXUS</strong></p>
                    <p>CUIT: 30-71598338-5</p>
                    <p>Correo: gestionnexus@gmail.com</p>
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


        $stylesheet = file_get_contents('../Util/css/remito.css');
        $mpdf->WriteHTML($stylesheet, \Mpdf\HTMLParserMode::HEADER_CSS);


        $mpdf->WriteHTML($remitoHTML, \Mpdf\HTMLParserMode::HTML_BODY);


        if ($i < 1) {
            $mpdf->AddPage();
        }
    }


    $pdfFilePath = '../Util/pdf/remito_' . time() . '.pdf';
    $mpdf->Output($pdfFilePath, 'F');


    echo json_encode(['pdfUrl' => $pdfFilePath]);
}
