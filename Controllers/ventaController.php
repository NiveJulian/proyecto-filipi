<?php
include '../modelo/venta.php';
include '../modelo/cliente.php';
$cliente = new Cliente();
$venta = new Venta();

if($_POST['funcion']=='listar'){
    $venta->buscar();
    $json=array();
    foreach ($venta->objetos as $objeto) {
        if (empty($objeto->id_cliente)) {
            $cliente_nombre = $objeto->cliente;
            $cliente_firma = $objeto->firma;
        }
        else {
            $cliente->buscar_datos_clientes($objeto->id_cliente);
            foreach ($cliente->objetos as $cli) {
                $cliente_nombre = $cli->nombre.' '.$cli->apellido;
                $cliente_firma = $cli->razonsocial;
            }
            
        }
        $json['data'][]=array(
            'id_venta'=>$objeto->id_venta,
            'fecha'=>$objeto->fecha,
            'cliente'=>$cliente_nombre,
            'firma'=>$cliente_firma,
            'total'=>$objeto->total,
            'vendedor'=>$objeto->vendedor
        );
    }
    $jsonstring = json_encode($json);
    echo $jsonstring;
}
?>