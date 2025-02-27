<?php
include_once '../Models/conexion.php';
class Factura
{
    var $acceso;
    var $objetos;
    public function __construct()
    {
        $db = new Conexion();
        $this->acceso = $db->pdo;
    }

    function obtener_facturas_por_fecha($fecha_inicio, $fecha_fin, $tipo_factura)
    {
        $sql = '';

        if ($tipo_factura == 'recibido') {
            $sql = "SELECT 
            fr.id as id_factura,
            fr.fecha,
            concat(tf.nombre, '-', fr.punto_venta, '-', fr.numero_factura) as num_factura,
            prov.razon_social as razonsocial,
            prov.cuit as cuit,
            fr.subtotal,
            fr.iva,
            fr.itc,
            fr.idc,
            fr.perc_iibb,
            fr.perc_iva,
            fr.otros_im,
            fr.descuento,
            fr.total,
            v.id as id_vehiculo,
            concat(v.vehiculo, ' ', v.codigo) as vehiculo_datos,
            tr.nombre as tipo_gasto
        FROM facturacion_recibida fr
        JOIN vehiculos v on fr.vehiculo = v.id
        JOIN proveedor prov on fr.razon_social = prov.id
        JOIN tipos_factura tf on fr.tipo_factura = tf.id
        JOIN tipos_registro tr on fr.tipo_gasto = tr.id
        WHERE fr.estado='A' 
        AND fr.fecha BETWEEN :fecha_inicio AND :fecha_fin";
        } elseif ($tipo_factura == 'emitido') {
            $sql = "SELECT 
            fe.id as id_factura,
            fe.fecha,
            tf.id as id_tipo_factura,
            cli.id as id_cliente,
            tr.id as id_registro,
            concat(tf.nombre,'-', fe.punto_venta ,'-', fe.numero_factura) as num_factura,
            cli.razon_social as razonsocial,
            cli.cuit as cuit,
            fe.subtotal,
            fe.iva,
            fe.itc,
            fe.idc,
            fe.perc_iibb,
            fe.perc_iva,
            fe.otros_im,
            fe.descuento,
            fe.total,
            tr.nombre as tipo_gasto
        FROM facturacion_emitida fe
        JOIN cliente cli on fe.razon_social = cli.id
        JOIN tipos_factura tf on fe.tipo_factura = tf.id
        JOIN tipos_registro_venta tr on fe.tipo_gasto_emitido = tr.id
        WHERE fe.estado='A' 
        AND fe.fecha BETWEEN :fecha_inicio AND :fecha_fin";
        } else {
            return [];
        }


        $query = $this->acceso->prepare($sql);
        $query->execute(array(':fecha_inicio' => $fecha_inicio, ':fecha_fin' => $fecha_fin));
        $this->objetos = $query->fetchAll();

        return $this->objetos;
    }
    function obtener_calc()
    {
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
    function obtener_facturas()
    {
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
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }
    function borrar($idFactura, $numeroFactura)
    {
        $fechaHoraEliminacion = date("Y-m-d H:i:s");
        $sql = "UPDATE facturacion_recibida 
                SET estado = 'I', deleted_at= :fechaHoraEliminacion 
                WHERE numero_factura = :numero_factura and id = :id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $idFactura, ':numero_factura' => $numeroFactura, ':fechaHoraEliminacion' => $fechaHoraEliminacion));
        if (!empty($query->execute(array(':id' => $idFactura, ':numero_factura' => $numeroFactura, ':fechaHoraEliminacion' => $fechaHoraEliminacion)))) {
            echo 'borrado';
        } else {

            echo 'noborrado';
        }
    }
    function editarFactura($id, $fecha, $comprobante, $puntoVenta, $tipoVenta, $numeroFactura, $razonSocial, $equipo, $subtotal, $iva, $itc, $idc, $percIibb, $percIva, $otrosImpuestos, $descuento, $total)
    {
        $sql = "SELECT id FROM facturacion_recibida 
        WHERE id != :id
        AND numero_factura = :numero_factura";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(
            ':id' => $id,
            ':numero_factura' => $numeroFactura

        ));
        $this->objetos = $query->fetchall();
        if (!empty($this->objetos)) {
            echo 'noedit';
        } else {
            $sql = "UPDATE facturacion_recibida 
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
                ':punto_venta' => $puntoVenta,
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
    function registrarFactura($fecha, $comprobante, $puntoVenta, $tipoVenta, $numeroFactura, $razonSocial, $equipo, $subtotal, $iva, $itcValue, $idcValue, $percIibb, $percIvaValue, $otrosImpuestos, $descuentoValue, $total)
    {
        $sql = "SELECT id, estado FROM facturacion_recibida WHERE numero_factura = :numero_factura";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':numero_factura' => $numeroFactura));
        $this->objetos = $query->fetchAll();

        if (!empty($this->objetos)) {
            foreach ($this->objetos as $factura) {
                $factura_id = $factura->id;
                $factura_estado = $factura->estado;
            }
            if ($factura_estado == 'A') {
                echo 'noadd';
            } else {
                $sql = "UPDATE facturacion_recibida SET estado = 'A' WHERE id = :id";
                $query = $this->acceso->prepare($sql);
                $query->execute(array(':id' => $factura_id));
                echo 'add';
            }
        } else {
            $sql = "INSERT INTO facturacion_recibida (fecha, numero_factura, punto_venta, razon_social, tipo_factura, subtotal, iva, itc, idc, perc_iibb, perc_iva, otros_im, descuento, total, vehiculo, tipo_gasto) 
        VALUES (:fecha, :numero_factura, :punto_venta, :razon_social, :tipo_factura, :subtotal, :iva, :itc, :idc, :perc_iibb, :perc_iva, :otros_im, :descuento, :total, :vehiculo, :tipo_gasto)";

            $query = $this->acceso->prepare($sql);
            $query->execute(array(
                ':fecha' => $fecha,
                ':numero_factura' => $numeroFactura,
                ':punto_venta' => $puntoVenta,
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

            $factura_id = $this->acceso->lastInsertId();

            echo 'add';

            $tiposValidos = ['Combustible', 'Aceite', 'Lubricantes'];

            if (in_array($tipoVenta, $tiposValidos)) {
                $sql = "INSERT INTO consumo_combustible (id_vehiculo, fecha, lugar_trabajo, cantidad_combustible, aceite_motor, aceite_hidraulico, aceite_transmision, hora, horas_trabajo) 
                    VALUES (:id_vehiculo, :fecha, :lugar_trabajo, :cantidad_combustible, :aceite_motor, :aceite_hidraulico, :aceite_transmision, :hora, :horas_trabajo)";

                $query = $this->acceso->prepare($sql);
                $query->execute(array(
                    ':id_vehiculo' => $equipo,
                    ':fecha' => $fecha,
                    ':lugar_trabajo' => 'Lugar por definir',
                    ':cantidad_combustible' => ($tipoVenta == 'Combustible') ? $total : 0,
                    ':aceite_motor' => ($tipoVenta == 'Aceite') ? $total : 0,
                    ':aceite_hidraulico' => ($tipoVenta == 'Lubricantes') ? $total : 0,
                    ':aceite_transmision' => ($tipoVenta == 'Aceite') ? $total : 0,
                    ':hora' => date('H:i:s'),
                    ':horas_trabajo' => 0,
                ));
            }
        }
    }

    function rellenar_tipo_registro()
    {
        $sql = "SELECT * FROM tipos_registro WHERE estado = 'A' ORDER BY nombre ASC";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }
    function rellenar_tipo_registro_venta()
    {
        $sql = "SELECT * FROM tipos_registro_venta WHERE estado = 'A' ORDER BY nombre ASC";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }
    function rellenar_factura()
    {
        $sql = "SELECT * FROM tipos_factura ORDER BY nombre ASC";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }
    function obtenerFacturasPorTipoRegistro()
    {
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
    function obtenerFacturasPorTipoRegistroRecibidoPorMes()
    {
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
    function obtenerMesesFacturasRecibidos()
    {
        $sql = "SELECT DISTINCT DATE_FORMAT(fecha, '%Y-%m') as valor, DATE_FORMAT(fecha, '%Y-%M') as nombre FROM facturacion_recibida WHERE estado='A'";

        $query = $this->acceso->prepare($sql);
        $query->execute();
        $meses = $query->fetchAll(PDO::FETCH_ASSOC);

        return $meses;
    }

    function obtenerMesesFacturasRecibidosCalc()
    {
        $sql = "SELECT DISTINCT DATE_FORMAT(fecha, '%Y-%m') as valor, DATE_FORMAT(fecha, '%Y-%M') as nombre FROM facturacion_recibida WHERE estado='A'";


        $query = $this->acceso->prepare($sql);
        $query->execute();
        $meses = $query->fetchAll(PDO::FETCH_ASSOC);

        return $meses;
    }
    function obtener_facturas_recibidas_eliminadas()
    {
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
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }
    function activarFacturaRecibida($idFactura)
    {
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



    function obtener_calculo_total_emitido()
    {
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
    function obtener_calculo_iva_venta()
    {
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
    function obtener_calculo_emitido($mes)
    {
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
    function obtener_facturas_emitidas()
    {
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
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchAll();
        return $this->objetos;
    }
    function editarFacturaEmitida($id, $fecha, $comprobante, $puntoVenta, $tipoVenta, $numeroFactura, $razonSocial, $subtotal, $iva, $itc, $idc, $percIibb, $percIva, $otrosImpuestos, $descuento, $total)
    {
        $sql = "SELECT id FROM facturacion_emitida 
        WHERE id != :id
        AND numero_factura = :numero_factura";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(
            ':id' => $id,
            ':numero_factura' => $numeroFactura
        ));
        $this->objetos = $query->fetchall();
        if (!empty($this->objetos)) {
            echo 'noedit';
        } else {
            $sql = "UPDATE facturacion_emitida 
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
                ':punto_venta' => $puntoVenta,
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
    function registrarFacturaEmitida($fecha, $comprobante, $puntoVenta, $tipoVenta, $numeroFactura, $razonSocial, $subtotal, $iva, $itcValue, $idcValue, $percIibb, $percIvaValue, $otrosImpuestos, $descuentoValue, $total)
    {
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
                echo 'noadd';
            } else {
                $sql = "UPDATE facturacion_emitida SET estado = 'A' WHERE id = :id";
                $query = $this->acceso->prepare($sql);
                $query->execute(array(':id' => $factura_id));
                echo 'add';
            }
        } else {

            $sql = "INSERT INTO facturacion_emitida (fecha, numero_factura, punto_venta, razon_social, tipo_factura, subtotal, iva, itc, idc, perc_iibb, perc_iva, otros_im, descuento, total , tipo_gasto_emitido) 
        VALUES (:fecha, :numero_factura, :punto_venta, :razon_social, :tipo_factura, :subtotal, :iva, :itc, :idc, :perc_iibb, :perc_iva, :otros_im, :descuento, :total, :tipo_gasto_emitido)";


            $query = $this->acceso->prepare($sql);
            $query->execute(array(
                ':fecha' => $fecha,
                ':numero_factura' => $numeroFactura,
                ':punto_venta' => $puntoVenta,
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


            $factura_id = $this->acceso->lastInsertId();

            echo 'add';
        }
    }
    function importarFacturaEmitida($fecha, $comprobante, $puntoVenta, $tipoVenta, $numeroFactura, $razonSocial, $subtotal, $iva, $itcValue, $idcValue, $percIibb, $percIvaValue, $otrosImpuestos, $descuentoValue, $total)
    {
        try {

            $sql_tipo_venta = "SELECT id FROM tipos_registro_venta WHERE nombre = :tipoVenta";
            $query_tipo_venta = $this->acceso->prepare($sql_tipo_venta);
            $query_tipo_venta->execute(array(':tipoVenta' => $tipoVenta));
            $tipo_venta_existente = $query_tipo_venta->fetch(PDO::FETCH_OBJ);

            if (!$tipo_venta_existente) {
                $sql_insert_tipo_venta = "INSERT INTO tipos_registro_venta (nombre) VALUES (:tipoVenta)";
                $query_insert_tipo_venta = $this->acceso->prepare($sql_insert_tipo_venta);
                $query_insert_tipo_venta->execute(array(':tipoVenta' => $tipoVenta));
                $tipo_venta_id = $this->acceso->lastInsertId();
            } else {
                $tipo_venta_id = $tipo_venta_existente->id;
            }


            $sql_tipo_factura = "SELECT id FROM tipos_factura WHERE nombre = :comprobante";
            $query_tipo_factura = $this->acceso->prepare($sql_tipo_factura);
            $query_tipo_factura->execute(array(':comprobante' => $comprobante));
            $tipo_factura_existente = $query_tipo_factura->fetch(PDO::FETCH_OBJ);

            if (!$tipo_factura_existente) {
                $sql_insert_tipo_factura = "INSERT INTO tipos_factura (nombre) VALUES (:comprobante)";
                $query_insert_tipo_factura = $this->acceso->prepare($sql_insert_tipo_factura);
                $query_insert_tipo_factura->execute(array(':comprobante' => $comprobante));
                $tipo_factura_id = $this->acceso->lastInsertId();
            } else {
                $tipo_factura_id = $tipo_factura_existente->id;
            }


            $sql_clienteF = "SELECT id FROM cliente WHERE razon_social = :razonSocial";
            $query_clienteF = $this->acceso->prepare($sql_clienteF);
            $query_clienteF->execute(array(':razonSocial' => $razonSocial));
            $cliente_existente = $query_clienteF->fetch(PDO::FETCH_OBJ);

            if (!$cliente_existente) {
                $sql_insert_clienteF = "INSERT INTO cliente (nombre, direccion, telefono, cuit, razon_social, condicion_iva, avatar) 
                                    VALUES (:nombre, :direccion, :telefono, :cuit, :razon_social, :condicion_iva, :avatar)";
                $query_insert_clienteF = $this->acceso->prepare($sql_insert_clienteF);
                $query_insert_clienteF->execute(array(
                    ':nombre' => $razonSocial,
                    ':direccion' => '',
                    ':telefono' => '',
                    ':cuit' => NULL,
                    ':razon_social' => $razonSocial,
                    ':condicion_iva' => '',
                    ':avatar' => ''
                ));
                $cliente_id = $this->acceso->lastInsertId();
            } else {
                $cliente_id = $cliente_existente->id;
            }


            $sql_factura = "SELECT id, estado FROM facturacion_emitida WHERE numero_factura = :numero_factura";
            $query_factura = $this->acceso->prepare($sql_factura);
            $query_factura->execute(array(':numero_factura' => $numeroFactura));
            $factura_existente = $query_factura->fetchAll();

            if (!empty($factura_existente)) {
                foreach ($factura_existente as $factura) {
                    $factura_id = $factura->id;
                    $factura_estado = $factura->estado;
                }

                if ($factura_estado == 'A') {
                    return json_encode(['status' => 'warning', 'message' => 'La factura ya existe y está activa.']);
                } else {
                    $sql_update_factura = "UPDATE facturacion_emitida SET estado = 'A' WHERE id = :id";
                    $query_update_factura = $this->acceso->prepare($sql_update_factura);
                    $query_update_factura->execute(array(':id' => $factura_id));
                    return json_encode(['status' => 'success', 'message' => 'Factura actualizada correctamente.']);
                }
            } else {

                $sql_insert_factura = "INSERT INTO facturacion_emitida (fecha, numero_factura, punto_venta, razon_social, tipo_factura, subtotal, iva, itc, idc, perc_iibb, perc_iva, otros_im, descuento, total, tipo_gasto_emitido) 
                                   VALUES (:fecha, :numero_factura, :punto_venta, :razon_social, :tipo_factura, :subtotal, :iva, :itc, :idc, :perc_iibb, :perc_iva, :otros_im, :descuento, :total, :tipo_gasto_emitido)";
                $query_insert_factura = $this->acceso->prepare($sql_insert_factura);
                $query_insert_factura->execute(array(
                    ':fecha' => $fecha,
                    ':numero_factura' => $numeroFactura,
                    ':punto_venta' => $puntoVenta,
                    ':razon_social' => $cliente_id,
                    ':tipo_factura' => $tipo_factura_id,
                    ':subtotal' => $subtotal,
                    ':iva' => $iva,
                    ':itc' => $itcValue,
                    ':idc' => $idcValue,
                    ':perc_iibb' => $percIibb,
                    ':perc_iva' => $percIvaValue,
                    ':otros_im' => $otrosImpuestos,
                    ':descuento' => $descuentoValue,
                    ':total' => $total,
                    ':tipo_gasto_emitido' => $tipo_venta_id
                ));

                $factura_id = $this->acceso->lastInsertId();
                return json_encode(['status' => 'success', 'message' => 'Factura importada correctamente.']);
            }
        } catch (PDOException $e) {
            return json_encode(['status' => 'error', 'message' => 'Error al registrar' . $e->getMessage()]);
        } catch (Exception $e) {
            return json_encode(['status' => 'error', 'message' => 'Error general' . $e->getMessage()]);
        }
    }
    function anularEmitida($idFactura, $numeroFactura)
    {
        $fechaHoraEliminacion = date("Y-m-d H:i:s");
        $sql = "UPDATE facturacion_emitida 
                SET estado = 'I', deleted_at = :fechaHoraEliminacion 
                WHERE numero_factura = :numero_factura AND id = :id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $idFactura, ':numero_factura' => $numeroFactura, ':fechaHoraEliminacion' => $fechaHoraEliminacion));
        if (!empty($query->execute(array(':id' => $idFactura, ':numero_factura' => $numeroFactura, ':fechaHoraEliminacion' => $fechaHoraEliminacion)))) {
            echo 'borrado';
        } else {

            echo 'noborrado';
        }
    }
    function obtenerMesesFacturasEmitidas()
    {
        $sql = "SELECT DISTINCT DATE_FORMAT(fecha, '%Y-%m') as valor, DATE_FORMAT(fecha, '%Y-%M') as nombre FROM facturacion_emitida WHERE estado='A'";

        $query = $this->acceso->prepare($sql);
        $query->execute();
        $meses = $query->fetchAll(PDO::FETCH_ASSOC);

        return $meses;
    }
    function obtenerMesesFacturasEmitidasCalc()
    {
        $sql = "SELECT DISTINCT DATE_FORMAT(fecha, '%m') as valor, DATE_FORMAT(fecha, '%M') as nombre FROM facturacion_emitida WHERE estado='A'";

        $query = $this->acceso->prepare($sql);
        $query->execute();
        $meses = $query->fetchAll(PDO::FETCH_ASSOC);

        return $meses;
    }
    function obtenerFacturasPorTipoRegistroEmitidoPorMes()
    {
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
    function obtener_facturas_emitidas_eliminadas()
    {
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
    function crearTipoRegistro($nombre)
    {
        $sql = "SELECT * FROM tipos_registro where nombre=:nombre";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':nombre' => $nombre));
        $this->objetos = $query->fetchall();
        if (!empty($this->objetos)) {
            echo 'noadd';
        } else {
            $sql = "INSERT INTO tipos_registro(nombre) VALUES (:nombre)";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':nombre' => $nombre));
            echo 'add';
        }
    }
    function crearTipoRegistroVenta($nombre)
    {
        $sql = "SELECT * FROM tipos_registro_venta where nombre=:nombre";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':nombre' => $nombre));
        $this->objetos = $query->fetchall();
        if (!empty($this->objetos)) {
            echo 'noadd';
        } else {
            $sql = "INSERT INTO tipos_registro_venta(nombre) VALUES (:nombre)";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':nombre' => $nombre));
            echo 'add';
        }
    }
    function editarTipoRegistroVenta($id, $nombre)
    {
        $sql = "SELECT id FROM tipos_registro_venta WHERE id != :id
        AND nombre = :nombre";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $id, ':nombre' => $nombre));
        $this->objetos = $query->fetchall();
        if (!empty($this->objetos)) {
            echo 'noedit';
        } else {
            $sql = "UPDATE tipos_registro_venta 
            SET
            nombre = :nombre
            WHERE id=:id";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':id' => $id, ':nombre' => $nombre));
            echo 'edit';
        }
    }
    function editarTipoRegistro($id, $nombre)
    {
        $sql = "SELECT id FROM tipos_registro WHERE id != :id
        AND nombre = :nombre";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $id, ':nombre' => $nombre));
        $this->objetos = $query->fetchall();
        if (!empty($this->objetos)) {
            echo 'noedit';
        } else {
            $sql = "UPDATE tipos_registro 
            SET
            nombre = :nombre
            WHERE id=:id";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':id' => $id, ':nombre' => $nombre));
            echo 'edit';
        }
    }
    function eliminarTipoRegistro($id)
    {
        $fechaHoraEliminacion = date("Y-m-d H:i:s");
        $sql = "UPDATE tipos_registro 
            SET estado = 'I', deleted_at = :fechaHoraEliminacion 
            WHERE id = :id";
        $query = $this->acceso->prepare($sql);

        if ($query->execute(array(':id' => $id, ':fechaHoraEliminacion' => $fechaHoraEliminacion))) {
            echo 'borrado';
        } else {
            echo 'noborrado';
        }
    }

    function eliminarTipoRegistroVenta($id)
    {
        $fechaHoraEliminacion = date("Y-m-d H:i:s");
        $sql = "UPDATE tipos_registro_venta 
                SET estado = 'I', deleted_at = :fechaHoraEliminacion 
                WHERE id = :id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $id, ':fechaHoraEliminacion' => $fechaHoraEliminacion));
        if (!empty($query->execute(array(':id' => $id, ':fechaHoraEliminacion' => $fechaHoraEliminacion)))) {
            echo 'borrado';
        } else {

            echo 'noborrado';
        }
    }
    function activarFacturaEmitida($idFactura)
    {
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
