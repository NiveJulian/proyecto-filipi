<?php
include_once $_SERVER["DOCUMENT_ROOT"].'/filippi/Models/personal.php';

$personal = new Personal();
if($_POST['funcion']=='ver'){
    $id=$_POST['id'];
    $personal->ver($id);
    $json=array();
    $cont=0;
        foreach ($personal->objetos as $objeto) {
            $cont++;
            $json[]=array(
            );
        }
    $jsonstring = json_encode($json);
    echo $jsonstring;
}
else 
if ($_POST['funcion'] == 'cambiar_avatar') {
    $id = $_POST['id_logo_prod'];
    $avatar = $_POST['avatar'];

    // Verifica si se ha subido una nueva imagen
    if (!empty($_FILES['photo']['name'])) {
        if (($_FILES['photo']['type'] == 'image/jpeg') || ($_FILES['photo']['type'] == 'image/png') || ($_FILES['photo']['type'] == 'image/gif')) {
            $nombre = uniqid() . '-' . $_FILES['photo']['name'];
            $ruta = '../Util/img/personal/' . $nombre;
            move_uploaded_file($_FILES['photo']['tmp_name'], $ruta);
            $personal->cambiar_avatar($id, $nombre);
            if ($avatar !== '/filippi/Util/img/personal_default.png') {
                if (file_exists($avatar)) {
                    unlink($avatar);
                }
            }

            $json = array(
                'ruta' => $ruta,
                'alert' => 'edit'
            );
        } else {
            $json = array(
                'alert' => 'noedit'
            );
        }
    } else {
        $json = array(
            'alert' => 'noedit'
        );
    }

    $jsonstring = json_encode($json);
    echo $jsonstring;
}
else 
if ($_POST['funcion'] == 'obtener_personal') {
    $page = isset($_POST['page']) ? intval($_POST['page']) : 1;
    $itemsPerPage = isset($_POST['itemsPerPage']) ? intval($_POST['itemsPerPage']) : 10;

    // Calcular el índice inicial y final de los registros a obtener
    $offset = ($page - 1) * $itemsPerPage;

    $personal->obtener_personal($offset, $itemsPerPage);

    $json = array();
    $pagination = array();

    foreach ($personal->objetos as $objeto) {
        $json['data'][] = array(
            'id' => $objeto->id,
            'nombre' => $objeto->nombre,
            'direccion' => $objeto->direccion,
            'cuil' => $objeto->cuil,
            'rol' => $objeto->nombre_rol,
            'fecha_ingreso' => $objeto->fecha_ingreso,
            'fecha_alta' => $objeto->fecha_alta,
            'fecha_salida' => $objeto->fecha_salida,
            'fecha_baja' => $objeto->fecha_baja,
            'obra_social' => $objeto->obra_social,
            'dni' => $objeto->dni,
            'carnet' => $objeto->carnet,
            'avatar' => '../Util/img/personal/'.$objeto->avatar
        );
    }
    $totalRecords = $personal->obtener_total_registros(); 
    $paginationData = array(
        'totalRecords' => $totalRecords,
        'currentPage' => $page,
        'itemsPerPage' => $itemsPerPage
    );

    $json['pagination'] = $paginationData;
    echo json_encode(array("data" => $json, "pagination" => $pagination));
}
else
if($_POST['funcion']=='crear'){
    $nombre = $_POST['nombre'];
    $direccion = $_POST['direccion'];
    $cuil = $_POST['cuil'];
    $dni = $_POST['dni'];
    $rol = $_POST['rol'];
    $obrasocial = $_POST['obrasocial'];
    $fecha_alta = $_POST['fecha_alta'];
    $fecha_baja = $_POST['fecha_baja'];
    $fecha_ingreso = $_POST['fecha_ingreso'];
    $carnet = $_POST['carnet'];
    $avatar='personal_default.png';
    
    $personal->crear($nombre,$direccion,$cuil,$rol,$dni,$obrasocial,$fecha_alta,$fecha_baja,$fecha_ingreso,$carnet);
}
else
if($_POST['funcion']=='editar'){
    $id = $_POST['id'];
    $nombre = $_POST['nombre'];
    $direccion = $_POST['direccion'];
    $cuil = $_POST['cuil'];
    $dni = $_POST['dni'];
    $rol = $_POST['rol'];
    $obrasocial = $_POST['obrasocial'];
    $fecha_alta = $_POST['fecha_alta'];
    $fecha_ingreso = $_POST['fecha_ingreso'];
    $fecha_baja = $_POST['fecha_baja'];
    $carnet = $_POST['carnet'];
    
    $personal->editar($id,$nombre,$direccion,$dni,$cuil,$rol,$obrasocial,$fecha_alta,$fecha_ingreso,$fecha_baja,$carnet);
}
if($_POST['funcion']=='borrar'){
    $id=$_POST['id'];
    $personal->borrar($id);
}
else
if($_POST['funcion']=='obtener_vencidos'){
    $personal->obtener_fecha_vencida();
    $json= array();
    $fecha_actual = new DateTime();
    foreach($personal->objetos as $objeto){
        $vencimientos = [
            'vtv' => new DateTime($objeto->vtv),
            'cedula' => new DateTime($objeto->vencimiento_cedula),
            'logistica' => new DateTime($objeto->logistica),
            'senasa' => new DateTime($objeto->senasa),
            'seguro' => new DateTime($objeto->seguro),
            'poliza' => new DateTime($objeto->poliza),
        ];
        foreach ($vencimientos as $key => $vencimiento) {
            $diferencia = $vencimiento->diff($fecha_actual);
            $dia = $diferencia->d;
            $verificado = $diferencia->invert;
            if($verificado==0){
                $estado = 'danger';
                $dia = $dia*(-1);
            }
            else{
                if($dia > 10){
                    $estado = 'light';
                }
                if($dia < 10 && $dia > 0){
                    $estado = 'warning';
                }
            };
        }
        $json[]=array(
            'id'=>$objeto->id,
            'codigo'=>$objeto->codigo,
            'personal'=>$objeto->personal,
            'vtv'=>$objeto->vtv,
            'cedula'=>$objeto->cedula,
            'motor'=>$objeto->motor,
            'vencimiento_cedula'=>$objeto->vencimiento_cedula,
            'logistica'=>$objeto->logistica,
            'senasa'=>$objeto->senasa,
            'seguro'=>$objeto->seguro,
            'num_poliza'=>$objeto->num_poliza,
            'poliza'=>$objeto->poliza,
            'estado'=>$estado,
            'invert'=>$verificado
        );
    }
    $jsonstring = json_encode($json);
    echo $jsonstring;
}
else
if ($_POST['funcion'] == 'obtener_resumen') {
    $personal->obtener_resumen();
    $json = array();
    $fecha_actual = new DateTime();
    $cont=0;
    foreach ($personal->objetos as $objeto) {
        $cont++;
        $vencimientos = [
            'VTV' => new DateTime($objeto->vtv),
            'Cedula' => new DateTime($objeto->vencimiento_cedula),
            'R.U.T.A' => new DateTime($objeto->logistica),
            'Senasa' => new DateTime($objeto->senasa),
            'Pago Seguro' => new DateTime($objeto->seguro),
            'Matafuego' => new DateTime($objeto->matafuego),
            'Poliza' => new DateTime($objeto->poliza),
        ];

        $vencimientos_info = array();

        foreach ($vencimientos as $key => $vencimiento) {
            $diferencia = $vencimiento->diff($fecha_actual);
            $dias = $diferencia->days;
            $verificado = $diferencia->invert;
            
            if ($verificado == 0) {
                $estado = 'danger';
                $dias = -$dias; // Si es vencido, convertimos días negativos
            } else {
                if($dias > 15){
                    $estado = 'light';
                }
                if($dias < 15 && $dias > 0){
                    $estado = 'warning';
                }
            }
            
            // Agregar información de vencimiento al array
            $vencimientos_info[$key] = array(
                'dias' => $dias
            );
        }
        $json[] = array(
            'id'=>$objeto->id,
            'num' => $cont,
            'dato' => $objeto->codigo,
            'personal' => $objeto->personal,
            'cedula_verde' => $objeto->cedula,
            'motor' => $objeto->motor,
            'vencimientos' => $vencimientos_info
        );
    }

    $jsonstring = json_encode($json);
    echo $jsonstring;
}
else
if ($_POST['funcion'] == 'descargarPDF') {
    $archivoId = $_POST['id'];

    // Recupera el registro de archivo PDF con el ID especificado
    $archivo = $personal->obtenerDatosArchivoPDF($archivoId);

    $json= array();
    
    foreach($archivo->objetos as $objeto){
        
        $json[]=array(
            'id'=>$objeto->id,
            'nombre'=>$objeto->nombre,
            'ruta'=>$objeto->ruta
        );
    }
    $jsonstring = json_encode($json);
    echo $jsonstring;
}
else
if($_POST['funcion']=='rellenar_personal'){
    $personal->rellenar_personal();
    $json = array();
    foreach ($personal->objetos as $objeto){
        $json[]=array(
            'id'=>$objeto->id,
            'nombre'=>$objeto->nombre
        );
    };
    $jsonstring=json_encode($json);
    echo $jsonstring;
}

else
if ($_POST['funcion'] == 'empleados_rol') {
    $resultados = $personal->empleadosConRol();
    $json = array();
    if ($resultados !== false && !empty($resultados)) {
        foreach ($resultados as $objeto) {
            $json[] = array(
                'rol_id' => $objeto['rol_id'],
                'nombre' => $objeto['nombre'],
            );
        }
    }
    $jsonstring = json_encode($json);
    echo $jsonstring;
}


?>