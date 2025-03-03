<?php
include_once '../Models/conexion.php';

class Archivos
{
    var $acceso;
    var $objetos;
    public function __construct()
    {
        $db = new Conexion();
        $this->acceso = $db->pdo;
    }
    function crearTipoDeArchivoPersonal($nombre_tipo)
    {
        $sql = "SELECT * FROM tipos_archivo_personal where nombre_tipo=:nombre_tipo";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':nombre_tipo' => $nombre_tipo));
        $this->objetos = $query->fetchall();
        if (!empty($this->objetos)) {
            echo 'noadd';
        } else {
            $sql = "INSERT INTO tipos_archivo_personal(nombre_tipo) values (:nombre_tipo);";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':nombre_tipo' => $nombre_tipo));
            echo 'add';
        }
    }
    function obtenerDatosArchivoPDF($archivoId)
    {
        $sql = "SELECT nombre, ruta FROM archivos WHERE id = :archivoId";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':archivoId' => $archivoId));
        $this->objetos = $query->fetchAll();
        return $this->objetos;
    }
    function verificar_archivo_existente($idVehiculo, $nombre)
    {
        $sql = "SELECT id FROM archivos WHERE id_vehiculo = :id_vehiculo AND nombre = :nombre";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id_vehiculo' => $idVehiculo, ':nombre' => $nombre));
        $archivoExistente = $query->fetch(PDO::FETCH_ASSOC);
        return !empty($archivoExistente);
    }
    function obtenerArchivosVehiculo($vehiculoId)
    {
        $sql = "SELECT a.id, 
                a.nombre, 
                a.ruta, 
                a.id_tipo_archivo, 
                ta.nombre AS tipo_archivo_nombre
                FROM archivos a
                LEFT JOIN tipos_archivos ta ON a.id_tipo_archivo = ta.id
                WHERE a.id_vehiculo = :vehiculo_id";

        $query = $this->acceso->prepare($sql);
        $query->execute(array(':vehiculo_id' => $vehiculoId));
        $this->objetos = $query->fetchAll();
        return $this->objetos;
    }
    function adjuntar_archivo_pdf($idVehiculo, $idTipoArchivo, $nombre, $ruta)
    {
        // Primero, consulta la base de datos para verificar si ya existe un archivo con el mismo nombre e id_vehiculo
        $sql = "SELECT * FROM archivos WHERE nombre = :nombre AND id_vehiculo = :id_vehiculo";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':nombre' => $nombre, ':id_vehiculo' => $idVehiculo));
        $this->objetos = $query->fetchall();
        if (!empty($this->objetos)) {
            echo 'noadd';
        } else {
            $sql = "INSERT INTO archivos (nombre, id_vehiculo, id_tipo_archivo, ruta) VALUES (:nombre, :id_vehiculo, :id_tipo_archivo, :ruta)";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':nombre' => $nombre, ':id_vehiculo' => $idVehiculo, ':id_tipo_archivo' => $idTipoArchivo, ':ruta' => $ruta));
            return "add";
        }
    }
    function crear_tipos_archivos($nombre_tipo)
    {
        $sql = "SELECT * FROM tipos_archivos where nombre=:nombre";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':nombre' => $nombre_tipo));
        $this->objetos = $query->fetchall();
        if (!empty($this->objetos)) {
            echo 'noadd';
        } else {
            $sql = "INSERT INTO tipos_archivos(nombre) values (:nombre);";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':nombre' => $nombre_tipo));
            echo 'add';
        }
    }
    function rellenar_archivos()
    {
        $sql = "SELECT * FROM tipos_archivos ORDER BY nombre ASC";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }

    function adjuntar_archivo_personal($idPersonal, $idTipoArchivo, $nombre, $ruta)
    {
        $sql = "SELECT id FROM archivos_adjuntos WHERE nombre = :nombre AND id_personal = :id_personal";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':nombre' => $nombre, ':id_personal' => $idPersonal));
        $this->objetos = $query->fetchall();
        if (!empty($this->objetos)) {
            echo 'noadd';
        } else {
            $sql = "INSERT INTO archivos_adjuntos (nombre, id_personal, ruta_archivo, tipo_archivo_id) VALUES (:nombre, :id_personal, :ruta, :id_tipo_archivo)";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':nombre' => $nombre, ':id_personal' => $idPersonal, ':ruta' => $ruta, ':id_tipo_archivo' => $idTipoArchivo));
            return "add";
        }
    }
    function obtenerArchivosPersonal($archivosId)
    {
        $sql = "SELECT a.id, 
                a.nombre, 
                a.ruta_archivo, 
                a.tipo_archivo_id, 
                ta.nombre_tipo AS tipo_archivo_personal
                FROM archivos_adjuntos a
                LEFT JOIN tipos_archivo_personal ta ON a.tipo_archivo_id = ta.id
                WHERE a.id_personal = :id_personal";

        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id_personal' => $archivosId));
        $this->objetos = $query->fetchAll();
        return $this->objetos;
    }
    function rellenar_archivos_personal()
    {
        $sql = "SELECT * FROM tipos_archivo_personal ORDER BY nombre_tipo ASC";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }
    function borrar_archivo($id)
    {
        $sql = "DELETE FROM archivos WHERE id = :id";
        $query = $this->acceso->prepare($sql);

        if ($query->execute(array(':id' => $id))) {
            echo 'borrado';
        } else {
            echo 'noborrado';
        }
    }
    function verificar_archivo_existente_personal($idPersonal, $nombre)
    {
        $sql = "SELECT id FROM archivos_adjuntos WHERE id_personal = :id_personal AND nombre = :nombre";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id_personal' => $idPersonal, ':nombre' => $nombre));
        $archivosExistente = $query->fetch(PDO::FETCH_ASSOC);
        return !empty($archivosExistente);
    }
}
