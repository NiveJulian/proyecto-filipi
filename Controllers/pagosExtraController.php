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

    $valor_predeterminado = $pagosExtra->obtener_valor_predeterminado();
    $valor_vianda = ($valor_vianda !== null && $valor_vianda !== 0.00) ? $valor_vianda : $valor_predeterminado;

    $pagosExtra->actualizarValorPredeterminadoVianda($valor_vianda);
}

?>
