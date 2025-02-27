<?php
include_once '../Models/envios.php';
include_once '../Util/config/config.php';


$envios = new Envio();

if ($_POST['funcion'] == 'crear') {
    $vehiculo_id = $_POST['vehiculo_id'];
    $idDescrypt = decrypt($vehiculo_id);
    $chofer_id = $_POST['chofer_id'];
    $cliente_id = $_POST['cliente_id'];
    $estado_id = $_POST['estado_id'];
    $lugar_salida = $_POST['lugar_salida'];
    $destino = $_POST['destino'];
    $peso = $_POST['peso'];
    $precio = $_POST['precio'];
    $numero_despacho = $_POST['numero_despacho'];

    $envios->crearEnvio($idDescrypt, $chofer_id, $cliente_id, $estado_id, $lugar_salida, $destino, $peso, $precio, $numero_despacho);
} else
if ($_POST['funcion'] == 'crear_estado_envio') {
    $id = $_POST['id'];
    $nombre = $_POST['nombre'];

    $envios->CrearEstadoEnvio($id, $nombre);
} else
if ($_POST['funcion'] == 'cambiar_estado_envio') {
    $id = $_POST['id'];
    $idDescrypt = decrypt($id);
    $estado = $_POST['estado'];

    $envios->CambiarEstadoEnvio($idDescrypt, $estado);
} else
if ($_POST['funcion'] == 'obtener_todos_envios') {
    $envios->obtener_todos_envios();
    $json = array();

    foreach ($envios->objetos as $objeto) {
        $json[] = array(
            'id' => encrypt($objeto->id_envio),
            'fecha' => $objeto->created_at,
            'lugar_Salida' => $objeto->lugar_salida,
            'destino' => $objeto->destino,
            'peso' => $objeto->peso,
            'precio' => $objeto->precio,
            'estado' => $objeto->estado_envio,
            'numero_despacho' => $objeto->numero_despacho,
            'tracking_uid' => $objeto->tracking_uid,
            'vehiculo_codigo' => $objeto->vehiculo_codigo,
            'vehiculo' => $objeto->vehiculo_nombre,
            'chofer' => $objeto->chofer_nombre,
            'cliente_nombre' => $objeto->cliente_nombre,
            'cliente_razon_social' => $objeto->cliente_razon_social
        );
    }

    $jsonstring = json_encode($json);
    echo $jsonstring;
} else
if ($_POST['funcion'] == 'obtener_envios_cliente') {
    $idEncript = $_POST['cliente_id'];
    $cliente_id = decrypt($idEncript);
    $envios->obtener_envios_cliente($cliente_id);
    $json = array();

    foreach ($envios->objetos as $objeto) {
        $json[] = array(
            'id' => encrypt($objeto->id_envio),
            'fecha' => $objeto->created_at,
            'lugar_Salida' => $objeto->lugar_salida,
            'destino' => $objeto->destino,
            'peso' => $objeto->peso,
            'precio' => $objeto->precio,
            'estado' => $objeto->estado_envio,
            'numero_despacho' => $objeto->numero_despacho,
            'tracking_uid' => $objeto->tracking_uid,
            'vehiculo_codigo' => $objeto->vehiculo_codigo,
            'vehiculo' => $objeto->vehiculo_nombre,
            'chofer' => $objeto->chofer_nombre,
            'cliente_nombre' => $objeto->cliente_nombre,
            'cliente_razon_social' => $objeto->cliente_razon_social
        );
    }

    $jsonstring = json_encode($json);
    echo $jsonstring;
} else
if ($_POST['funcion'] == 'rellenar_estado_envio') {
    $envios->rellenarEstadoEnvio();
    $json = array();
    foreach ($envios->objetos as $objeto) {
        $json[] = array(
            'id' => $objeto->id,
            'nombre' => $objeto->nombre
        );
    }
    $jsonstring = json_encode($json);
    echo $jsonstring;
} else
if ($_POST['funcion'] == 'obtener_documentos') {
    $idDescrypt = $_POST['envioId'];
    $envioId = decrypt($idDescrypt);

    $envios->obtener_documentos($envioId);
    $json = array();
    foreach ($envios->objetos as $objeto) {
        $json[] = array(
            'id' => encrypt($objeto->id),
            'envio_id' => encrypt($objeto->envio_id),
            'tipo_documento' => $objeto->tipo_documento,
            'url' => $objeto->url_documento,
        );
    };
    $jsonstring = json_encode($json);
    echo $jsonstring;
} else
if ($_POST['funcion'] == 'subir-documento') {
    $id = $_POST['envio-id-doc'];
    $envioId = decrypt($id);

    $nombreDoc = $_POST['nombre-doc'];

    if (!isset($_FILES['pdf'])) {
        echo json_encode(['alert' => 'novalid']);
        exit();
    }

    $archivo = $_FILES['pdf'];
    $nombreArchivo = $archivo['name'];
    $tipoArchivo = $archivo['type'];
    $tamanioArchivo = $archivo['size'];
    $rutaTemp = $archivo['tmp_name'];
    $directorioDestino = '../Util/archiv/doc-envio/';

    // Validar tipo y tamaño (ejemplo: 5MB máximo)
    if ($tipoArchivo !== 'application/pdf' || $tamanioArchivo > 5 * 1024 * 1024) {
        echo json_encode(['alert' => 'novalid']);
        exit();
    }

    // Definir ruta final
    $rutaArchivo = $directorioDestino . $nombreArchivo;

    if ($envios->verificar_archivo_existente($envioId, $rutaArchivo)) {
        echo json_encode(['alert' => 'noedit']);
        exit();
    }

    // Mover archivo al servidor
    if (!move_uploaded_file($rutaTemp, $rutaArchivo)) {
        echo json_encode(['alert' => 'noedit']);
        exit();
    }

    // Guardar en la base de datos
    $envios->adjuntar_archivo_pdf($envioId, $nombreDoc, $rutaArchivo);

    echo json_encode(['alert' => 'edit']);
}
