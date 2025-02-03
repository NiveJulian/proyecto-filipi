<?php
include_once '../Models/rifas.php';

$rifas = new Rifa();

if ($_POST['funcion'] == 'rifa') {
    require('../vendor/autoload.php');

    $rangoNumeracionInicio = $_POST["rangoNumeracionInicio"];
    $rangoNumeracionFin = $_POST["rangoNumeracionFin"];
    $tarjetasPorFila = 2; // Número de tarjetas por fila
    $tarjetasPorColumna = 3; // Número de tarjetas por columna

    $mpdf = new \Mpdf\Mpdf([
        'format' => 'A4',
    ]);

    // Incluye los estilos CSS
    $css = file_get_contents("../Util/css/sorteo_print.css");

    // Genera las tarjetas dentro del rango especificado
    for ($i = $rangoNumeracionInicio; $i <= $rangoNumeracionFin; $i++) {
        // Verifica si se necesita una nueva página
        if (($i - $rangoNumeracionInicio) % ($tarjetasPorFila * $tarjetasPorColumna) === 0) {
            $mpdf->AddPage();
        }

        // Calcula las coordenadas X e Y de la tarjeta en la página
        $fila = floor(($i - $rangoNumeracionInicio) / $tarjetasPorFila) % $tarjetasPorColumna;
        $columna = ($i - $rangoNumeracionInicio) % $tarjetasPorFila;

        // Calcula el desplazamiento según la posición en la fila y columna
        $desplazamientoX = $columna * (100 / $tarjetasPorFila);
        $desplazamientoY = $fila * (50 / $tarjetasPorColumna);

        // Construye la plantilla con desplazamiento
        $plantilla = '<div class="page-container" style="transform: translateY(' . $desplazamientoY . '%);">
                            <div class="card card-sorteo" style="transform: translateX(' . $desplazamientoX . '%);">
                                <div class="card-body">
                                    <div class="form-rifa">
                                        <div class="row">
                                            <!-- SECCION 1 -->
                                            <div class="text-left">
                                            
                                                <div class="vertical-line-container">
                                                    <form>
                                                        <div class="form-group">
                                                            <label for="">Nombre:</label>
                                                            <p>_______________________________</p>
                                                        </div>
                                                        <div class="form-group">
                                                            <label for="">Direccion:</label>
                                                            <p>_______________________________</p>
                                                        </div>
                                                        <div class="form-group">
                                                            <label for="">Telefono:</label>
                                                            <p>_______________________________</p>
                                                        </div>
                                                        <div class="form-group">
                                                            <label for="">DNI:</label>
                                                            <p>_______________________________</p>
                                                        </div>
                                                        <div class="form-group numeracion">
                                                            <span id="numeracion">000'. $i .'</span>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                            <!-- SECCION 2 -->

                                            <div class="columna-2">
                                                <div class="vertical-line-container">
                                                    <img src="../Util/img/sorteo-edicion-24.png" class="sorteo24 img-fluid">
                                                    <div class="row">
                                                        <div class="premios">
                                                            <ul>
                                                                <b>
                                                                    <li>1° $200.000</li>
                                                                    <li>2° $100.000</li>
                                                                    <li>3° $50.000</li>
                                                                    <li>4° $50.000</li>
                                                                    <li>5° $50.000</li>
                                                                    <li>6° $40.000</li>
                                                                    <li>7° $40.000</li>
                                                                    <li>8° $40.000</li>
                                                                    <li>9° $30.000</li>
                                                                    <li>10° $30.000</li>
                                                                </b>
                                                            </ul>
                                                        </div>
                                                        <div class="sortea1">
                                                            <h6>SORTEA</h6>
                                                            <p>14 de febrero</p>
                                                            <p><b>2024</b></p>
                                                            <img src="../Util/img/logorifa.png" class="logo-sorteo img-fluid">
                                                        </div>
                                                        <img src="../Util/img/pfb.png" class="img-fluid">
                                                        <div class="sortea3 cuota-2">
                                                            <img src="../Util/img/cuota2.png" class="img-fluid">
                                                            <p class="bg-cuotas1"></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <!-- SECCION 3 -->

                                            <div class="columna-3">
                                                <div class="row">
                                                    <div class="valor-rifa text-center">
                                                        <h7><b>Valor de la rifa</b></h7>
                                                        <span>$3000</span>
                                                    </div>
                                                    <div class="sortea2 text-center mt-2">
                                                        <h7><b>Sortea 14 de febrero</b></h7>
                                                        <h5>2024</h5>
                                                    </div>
                                                    <div class="sortea4 text-center mt-2">
                                                        <h7><b>Sorteo por Facebook en VIVO</b></h7>
                                                    </div>
                                                    <div class="text-center flex-end cuota-1">
                                                        <img src="../Util/img/cuota1.png" class="img-fluid">
                                                        <p class="bg-cuotas2"></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>';

        // Escribe la plantilla en el PDF
        $mpdf->writeHTML($css, \Mpdf\HTMLParserMode::HEADER_CSS);
        $mpdf->writeHTML($plantilla, \Mpdf\HTMLParserMode::HTML_BODY);
    }

    // Guarda el archivo PDF
    $mpdf->output("../Util/pdf/pdf-rifa-" . $rangoNumeracionInicio . "-to-" . $rangoNumeracionFin . ".pdf", "F");
}

?>
