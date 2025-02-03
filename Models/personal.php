<?php
include_once '../Models/conexion.php';
class Personal
{
    var $objetos;
    var $acceso;
    public function __construct()
    {
        $db = new Conexion();
        $this->acceso = $db->pdo;
    }
    function crear($nombre, $direccion, $cuil, $rol, $dni, $obrasocial, $fecha_alta, $fecha_baja, $fecha_ingreso, $carnet)
    {
        $sql = "SELECT id, estado FROM 
                personal WHERE 
                dni = :dni 
                AND nombre = :nombre
                AND direccion = :direccion
                AND cuil = :cuil
                AND rol_id = :rol
                AND fecha_ingreso = :fecha_ingreso
                AND fecha_alta = :fecha_alta
                AND fecha_baja = :fecha_baja
                AND obra_social = :obrasocial
                AND carnet = :carnet";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(
            ':dni' => $dni,
            ':nombre' => $nombre,
            ':direccion' => $direccion,
            ':cuil' => $cuil,
            ':rol' => $rol,
            ':fecha_ingreso' => $fecha_ingreso,
            ':fecha_alta' => $fecha_alta,
            ':fecha_baja' => $fecha_baja,
            ':obrasocial' => $obrasocial,
            ':carnet' => $carnet
        ));
        $this->objetos = $query->fetchAll();
        if (!empty($this->objetos)) {
            foreach ($this->objetos as $perso) {
                $perso_id = $perso->id;
                $perso_estado = $perso->estado;
            }
            if ($perso_estado == 'A') {
                echo 'noadd';
            } else {
                $sql = "UPDATE personal SET estado = 'A' WHERE id = :id";
                $query = $this->acceso->prepare($sql);
                $query->execute(array(':id' => $perso_id));
                echo 'add';
            }
        } else {
            $sql = "INSERT INTO personal (nombre, direccion, cuil, rol_id, fecha_ingreso, fecha_alta, fecha_baja, obra_social,dni,carnet, estado)
            VALUES (:nombre, :direccion, :cuil, :rol, :fecha_ingreso, :fecha_alta, :fecha_baja, :obra_social, :dni, :carnet, :estado)";

            if ($fecha_alta === '') {
                $fecha_alta = null;
            }
            if ($fecha_ingreso === '') {
                $fecha_ingreso = null;
            }
            if ($fecha_baja === '') {
                $fecha_baja = null;
            }
            if ($carnet === '') {
                $carnet = null;
            }
            $query = $this->acceso->prepare($sql);
            $query->execute(array(
                ':nombre' => $nombre,
                ':direccion' => $direccion,
                ':cuil' => $cuil,
                ':rol' => $rol,
                ':fecha_ingreso' => $fecha_ingreso,
                ':fecha_alta' => $fecha_alta,
                ':fecha_baja' => $fecha_baja,
                ':obra_social' => $obrasocial,
                ':dni' => $dni,
                ':carnet' => $carnet,
                ':estado' => 'A'
            ));
            echo 'add';
        }
    }
    function editar($id, $nombre, $direccion, $dni, $cuil, $rol, $obrasocial, $fecha_alta, $fecha_ingreso, $fecha_baja, $carnet)
    {
        $sql = "SELECT id FROM personal 
        WHERE id != :id
        AND (nombre = :nombre)";

        $query = $this->acceso->prepare($sql);
        $query->execute(array(
            ':id' => $id,
            ':nombre' => $nombre
        ));

        $this->objetos = $query->fetchall();
        if (!empty($this->objetos)) {
            echo 'noedit';
        } else {
            $sql = "UPDATE personal 
                    SET nombre = :nombre,
                    dni = :dni, 
                    direccion = :direccion,
                    cuil = :cuil,
                    rol_id = :rol,
                    fecha_ingreso = :fecha_ingreso, 
                    fecha_alta = :fecha_alta,
                    fecha_baja = :fecha_baja,
                    obra_social = :obrasocial,
                    carnet = :carnet
                    WHERE id = :id";

            $query = $this->acceso->prepare($sql);
            if ($fecha_alta === '') {
                $fecha_alta = null;
            }
            if ($fecha_ingreso === '') {
                $fecha_ingreso = null;
            }
            if ($fecha_baja === '') {
                $fecha_baja = null;
            }
            if ($carnet === '') {
                $carnet = null;
            }
            $query->execute(array(
                ':id' => $id,
                ':dni' => $dni,
                ':nombre' => $nombre,
                ':cuil' => $cuil,
                ':rol' => $rol,
                ':direccion' => $direccion,
                ':fecha_ingreso' => $fecha_ingreso,
                ':fecha_alta' => $fecha_alta,
                ':fecha_baja' => $fecha_baja,
                ':obrasocial' => $obrasocial,
                ':carnet' => $carnet
            ));

            echo 'edit';
        }
    }
    function obtener_total_registros()
    {
        $sql = "SELECT 
                COUNT(*) AS total 
        FROM personal WHERE estado = 'A' AND nombre = nombre";
        $query = $this->acceso->prepare($sql);
        $query->execute();

        $result = $query->fetch(PDO::FETCH_ASSOC);
        return $result['total'];
    }
    function obtener_personal($offset, $itemsPerPage)
    {
        $sql = "SELECT 
                    per.id, 
                    per.nombre, 
                    per.direccion, 
                    per.cuil, 
                    per.fecha_ingreso, 
                    per.fecha_alta, 
                    per.fecha_salida, 
                    per.fecha_baja, 
                    per.obra_social, 
                    per.dni, 
                    per.carnet,
                    per.avatar,
                    per.estado,
                    rol.nombre AS nombre_rol
                FROM personal per
                LEFT JOIN roles rol ON per.rol_id = rol.id
                ORDER BY per.nombre ASC
                LIMIT :offset, :limit";

        $query = $this->acceso->prepare($sql);
        $query->bindParam(':offset', $offset, PDO::PARAM_INT);
        $query->bindParam(':limit', $itemsPerPage, PDO::PARAM_INT);
        $query->execute();

        $this->objetos = $query->fetchAll();
        return $this->objetos;
    }
    function cambiar_avatar($id, $nombre)
    {
        $sql = "UPDATE personal SET avatar=:nombre WHERE id=:id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $id, ':nombre' => $nombre));
        return $this->objetos;
    }
    function anular_personal($id)
    {
        // Actualiza el estado del registro de personal a "I" (inactivo)
        $sql = "UPDATE personal 
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
    function obtenerDatos($id_impresion)
    {
        $sql = "SELECT * FROM personal WHERE id = :id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $id_impresion));
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }
    function ver($id)
    {
        $sql = "SELECT * FROM personal WHERE id=:id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $id));
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }
    function rellenar_personal()
    {
        $sql = "SELECT p.id as id_personal,
        p.nombre as nombre_personal,
        r.nombre as rol
        FROM personal p
        JOIN roles r on r.id = p.rol_id
        ORDER BY p.nombre ASC";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }
    function obtener_camioneros_sql()
    {
        $sql = "SELECT 
                p.id, 
                p.nombre,
                r.nombre as rol
            FROM personal p
            JOIN roles r ON p.rol_id = r.id
            WHERE r.nombre = 'Camionero'
            OR r.nombre = 'Chofer'
            ORDER BY p.nombre ASC";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }
    //ASISTENCIA
    function obtener_datos_empleados()
    {
        $sql = "SELECT 
                    per.id as id_personal,
                    per.nombre as nombre_personal,
                    per.direccion,
                    rol.id as rol_id,
                    rol.nombre as nombre_rol
                FROM personal per
                JOIN roles rol ON per.rol_id = rol.id
                WHERE per.estado = 'A'
                ORDER BY rol.nombre ASC, per.nombre ASC";

        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchAll();
        return $this->objetos;
    }
    function cambiarRol($personalId, $nuevoRolId)
    {
        $rolActual = $this->obtenerRol($personalId);

        if ($rolActual !== null) {
            return false;
        }
        $sql = "UPDATE personal SET rol_id = :nuevoRolId WHERE id = :personalId";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':nuevoRolId' => $nuevoRolId, ':personalId' => $personalId));

        return true;
    }
    function obtenerRol($personalId)
    {
        $sql = "SELECT rol_id FROM personal WHERE id = :personalId";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':personalId' => $personalId));

        $resultado = $query->fetch(PDO::FETCH_ASSOC);

        return $resultado ? $resultado['rol_id'] : null;
    }
    function obtener_asistencias()
    {
        $sql = "SELECT 
                    p.id as id_personal,
                    asist.fecha_inicio,
                    asist.fecha_final,
                    asist.fecha_creacion,
                    pe.fecha_creacion as creacion_pagos,
                    COUNT(asist.fecha_creacion) AS cantidad_recibos,
                    SUM(pe.pago_semanal) AS total_sueldos_semanales
                FROM personal p
                JOIN pagos_extras pe ON p.id = pe.personal_id
                JOIN asistencia asist ON p.id = asist.personal_id 
                WHERE p.estado = 'A'
                GROUP BY asist.fecha_creacion  
                ORDER BY asist.fecha_creacion ASC";

        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchAll();
        return $this->objetos;
    }

    function showAsistPrint($fechaCreacion)
    {
        $sql = "SELECT p.nombre AS nombre_personal,
                       a.fecha_inicio,
                       a.fecha_final,
                       a.total_dias,
                       a.fecha_creacion AS creacion_asistencias,
                       pe.viandas_valor_predeterminado AS comida,
                       pe.viandas_cantidad AS viandas_cantidad,
                       pe.adelanto,
                       pe.viaje,
                       pe.domingos,
                       pe.extras,
                       pe.bonificacion,
                       pe.pago_semanal AS semanal_total,
                       pe.fecha_creacion AS creacion_pagos
                FROM personal p
                JOIN asistencia a ON p.id = a.personal_id
                JOIN pagos_extras pe ON p.id = pe.personal_id
                WHERE p.estado = 'A' 
                  AND a.fecha_creacion = :creacion_asistencias
                  AND pe.fecha_creacion = :creacion_pagos
                ORDER BY p.nombre ASC";

        $query = $this->acceso->prepare($sql);
        $query->bindParam(':creacion_asistencias', $fechaCreacion);
        $query->bindParam(':creacion_pagos', $fechaCreacion);
        $query->execute();
        $this->objetos = $query->fetchAll();
        return $this->objetos;
    }
    function empleadosConRol()
    {
        $sql = "SELECT rol_id,
            rol.nombre 
            FROM personal p
            JOIN roles rol on p.rol_id = rol.id 
            WHERE p.rol_id IS NOT NULL";
        $query = $this->acceso->prepare($sql);
        $query->execute();

        $resultados = $query->fetchAll(PDO::FETCH_ASSOC);

        return $resultados;
    }
}
