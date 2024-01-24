<?php
include_once $_SERVER["DOCUMENT_ROOT"] . '/filippi/Models/roles.php';

$roles = new Roles();

if ($_POST['funcion'] == 'obtener_roles') {
    $roles->obtenerRoles();

    $json = array();

    foreach ($roles->objetos as $objeto) {
        $json[] = array(
            'id' => $objeto->id,
            'nombre' => $objeto->nombre,
            'sueldo_semanal' => $objeto->sueldo_semanal,
            'sueldo_mensual' => $objeto->sueldo_mensual,
        );
    }

    $jsonstring = json_encode($json);
    echo $jsonstring;
}
?>