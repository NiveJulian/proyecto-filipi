<?php
include_once $_SERVER["DOCUMENT_ROOT"].'/filippi/Models/facturacion.php';

$facturacion = new Factura();

// FACTURACION RECIBIDO
if ($_POST['funcion'] == 'obtener_calc') {
    $facturas = $facturacion->obtener_calc();
    $json = array();
    foreach ($facturas as $objeto) {

        $json[] = array(
            'id' => $objeto->id,
            'fecha' => $objeto->fecha,
            'subtotal' =>$objeto->subtotal,
            'iva' =>$objeto->iva,
            'itc' =>$objeto->itc,
            'idc' =>$objeto->idc,
            'perc_iibb' =>$objeto->perc_iibb,
            'perc_iva' =>$objeto->perc_iva,
            'otros_im' =>$objeto->otros_im,
            'descuento' =>$objeto->descuento,
            'total' =>$objeto->total
        );
    }
    $jsonstring = json_encode($json);
    echo $jsonstring;
}
if ($_POST['funcion'] == 'obtener_facturas') {
    $facturas = $facturacion->obtener_facturas();
    $json = array();
    foreach ($facturas as $objeto) {

        $json[] = array(
            'id' => $objeto->id_factura,
            'fecha' => $objeto->fecha,
            'num_factura' => $objeto->num_factura,
            'razon_social' => $objeto->razonsocial,
            'subtotal' => $objeto->subtotal, // Formatear subtotal
            'iva' => $objeto->iva, // Formatear iva
            'itc' => $objeto->itc, // Formatear itc
            'idc' => $objeto->idc,
            'perc_iibb' => $objeto->perc_iibb,
            'perc_iva' => $objeto->perc_iva,
            'otros_im' => $objeto->otros_im,
            'descuento' => $objeto->descuento,
            'total' => $objeto->total,
            'vehiculo_datos' => $objeto->vehiculo_datos,
            'cuit' => $objeto->cuit,
            'tipo_gasto' => $objeto->tipo_gasto,
            'id_vehiculo' => $objeto->id_vehiculo,
            'id_tipo_factura' => $objeto->id_tipo_factura,
            'id_proveedor' => $objeto->id_proveedor,
            'id_registro' => $objeto->id_registro
        );
    }
    $jsonstring = json_encode($json);
    echo $jsonstring;
}
if ($_POST['funcion'] == 'registrar_factura') {
    // Obtener los datos del POST
    $fecha = $_POST['fecha'];

    $comprobante = $_POST['comprobante'];

    $puntoVenta = $_POST['puntoVenta'];

    $tipoVenta = $_POST['tipoVenta'];

    $numeroFactura = $_POST['numeroFactura'];
    
    $razonSocial = $_POST['razonSocial'];

    $equipo = $_POST['equipo'];

    $subtotal = $_POST['subtotal'];

    $iva = $_POST['iva'];

    $itc = $_POST['itc'];

    $idc = $_POST['idc'];

    $percIibb = $_POST['percIibb'];

    $percIva = $_POST['percIva'];

    $otrosImpuestos = $_POST['otrosImpuestos'];
    
    $descuento = $_POST['descuento'];
    
    $total = $_POST['total'];


    $resultado = $facturacion->registrarFactura($fecha, $comprobante, $puntoVenta, $tipoVenta, $numeroFactura, $razonSocial, $equipo, $subtotal, $iva, $itc, $idc, $percIibb, $percIva, $otrosImpuestos, $descuento, $total);

    echo $resultado;
}
if($_POST['funcion']=='rellenar_tipo_registro'){
    $facturacion->rellenar_tipo_registro();
    $json = array();
    foreach ($facturacion->objetos as $objeto){
        $json[]=array(
            'id'=>$objeto->id,
            'nombre'=>$objeto->nombre
        );
    };
    $jsonstring=json_encode($json);
    echo $jsonstring;
}
if($_POST['funcion']=='rellenar_factura'){
    $facturacion->rellenar_factura();
    $json = array();
    foreach ($facturacion->objetos as $objeto){
        $json[]=array(
            'id'=>$objeto->id,
            'nombre'=>$objeto->nombre,
            'descripcion'=>$objeto->descripcion
        );
    };
    $jsonstring=json_encode($json);
    echo $jsonstring;
}
if ($_POST['funcion'] == 'obtener_opciones_factura') {
    $tiposRegistro = $facturacion->obtenerFacturasPorTipoRegistro();

    $json = array(
        'tipos_registro' => $tiposRegistro,
        'facturas' => []
    );
    if (!empty($tiposRegistro)) {
        $facturas = array();
        foreach ($tiposRegistro as $tipoRegistro) {
            $facturas[] = array(
                'id' => $tipoRegistro->id,
                'total' => $tipoRegistro->total,
                'estado' => $tipoRegistro->estado
            );
        }
        $json['facturas'] = $facturas;
    }

    $jsonstring = json_encode($json);
    echo $jsonstring;
}
if($_POST['funcion']=='borrar'){
    $idFactura=$_POST['idFactura'];
    $numeroFactura=$_POST['numeroFactura'];

    $facturacion->borrar($idFactura, $numeroFactura);
}
if($_POST['funcion']=='editar'){

    $id = $_POST['id'];

    $fecha = $_POST['fecha'];

    $comprobante = $_POST['comprobante'];

    $puntoVenta = $_POST['puntoVenta'];

    $tipoVenta = $_POST['tipoRegistroId'];

    $numeroFactura = $_POST['numeroFactura'];
    
    $razonSocial = $_POST['razonSocial'];

    $equipo = $_POST['equipo'];

    $subtotal = $_POST['subtotal'];

    $iva = $_POST['iva'];

    $itc = $_POST['itc'];

    $idc = $_POST['idc'];

    $percIibb = $_POST['percIibb'];

    $percIva = $_POST['percIva'];

    $otrosImpuestos = $_POST['otrosImpuestos'];
    
    $descuento = $_POST['descuento'];
    
    $total = $_POST['total'];

    $resultado = $facturacion->editarFactura($id,$fecha, $comprobante, $puntoVenta, $tipoVenta, $numeroFactura, $razonSocial, $equipo, $subtotal, $iva, $itc, $idc, $percIibb, $percIva, $otrosImpuestos, $descuento, $total);

    echo $resultado;
}



// FACTURACION EMITIDO
if ($_POST['funcion'] == 'obtener_registo_factura') {
    $tiposRegistro = $facturacion->obtenerFacturasPorTipoRegistroEmitidoPorMes();

    $json = array(
        'tipos_registro' => $tiposRegistro,
        'facturas' => []
    );
    if (!empty($tiposRegistro)) {
        $facturas = array();
        foreach ($tiposRegistro as $tipoRegistro) {
            $facturas[] = array(
                'id' => $tipoRegistro->id,
                'total' => $tipoRegistro->total,
                'mes' => $tipoRegistro->mes,
                'estado' => $tipoRegistro->estado
            );
        }
        $json['facturas'] = $facturas;
    }

    $jsonstring = json_encode($json);
    echo $jsonstring;
}

// if ($_POST['funcion'] == 'obtener_registo_factura') {
//     $tiposRegistro = $facturacion->obtenerFacturasPorTipoRegistroEmitido();

//     $json = array(
//         'tipos_registro' => $tiposRegistro,
//         'facturas' => []
//     );
//     if (!empty($tiposRegistro)) {
//         $facturas = array();
//         foreach ($tiposRegistro as $tipoRegistro) {
//             $facturas[] = array(
//                 'id' => $tipoRegistro->id,
//                 'total' => $tipoRegistro->total,
//                 'estado' => $tipoRegistro->estado
//             );
//         }
//         $json['facturas'] = $facturas;
//     }

//     $jsonstring = json_encode($json);
//     echo $jsonstring;
// }
if ($_POST['funcion'] == 'obtener_calculo_emitido') {
    $facturas = $facturacion->obtener_calculo_emitido();
    $json = array();
    foreach ($facturas as $objeto) {

        $json[] = array(
            'id' => $objeto->id,
            'fecha' => $objeto->fecha,
            'subtotal' =>$objeto->subtotal,
            'iva' =>$objeto->iva,
            'itc' =>$objeto->itc,
            'idc' =>$objeto->idc,
            'perc_iibb' =>$objeto->perc_iibb,
            'perc_iva' =>$objeto->perc_iva,
            'otros_im' =>$objeto->otros_im,
            'descuento' =>$objeto->descuento,
            'total' =>$objeto->total
        );
    }
    $jsonstring = json_encode($json);
    echo $jsonstring;
}
if ($_POST['funcion'] == 'obtener_facturas_emitidas') {
    $facturas = $facturacion->obtener_facturas_emitidas();
    $json = array();
    foreach ($facturas as $objeto) {

        $json[] = array(
            'id' => $objeto->id_factura,
            'fecha' => $objeto->fecha,
            'num_factura' => $objeto->num_factura,
            'razon_social' => $objeto->razonsocial,
            'subtotal' => $objeto->subtotal, // Formatear subtotal
            'iva' => $objeto->iva, // Formatear iva
            'itc' => $objeto->itc, // Formatear itc
            'idc' => $objeto->idc,
            'perc_iibb' => $objeto->perc_iibb,
            'perc_iva' => $objeto->perc_iva,
            'otros_im' => $objeto->otros_im,
            'descuento' => $objeto->descuento,
            'total' => $objeto->total,
            'cuit' => $objeto->cuit,
            'tipo_gasto' => $objeto->tipo_gasto,
            'id_tipo_factura' => $objeto->id_tipo_factura,
            'id_cliente' => $objeto->id_cliente,
            'id_registro' => $objeto->id_registro
        );
    }
    $jsonstring = json_encode($json);
    echo $jsonstring;
}
if ($_POST['funcion']=='registrar_factura_emitida') {
    $fecha = $_POST['fecha_emitido'];

    $comprobante = $_POST['comprobante_emitido'];

    $puntoVenta = $_POST['puntoVenta_emitido'];

    $tipoVenta = $_POST['tipoVenta_emitido'];

    $numeroFactura = $_POST['numeroFactura_emitido'];
    
    $razonSocial = $_POST['razonSocial_emitido'];

    $subtotal = $_POST['subtotal_emitido'];

    $iva = $_POST['iva_emitido'];

    $itc = $_POST['itc_emitido'];

    $idc = $_POST['idc_emitido'];

    $percIibb = $_POST['percIibb_emitido'];

    $percIva = $_POST['percIva_emitido'];

    $otrosImpuestos = $_POST['otrosImpuestos_emitido'];
    
    $descuento = $_POST['descuento_emitido'];
    
    $total = $_POST['total_emitido'];


    $resultado = $facturacion->registrarFacturaEmitida($fecha, $comprobante, $puntoVenta, $tipoVenta, $numeroFactura, $razonSocial, $subtotal, $iva, $itc, $idc, $percIibb, $percIva, $otrosImpuestos, $descuento, $total);
}
if($_POST['funcion']=='editar_factura_emitida'){

    $id = $_POST['id'];

    $fecha = $_POST['fecha_emitido'];

    $comprobante = $_POST['comprobante_emitido'];

    $puntoVenta = $_POST['puntoVenta_emitido'];

    $tipoVenta = $_POST['tipoRegistroIdEmitido'];

    $numeroFactura = $_POST['numeroFactura_emitido'];
    
    $razonSocial = $_POST['razonSocial_emitido'];

    $subtotal = $_POST['subtotal_emitido'];

    $iva = $_POST['iva_emitido'];

    $itc = $_POST['itc_emitido'];

    $idc = $_POST['idc_emitido'];

    $percIibb = $_POST['percIibb_emitido'];

    $percIva = $_POST['percIva_emitido'];

    $otrosImpuestos = $_POST['otrosImpuestos_emitido'];
    
    $descuento = $_POST['descuento_emitido'];
    
    $total = $_POST['total_emitido'];

    $resultado = $facturacion->editarFacturaEmitida($id,$fecha, $comprobante, $puntoVenta, $tipoVenta, $numeroFactura, $razonSocial, $subtotal, $iva, $itc, $idc, $percIibb, $percIva, $otrosImpuestos, $descuento, $total);
}
if($_POST['funcion']=='anular'){
    $idFactura=$_POST['idFactura'];
    $numeroFactura=$_POST['numeroFactura'];

    $facturacion->anularEmitida($idFactura, $numeroFactura);
}
if($_POST['funcion']=='rellenar_tipo_registro_venta'){
    $facturacion->rellenar_tipo_registro_venta();
    $json = array();
    foreach ($facturacion->objetos as $objeto){
        $json[]=array(
            'id'=>$objeto->id,
            'nombre'=>$objeto->nombre
        );
    };
    $jsonstring=json_encode($json);
    echo $jsonstring;
}
?>