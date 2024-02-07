<?php
include_once $_SERVER["DOCUMENT_ROOT"] . '/filippi/Models/personal.php';
include_once $_SERVER["DOCUMENT_ROOT"] . '/filippi/Models/pagosExtra.php';

$personal = new Personal();
$pagosExtra = new PagosExtra();
if ($_POST['funcion'] == 'obtener_valor_vianda') {
    $valor_predeterminado = $pagosExtra->obtener_valor_predeterminado();

    echo $valor_predeterminado;
}


if ($_POST['funcion'] == 'valor_vianda') {
    $valor_vianda = $_POST['viandas_valor'];

    // Obtén el valor predeterminado de la base de datos (puedes guardarlo en una variable de configuración o consultarlo)
    $valor_predeterminado = $pagosExtra->obtener_valor_predeterminado();

    // var_dump($valor_predeterminado);
    // Si el valor de viandas es nulo o vacío, usa el valor predeterminado
    $valor_vianda = ($valor_vianda !== null && $valor_vianda !== 0.00) ? $valor_vianda : $valor_predeterminado;

    $pagosExtra->actualizarValorPredeterminadoVianda($valor_vianda);
}

?>
