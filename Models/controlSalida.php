<?php
include_once '../Models/conexion.php';
class Control
{
    var $objetos;
    var $acceso;
    public function __construct()
    {
        $db = new Conexion();
        $this->acceso = $db->pdo;
    }
    function registrar_control_salida($fecha, $hora, $vehiculo_id, $motivo, $observacion, $personal_id, $empresa)
    {
        $sql = "INSERT INTO control_salida (fecha, hora, vehiculo_id, motivo, observacion, personal_id, empresa) 
                VALUES (:fecha, :hora, :vehiculo_id, :motivo, :observacion, :personal_id, :empresa)";
        $query = $this->acceso->prepare($sql);
        $query->execute([
            ':fecha' => $fecha,
            ':hora' => $hora,
            ':vehiculo_id' => $vehiculo_id,
            ':motivo' => $motivo,
            ':observacion' => $observacion,
            ':personal_id' => $personal_id,
            ':empresa' => $empresa
        ]);
        return $this->acceso->lastInsertId();
    }
    function registrar_producto_salida($control_salida_id, $producto_id, $cantidad)
    {
        $sql = "INSERT INTO control_salida_producto (control_salida_id, producto_id, cantidad) 
                VALUES (:control_salida_id, :producto_id, :cantidad)";
        $query = $this->acceso->prepare($sql);
        $query->execute([
            ':control_salida_id' => $control_salida_id,
            ':producto_id' => $producto_id,
            ':cantidad' => $cantidad
        ]);
    }
    function obtener_stock($producto_id, $lote_id)
    {
        $sql = "SELECT stock FROM producto WHERE id = :producto_id AND id_lote = :lote_id";
        $query = $this->acceso->prepare($sql);
        $query->execute([
            ':producto_id' => $producto_id,
            ':lote_id' => $lote_id
        ]);
        $resultado = $query->fetch(PDO::FETCH_ASSOC);

        return $resultado ? (int) $resultado['stock'] : 0;
    }

    function disminuir_stock($producto_id, $lote_id, $cantidad)
    {
        $sql = "UPDATE producto 
                SET stock = stock - :cantidad 
                WHERE id = :producto_id AND id_lote = :lote_id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(
            ':cantidad' => $cantidad,
            ':producto_id' => $producto_id,
            ':lote_id' => $lote_id
        ));
    }

    function obtener_todos_control_salida()
    {
        $sql = "SELECT cs.*,
                       v.codigo AS vehiculo_codigo,
                       v.vehiculo AS vehiculo_nombre,
                       p.nombre AS chofer_nombre
                FROM control_salida cs
                JOIN vehiculos v ON cs.vehiculo_id = v.id
                JOIN personal p ON cs.personal_id = p.id
                ORDER BY cs.fecha DESC, cs.hora DESC";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $controlesSalida = $query->fetchAll(PDO::FETCH_OBJ);

        foreach ($controlesSalida as $control) {
            $control->productos = $this->obtener_productos_control_salida($control->id);
        }

        return $controlesSalida;
    }

    function obtener_productos_control_salida($control_salida_id)
    {
        $sql = "SELECT csp.producto_id, 
                        pr.nombre, 
                        pr.codigo, 
                        pr.precio, 
                        csp.cantidad, 
                        pr.id_lote
                FROM control_salida_producto csp
                JOIN producto pr ON csp.producto_id = pr.id
                WHERE csp.control_salida_id = :control_salida_id";
        $query = $this->acceso->prepare($sql);
        $query->execute([':control_salida_id' => $control_salida_id]);
        return $query->fetchAll(PDO::FETCH_OBJ);
    }

    function eliminar_control_salida($id)
    {
        // Iniciar una transacción para asegurar la integridad de los datos
        $this->acceso->beginTransaction();

        try {
            // Paso 1: Eliminar los registros relacionados en control_salida_producto
            $sql_delete_productos = "DELETE FROM control_salida_producto WHERE control_salida_id = :id";
            $query_delete_productos = $this->acceso->prepare($sql_delete_productos);
            $query_delete_productos->execute([':id' => $id]);

            // Paso 2: Eliminar el registro en control_salida
            $sql_delete_control = "DELETE FROM control_salida WHERE id = :id";
            $query_delete_control = $this->acceso->prepare($sql_delete_control);
            $query_delete_control->execute([':id' => $id]);

            // Confirmar la transacción
            $this->acceso->commit();

            echo 'success'; // Éxito
        } catch (PDOException $e) {
            // Revertir la transacción en caso de error
            $this->acceso->rollBack();
            echo 'error'; // Error
        }
    }
}
