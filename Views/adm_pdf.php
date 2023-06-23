<?php
require_once ('../modelo/venta.php');
require_once ('../modelo/ventaProducto.php');
$venta=new Venta();
$venta_producto=new VentaProducto();
$venta->buscar_id($id_venta);
$venta_producto->ver($id_venta);
$fecha = date("d-m-Y");
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <link rel="stylesheet" href="./bs3.min.css">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    
    <link rel="stylesheet" href="../css/pdf.css">
    <title>Factura</title>
</head>
<body>
	<header class="clearfix">
		<div id="logo"><img src="" alt=""></div>
		<h1>COMPROBANTE DE PAGO</h1>
		<div class="clearfix" id="company">
			<div id="negocio">Respuestos Quito</div>
			<div>Direccion Numero ###,<br /> Paso de los Libres, Corrientes</div>
			<div>(3772)1231123123</div>
			<div><a href="mailto:example@example.com">example@example.com</a></div>
		</div>
        <div id="project">
            <div><span>Codigo de Venta: </span><?php echo ucwords($venta['id_venta']) ?></div>
            <div><span>Cliente: </span><?php echo $cliente ?></div>
            <div><span>Firma: </span><?php echo $firma ?></div>
            <div><span>Fecha y hora: </span><?php echo $fecha ?></div>
            <div><span>Vendedor: </span><?php echo $vendedor ?></div>
        </div>
			</header>
			<main>
				<table>
					<thead>
						<tr>
							<th>Producto</th>
							<th>Descripcion</th>
							<th>Codigo</th>
							<th>tipo</th>
							<th>Presentacion</th>
							<th>cantidad</th>
							<th>Precio</th>
							<th>Subtotal</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td class="service">'.$objeto->producto.'</td>
							<td class="service">'.$objeto->descripcion.'</td>
							<td class="service">'.$objeto->codigo.'</td>
							<td class="service">'.$objeto->tipo.'</td>
							<td class="service">'.$objeto->presentacion.'</td>
							<td class="service">'.$objeto->cantidad.'</td>
							<td class="service">'.$objeto->precio.'</td>
							<td class="service">'.$objeto->subtotal.'</td>
						</tr>
					<?php
                    $calculos=new Venta();
					$calculos->buscar_id($id_venta);
					foreach($calculos->objetos as $objeto){
						$iva=$objeto->total*0.21;
						$sub=$objeto->total-$iva;
                        ?>
							<tr>
								<td colspan="8" class="grand total">SUBTOTAL</td>
								<td class="grand total">2/<?php echo $sub ?></td>
							</tr>
							<tr>
								<td colspan="8" class="grand total">IVA(21%)</td>
								<td class="grand total">2/<?php echo $iva ?></td>
							</tr>
							<tr>
								<td colspan="8" class="grand total">TOTAL</td>
								<td class="grand total">2/<?php echo $objeto->total ?></td>
							</tr>;
					</tbody>
				</table>
					<?php } 
                    ?>
					<div id="notices">
						<div>NOTICE:</div>
						<div class="notice">Presentar este comprobante de pago para cualquier reclamo o devolucion.</div>
						<div class="notice">El reclamo procedera dentro de las 24hs de haber hecho la compra.</div>
						<div class="notice">Si el producto esta dañado o abierto, la devolucion no procedera.</div>
						<div class="notice">Revise su cambio antes de salir del establecimiento.</div>
					</div>
					</main>
					<footer>
						Created by Julian Niveyro 
					</footer>
					</body>
</html>