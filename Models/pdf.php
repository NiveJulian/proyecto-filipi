<?php
include_once 'venta.php';
include_once 'ventaProducto.php';
include_once 'cliente.php';

function getHtml($id_venta){
    $venta=new Venta();
    $venta_producto=new VentaProducto();
    $cliente= new Cliente();
    $venta->buscar_id($id_venta);
    $venta_producto->ver($id_venta);
    $plantilla='
    <body>
    <header class="clearfix">
      <div id="logo">
	  	  <div class="card-title text-center p-1 fs-1" style="color:#000;">
          <span style="color:#fff; background:#000; font-size:30px; padding:10px;">Repuestos</span><span style="color:#fff; background:#F32013; font-size:30px; padding:10px;">Quito
          </span>
        </div>
      </div>
      <h1>COMPROBANTE DE PAGO</h1>
      <div id="company" class="clearfix">
        <div id="negocio">Repuestos Quito</div>
        <div>Direccion Numero RN117 km 6,<br /> Paso de los libres, Corrientes</div>
        <div>+54 9 3772 63-0944</div>
        <div><a href="mailto:company@example.com">company@example.com</a></div>
      </div>';
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
      $plantilla.='
    
      <div id="project" class="float-left">
        <div><span>Codigo de Venta: </span>'.$objeto->id_venta.'</div>
        <div><span>Cliente: </span>'.$cliente_nombre.'</div>
        <div><span>DNI: </span>'.$cliente_firma.'</div>
        <div><span>Fecha y Hora: </span>'.$objeto->fecha.'</div>
        <div><span>Vendedor: </span>'.$objeto->vendedor.'</div>
      </div>';
      }
    $plantilla.='
    </header>
    <main>
      <table>
        <thead>
          <tr>
            <th class="service">N°</th>
            <th class="service">Producto</th>
            <th class="service">Codigo</th>
            <th class="service">Descipcion</th>
            <th class="service">Presentacion</th>
            <th class="service">Tipo</th>
            <th class="service">Cantidad</th>
            <th class="service">Precio</th>
            <th class="service">Subtotal</th>
          </tr>
        </thead>
        <tbody>';
        foreach ($venta_producto->objetos as $objeto) {
         
          $plantilla.='<tr>
            <td class="servic">'.$objeto->id_producto.'</td>
            <td class="servic">'.$objeto->producto.'</td>
            <td class="servic">'.$objeto->codigo.'</td>
            <td class="servic">'.$objeto->descripcion.'</td>
            <td class="servic">'.$objeto->presentacion.'</td>
            <td class="servic">'.$objeto->tipo.'</td>
            <td class="servic">'.$objeto->cantidad.'</td>
            <td class="servic">$ '.$objeto->precio.'</td>
            <td class="servic">$ '.$objeto->subtotal.'</td>
          </tr>';
        }
        $calculos= new Venta();
        $calculos->buscar_id($id_venta);
        foreach ($calculos->objetos as $objeto) {
          $iva=$objeto->total*0.21;
          $sub=$objeto->total-$iva;
          
          $plantilla.='
          <tr>
            <td colspan="8" class="grand total">SUBTOTAL</td>
            <td class="grand total">$/.'.$sub.'</td>
          </tr>
          <tr>
            <td colspan="8" class="grand total">IVA(21%)</td>
            <td class="grand total">$/.'.$iva.'</td>
          </tr>
          <tr>
            <td colspan="8" class="grand total">TOTAL</td>
            <td class="grand total">$/.'.$objeto->total.'</td>
          </tr>';

        }
       $plantilla.='
        </tbody>
      </table>
      <div id="notices">
        <div>NOTICE:</div>
        <div class="notice">*Presentar este comprobante de pago para cualquier reclamo o devolucion.</div>
        <div class="notice">*El reclamo procedera dentro de las 24 horas de haber hecho la compra.</div>
        <div class="notice">*Si el producto esta dañado o abierto, la devolucion no procedera.</div>
        <div class="notice">*Revise su cambio antes de salir del establecimiento.</div>
      </div>
      <footer>
      Created by JN desarrollador ©
      </footer>
  </body>';
	return $plantilla;
}

?>