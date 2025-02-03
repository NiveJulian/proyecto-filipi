<?php
include_once '../Models/archivo.php';

$archivos = new Archivos();

if ($_POST['funcion'] == 'borrar_archivo') {
    $id = $_POST['id'];
    $result = $archivos->borrar_archivo($id);
} else
if ($_POST['funcion'] == 'adjuntar_archivo_pdf') {
    $idVehiculo = $_POST['id_vehiculo'];
    $idTipoArchivo = $_POST['id_tipo_archivo'];
    $nombre = $_FILES['pdf']['name'];
    $ruta = '../Util/archiv/vehiculos/' . $nombre;
    $existeArchivo = $archivos->verificar_archivo_existente($idVehiculo, $nombre);

    if ($existeArchivo) {
        $json = array('alert' => 'noedit', 'message' => 'Ya existe un archivo con el mismo nombre y vehículo.');
    } elseif ($_FILES['pdf']['type'] != 'application/pdf') {
        $json = array('alert' => 'novalid', 'message' => 'El archivo no es un PDF válido o supera el límite de tamaño permitido.');
    } elseif (!move_uploaded_file($_FILES['pdf']['tmp_name'], $ruta)) {
        $json = array('alert' => 'noedit', 'message' => 'No se pudo subir el archivo.');
    } else {
        $archivos->adjuntar_archivo_pdf($idVehiculo, $idTipoArchivo, $nombre, $ruta);
        $json = array('alert' => 'edit');
    }

    $jsonstring = json_encode($json);
    echo $jsonstring;
} else
if ($_POST['funcion'] == 'obtener_archivos_vehiculo') {
    $archivosId = $_POST['vehiculo_id'];
    $archivos->obtenerArchivosVehiculo($archivosId);


    $json = array();
    foreach ($archivos->objetos as $objeto) {
        $json[] = array(
            'id' => $objeto->id,
            'nombre' => $objeto->nombre,
            'ruta' => $objeto->ruta,
            'id_tipo_archivo' => $objeto->id_tipo_archivo,
            'tipo_archivo_nombre' => $objeto->tipo_archivo_nombre,
        );
    }

    $jsonstring = json_encode($json);
    echo $jsonstring;
} else
if ($_POST['funcion'] == 'rellenar_archivos') {
    $archivos->rellenar_archivos();
    $json = array();
    foreach ($archivos->objetos as $objeto) {
        $json[] = array(
            'id' => $objeto->id,
            'nombre' => $objeto->nombre
        );
    };
    $jsonstring = json_encode($json);
    echo $jsonstring;
} else
if ($_POST['funcion'] == 'creador_tipos_archivos') {
    $nombre = $_POST['tipo_archivo'];
    $archivos->crear_tipos_archivos($nombre);
}

// PERSONAL
else
if ($_POST['funcion'] == 'crear_tipo_archivo') {
    $nombre = $_POST['tipo_archivo'];
    $archivos->crearTipoDeArchivoPersonal($nombre);
} else
if ($_POST['funcion'] == 'adjuntar_archivo_personal') {
    $idPersonal = $_POST['id_personal'];
    $idTipoArchivo = $_POST['id_tipo_archivo_personal'];
    $nombre = $_FILES['pdf']['name'];
    $ruta = '../Util/archiv/personal/' . $nombre;
    $existeArchivo = $archivos->verificar_archivo_existente_personal($idPersonal, $nombre);

    if ($existeArchivo) {
        $json = array('alert' => 'noedit', 'message' => 'Ya existe un archivo con el mismo nombre y vehículo.');
    } elseif ($_FILES['pdf']['type'] != 'application/pdf') {
        $json = array('alert' => 'novalid', 'message' => 'El archivo no es un PDF válido o supera el límite de tamaño permitido.');
    } elseif (!move_uploaded_file($_FILES['pdf']['tmp_name'], $ruta)) {
        $json = array('alert' => 'noedit', 'message' => 'No se pudo subir el archivo.');
    } else {
        $archivos->adjuntar_archivo_personal($idPersonal, $idTipoArchivo, $nombre, $ruta);
        $json = array('alert' => 'edit');
    }

    $jsonstring = json_encode($json);
    echo $jsonstring;
} else
if ($_POST['funcion'] == 'rellenar_archivos_personal') {
    $archivos->rellenar_archivos_personal();
    $json = array();
    foreach ($archivos->objetos as $objeto) {
        $json[] = array(
            'id' => $objeto->id,
            'nombre' => $objeto->nombre_tipo
        );
    };
    $jsonstring = json_encode($json);
    echo $jsonstring;
} else
if ($_POST['funcion'] == 'obtener_archivos_personal') {
    $archivosId = $_POST['personal_id'];
    $archivos->obtenerArchivosPersonal($archivosId);


    $json = array();
    foreach ($archivos->objetos as $objeto) {
        $json[] = array(
            'id' => $objeto->id,
            'nombre' => $objeto->nombre,
            'ruta' => $objeto->ruta_archivo,
            'id_tipo_archivo' => $objeto->tipo_archivo_id,
            'tipo_archivo_personal' => $objeto->tipo_archivo_personal
        );
    }

    $jsonstring = json_encode($json);
    echo $jsonstring;
}
