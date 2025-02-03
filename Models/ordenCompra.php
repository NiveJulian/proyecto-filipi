<?php
include_once '../Models/conexion.php';
class OrdenCompra
{
    var $acceso;
    var $objetos;
    public function __construct()
    {
        $db = new Conexion();
        $this->acceso = $db->pdo;
    }
    function anular($idOrdenCompra)
    {
        $this->acceso->beginTransaction();

        try {
            // Actualiza el estado de la orden de compra
            $sql = "UPDATE orden_compra SET estado = 'I' WHERE id = :id";
            $query = $this->acceso->prepare($sql);

            // Verifica si la actualización fue exitosa
            if ($query->execute(array(':id' => $idOrdenCompra))) {
                // Actualiza el estado de los detalles de la orden de compra
                $sqlDetalles = "UPDATE detalle_orden_compra SET estado = 'I' WHERE id_orden_compra = :id_orden_compra";
                $queryDetalles = $this->acceso->prepare($sqlDetalles);

                // Verifica si la actualización de detalles fue exitosa
                if ($queryDetalles->execute(array(':id_orden_compra' => $idOrdenCompra))) {
                    $this->acceso->commit();
                    return 'borrado';
                } else {
                    $this->acceso->rollBack();
                    return 'noborrado';
                }
            } else {
                $this->acceso->rollBack();
                return 'noborrado';
            }
        } catch (Exception $e) {
            $this->acceso->rollBack();
            throw $e; // Relanza la excepción para que sea manejada en el script principal
        }
    }

    function getDetallesOrdenCompra($id_impresion)
    {
        $sql = "SELECT 
            d.cantidad as cantidad,
            d.detalle as detalle,
            d.obra as obra,
            v.vehiculo as vehiculo,
            d.monto as monto,
            d.total as total
    
        FROM detalle_orden_compra as d
        LEFT JOIN vehiculos as v ON v.id = d.vehiculo_id
        WHERE d.id_orden_compra = :id";

        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $id_impresion));
        return $query->fetchAll();
    }

    function showPurchaseOrderPrint($id_impresion)
    {
        $sql = "SELECT 
            odc.id as id_order,
            odc.fecha as fecha,
            tr.id as tipo_registro_id,
            p.id as personal_id,
            prov.id as proveedor_id,
            tr.nombre as tipo_registro,
            p.nombre as personal,
            prov.nombre as proveedor,
            d.cantidad as cantidad,
            d.detalle as detalle,
            d.obra as obra,
            v.id as vehiculo_id,
            v.vehiculo as vehiculo,
            d.monto as monto,
            d.total as total,
            observaciones

        FROM orden_compra as odc
        JOIN tipos_registro as tr ON odc.tipo_gasto_id = tr.id
        JOIN personal as p ON odc.personal_id = p.id
        JOIN proveedor as prov ON odc.proveedor_id = prov.id
        JOIN detalle_orden_compra as d ON odc.id = d.id_orden_compra
        LEFT JOIN vehiculos as v ON v.id = d.vehiculo_id 

        WHERE odc.estado='A' and odc.id = :id";

        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $id_impresion));
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }

    function showPurchaseOrder()
    {
        $sql = "SELECT 
            odc.id as id_orden,
            fecha,
            prov.id as proveedor_id,
            tr.nombre as tipo_registro,
            tr.id as tipo_registro_id,
            p.nombre as personal,
            p.id as personal_id,
            prov.nombre as proveedor,
            GROUP_CONCAT(d.cantidad) as cantidad,
            GROUP_CONCAT(d.detalle) as detalle,
            GROUP_CONCAT(d.obra) as obra,
            GROUP_CONCAT(d.monto) as monto,
            GROUP_CONCAT(d.total) as total,
            GROUP_CONCAT(v.id) as vehiculo_id,
            GROUP_CONCAT(v.vehiculo) as vehiculo,
            observaciones
            FROM orden_compra odc
            JOIN tipos_registro tr ON odc.tipo_gasto_id  = tr.id
            JOIN personal p ON odc.personal_id = p.id
            JOIN proveedor prov ON odc.proveedor_id = prov.id
            JOIN detalle_orden_compra d ON odc.id = d.id_orden_compra
            LEFT JOIN vehiculos v ON v.id = d.vehiculo_id 
            WHERE odc.estado='A'
            GROUP BY odc.id";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchAll(PDO::FETCH_ASSOC);
        return $this->objetos;
    }

    function obtenerUltimoNumOrder()
    {
        $sql = "SELECT id FROM orden_compra ORDER BY id DESC LIMIT 1";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchAll();
        return $this->objetos;
    }

    function crear($tipoGasto, $autorizado, $proveedor, $observaciones, $datosTabla)
    {
        $this->acceso->beginTransaction();

        try {
            $sql = "INSERT INTO orden_compra (fecha, tipo_gasto_id, personal_id, proveedor_id, observaciones)
                    VALUES (NOW(), :tipo_gasto_id, :personal_id, :proveedor_id, :observaciones)";


            $query = $this->acceso->prepare($sql);
            $query->execute(array(
                ':tipo_gasto_id' => $tipoGasto,
                ':personal_id' => $autorizado,
                ':proveedor_id' => $proveedor,
                ':observaciones' => $observaciones
            ));


            $idOrdenCompra = $this->acceso->lastInsertId();

            foreach ($datosTabla as $detalle) {
                $sqlDetalle = "INSERT INTO detalle_orden_compra (cantidad, detalle, obra, vehiculo_id, monto, total, id_orden_compra)
                                VALUES (:cantidad, :detalle, :obra, :vehiculo_id, :monto, :total, :id_orden_compra)";

                $queryDetalle = $this->acceso->prepare($sqlDetalle);
                $queryDetalle->execute(array(
                    ':cantidad' => $detalle['cantidad'],
                    ':detalle' => $detalle['detalle'],
                    ':obra' => $detalle['obra'],
                    ':vehiculo_id' => $detalle['equipo'],
                    ':monto' => $detalle['monto'],
                    ':total' => $detalle['total'],
                    ':id_orden_compra' => $idOrdenCompra // Utiliza el ID de la orden de compra que obtuviste anteriormente
                ));
            }

            $this->acceso->commit();
            return $idOrdenCompra; // Devuelve el ID de la orden creada
        } catch (Exception $e) {
            $this->acceso->rollBack();
            throw $e; // Relanza la excepción para que sea manejada en el script principal
        }
    }

    function editar($id, $nombre, $direccion, $dni, $obrasocial, $fecha_alta, $fecha_ingreso, $carnet)
    {
        $sql = "SELECT id FROM personal 
        WHERE id != :id
        AND (nombre = :nombre OR dni = :dni)";

        $query = $this->acceso->prepare($sql);
        $query->execute(array(
            ':id' => $id,
            ':nombre' => $nombre,
            ':dni' => $dni,
        ));

        $this->objetos = $query->fetchall();
        if (!empty($this->objetos)) {
            echo 'noedit';
        } else {
            $sql = "UPDATE personal 
                    SET nombre = :nombre,
                    dni = :dni, 
                    direccion = :direccion, 
                    fecha_ingreso = :fecha_ingreso, 
                    fecha_alta = :fecha_alta,
                    obra_social = :obrasocial,
                    carnet = :carnet
                    WHERE id = :id";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(
                ':id' => $id,
                ':dni' => $dni,
                ':nombre' => $nombre,
                ':direccion' => $direccion,
                ':fecha_ingreso' => $fecha_ingreso,
                ':fecha_alta' => $fecha_alta,
                ':obrasocial' => $obrasocial,
                ':carnet' => $carnet
            ));

            echo 'edit';
        }
    }
}
