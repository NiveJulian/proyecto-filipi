<?php
include_once $_SERVER["DOCUMENT_ROOT"].'/filippi/Models/conexion.php';
class Factura {
    var $objetos;
    public function __construct(){
        $db= new Conexion();
        $this->acceso= $db->pdo;
    }
    // RECIBIDOS
    function obtener_calc(){
        $sql = "SELECT 
            id,
            fecha,
            subtotal,
            iva,
            itc,
            idc,
            perc_iibb,
            perc_iva,
            otros_im,
            descuento,
            total
        FROM facturacion_recibida 
        WHERE estado='A'";
    
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchAll();
        return $this->objetos; 
    }
    function obtener_facturas(){
        $sql = "SELECT 
        fr.id as id_factura,
        fecha,
        tf.id as id_tipo_factura,
        prov.id as id_proveedor,
        tr.id as id_registro,
        concat(tf.nombre,'-', fr.punto_venta ,'-', fr.numero_factura) as num_factura,
        prov.razon_social as razonsocial,
        prov.cuit as cuit,
        subtotal,
        iva,
        itc,
        idc,
        perc_iibb,
        perc_iva,
        otros_im,
        descuento,
        total,
        v.id as id_vehiculo,
        concat(v.vehiculo,' ', v.codigo) as vehiculo_datos,
        tr.nombre as tipo_gasto
        FROM facturacion_recibida fr
        JOIN vehiculos v on fr.vehiculo = v.id
        JOIN proveedor prov on fr.razon_social = prov.id
        JOIN tipos_factura tf on fr.tipo_factura = tf.id
        JOIN tipos_registro tr on fr.tipo_gasto = tr.id
        WHERE fr.estado='A'";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos=$query->fetchall();
        return $this->objetos; 
    }
    function borrar($idFactura, $numeroFactura) {
        $fechaHoraEliminacion = date("Y-m-d H:i:s");
        $sql = "UPDATE facturacion_recibida 
                SET estado = 'I', deleted_at= :fechaHoraEliminacion 
                WHERE numero_factura = :numero_factura and id = :id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $idFactura, ':numero_factura' => $numeroFactura, ':fechaHoraEliminacion' => $fechaHoraEliminacion));
        if (!empty($query->execute(array(':id' => $idFactura , ':numero_factura' => $numeroFactura, ':fechaHoraEliminacion' => $fechaHoraEliminacion)))) {
            echo 'borrado';
        } else {
            
            echo 'noborrado';
        }
    }
    function editarFactura($id,$fecha, $comprobante, $puntoVenta, $tipoVenta, $numeroFactura, $razonSocial, $equipo, $subtotal, $iva, $itc, $idc, $percIibb, $percIva, $otrosImpuestos, $descuento, $total){
        $sql="SELECT id FROM facturacion_recibida 
        WHERE id != :id
        AND numero_factura = :numero_factura";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(
            ':id'=>$id,
            ':numero_factura' => $numeroFactura

        ));
        $this->objetos=$query->fetchall();
        if(!empty($this->objetos)){
            echo 'noedit';
        }
        else{
            $sql="UPDATE facturacion_recibida 
            SET fecha = :fecha,
            numero_factura = :numero_factura,
            punto_venta = :punto_venta,
            razon_social = :razon_social,
            tipo_factura = :tipo_factura,
            subtotal = :subtotal,
            iva = :iva,
            itc = :itc,
            idc = :idc,
            perc_iibb = :perc_iibb,
            perc_iva = :perc_iva,
            otros_im = :otros_im,
            descuento = :descuento,
            total = :total,
            vehiculo = :vehiculo,
            tipo_gasto = :tipo_gasto,
            total = :total
            WHERE id=:id";
            $query = $this->acceso->prepare($sql);
            if ($iva === '') {
                $iva = null;
            }
            if ($itc === '') {
                $itc = null;
            }
            if ($idc === '') {
                $idc = null;
            }
            if ($percIibb === '') {
                $percIibb = null;
            }
            if ($percIva === '') {
                $percIva = null;
            }
            if ($otrosImpuestos === '') {
                $otrosImpuestos = null;
            }
            if ($descuento === '') {
                $descuento = null;
            }
            $query->execute(array(
                ':id' => $id,
                ':fecha' => $fecha,
                ':numero_factura' => $numeroFactura,
                ':punto_venta'=> $puntoVenta,
                ':razon_social' => $razonSocial,
                ':tipo_factura' => $comprobante,
                ':subtotal' => $subtotal,
                ':iva' => $iva,
                ':itc' => $itc,
                ':idc' => $idc,
                ':perc_iibb' => $percIibb,
                ':perc_iva' => $percIva,
                ':otros_im' => $otrosImpuestos,
                ':descuento' => $descuento,
                ':total' => $total,
                ':vehiculo' => $equipo,
                ':tipo_gasto' => $tipoVenta,
            ));
            echo 'edit';
        }
    }
    function registrarFactura($fecha, $comprobante, $puntoVenta, $tipoVenta, $numeroFactura, $razonSocial, $equipo, $subtotal, $iva, $itcValue, $idcValue, $percIibb, $percIvaValue, $otrosImpuestos, $descuentoValue, $total) {
            $sql = "SELECT id, estado 
                FROM facturacion_recibida 
                WHERE numero_factura = :numero_factura";
    
            $query = $this->acceso->prepare($sql);
            $query->execute(array(
                ':numero_factura' => $numeroFactura,
            ));
    
            $this->objetos = $query->fetchAll();
    
            if (!empty($this->objetos)) {
                foreach ($this->objetos as $factura) {
                    $factura_id = $factura->id;
                    $factura_estado = $factura->estado;
                }
                if ($factura_estado == 'A') {
                    echo 'noadd'; // La factura ya existe
                } else {
                    $sql = "UPDATE facturacion_recibida SET estado = 'A' WHERE id = :id";
                    $query = $this->acceso->prepare($sql);
                    $query->execute(array(':id' => $factura_id));
                    echo 'add';
                }
            } else {
                // La factura no existe, crear una nueva
                $sql = "INSERT INTO facturacion_recibida (fecha, numero_factura, punto_venta, razon_social, tipo_factura, subtotal, iva, itc, idc, perc_iibb, perc_iva, otros_im, descuento, total, vehiculo, tipo_gasto) 
        VALUES (:fecha, :numero_factura, :punto_venta, :razon_social, :tipo_factura, :subtotal, :iva, :itc, :idc, :perc_iibb, :perc_iva, :otros_im, :descuento, :total, :vehiculo, :tipo_gasto)";

    
                $query = $this->acceso->prepare($sql);
                $query->execute(array(
                    ':fecha' => $fecha,
                    ':numero_factura' => $numeroFactura,
                    ':punto_venta'=> $puntoVenta,
                    ':razon_social' => $razonSocial,
                    ':tipo_factura' => $comprobante,
                    ':subtotal' => $subtotal,
                    ':iva' => $iva,
                    ':itc' => $itcValue,
                    ':idc' => $idcValue,
                    ':perc_iibb' => $percIibb,
                    ':perc_iva' => $percIvaValue,
                    ':otros_im' => $otrosImpuestos,
                    ':descuento' => $descuentoValue,
                    ':total' => $total,
                    ':vehiculo' => $equipo,
                    ':tipo_gasto' => $tipoVenta,
                ));
    
                // Obtener el ID de la factura recién creada
                $factura_id = $this->acceso->lastInsertId();
    
                echo 'add';
            }
    }
    function rellenar_tipo_registro(){
        $sql="SELECT * FROM tipos_registro ORDER BY nombre ASC";
        $query= $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }
    function rellenar_tipo_registro_venta(){
        $sql="SELECT * FROM tipos_registro_venta ORDER BY nombre ASC";
        $query= $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }
    function rellenar_factura(){
        $sql="SELECT * FROM tipos_factura ORDER BY nombre ASC";
        $query= $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }
    function obtenerFacturasPorTipoRegistro() {
        $sql = "SELECT tr.id, 
                tr.nombre, COALESCE(SUM(fr.total), 0) as total,
                fr.estado as estado
                FROM tipos_registro tr
                JOIN facturacion_recibida fr ON tr.id = fr.tipo_gasto
                GROUP BY tr.id, tr.nombre
                ORDER BY tr.nombre ASC";
    
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchAll(PDO::FETCH_OBJ);
        return $this->objetos;
    }
    function obtenerFacturasPorTipoRegistroRecibidoPorMes() {
        $sql = "SELECT tr.id, 
                tr.nombre, 
                COALESCE(SUM(fe.total), 0) as total,
                MONTH(fe.fecha) as mes,
                fe.estado as estado
                FROM tipos_registro tr
                JOIN facturacion_recibida fe ON tr.id = fe.tipo_gasto
                GROUP BY tr.id, tr.nombre, mes
                ORDER BY mes ASC, tr.nombre ASC";
    
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchAll(PDO::FETCH_OBJ);
        return $this->objetos;
    }
    function obtenerMesesFacturasRecibidos() {
        $sql = "SELECT DISTINCT DATE_FORMAT(fecha, '%Y-%m') as valor, DATE_FORMAT(fecha, '%Y-%M') as nombre FROM facturacion_recibida WHERE estado='A'";
        
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $meses = $query->fetchAll(PDO::FETCH_ASSOC);
    
        return $meses;
    }
    
    function obtenerMesesFacturasRecibidosCalc() {
        $sql = "SELECT DISTINCT DATE_FORMAT(fecha, '%Y-%m') as valor, DATE_FORMAT(fecha, '%Y-%M') as nombre FROM facturacion_recibida WHERE estado='A'";

        
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $meses = $query->fetchAll(PDO::FETCH_ASSOC);
    
        return $meses;
    }
    function obtener_facturas_recibidas_eliminadas(){
        $sql = "SELECT 
        fr.id id_factura,
        fr.fecha datos_factura,
        concat(tf.nombre,'-',fr.punto_venta ,'-', fr.numero_factura) as numero_facturas,
        concat(prov.razon_social, '|', prov.cuit) as datos_proveedor,
        concat(v.vehiculo,' ', v.codigo) as datos_vehiculo,
        fr.deleted_at fecha_anulado
        FROM facturacion_recibida fr
        JOIN vehiculos v on fr.vehiculo = v.id
        JOIN tipos_factura tf on fr.tipo_factura = tf.id
        JOIN proveedor prov on fr.razon_social = prov.id
        WHERE fr.estado='I'";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos=$query->fetchall();
        return $this->objetos; 
    }
    function activarFacturaRecibida($idFactura){
        $sql = "UPDATE facturacion_recibida
                SET estado = 'A' WHERE id = :id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $idFactura));
        if (!empty($query->execute(array(':id' => $idFactura)))) {
            echo 'activado';
        } else {
            
            echo 'noactivado';
        }
    }


    // EMITIDOS
    function obtener_calculo_total_emitido(){
        $sql = "SELECT 
            estado,
            total
        FROM facturacion_emitida
        WHERE estado='A'";
    
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchAll();
        return $this->objetos; 
    }
    function obtener_calculo_iva_venta(){
        $sql = "SELECT 
            id,
            fecha,
            subtotal,
            iva,
            itc,
            idc,
            perc_iibb,
            perc_iva,
            otros_im,
            descuento,
            total
        FROM facturacion_emitida
        WHERE estado='A'";
    
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchAll();
        return $this->objetos; 
    }
    function obtener_calculo_emitido($mes){
        $whereClause = "";
        if ($mes) {
            $whereClause = "AND MONTH(fecha) = :mes";
        }
        
        $sql = "SELECT 
            id,
            fecha,
            subtotal,
            iva,
            itc,
            idc,
            perc_iibb,
            perc_iva,
            otros_im,
            descuento,
            total
        FROM facturacion_emitida
        WHERE estado='A' AND fecha BETWEEN CURDATE() - INTERVAL 30 DAY AND CURDATE()
        $whereClause";
    
        $query = $this->acceso->prepare($sql);
    
        if ($mes) {
            $query->bindParam(':mes', $mes, PDO::PARAM_INT);
        }
    
        $query->execute();
        $this->objetos = $query->fetchAll();
        return $this->objetos; 
    }
    function obtener_facturas_emitidas($mes = null) {
        $sql = "SELECT 
            fe.id as id_factura,
            fecha,
            tf.id as id_tipo_factura,
            cli.id as id_cliente,
            tr.id as id_registro,
            concat(tf.nombre,'-', fe.punto_venta ,'-', fe.numero_factura) as num_factura,
            cli.razon_social as razonsocial,
            cli.cuit as cuit,
            subtotal,
            iva,
            itc,
            idc,
            perc_iibb,
            perc_iva,
            otros_im,
            descuento,
            total,
            tr.nombre as tipo_gasto
            FROM facturacion_emitida fe
            JOIN cliente cli on fe.razon_social = cli.id
            JOIN tipos_factura tf on fe.tipo_factura = tf.id
            JOIN tipos_registro_venta tr on fe.tipo_gasto_emitido = tr.id
            WHERE fe.estado='A'";
    
        // Agregar condición para filtrar por mes si se proporciona
        if ($mes) {
            $sql .= " AND DATE_FORMAT(fe.fecha, '%m') = :mes";
        }
    
        $query = $this->acceso->prepare($sql);
    
        // Bindear el parámetro del mes si se proporciona
        if ($mes) {
            $query->bindParam(':mes', $mes);
        }
    
        $query->execute();
        $this->objetos = $query->fetchAll();
        return $this->objetos; 
    }
    function editarFacturaEmitida($id,$fecha, $comprobante, $puntoVenta, $tipoVenta, $numeroFactura, $razonSocial, $subtotal, $iva, $itc, $idc, $percIibb, $percIva, $otrosImpuestos, $descuento, $total){
        $sql="SELECT id FROM facturacion_emitida 
        WHERE id != :id
        AND numero_factura = :numero_factura";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(
            ':id'=>$id,
            ':numero_factura' => $numeroFactura

        ));
        $this->objetos=$query->fetchall();
        if(!empty($this->objetos)){
            echo 'noedit';
        }
        else{
            $sql="UPDATE facturacion_emitida 
            SET fecha = :fecha,
            numero_factura = :numero_factura,
            punto_venta = :punto_venta,
            razon_social = :razon_social,
            tipo_factura = :tipo_factura,
            subtotal = :subtotal,
            iva = :iva,
            itc = :itc,
            idc = :idc,
            perc_iibb = :perc_iibb,
            perc_iva = :perc_iva,
            otros_im = :otros_im,
            descuento = :descuento,
            total = :total,
            tipo_gasto_emitido = :tipo_gasto_emitido,
            total = :total
            WHERE id=:id";
            $query = $this->acceso->prepare($sql);
            if ($iva === '') {
                $iva = null;
            }
            if ($itc === '') {
                $itc = null;
            }
            if ($idc === '') {
                $idc = null;
            }
            if ($percIibb === '') {
                $percIibb = null;
            }
            if ($percIva === '') {
                $percIva = null;
            }
            if ($otrosImpuestos === '') {
                $otrosImpuestos = null;
            }
            if ($descuento === '') {
                $descuento = null;
            }
            $query->execute(array(
                ':id' => $id,
                ':fecha' => $fecha,
                ':numero_factura' => $numeroFactura,
                ':punto_venta'=> $puntoVenta,
                ':razon_social' => $razonSocial,
                ':tipo_factura' => $comprobante,
                ':subtotal' => $subtotal,
                ':iva' => $iva,
                ':itc' => $itc,
                ':idc' => $idc,
                ':perc_iibb' => $percIibb,
                ':perc_iva' => $percIva,
                ':otros_im' => $otrosImpuestos,
                ':descuento' => $descuento,
                ':total' => $total,
                ':tipo_gasto_emitido' => $tipoVenta
            ));
            echo 'edit';
        }
    }
    function registrarFacturaEmitida($fecha, $comprobante, $puntoVenta, $tipoVenta, $numeroFactura, $razonSocial, $subtotal, $iva, $itcValue, $idcValue, $percIibb, $percIvaValue, $otrosImpuestos, $descuentoValue, $total) {
            $sql = "SELECT id, estado 
                FROM facturacion_emitida
                WHERE numero_factura = :numero_factura";
    
            $query = $this->acceso->prepare($sql);
            $query->execute(array(
                ':numero_factura' => $numeroFactura,
            ));
    
            $this->objetos = $query->fetchAll();
    
            if (!empty($this->objetos)) {
                foreach ($this->objetos as $factura) {
                    $factura_id = $factura->id;
                    $factura_estado = $factura->estado;
                }
                if ($factura_estado == 'A') {
                    echo 'noadd'; // La factura ya existe
                } else {
                    $sql = "UPDATE facturacion_emitida SET estado = 'A' WHERE id = :id";
                    $query = $this->acceso->prepare($sql);
                    $query->execute(array(':id' => $factura_id));
                    echo 'add';
                }
            } else {
                // La factura no existe, crear una nueva
                $sql = "INSERT INTO facturacion_emitida (fecha, numero_factura, punto_venta, razon_social, tipo_factura, subtotal, iva, itc, idc, perc_iibb, perc_iva, otros_im, descuento, total , tipo_gasto_emitido) 
        VALUES (:fecha, :numero_factura, :punto_venta, :razon_social, :tipo_factura, :subtotal, :iva, :itc, :idc, :perc_iibb, :perc_iva, :otros_im, :descuento, :total, :tipo_gasto_emitido)";

    
                $query = $this->acceso->prepare($sql);
                $query->execute(array(
                    ':fecha' => $fecha,
                    ':numero_factura' => $numeroFactura,
                    ':punto_venta'=> $puntoVenta,
                    ':razon_social' => $razonSocial,
                    ':tipo_factura' => $comprobante,
                    ':subtotal' => $subtotal,
                    ':iva' => $iva,
                    ':itc' => $itcValue,
                    ':idc' => $idcValue,
                    ':perc_iibb' => $percIibb,
                    ':perc_iva' => $percIvaValue,
                    ':otros_im' => $otrosImpuestos,
                    ':descuento' => $descuentoValue,
                    ':total' => $total,
                    ':tipo_gasto_emitido' => $tipoVenta
                ));
    
                // Obtener el ID de la factura recién creada
                $factura_id = $this->acceso->lastInsertId();
    
                echo 'add';
            }
    }
    function anularEmitida($idFactura, $numeroFactura) {
        $fechaHoraEliminacion = date("Y-m-d H:i:s");
        $sql = "UPDATE facturacion_emitida 
                SET estado = 'I', deleted_at = :fechaHoraEliminacion 
                WHERE numero_factura = :numero_factura AND id = :id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $idFactura, ':numero_factura' => $numeroFactura, ':fechaHoraEliminacion' => $fechaHoraEliminacion));
        if (!empty($query->execute(array(':id' => $idFactura , ':numero_factura' => $numeroFactura, ':fechaHoraEliminacion' => $fechaHoraEliminacion)))) {
            echo 'borrado';
        } else {
            
            echo 'noborrado';
        }
    }
    function obtenerMesesFacturasEmitidas() {
        $sql = "SELECT DISTINCT DATE_FORMAT(fecha, '%Y-%m') as valor, DATE_FORMAT(fecha, '%Y-%M') as nombre FROM facturacion_emitida WHERE estado='A'";
        
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $meses = $query->fetchAll(PDO::FETCH_ASSOC);
    
        return $meses;
    }
    function obtenerMesesFacturasEmitidasCalc() {
        $sql = "SELECT DISTINCT DATE_FORMAT(fecha, '%m') as valor, DATE_FORMAT(fecha, '%M') as nombre FROM facturacion_emitida WHERE estado='A'";
        
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $meses = $query->fetchAll(PDO::FETCH_ASSOC);
    
        return $meses;
    }
    function obtenerFacturasPorTipoRegistroEmitidoPorMes() {
        $sql = "SELECT tr.id, 
                tr.nombre, 
                COALESCE(SUM(fe.total), 0) as total,
                MONTH(fe.fecha) as mes,
                fe.estado as estado
                FROM tipos_registro_venta tr
                JOIN facturacion_emitida fe ON tr.id = fe.tipo_gasto_emitido
                GROUP BY tr.id, tr.nombre, mes
                ORDER BY mes ASC, tr.nombre ASC";
    
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchAll(PDO::FETCH_OBJ);
        return $this->objetos;
    }
    function obtener_facturas_emitidas_eliminadas() {
        $sql = "SELECT 
            fe.id as id_factura,
            fe.fecha as datos_factura,
            concat(tf.nombre ,'-',fe.punto_venta ,'-',fe.numero_factura) as num_factura,
            cli.razon_social as razonsocial,
            cli.cuit,
            fe.subtotal,
            fe.deleted_at fecha_eliminado
            FROM facturacion_emitida fe
            JOIN tipos_factura tf on fe.tipo_factura = tf.id
            JOIN cliente cli on fe.razon_social = cli.id
            WHERE fe.estado='I' ";
    
        
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchAll();
        return $this->objetos;  
    }
    function activarFacturaEmitida($idFactura){
        $sql = "UPDATE facturacion_emitida 
                SET estado = 'A' WHERE id = :id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $idFactura));
        if (!empty($query->execute(array(':id' => $idFactura)))) {
            echo 'activado';
        } else {
            
            echo 'noactivado';
        }
    }
}

?>