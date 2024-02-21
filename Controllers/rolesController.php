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
else
if ($_POST['funcion'] == 'actualizar_sueldo_rol') {
    $rolesId = $_POST['roles'];
    $valor_sueldo_semanal = $_POST['valor_sueldo_semanal'];
    $valor_sueldo_mensual = $_POST['valor_sueldo_mensual'];

    $roles->actualizarValorRoles($rolesId, $valor_sueldo_semanal, $valor_sueldo_mensual);
}
?>