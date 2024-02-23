<?php
include_once $_SERVER["DOCUMENT_ROOT"].'/filippi/Models/vehiculos.php';

$vehiculo = new Vehiculo();

if($_POST['funcion']=='tipos_vehiculos'){
    $vehiculo->tipos_vehiculos();
    $json= array();
    
    foreach($vehiculo->objetos as $objeto){
        
        $json[]=array(
            'id'=>$objeto->id,
            'nombre'=>$objeto->nombre
        );
    }
    $jsonstring = json_encode($json);
    echo $jsonstring;
}
else
if($_POST['funcion']=='ver'){
    $id=$_POST['id'];
    $vehiculo->ver($id);
    $json=array();
    $cont=0;
        foreach ($vehiculo->objetos as $objeto) {
            $cont++;
            $json[]=array(
                'num' => $cont,
                'codigo'=>$objeto->codigo,
                'vtv'=>$objeto->vtv,
                'cedula'=>$objeto->cedula,
                'motor'=>$objeto->motor,
                'vencimiento_cedula'=>$objeto->vencimiento_cedula,
                'logistica'=>$objeto->logistica,
                'senasa'=>$objeto->senasa,
                'seguro'=>$objeto->seguro,
                'num_poliza'=>$objeto->num_poliza,
                'poliza'=>$objeto->poliza
            );
        }
    $jsonstring = json_encode($json);
    echo $jsonstring;
}
else
if($_POST['funcion']=='cambiar_avatar'){
        $id=$_POST['id_logo_prod'];
        $avatar=$_POST['avatar'];
        if(($_FILES['photo']['type']=='image/jpeg')||($_FILES['photo']['type']=='image/png')||($_FILES['photo']['type']=='image/gif')){
            $nombre=uniqid().'-'.$_FILES['photo']['name'];
            $ruta='../Util/img/'.$nombre;
            move_uploaded_file($_FILES['photo']['tmp_name'],$ruta);
            $vehiculo->cambiar_avatar($id,$nombre);
            if (file_exists($avatar)) {
                unlink($avatar);
            }
            $json=array();
            $json[]=array(
                'ruta'=>$ruta,
                'alert'=>'edit'
            );
            $jsonstring = json_encode($json[0]);
            echo $jsonstring;
        }
        else{
            $json=array();
            $json[]=array(
                'alert'=>'noedit'
            );
            $jsonstring = json_encode($json[0]);
            echo $jsonstring;
        }
}
else
if($_POST['funcion']=='rellenar_vehiculos'){
    $vehiculo->obtener_vehiculos();
    $json = array();
    foreach ($vehiculo->objetos as $objeto){
        $json[]=array(
            'id'=>$objeto->id,
            'vehiculo'=>$objeto->vehiculo,
            'codigo'=>$objeto->codigo
        );
    };
    $jsonstring=json_encode($json);
    echo $jsonstring;
}
else
if($_POST['funcion']=='obtener_vehiculo'){
    $vehiculo->obtener_vehiculos();
    $json= array();
    
    foreach($vehiculo->objetos as $objeto){
        
        $json[]=array(
            'id'=>$objeto->id,
            'codigo'=>$objeto->codigo,
            'vehiculo'=>$objeto->vehiculo,
            'vtv'=>$objeto->vtv,
            'cedula'=>$objeto->cedula,
            'motor'=>$objeto->motor,
            'vencimiento_cedula'=>$objeto->vencimiento_cedula,
            'logistica'=>$objeto->logistica,
            'senasa'=>$objeto->senasa,
            'matafuego'=>$objeto->matafuego,
            'seguro'=>$objeto->seguro,
            'num_poliza'=>$objeto->num_poliza,
            'poliza'=>$objeto->poliza,
            'avatar'=>'../Util/img/'.$objeto->avatar
        );
    }
    $jsonstring = json_encode($json);
    echo $jsonstring;
}
else
if($_POST['funcion']=='crear'){
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
}
else
if($_POST['funcion']=='editar'){
    $id = $_POST['id'];
    $codigo = $_POST['codigo'];
    $nombre_vehiculo = $_POST['vehiculo'];
    $vencimiento_vtv = $_POST['vencimiento_vtv'];
    $cedula = $_POST['cedula'];
    $motor = $_POST['motor'];
    $vencimiento_cedula = $_POST['vencimiento_cedula'];
    $vencimiento_logistica = $_POST['vencimiento_logistica'];
    $vencimiento_senasa = $_POST['vencimiento_senasa'];
    $vencimiento_matafuego= $_POST['vencimiento_matafuego'];
    $vencimiento_seguro = $_POST['vencimiento_seguro'];
    $numero_poliza = $_POST['poliza'];
    $vencimiento_poliza = $_POST['vencimiento_poliza'];
    
    $result = $vehiculo->editar($id, $codigo, $nombre_vehiculo, $vencimiento_vtv, $cedula, $motor, $vencimiento_cedula, $vencimiento_logistica, $vencimiento_senasa, $vencimiento_matafuego, $vencimiento_seguro, $numero_poliza, $vencimiento_poliza);

}
if($_POST['funcion']=='borrar'){
    $id=$_POST['id'];
    $vehiculo->borrar($id);
}
else
if($_POST['funcion']=='obtener_vencidos'){
    $vehiculo->obtener_fecha_vencida();
    $json= array();
    $fecha_actual = new DateTime();
    foreach($vehiculo->objetos as $objeto){
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
            'vehiculo'=>$objeto->vehiculo,
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
    $vehiculo->obtener_resumen();
    $json = array();
    $fecha_actual = new DateTime();
    $cont=0;
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
            'vehiculo' => $objeto->vehiculo,
            'cedula_verde' => $objeto->cedula,
            'motor' => $objeto->motor,
            'vencimientos' => $vencimientos_info
        );
    }

    $jsonstring = json_encode($json);
    echo $jsonstring;
}
else
if($_POST['funcion']=='imprimir'){
    require ('../vendor/autoload.php');
    $id_impresion = $_POST['id'];
    $vehiculo->obtenerDatos($id_impresion);
    foreach ($vehiculo->objetos as $objeto) {
        $fecha_hora_actual = date('d/m/Y');
        $codigo = $objeto->codigo;
        $nombre_vehiculo = $objeto->vehiculo;
        $vencimiento_vtv = $objeto->vtv;
        $cedula = $objeto->cedula;
        $motor = $objeto->motor;
        $vencimiento_cedula = $objeto->vencimiento_cedula;
        $vencimiento_logistica = $objeto->logistica;
        $vencimiento_senasa = $objeto->senasa;
        $vencimiento_seguro = $objeto->seguro;
        $numero_poliza = $objeto->num_poliza;
        $vencimiento_poliza = $objeto->poliza;

    }
    $plantilla='
    <body>
    <header class="clearfix">
        <div id="logo">
        <img src="../Util/img/Filippi.jpeg" width="60" height="60">
        </div>
        <h1>Vehiculo: '.$nombre_vehiculo.'</h1>
        <div id="company" class="clearfix">
            <div><span>Fecha: '.$fecha_hora_actual.'</span></div>
            <div id="negocio">Vehiculo Patente: '.$codigo.'</div>
        </div>';
        $plantilla.='
    
        <div id="project">
        <div><span>N° Registro: '.$id_impresion.'</span></div>
        <div><span>Cedula: '.$cedula.'</span></div>
        <div><span>Motor: '.$motor.'</span></div>
        </div>';
    
        $plantilla.='
        </header>
        <main>
            <table>
            <thead>
                <tr>
                <th class="service">VTO. VTV</th>
                <th class="service">VTO. CEDULA</th>
                <th class="service">VTO. R.U.T.A</th>
                <th class="service">VTO. SENASA</th>
                <th class="service">VTO. SEGURO</th>
                <th class="service">VTO. POLIZA</th>
                </tr>
            </thead>
            <tbody>';
            foreach ($vehiculo->objetos as $objeto) {
            
                $plantilla.='<tr>
                <td class="servic">'.$objeto->vtv.'</td>
                <td class="servic">'.$objeto->vencimiento_cedula.'</td>
                <td class="servic">'.$objeto->logistica.'</td>
                <td class="servic">'.$objeto->senasa.'</td>
                <td class="servic">'.$objeto->seguro.'</td>
                <td class="servic">'.$objeto->poliza.'</td>
                </tr>';
            }


            $plantilla.='
            </tbody>
            </table>
            <div id="notices">
            <div>NOTICE:</div>
            <div class="notice">*.</div>

            </div>
                </main>
                <footer>
                Created by Warpiece (Julian Niveyro) Desarrollador Web y Analista desarrollador.
                </footer>
    </body>';
    $css = file_get_contents("../Util/css/imprimir.css");
    $mpdf=new \Mpdf\Mpdf();
    $mpdf->writeHTML($css, \Mpdf\HTMLParserMode::HEADER_CSS);
    $mpdf->writeHTML($plantilla, \Mpdf\HTMLParserMode::HTML_BODY);
    $mpdf->output("../pdf/pdf-compra-".$id_impresion.".pdf", "F");
}
else
if ($_POST['funcion'] == 'descargarPDF') {
    $archivoId = $_POST['id'];

    // Recupera el registro de archivo PDF con el ID especificado
    $archivo = $vehiculo->obtenerDatosArchivoPDF($archivoId);

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

//CONSUMO

else
if($_POST['funcion'] == 'registrar_consumo'){
    $idVehiculo = $_POST['idVehiculo'];
    $vehiculo = $_POST['vehiculo'];
    $cantidadCombustible = $_POST['cantidadCombustible'];
    $precioCombustible = $_POST['precioCombustible'];
    $distancia = $_POST['distancia'];
    $fechaRegistro = $_POST['fechaRegistro'];

    $vehiculo->registrarConsumo($idVehiculo, $cantidadCombustible, $precioCombustible, $distancia, $fechaRegistro);

}

?>