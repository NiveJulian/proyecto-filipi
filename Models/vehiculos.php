<?php
include_once '../Models/conexion.php';

class Vehiculo
{
    var $objetos;
    var $acceso;
    public function __construct()
    {
        $db = new Conexion();
        $this->acceso = $db->pdo;
    }

    //CONSUMO
    function asignar_tipo_vehiculo($idTipoVehiculo, $vehiculoConsumo)
    {
        $sqlUpdate = "UPDATE vehiculos SET id_tipo_vehiculo = :idTipoVehiculo WHERE id = :idVehiculo";
        $queryUpdate = $this->acceso->prepare($sqlUpdate);
        $queryUpdate->execute(array(
            ':idTipoVehiculo' => $idTipoVehiculo,
            ':idVehiculo' => $vehiculoConsumo
        ));

        if ($queryUpdate->rowCount() > 0) {
            echo 'addTypeVehicle';
        } else {
            echo 'error_updateTypeVehicle';
        }
    }
    function anular_consumo($id)
    {
        // Actualiza el estado del registro de consumo a "I" (inactivo)
        $sql = "UPDATE consumo_combustible 
            SET estado = 'I' 
            WHERE id = :id";

        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $id));

        // Verifica si la operación fue exitosa
        if ($query->rowCount() > 0) {
            echo 'anulado';
        } else {
            echo 'noanulado';
        }
    }
    function editar_consumo($idConsumo, $vehiculoConsumo, $cantidadCombustible, $lugar_trabajo, $aceite_hidraulico, $aceite_motor, $aceite_transmision, $mantenimiento, $horas, $horas_trabajo, $fechaRegistro)
    {
        // Actualizar el registro de consumo de combustible
        $sql = "UPDATE consumo_combustible 
            SET id_vehiculo = :id_vehiculo, 
                fecha = :fecha,
                lugar_trabajo = :lugar_trabajo,
                cantidad_combustible = :cantidad_combustible,
                aceite_motor = :aceite_motor,
                aceite_hidraulico = :aceite_hidraulico,
                aceite_transmision = :aceite_transmision,
                hora = :hora,
                horas_trabajo = :horas_trabajo
            WHERE id = :idConsumo";

        $query = $this->acceso->prepare($sql);
        $query->execute([
            ':id_vehiculo' => $vehiculoConsumo,
            ':fecha' => $fechaRegistro,
            ':lugar_trabajo' => $lugar_trabajo,
            ':cantidad_combustible' => $cantidadCombustible,
            ':aceite_motor' => $aceite_motor,
            ':aceite_hidraulico' => $aceite_hidraulico,
            ':aceite_transmision' => $aceite_transmision,
            ':hora' => $horas,
            ':horas_trabajo' => $horas_trabajo,
            ':idConsumo' => $idConsumo
        ]);
        $sql = "DELETE FROM mantenimiento_vehiculo WHERE id_consumo = :idConsumo";
        $query = $this->acceso->prepare($sql);
        $query->execute([':idConsumo' => $idConsumo]);

        // Luego, agrega los nuevos registros de mantenimiento
        foreach ($mantenimiento as $mantener) {
            $sql = "INSERT INTO mantenimiento_vehiculo (id_consumo, nombre,vehiculo_id, tipo, descripcion, fecha, costo, estado, taller)
                    VALUES (:id_consumo, :nombre,:vehiculo, :tipo, :descripcion, :fecha, :costo, :tipo, :taller)";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(
                ':id_consumo' => $idConsumo,
                ':nombre' => $mantener,
                ':vehiculo' => null,
                ':tipo' => null,
                ':descripcion' => null,
                ':fecha' => null,
                ':costo' => null,
                ':estado' => null,
                ':taller' => null,
            ));
        }

        echo 'edit';
    }
    function registrar_consumo($vehiculoConsumo, $cantidadCombustible, $lugar_trabajo, $aceite_hidraulico, $aceite_motor, $aceite_transmision, $mantenimiento, $horas, $horas_trabajo, $fechaRegistro)
    {
        $sql = "SELECT id FROM consumo_combustible 
                WHERE id_vehiculo = :id_vehiculo
                AND fecha = :fecha
                AND lugar_trabajo = :lugar_trabajo
                AND cantidad_combustible = :cantidad_combustible
                AND aceite_motor = :aceite_motor
                AND aceite_hidraulico = :aceite_hidraulico
                AND aceite_transmision = :aceite_transmision
                AND hora = :hora
                AND horas_trabajo = :horas_trabajo";

        $query = $this->acceso->prepare($sql);
        $query->execute(array(
            ':id_vehiculo' => $vehiculoConsumo,
            ':fecha' => $fechaRegistro,
            ':lugar_trabajo' => $lugar_trabajo,
            ':cantidad_combustible' => $cantidadCombustible,
            ':aceite_motor' => $aceite_motor,
            ':aceite_hidraulico' => $aceite_hidraulico,
            ':aceite_transmision' => $aceite_transmision,
            ':hora' => $horas,
            ':horas_trabajo' => $horas_trabajo
        ));
        $this->objetos = $query->fetchAll();
        if (!empty($this->objetos)) {
            echo 'esta vacio';
        } else {
            $sql = "INSERT INTO consumo_combustible (id_vehiculo, fecha, lugar_trabajo, cantidad_combustible, aceite_motor, aceite_hidraulico, aceite_transmision, hora, horas_trabajo) 
            VALUES (:id_vehiculo, :fecha, :lugar_trabajo, :cantidad_combustible, :aceite_motor, :aceite_hidraulico, :aceite_transmision, :hora, :horas_trabajo)";

            $query = $this->acceso->prepare($sql);
            $query->execute(array(
                ':id_vehiculo' => $vehiculoConsumo,
                ':fecha' => $fechaRegistro,
                ':lugar_trabajo' => $lugar_trabajo,
                ':cantidad_combustible' => $cantidadCombustible,
                ':aceite_motor' => $aceite_motor,
                ':aceite_hidraulico' => $aceite_hidraulico,
                ':aceite_transmision' => $aceite_transmision,
                ':hora' => $horas,
                ':horas_trabajo' => $horas_trabajo
            ));
            $id_consumo = $this->acceso->lastInsertId();
            if (!empty($mantenimiento)) {
                foreach ($mantenimiento as $mantener) {
                    // Verifica si el número de teléfono ya existe en la base de datos
                    $sql = "INSERT INTO mantenimiento_vehiculo (id_consumo, nombre,vehiculo_id, tipo, descripcion, fecha, costo, estado, taller)
                    VALUES (:id_consumo, :nombre,:vehiculo, :tipo, :descripcion, :fecha, :costo, :tipo, :taller)";
                    $query = $this->acceso->prepare($sql);
                    $query->execute(array(
                        ':id_consumo' => $id_consumo,
                        ':nombre' => $mantener,
                        ':vehiculo' => null,
                        ':tipo' => null,
                        ':descripcion' => null,
                        ':fecha' => null,
                        ':costo' => null,
                        ':estado' => null,
                        ':taller' => null,
                    ));
                }
            }

            echo 'add';
        }
    }
    function obtenerCalculoConsumo($id)
    {
        $sql = "SELECT
            cb.id as id_consumo,
            cb.fecha as fecha_real,
            cb.hora,
            cb.cantidad_combustible,
            cb.lugar_trabajo,
            cb.aceite_motor,
            cb.aceite_hidraulico,
            cb.aceite_transmision,
            cb.horas_trabajo,
            mv.nombre AS mantenimiento,
            v.vehiculo,
            v.codigo,
            cb.hora - LAG(cb.hora) OVER (ORDER BY cb.fecha, cb.hora) AS diferencia_horas
        FROM consumo_combustible cb
        JOIN mantenimiento_vehiculo mv ON mv.id_consumo = cb.id
        JOIN vehiculos v ON v.id = cb.id_vehiculo
        WHERE v.id = :id AND cb.estado = 'A'
        ORDER BY cb.fecha ASC, cb.hora ASC;";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $id));
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }
    function asignar_precio_combustible($precio_combustible)
    {
        $sqlAlterTable = "ALTER TABLE consumo_combustible MODIFY COLUMN precio_combustible DECIMAL(10,2) DEFAULT :precio_combustible";
        $query = $this->acceso->prepare($sqlAlterTable);
        $query->bindParam(':precio_combustible', $precio_combustible, PDO::PARAM_STR);
        echo 'success';
        return $query->execute();
    }
    function calcularConsumoPorFecha($id, $fecha_desde, $fecha_hasta)
    {
        // Consulta SQL para calcular el total de horas y total de litros de combustible
        $sql = "SELECT 
                    SUM(subquery.diferencia_horas) AS total_horas,
                    SUM(subquery.cantidad_combustible) AS total_litros
                FROM (
                    SELECT 
                        cb.cantidad_combustible,
                        cb.hora - LAG(cb.hora) OVER (ORDER BY cb.fecha, cb.hora) AS diferencia_horas
                    FROM consumo_combustible cb
                    JOIN vehiculos v ON v.id = cb.id_vehiculo
                    WHERE v.id = :id
                    AND cb.fecha >= :fecha_desde
                    AND cb.fecha <= :fecha_hasta
                ) AS subquery";

        // Prepara la consulta
        $query = $this->acceso->prepare($sql);
        $query->execute([
            ':id' => $id,
            ':fecha_desde' => $fecha_desde,
            ':fecha_hasta' => $fecha_hasta
        ]);

        // Recuperar resultados como un array asociativo
        $result = $query->fetch(PDO::FETCH_ASSOC);

        // Asegurarse de que los resultados sean numéricos
        $result['total_horas'] = (float) $result['total_horas'];
        $result['total_litros'] = (float) $result['total_litros'];

        return $result;
    }
    function calcularConsumoDeAceite($id, $fecha_desde, $fecha_hasta)
    {
        // Consulta SQL para calcular el total de aceites por tipo
        $sql = "SELECT 
                    SUM(cb.aceite_motor) AS total_aceite_motor,
                    SUM(cb.aceite_hidraulico) AS total_aceite_hidraulico,
                    SUM(cb.aceite_transmision) AS total_aceite_transmision
                FROM consumo_combustible cb
                JOIN vehiculos v ON v.id = cb.id_vehiculo
                WHERE v.id = :id
                AND cb.fecha >= :fecha_desde
                AND cb.fecha <= :fecha_hasta";

        // Prepara la consulta
        $query = $this->acceso->prepare($sql);
        $query->execute([
            ':id' => $id,
            ':fecha_desde' => $fecha_desde,
            ':fecha_hasta' => $fecha_hasta
        ]);

        // Recuperar resultados como un array asociativo
        $result = $query->fetch(PDO::FETCH_ASSOC);

        return $result;
    }
    function seguimientoDeService($id)
    {
        // Consulta SQL para obtener la última hora registrada y el tipo de mantenimiento
        $sql = "SELECT cb.hora, mv.nombre AS tipo_mantenimiento
                FROM consumo_combustible cb
                JOIN mantenimiento_vehiculo mv ON mv.id_consumo = cb.id
                WHERE cb.id_vehiculo = :id
                ORDER BY cb.hora DESC
                LIMIT 1";

        // Prepara la consulta
        $query = $this->acceso->prepare($sql);
        $query->execute([':id' => $id]);
        $result = $query->fetch(PDO::FETCH_ASSOC);

        // Verifica si hay un resultado
        if ($result) {
            return $result;
        } else {
            return null;
        }
    }
    function obtener_historico($idVehiculo)
    {
        // Consulta que calcula total_horas y total_litros
        $sql = "SELECT 
            SUM(diferencia_horas) AS total_horas,
            SUM(cantidad_combustible) AS total_litros
        FROM (
            SELECT 
                cantidad_combustible,
                cb.hora - LAG(cb.hora) OVER (ORDER BY cb.fecha, cb.hora) AS diferencia_horas
            FROM consumo_combustible cb
            JOIN vehiculos v ON v.id = cb.id_vehiculo
            WHERE v.id = :idVehiculo
        ) AS subquery;";

        // Prepara y ejecuta la consulta
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':idVehiculo' => $idVehiculo));

        // Obtiene los resultados de la consulta
        $this->objetos = $query->fetchAll();

        // Retorna los resultados
        return $this->objetos;
    }
    function obtener_consumos($idVehiculo)
    {
        $sql = "SELECT 
            v.id id_vehiculo,
            codigo,
            avatar,
            vehiculo
        FROM vehiculos v
        WHERE v.id = :idVehiculo";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':idVehiculo' => $idVehiculo));
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }

    //
    function ids_tipos_vehiculos()
    {
        $sql = "SELECT DISTINCT id_tipo_vehiculo FROM vehiculos";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }
    function tipo_vehiculos()
    {
        $sql = "SELECT 
        tv.id id_tipo_vehiculo,
        tv.nombre nombre_tipo_vehiculo,
        tv.orden,
        v.id id_vehiculo,
        v.codigo,
        v.avatar,
        v.vehiculo
        FROM tipo_vehiculo tv
        LEFT JOIN vehiculos v on v.id_tipo_vehiculo = tv.id
        ORDER BY tv.nombre asc";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchAll();
        return $this->objetos;
    }

    function tipos_vehiculos()
    {
        $sql = "SELECT 
            tv.id id_tipo_vehiculo,
            tv.nombre nombre_tipo_vehiculo,
            tv.orden,
            v.id id_vehiculo,
            codigo,
            avatar,
            vehiculo
        FROM tipo_vehiculo tv
        JOIN vehiculos v on v.id_tipo_vehiculo = tv.id
        ORDER BY tv.nombre asc";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }
    function cambiar_avatar($id, $nombre)
    {
        $sql = "UPDATE vehiculos SET avatar=:nombre WHERE id=:id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $id, ':nombre' => $nombre));
        return $this->objetos;
    }
    function ver($id)
    {
        $sql = "SELECT * FROM vehiculos WHERE id=:id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $id));
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }
    function obtener_vehiculos()
    {
        $sql = "SELECT id,
        codigo,
        vehiculo,
        vtv,
        motor,
        cedula,
        vencimiento_cedula,
        logistica,
        matafuego,
        senasa,
        seguro,
        num_poliza,
        poliza,
        avatar,
        id_tipo_vehiculo
        FROM vehiculos 
        WHERE estado = 'A' AND vehiculo = vehiculo AND codigo = codigo
        ORDER BY codigo ASC";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }
    function obtener_fecha_vencida()
    {
        $sql = "SELECT * FROM vehiculos WHERE estado='A' ORDER BY vehiculo asc";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }
    function obtener_resumen()
    {
        $sql = "SELECT * FROM vehiculos WHERE estado='A' ORDER BY vehiculo asc";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }
    function crear($codigo, $nombre_vehiculo, $vencimiento_vtv, $cedula, $motor, $vencimiento_cedula, $vencimiento_logistica, $vencimiento_senasa, $vencimiento_matafuego, $vencimiento_seguro, $numero_poliza, $vencimiento_poliza)
    {
        $sql = "SELECT id, estado FROM 
        vehiculos WHERE 
        vehiculo = :vehiculo
        AND codigo = :codigo";

        $query = $this->acceso->prepare($sql);
        $query->execute(array(
            ':codigo' => $codigo,
            ':vehiculo' => $nombre_vehiculo,
        ));
        $vehiculoExistente = $query->fetch(PDO::FETCH_OBJ);

        if (!empty($vehiculoExistente)) {
            if ($vehiculoExistente->estado == 'A') {
                echo 'noadd';
            } else {
                // Reactivar vehículo si está inactivo
                $sql = "UPDATE vehiculos SET estado = 'A' WHERE id = :id";
                $query = $this->acceso->prepare($sql);
                $query->execute(array(':id' => $vehiculoExistente->id));
                echo 'add';
            }
        } else {
            // Inserta el nuevo vehículo en la tabla
            $sql = "INSERT INTO vehiculos (codigo, vehiculo, vtv, cedula, motor, vencimiento_cedula, logistica, senasa, matafuego, seguro, num_poliza, poliza, estado)
            VALUES (:codigo, :vehiculo, :vtv, :cedula, :motor, :vencimiento_cedula, :logistica, :senasa, :matafuego, :seguro, :num_poliza, :poliza, :estado)";


            $query = $this->acceso->prepare($sql);
            $query->execute(array(
                ':codigo' => $codigo,
                ':vehiculo' => $nombre_vehiculo,
                ':vtv' => $vencimiento_vtv,
                ':cedula' => $cedula,
                ':motor' => $motor,
                ':vencimiento_cedula' => $vencimiento_cedula,
                ':logistica' => $vencimiento_logistica,
                ':senasa' => $vencimiento_senasa,
                ':matafuego' => $vencimiento_matafuego,
                ':seguro' => $vencimiento_seguro,
                ':num_poliza' => $numero_poliza,
                ':poliza' => $vencimiento_poliza,
                ':estado' => 'A' // Reemplaza esto con el valor correcto de estado
            ));
            echo 'add';
        }
    }
    function editar($id, $codigo, $nombre_vehiculo, $vencimiento_vtv, $cedula, $motor, $vencimiento_cedula, $vencimiento_logistica, $vencimiento_senasa, $vencimiento_matafuego, $vencimiento_seguro, $numero_poliza, $vencimiento_poliza)
    {
        $sql = "SELECT id FROM vehiculos 
        WHERE id != :id
        AND codigo = :codigo 
        AND vehiculo = :vehiculo";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(
            ':id' => $id,
            ':codigo' => $codigo,
            ':vehiculo' => $nombre_vehiculo,
        ));
        $this->objetos = $query->fetchall();
        if (!empty($this->objetos)) {
            echo 'noedit';
        }
        try {
            $sql = "UPDATE vehiculos 
            SET codigo=:codigo,
            vehiculo=:vehiculo, 
            vtv=:vtv, 
            cedula=:cedula, 
            motor=:motor, 
            vencimiento_cedula=:vencimiento_cedula,
            logistica=:logistica,
            senasa=:senasa,
            matafuego=:matafuego,
            seguro=:seguro,
            num_poliza=:num_poliza,
            poliza=:poliza
            WHERE id=:id";
            $query = $this->acceso->prepare($sql);
            if ($vencimiento_vtv === '') {
                $vencimiento_vtv = null;
            }

            if ($vencimiento_cedula === '') {
                $vencimiento_cedula = null;
            }

            if ($vencimiento_logistica === '') {
                $vencimiento_logistica = null;
            }

            if ($vencimiento_senasa === '') {
                $vencimiento_senasa = null;
            }

            if ($vencimiento_seguro === '') {
                $vencimiento_seguro = null;
            }

            if ($vencimiento_poliza === '') {
                $vencimiento_poliza = null;
            }
            if ($vencimiento_matafuego === '') {
                $vencimiento_matafuego = null;
            }

            $query->execute(array(
                ':id' => $id,
                ':codigo' => $codigo,
                ':vehiculo' => $nombre_vehiculo,
                ':vtv' => $vencimiento_vtv,
                ':cedula' => $cedula,
                ':motor' => $motor,
                ':vencimiento_cedula' => $vencimiento_cedula,
                ':logistica' => $vencimiento_logistica,
                ':senasa' => $vencimiento_senasa,
                ':matafuego' => $vencimiento_matafuego,
                ':seguro' => $vencimiento_seguro,
                ':num_poliza' => $numero_poliza,
                ':poliza' => $vencimiento_poliza,
            ));
            echo 'edit';
        } catch (PDOException $e) {
            return 'Error al actualizar los datos: ' . $e->getMessage();
        }
    }
    function borrar($id)
    {
        $sql = "DELETE FROM vehiculos where id=:id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $id));
        if (!empty($query->execute(array(':id' => $id)))) {
            echo 'borrado';
        } else {
            echo 'noborrado';
        }
    }
    function obtenerDatos($id_impresion)
    {
        $sql = "SELECT  
        codigo,
        vehiculo,
        vtv,
        cedula,
        motor,
        vencimiento_cedula,
        logistica,
        matafuego,
        senasa,
        seguro,
        num_poliza,
        poliza
        FROM vehiculos WHERE id = :id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $id_impresion));
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }
    function registrarConsumoMantenimiento($vehiculo, $tipo, $descripcion, $fecha, $costo, $estado, $taller)
    {
        $sql = "SELECT id FROM mantenimiento_vehiculo 
                WHERE vehiculo_id = :vehiculo_id
                AND fecha = :fecha
                AND nombre = :nombre
                AND tipo = :tipo
                AND descripcion = :descripcion
                AND costo = :costo
                AND estado = :estado
                AND taller = :taller
                AND id_consumo IS NULL";

        $query = $this->acceso->prepare($sql);
        $query->execute(array(
            ':vehiculo_id' => $vehiculo,
            ':fecha' => $fecha,
            ':tipo' => $tipo,
            ':nombre' => $descripcion,
            ':descripcion' => $descripcion,
            ':costo' => $costo,
            ':estado' => $estado,
            ':taller' => $taller
        ));
        $this->objetos = $query->fetchAll();
        if (!empty($this->objetos)) {
            echo 'noadd';
        } else {
            $sql = "INSERT INTO mantenimiento_vehiculo (id_consumo, nombre,vehiculo_id, tipo, descripcion, fecha, costo, estado, taller)
            VALUES (:id_consumo, :nombre,:vehiculo, :tipo, :descripcion, :fecha, :costo, :estado, :taller)";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(
                ':id_consumo' => null,
                ':nombre' => $descripcion,
                ':vehiculo' => $vehiculo,
                ':tipo' => $tipo,
                ':descripcion' => $descripcion,
                ':fecha' => $fecha,
                ':costo' => $costo,
                ':estado' => $estado,
                ':taller' => $taller
            ));
            $query->fetch();
            echo 'add';
        }
    }

    function obtenerDatosMantenimiento($id)
    {
        $sql = "SELECT 
            mv.id as id_mantenimiento,
            mv.nombre,
            mv.tipo,
            mv.descripcion,
            mv.fecha as fechas_mantenimiento,
            mv.costo,
            mv.estado as estado_mantenimiento,
            mv.taller,
            mv.vehiculo_id,
            v.vehiculo,
            v.codigo
        FROM mantenimiento_vehiculo mv
        JOIN vehiculos v ON mv.vehiculo_id = v.id
        WHERE id_consumo IS NULL AND mv.vehiculo_id = :id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $id));
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }
}
