<?php
include_once '../Models/ordenCompra.php';

$ordenCompra = new OrdenCompra();
if ($_POST['funcion'] == 'anular') {
    $idOrdenCompra = $_POST['id'];
    try {
        $idOrden = $ordenCompra->anular($idOrdenCompra);
        echo json_encode(['status' => 'success', 'id' => $idOrden, 'message' => 'Orden de compra creada con éxito.']);
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => 'Error al crear la orden de compra.', 'error' => $e->getMessage()]);
    }
}
if ($_POST['funcion'] == 'showPurchaseOrder') {
    $ordenes = $ordenCompra->showPurchaseOrder();
    $json = array();
    foreach ($ordenes as $objeto) {
        $json[] = array(
            'id' => $objeto['id_orden'],
            'proveedor' => $objeto['proveedor'],
            'autorizado' => $objeto['personal'],
            'fecha' => $objeto['fecha']
        );
    }
    $jsonstring = json_encode($json);
    echo $jsonstring;
}
if ($_POST['funcion'] == 'crear') {
    $tipoGasto = $_POST['ordenCompraData']['tipoGasto'];
    $autorizado = $_POST['ordenCompraData']['autorizado'];
    $proveedor = $_POST['ordenCompraData']['proveedor'];
    $observaciones = $_POST['ordenCompraData']['observaciones'];
    $datosTabla = $_POST['ordenCompraData']['datosTabla'];

    try {
        $idOrdenCompra = $ordenCompra->crear($tipoGasto, $autorizado, $proveedor, $observaciones, $datosTabla);
        echo json_encode(['status' => 'success', 'id' => $idOrdenCompra, 'message' => 'Orden de compra creada con éxito.']);
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => 'Error al crear la orden de compra.', 'error' => $e->getMessage()]);
    }
}
if ($_POST['funcion'] == 'obtener_ultimo_num_order') {
    $ordenCompra->obtenerUltimoNumOrder();
    $json = array();
    foreach ($ordenCompra->objetos as $objeto) {
        $json = array(
            'id' => $objeto->id
        );
    }
    $jsonstring = json_encode($json);
    echo $jsonstring;
}
if ($_POST['funcion'] == 'imprimir') {
    require('../vendor/autoload.php');
    $id_impresion = $_POST['id'];
    $ordenes = $ordenCompra->showPurchaseOrderPrint($id_impresion);
    foreach ($ordenes as $objeto) {
        $id = $objeto->id_order;
        $fecha = isset($objeto->fecha) ? $objeto->fecha : '';
        $proveedor = $objeto->proveedor;
        $TipoRegistro = $objeto->tipo_registro;
        $autorizado = $objeto->personal;
        $observaciones = $objeto->observaciones;
    };
    $mpdf = new \Mpdf\Mpdf();

    for ($i = 0; $i < 3; $i++) {

        $detalles = $ordenCompra->getDetallesOrdenCompra($id_impresion);
        $identificador = ($i == 0) ? 'ORIGINAL' : (($i == 1) ? 'DUPLICADO' : 'TRIPLICADO');
        $plantilla = '';
        $plantilla = '
        <body>
            <div class="orden">
            <div class="titulo">ORDEN DE COMPRA
                
                <div>Tipo de Orden</div>
                <span>' . $identificador . '</span>
            </div>
            
            <div class="row">
                <!-- Primera columna -->
                <div class="col-sm-6">
                    <div class="fecha">
                        <div class="etiqueta">FECHA</div>
                        <div id="auth-fecha">' . $fecha . '</div>
                        
                        <div class="seccion-1">
                            <div>MATERIALES - <span id="tipos-gastos">' . $TipoRegistro . '</span></div>
                        </div>
                    </div>
                </div>
                
                <!-- Segunda columna -->
                
                
                <img src="../Util/img/Filippi.jpeg" class="img-fluid img-circle">
                <div class="col-sm-6 info">
                    <div class="seccion-2">
                        <span class="etiqueta">N°</span>
                        <span>001</span>
                        <span id="num_order">000' . $id . '</span>
                    </div>

                    <div class="seccion">
                        <div>Se autoriza a</div>
                        <span id="auth-personal">' . $autorizado . '</span>
                    </div>
                </div>
            </div>

            <div class="seccion">
                <div>A la compra en el establecimiento: </div>
                <b><span id="auth-proveedor">' . $proveedor . '</span></b>
            </div>' .

            $plantilla .= '
                            <div class="seccion">
                                <div>De los siguientes materiales o insumos</div>
                                <table class="tabla">
                                    <thead>
                                        <tr>
                                            <th>Cantidad</th>
                                            <th>Detalle</th>
                                            <th>Obra</th>
                                            <th>Equipo</th>
                                            <th>Monto</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>';


        foreach ($detalles as $detalle) {
            $plantilla .=
                '
                <tr>
                    <td>' . $detalle->cantidad . '</td>
                    <td>' . $detalle->detalle . '</td>
                    <td>' . $detalle->obra . '</td>
                    <td>' . $detalle->vehiculo . '</td>
                    <td>' . $detalle->monto . '</td>
                    <td>' . $detalle->total . '</td>
                </tr>
            ';
        }

        $plantilla .= '</tbody>
                                </table>
                            </div>

                            <div class="seccion">
                                <div><b>Observación:</b></div>
                                <span id="observacion">' . $observaciones . '</span>
                            </div>

                            <div class="total">
                                <div>TOTAL</div>
                                <span id="total">$..............................</span>
                            </div>

                            <div class="firma">
                                <label for="firma">..............................</label>
                                <div>FIRMA AUTORIZADOR</div>
                            </div>
                        </div>
                </body>';

        $css = file_get_contents("../Util/css/style_print.css");
        $mpdf->writeHTML($css, \Mpdf\HTMLParserMode::HEADER_CSS);
        $mpdf->writeHTML($plantilla, \Mpdf\HTMLParserMode::HTML_BODY);
        if ($i < 2) {
            $mpdf->AddPage();
        }
    }

    $mpdf->output("../Util/pdf/pdf-ordencompra-" . $id_impresion . ".pdf", "F");
}
