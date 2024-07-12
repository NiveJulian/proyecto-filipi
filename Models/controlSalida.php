<?php
include_once $_SERVER["DOCUMENT_ROOT"] . '/filippi/Models/conexion.php';
class Control
{
    var $objetos;
    var $acceso;
    public function __construct()
    {
        $db = new Conexion();
        $this->acceso = $db->pdo;
    }
    function crear($fecha, $hora, $vehiculo, $cantidad, $motivo, $observacion, $chofer, $empresa)
    {
        // Comprobamos si ya existe un registro similar (dependiendo de los campos que consideres únicos)
        $sql = "SELECT id, estado FROM control_salida 
                WHERE fecha = :fecha 
                AND hora = :hora
                AND vehiculo_id = :vehiculo
                AND personal_id = :chofer
                AND empresa = :empresa";

        $query = $this->acceso->prepare($sql);
        $query->execute(array(
            ':fecha' => $fecha,
            ':hora' => $hora,
            ':vehiculo' => $vehiculo,
            ':chofer' => $chofer,
            ':empresa' => $empresa
        ));

        $this->objetos = $query->fetchAll(PDO::FETCH_OBJ);

        if (!empty($this->objetos)) {
            foreach ($this->objetos as $consumo) {
                $consumo_id = $consumo->id;
                $consumo_estado = $consumo->estado;
            }
            if ($consumo_estado == 'A') {
                echo 'noadd';
            } else {
                // Reactivar el registro si está inactivo
                $sql = "UPDATE control_salida SET estado = 'A' WHERE id = :id";
                $query = $this->acceso->prepare($sql);
                $query->execute(array(':id' => $consumo_id));
                echo 'add';
            }
        } else {
            // Inserta el nuevo registro en la tabla de consumos
            $sql = "INSERT INTO control_salida (fecha, hora, vehiculo_id, cantidad, motivo, observacion, personal_id, empresa, estado)
                    VALUES (:fecha, :hora, :vehiculo, :cantidad, :motivo, :observacion, :chofer, :empresa, :estado)";

            $query = $this->acceso->prepare($sql);
            $query->execute(array(
                ':fecha' => $fecha,
                ':hora' => $hora,
                ':vehiculo' => $vehiculo,
                ':cantidad' => $cantidad,
                ':motivo' => $motivo,
                ':observacion' => $observacion,
                ':chofer' => $chofer,
                ':empresa' => $empresa,
                ':estado' => 'A'
            ));
            echo 'add';
        }
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
        return $query->fetchAll(PDO::FETCH_OBJ);
    }

    function eliminar_control_salida($id)
    {
        $sql = "DELETE FROM control_salida where id=:id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $id));
        if (!empty($query->execute(array(':id' => $id)))) {
            echo 'success';
        } else {
            echo 'error';
        }
    }
}
