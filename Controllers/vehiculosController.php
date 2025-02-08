<?php
include_once '../Models/vehiculos.php';
include_once '../Util/config/config.php';

$vehiculo = new Vehiculo();
// Asegúrate de incluir o importar la clase Vehiculo y la conexión a la base de datos
if ($_POST['funcion'] == 'seguimientoDeService') {
    $idVehiculo = $_POST['id'];
    $idDescrypt = decrypt($idVehiculo);
    $result = $vehiculo->seguimientoDeService($idDescrypt);

    if ($result) {
        $ultimaHora = $result['hora'];
        $tipoMantenimiento = $result['tipo_mantenimiento'];
        if (strpos(strtolower($tipoMantenimiento), 'combustible') !== false) {
            $proxServis = $ultimaHora + 150;
        } else {
            $proxServis = $ultimaHora + 250;
        }
        $json = array(
            'ultima_hora' => $ultimaHora,
            'prox_servis' => $proxServis
        );

        echo json_encode($json);
    } else {
        echo json_encode(array('error' => 'No se encontraron datos'));
    }
} else
if ($_POST['funcion'] == 'calcularConsumoDeAceite') {
    $idVehiculo = $_POST['id'];
    $idDescrypt = decrypt($idVehiculo);
    $fecha_desde = $_POST['fecha_desde'];
    $fecha_hasta = $_POST['fecha_hasta'];

    // Obtener los resultados de la función del modelo
    $result = $vehiculo->calcularConsumoDeAceite($idDescrypt, $fecha_desde, $fecha_hasta);

    // Crear un array con los valores recibidos
    if ($result !== false) {
        $json = array(
            'total_aceite_motor' => $result['total_aceite_motor'],
            'total_aceite_hidraulico' => $result['total_aceite_hidraulico'],
            'total_aceite_transmision' => $result['total_aceite_transmision']
        );
    } else {
        // Valores por defecto si no se obtienen resultados
        $json = array(
            'total_aceite_motor' => 0,
            'total_aceite_hidraulico' => 0,
            'total_aceite_transmision' => 0
        );
    }

    // Codificar la respuesta como JSON y enviarla
    echo json_encode($json);
} else
if ($_POST['funcion'] == 'calcularConsumoPorFecha') {
    $idVehiculo = $_POST['id'];
    $idDescrypt = decrypt($idVehiculo);
    $fecha_desde = $_POST['fecha_desde'];
    $fecha_hasta = $_POST['fecha_hasta'];

    // Obtener los resultados de la función del modelo
    $result = $vehiculo->calcularConsumoPorFecha($idDescrypt, $fecha_desde, $fecha_hasta);

    // Crear un array con los valores recibidos
    if ($result !== false) {
        $json = array(
            'total_consumo' => $result['total_litros'],
            'total_horas' => $result['total_horas']
        );
    } else {
        $json = array(
            'total_consumo' => 0,
            'total_horas' => 0
        );
    }

    // Codificar la respuesta como JSON y enviarla
    $jsonstring = json_encode($json);

    echo $jsonstring;
} else
if ($_POST['funcion'] == 'obtener_historicos') {
    $json = array();
    $idVehiculo = $_POST['id'];
    $idDescrypt = decrypt($idVehiculo);
    $vehiculo->obtener_historico($idDescrypt);
    if (!empty($vehiculo->objetos)) {
        $json = array(
            'total_horas' => $vehiculo->objetos[0]->total_horas,
            'total_litros' => $vehiculo->objetos[0]->total_litros,
        );
        $jsonstring = json_encode($json);
        echo $jsonstring;
    } else {
        echo 'Error';
    }
} else
if ($_POST['funcion'] == 'obtener_comsumos') {
    $json = array();
    $idVehiculo = $_POST['id'];
    $idDescrypt = decrypt($idVehiculo);
    $vehiculo->obtener_consumos($idDescrypt);
    if (!empty($vehiculo->objetos)) {
        $json = array(
            'id' => $vehiculo->objetos[0]->id_vehiculo,
            'codigo' => $vehiculo->objetos[0]->codigo,
            'vehiculo' => $vehiculo->objetos[0]->vehiculo,
            'avatar' => $vehiculo->objetos[0]->avatar
        );
        $jsonstring = json_encode($json);
        echo $jsonstring;
    } else {
        echo 'Error';
    }
} else
if ($_POST['funcion'] == 'anular_consumo') {
    $idConsumo = $_POST['idConsumo'];

    $vehiculo->anular_consumo($idConsumo);
} else
if ($_POST['funcion'] == 'editar_consumo') {
    $idVehiculo = $_POST['idVehiculo'];
    $vehiculoConsumo = decrypt($idVehiculo);
    $idConsumo = $_POST['idConsumo'];
    $horas = $_POST['horas'];
    $horas_trabajo = $_POST['horas_trabajo'];
    $lugar_trabajo = $_POST['lugar_trabajo'];
    $aceite_hidraulico = $_POST['aceite_hidraulico'];
    $aceite_motor = $_POST['aceite_motor'];
    $aceite_transmision = $_POST['aceite_transmision'];
    $mantenimiento = isset($_POST['mantenimiento']) ? $_POST['mantenimiento'] : array();
    $cantidadCombustible = $_POST['cantidadCombustible'];
    $fechaRegistro = $_POST['fechaRegistro'];

    $vehiculo->editar_consumo($idConsumo, $vehiculoConsumo, $cantidadCombustible, $lugar_trabajo, $aceite_hidraulico, $aceite_motor, $aceite_transmision, $mantenimiento, $horas, $horas_trabajo, $fechaRegistro);
} else
if ($_POST['funcion'] == 'registrar_consumo') {
    $idVehiculo = $_POST['idVehiculo'];
    $vehiculoConsumo = decrypt($idVehiculo);
    $horas = $_POST['horas'];
    $horas_trabajo = $_POST['horas_trabajo'];
    $lugar_trabajo = $_POST['lugar_trabajo'];
    $aceite_hidraulico = $_POST['aceite_hidraulico'];
    $aceite_motor = $_POST['aceite_motor'];
    $aceite_transmision = $_POST['aceite_transmision'];
    $mantenimiento = isset($_POST['mantenimiento']) ? $_POST['mantenimiento'] : array();
    $cantidadCombustible = $_POST['cantidadCombustible'];
    $fechaRegistro = $_POST['fechaRegistro'];

    $vehiculo->registrar_consumo($vehiculoConsumo, $cantidadCombustible, $lugar_trabajo, $aceite_hidraulico, $aceite_motor, $aceite_transmision, $mantenimiento, $horas, $horas_trabajo, $fechaRegistro);
} else
if ($_POST['funcion'] == 'obtener_calculos') {
    $idVehiculo = $_POST['id'];
    $idDescrypt = decrypt($idVehiculo);
    $vehiculo->obtenerCalculoConsumo($idDescrypt);

    $json = array();

    foreach ($vehiculo->objetos as $objeto) {

        $json[] = array(
            'id' => $objeto->id_consumo,
            'cantidad' => $objeto->cantidad_combustible,
            'trabajo' => $objeto->lugar_trabajo,
            'horas' => $objeto->hora,
            'horas_trabajo' => $objeto->horas_trabajo,
            'fecha' => $objeto->fecha_real,
            'diferencia_horas' => $objeto->diferencia_horas,
            'aceite_motor' => $objeto->aceite_motor,
            'aceite_transmision' => $objeto->aceite_transmision,
            'aceite_hidraulico' => $objeto->aceite_hidraulico,
            'vehiculo' => $objeto->vehiculo,
            'codigo' => $objeto->codigo,
            'mantenimiento' => $objeto->mantenimiento,
        );
    }
    $jsonstring = json_encode($json);
    echo $jsonstring;
} else 
if ($_POST['funcion'] == 'tipo_vehiculos') {
    // Obtener los tipos de vehículos
    $tipo_vehiculos = $vehiculo->tipo_vehiculos();

    // Crear el array para los tipos de vehículos
    $json = [];
    foreach ($tipo_vehiculos as $tipo) {
        $json_tipo = [
            'id' => $tipo->id_vehiculo,
            'id_tipo' => $tipo->id_tipo_vehiculo,
            'nombre' => $tipo->nombre_tipo_vehiculo,
            'vehiculo' => $tipo->vehiculo,
            'codigo' => $tipo->codigo,
            'orden' => $tipo->orden,
            'avatar' => $tipo->avatar,
        ];
        $json[] = $json_tipo;
    }
    $jsonstring = json_encode($json);
    echo $jsonstring;
} else
if ($_POST['funcion'] == 'tipos_vehiculos') {
    // Obtener los tipos de vehículos
    $tipos_vehiculos = $vehiculo->tipos_vehiculos();
    $id_tipos_vehiculo = $vehiculo->ids_tipos_vehiculos();
    $ids_asignados = [];
    foreach ($id_tipos_vehiculo as $idVehiculo) {
        $ids_asignados[] = $idVehiculo->id_tipo_vehiculo;
    }

    $json = [];
    foreach ($tipos_vehiculos as $tipo) {
        $json_tipo = [
            'id' => encrypt($tipo->id_vehiculo),
            'id_tipo' => encrypt($tipo->id_tipo_vehiculo),
            'nombre' => $tipo->nombre_tipo_vehiculo,
            'vehiculo' => $tipo->vehiculo,
            'codigo' => $tipo->codigo,
            'orden' => $tipo->orden,
            'avatar' => $tipo->avatar,
        ];
        // Verificar si este tipo de vehículo está asignado
        $json_tipo['asignado'] = in_array($tipo->id_tipo_vehiculo, $ids_asignados);
        $json[] = $json_tipo;
    }

    // Convertir el array a formato JSON y devolverlo
    $jsonstring = json_encode($json);
    echo $jsonstring;
} else
if ($_POST['funcion'] == 'ver') {
    $id = $_POST['id'];
    $vehiculo->ver($id);
    $json = array();
    $cont = 0;
    foreach ($vehiculo->objetos as $objeto) {
        $cont++;
        $json[] = array(
            'num' => $cont,
            'codigo' => $objeto->codigo,
            'vtv' => $objeto->vtv,
            'cedula' => $objeto->cedula,
            'motor' => $objeto->motor,
            'vencimiento_cedula' => $objeto->vencimiento_cedula,
            'logistica' => $objeto->logistica,
            'senasa' => $objeto->senasa,
            'seguro' => $objeto->seguro,
            'num_poliza' => $objeto->num_poliza,
            'poliza' => $objeto->poliza
        );
    }
    $jsonstring = json_encode($json);
    echo $jsonstring;
} else
if ($_POST['funcion'] == 'cambiar_avatar') {
    $id = $_POST['id_logo_prod'];
    $avatar = $_POST['avatar'];
    if (($_FILES['photo']['type'] == 'image/jpeg') || ($_FILES['photo']['type'] == 'image/png') || ($_FILES['photo']['type'] == 'image/gif')) {
        $nombre = uniqid() . '-' . $_FILES['photo']['name'];

        $ruta = '../Util/img/' . $nombre;

        move_uploaded_file($_FILES['photo']['tmp_name'], $ruta);

        $vehiculo->cambiar_avatar($id, $nombre);
        if (file_exists($avatar)) {
            unlink($avatar);
        }
        $json = array();
        $json[] = array(
            'ruta' => $ruta,
            'alert' => 'edit'
        );
        $jsonstring = json_encode($json[0]);
        echo $jsonstring;
    } else {
        $json = array();
        $json[] = array(
            'alert' => 'noedit'
        );
        $jsonstring = json_encode($json[0]);
        echo $jsonstring;
    }
} else
if ($_POST['funcion'] == 'rellenar_vehiculos') {
    $vehiculo->obtener_vehiculos();
    $json = array();
    foreach ($vehiculo->objetos as $objeto) {
        $json[] = array(
            'id' => encrypt($objeto->id),
            'vehiculo' => $objeto->vehiculo,
            'codigo' => $objeto->codigo,
            'asignado' => $objeto->id_tipo_vehiculo
        );
    };
    $jsonstring = json_encode($json);
    echo $jsonstring;
} else
if ($_POST['funcion'] == 'obtener_vehiculo') {
    $vehiculo->obtener_vehiculos();
    $json = array();

    foreach ($vehiculo->objetos as $objeto) {

        $json[] = array(
            'id' => $objeto->id,
            'codigo' => $objeto->codigo,
            'vehiculo' => $objeto->vehiculo,
            'vtv' => $objeto->vtv,
            'cedula' => $objeto->cedula,
            'motor' => $objeto->motor,
            'vencimiento_cedula' => $objeto->vencimiento_cedula,
            'logistica' => $objeto->logistica,
            'senasa' => $objeto->senasa,
            'matafuego' => $objeto->matafuego,
            'seguro' => $objeto->seguro,
            'num_poliza' => $objeto->num_poliza,
            'poliza' => $objeto->poliza,
            'avatar' => '../Util/img/' . $objeto->avatar
        );
    }
    $jsonstring = json_encode($json);
    echo $jsonstring;
} else
if ($_POST['funcion'] == 'crear') {
    $codigo = $_POST['codigo'];
    $nombre_vehiculo = $_POST['vehiculo'];
    $vencimiento_vtv = $_POST['vencimiento_vtv'];
    $cedula = $_POST['cedula'];
    $motor = $_POST['motor'];
    $vencimiento_cedula = $_POST['vencimiento_cedula'];
    $vencimiento_logistica = $_POST['vencimiento_logistica'];
    $vencimiento_senasa = $_POST['vencimiento_senasa'];
    $vencimiento_matafuego = $_POST['vencimiento_matafuego'];
    $vencimiento_seguro = $_POST['vencimiento_seguro'];
    $numero_poliza = $_POST['poliza'];
    $vencimiento_poliza = $_POST['vencimiento_poliza'];

    $result = $vehiculo->crear($codigo, $nombre_vehiculo, $vencimiento_vtv, $cedula, $motor, $vencimiento_cedula, $vencimiento_logistica, $vencimiento_senasa, $vencimiento_matafuego, $vencimiento_seguro, $numero_poliza, $vencimiento_poliza);
} else
if ($_POST['funcion'] == 'editar') {
    $id = $_POST['id'];
    $codigo = $_POST['codigo'];
    $nombre_vehiculo = $_POST['vehiculo'];
    $vencimiento_vtv = $_POST['vencimiento_vtv'];
    $cedula = $_POST['cedula'];
    $motor = $_POST['motor'];
    $vencimiento_cedula = $_POST['vencimiento_cedula'];
    $vencimiento_logistica = $_POST['vencimiento_logistica'];
    $vencimiento_senasa = $_POST['vencimiento_senasa'];
    $vencimiento_matafuego = $_POST['vencimiento_matafuego'];
    $vencimiento_seguro = $_POST['vencimiento_seguro'];
    $numero_poliza = $_POST['poliza'];
    $vencimiento_poliza = $_POST['vencimiento_poliza'];

    $result = $vehiculo->editar($id, $codigo, $nombre_vehiculo, $vencimiento_vtv, $cedula, $motor, $vencimiento_cedula, $vencimiento_logistica, $vencimiento_senasa, $vencimiento_matafuego, $vencimiento_seguro, $numero_poliza, $vencimiento_poliza);
}
if ($_POST['funcion'] == 'borrar') {
    $id = $_POST['id'];
    $vehiculo->borrar($id);
} else
if ($_POST['funcion'] == 'obtener_vencidos') {
    $vehiculo->obtener_fecha_vencida();
    $json = array();
    $fecha_actual = new DateTime();
    foreach ($vehiculo->objetos as $objeto) {
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
            if ($verificado == 0) {
                $estado = 'danger';
                $dia = $dia * (-1);
            } else {
                if ($dia > 10) {
                    $estado = 'light';
                }
                if ($dia < 10 && $dia > 0) {
                    $estado = 'warning';
                }
            };
        }
        $json[] = array(
            'id' => $objeto->id,
            'codigo' => $objeto->codigo,
            'vehiculo' => $objeto->vehiculo,
            'vtv' => $objeto->vtv,
            'cedula' => $objeto->cedula,
            'motor' => $objeto->motor,
            'vencimiento_cedula' => $objeto->vencimiento_cedula,
            'logistica' => $objeto->logistica,
            'senasa' => $objeto->senasa,
            'seguro' => $objeto->seguro,
            'num_poliza' => $objeto->num_poliza,
            'poliza' => $objeto->poliza,
            'estado' => $estado,
            'invert' => $verificado
        );
    }
    $jsonstring = json_encode($json);
    echo $jsonstring;
} else
if ($_POST['funcion'] == 'obtener_resumen') {
    $vehiculo->obtener_resumen();
    $json = array();
    $fecha_actual = new DateTime();
    $cont = 0;
    foreach ($vehiculo->objetos as $objeto) {
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
                if ($dias > 15) {
                    $estado = 'light';
                }
                if ($dias < 15 && $dias > 0) {
                    $estado = 'warning';
                }
            }

            // Agregar información de vencimiento al array
            $vencimientos_info[$key] = array(
                'dias' => $dias
            );
        }
        $json[] = array(
            'id' => $objeto->id,
            'num' => $cont,
            'dato' => $objeto->codigo,
            'vehiculo' => $objeto->vehiculo,
            'cedula_verde' => $objeto->cedula,
            'motor' => $objeto->motor,
            'vencimientos' => $vencimientos_info
        );
    }

    $jsonstring = json_encode($json);
    echo $jsonstring;
} else
    // if ($_POST['funcion'] == 'imprimir') {
    //     require('../vendor/autoload.php');
    //     $id_impresion = $_POST['id'];
    //     $vehiculo->obtenerDatos($id_impresion);
    //     foreach ($vehiculo->objetos as $objeto) {
    //         $fecha_hora_actual = date('d/m/Y');
    //         $codigo = $objeto->codigo;
    //         $nombre_vehiculo = $objeto->vehiculo;
    //         $vencimiento_vtv = $objeto->vtv;
    //         $cedula = $objeto->cedula;
    //         $motor = $objeto->motor;
    //         $vencimiento_cedula = $objeto->vencimiento_cedula;
    //         $vencimiento_logistica = $objeto->logistica;
    //         $vencimiento_senasa = $objeto->senasa;
    //         $vencimiento_seguro = $objeto->seguro;
    //         $numero_poliza = $objeto->num_poliza;
    //         $vencimiento_poliza = $objeto->poliza;
    //     }
    //     $plantilla = '
    //     <body>
    //     <header class="clearfix">
    //         <div id="logo">
    //         <img src="../Util/img/Filippi.jpeg" width="60" height="60">
    //         </div>
    //         <h1>Vehiculo: ' . $nombre_vehiculo . '</h1>
    //         <div id="company" class="clearfix">
    //             <div><span>Fecha: ' . $fecha_hora_actual . '</span></div>
    //             <div id="negocio">Vehiculo Patente: ' . $codigo . '</div>
    //         </div>';
    //     $plantilla .= '

    //         <div id="project">
    //         <div><span>N° Registro: ' . $id_impresion . '</span></div>
    //         <div><span>Cedula: ' . $cedula . '</span></div>
    //         <div><span>Motor: ' . $motor . '</span></div>
    //         </div>';

    //     $plantilla .= '
    //         </header>
    //         <main>
    //             <table>
    //             <thead>
    //                 <tr>
    //                 <th class="service">VTO. VTV</th>
    //                 <th class="service">VTO. CEDULA</th>
    //                 <th class="service">VTO. R.U.T.A</th>
    //                 <th class="service">VTO. SENASA</th>
    //                 <th class="service">VTO. SEGURO</th>
    //                 <th class="service">VTO. POLIZA</th>
    //                 </tr>
    //             </thead>
    //             <tbody>';
    //     foreach ($vehiculo->objetos as $objeto) {

    //         $plantilla .= '<tr>
    //                 <td class="servic">' . $objeto->vtv . '</td>
    //                 <td class="servic">' . $objeto->vencimiento_cedula . '</td>
    //                 <td class="servic">' . $objeto->logistica . '</td>
    //                 <td class="servic">' . $objeto->senasa . '</td>
    //                 <td class="servic">' . $objeto->seguro . '</td>
    //                 <td class="servic">' . $objeto->poliza . '</td>
    //                 </tr>';
    //     }


    //     $plantilla .= '
    //             </tbody>
    //             </table>
    //             <div id="notices">
    //             <div>NOTICE:</div>
    //             <div class="notice">*.</div>

    //             </div>
    //                 </main>
    //                 <footer>
    //                 Created by Warpiece Nexus Management Software.
    //                 </footer>
    //     </body>';
    //     $css = file_get_contents("../Util/css/imprimir.css");
    //     $mpdf = new \Mpdf\Mpdf();
    //     $mpdf->writeHTML($css, \Mpdf\HTMLParserMode::HEADER_CSS);
    //     $mpdf->writeHTML($plantilla, \Mpdf\HTMLParserMode::HTML_BODY);
    //     $mpdf->output("../pdf/pdf-compra-" . $id_impresion . ".pdf", "F");
    // }

    // else
    // if ($_POST['funcion'] == 'descargarPDF') {
    //     $archivoId = $_POST['id'];

    //     // Recupera el registro de archivo PDF con el ID especificado
    //     $archivo = $vehiculo->obtenerDatosArchivoPDF($archivoId);

    //     $json= array();

    //     foreach($archivo->objetos as $objeto){

    //         $json[]=array(
    //             'id'=>$objeto->id,
    //             'nombre'=>$objeto->nombre,
    //             'ruta'=>$objeto->ruta
    //         );
    //     }
    //     $jsonstring = json_encode($json);
    //     echo $jsonstring;
    // }

    //CONSUMO

    if ($_POST['funcion'] == 'asignar_precio_combustible') {
        $precio_combustible = $_POST['precio_combustible'];
        $vehiculo->asignar_precio_combustible($precio_combustible);
    } else
if ($_POST['funcion'] == 'asignar_tipo_vehiculo') {
        $idTipoVehiculo = $_POST['idTipoVehiculo'];
        $vehiculoConsumo = $_POST['vehiculo'];

        $vehiculo->asignar_tipo_vehiculo($idTipoVehiculo, $vehiculoConsumo);
    }
