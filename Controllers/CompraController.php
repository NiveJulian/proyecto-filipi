<?php
    include $_SERVER["DOCUMENT_ROOT"].'/gasolero/Models/venta.php';
    include_once $_SERVER["DOCUMENT_ROOT"].'/gasolero/Models/conexion.php';
    $venta = new Venta();
    session_start();
    $vendedor = $_SESSION['id'];
    
    if($_POST['funcion']=='registrar_compra'){
        $total = $_POST['total'];
        $cliente = $_POST['cliente'];
        $direccion = $_POST['direccion'];
        $productos = json_decode($_POST['json']);
        date_default_timezone_set('America/Argentina/Buenos_Aires');
        $fecha = date('Y-m-d H:i:s');
        $venta->Crear($fecha,$cliente,$direccion,$total,$vendedor);
        $venta->ultima_venta();
        foreach ($venta->objetos as $objeto) {
            $id_venta = $objeto->ultima_venta;
            // echo $id_venta;
        }
        try {
            $db = new Conexion();
            $conexion = $db->pdo;
            $conexion->beginTransaction();
            foreach ($productos as $prod) {
                $cantidad = $prod->cantidad;
                while ($cantidad!=0) {
                        $sql="SELECT * FROM lote where fecha_entrega = (SELECT MIN(fecha_entrega) FROM lote where id_producto=:id and estado='A') and id_producto=:id";
                        $query = $conexion->prepare($sql);
                        $query->execute(array(':id'=>$prod->id));
                        $lote=$query->fetchall();
                        
                    foreach ($lote as $lote) {
                        $sql="SELECT compra.proveedor as proveedor 
                        FROM lote
                        join compra on lote.id_compra = compra.id and lote.id = :id";
                        $query = $conexion->prepare($sql);
                        $query->execute(array(':id'=>$lote->id));
                        $prov=$query->fetchall();
                        $proveedor = $prov[0]->proveedor;
                        if($cantidad<$lote->cantidad_lote){
                            $sql="INSERT INTO detalle_venta(cantidad,salida,lote,producto,proveedor,id_venta) values ('$cantidad','$lote->fecha_entrega','$lote->id', '$prod->id', '$proveedor', '$id_venta')";
                            $conexion->exec($sql);
                            $conexion->exec("UPDATE lote SET cantidad_lote = cantidad_lote -'$cantidad' where id='$lote->id'");
                            $cantidad=0;
                        }
                        if($cantidad==$lote->cantidad_lote){
                            $sql="INSERT INTO detalle_venta(cantidad,salida,lote,producto,proveedor,id_venta) values ('$cantidad','$lote->fecha_entrega','$lote->id', '$prod->id', '$proveedor', '$id_venta')";
                            $conexion->exec($sql);
                            $conexion->exec("UPDATE lote SET estado='I',cantidad_lote=0 where id='$lote->id'");
                            $cantidad=0;
                        }
                        if($cantidad>$lote->cantidad_lote){
                            $sql="INSERT INTO detalle_venta(cantidad,salida,lote,producto,proveedor,id_venta) values ('$lote->cantidad_lote','$lote->fecha_entrega','$lote->id', '$prod->id', '$proveedor', '$id_venta')";
                            $conexion->exec($sql);
                            $conexion->exec("UPDATE lote SET estado='I',cantidad_lote=0 where id='$lote->id'");
                            $cantidad= $cantidad-$lote->cantidad_lote;
                        }
                    }
                }
                $subtotal = $prod->cantidad*$prod->precio;
                $conexion->exec("INSERT INTO venta_producto(cantidad,subtotal,id_producto,id_venta) values ('$prod->cantidad', '$subtotal', '$prod->id', '$id_venta')");
            }
            $conexion->commit();

        } catch (Exception $error) {
            $conexion->rollBack();
            $venta->borrar($id_venta);
            echo $error->getMessage();
        }

    }
?>