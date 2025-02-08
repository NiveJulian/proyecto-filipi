<?php
include_once '../Models/conexion.php';

class Lote
{
    var $acceso;
    var $objetos;

    public function __construct()
    {
        $db = new Conexion();
        $this->acceso = $db->pdo;
    }

    // Crear un nuevo almacén
    function crear($nombre, $ubicacion, $tipo_producto, $estado)
    {
        $sql = "SELECT COUNT(*) FROM lote WHERE nombre = :nombre";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':nombre' => $nombre));
        $count = $query->fetchColumn();

        if ($count > 0) {
            return ["success" => false, "message" => "Error: El nombre del almacén ya existe."];
        }

        $sql = "INSERT INTO lote (nombre, ubicacion, tipo_producto, estado) VALUES (:nombre, :ubicacion, :tipo_producto, :estado)";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':nombre' => $nombre, ':ubicacion' => $ubicacion, ':tipo_producto' => $tipo_producto, ':estado' => $estado));

        return ["success" => true, "message" => "Almacén creado correctamente."];
    }

    function crear_tipo_producto($nombre)
    {
        // Verificar si el tipo de producto ya existe
        $sql = "SELECT COUNT(*) FROM tipos_productos WHERE nombre = :nombre";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':nombre' => $nombre));
        $count = $query->fetchColumn(); // Obtener la cantidad de registros encontrados

        if ($count > 0) {
            echo 'Error nombre existente';
            return;
        }

        // Insertar si no existe
        $sql = "INSERT INTO tipos_productos (nombre) VALUES (:nombre)";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':nombre' => $nombre));

        echo 'add';
    }

    // Editar un lote existente con validación de nombre duplicado
    function editar($id, $nombre, $ubicacion, $tipo_producto, $estado)
    {
        // Verificar si el nombre ya existe en otro lote (excluyendo el actual)
        $sql = "SELECT COUNT(*) FROM lote WHERE nombre = :nombre AND id != :id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':nombre' => $nombre, ':id' => $id));
        $count = $query->fetchColumn();

        if ($count > 0) {
            return ["success" => false, "message" => "Error: El nombre del almacén ya existe."];
        }

        // Actualizar si no hay duplicados
        $sql = "UPDATE lote SET nombre = :nombre, ubicacion = :ubicacion, tipo_producto = :tipo_producto, estado = :estado WHERE id = :id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $id, ':nombre' => $nombre, ':ubicacion' => $ubicacion, ':tipo_producto' => $tipo_producto, ':estado' => $estado));

        return ["success" => true, "message" => "Almacén editado correctamente."];
    }


    // Eliminar un almacén
    function eliminar($id)
    {
        $sql = "DELETE FROM lote WHERE id = :id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $id));
        echo 'delete';
    }

    // Listar todos los lote
    function listar()
    {
        $sql = "SELECT 
                    a.id, 
                    a.nombre, 
                    a.ubicacion, 
                    t.nombre AS tipo_producto, 
                    a.estado, 
                    COUNT(p.id) AS cantidad_productos
                FROM lote a
                JOIN tipos_productos t ON a.tipo_producto = t.id
                LEFT JOIN producto p ON a.id = p.id_lote
                GROUP BY a.id, a.nombre, a.ubicacion, t.nombre, a.estado";

        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchAll();
        return $this->objetos;
    }

    function listarProductosPorAlmacen($idAlmacen)
    {
        $sql = "SELECT 
                    p.id, 
                    p.nombre, 
                    p.descripcion, 
                    p.codigo, 
                    p.precio,
                    p.stock
                FROM producto p 
                WHERE p.id_lote = :idAlmacen";

        $query = $this->acceso->prepare($sql);
        $query->execute(array(':idAlmacen' => $idAlmacen));
        $this->objetos = $query->fetchAll();
        return $this->objetos;
    }


    function obtenerPorId($id)
    {
        $sql = "SELECT * FROM lote WHERE id=:id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $id));
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }

    // Habilitar o deshabilitar el ingreso de productos a un almacén
    function toggleHabilitado($id, $estado)
    {
        $sql = "UPDATE lote SET estado = :estado WHERE id = :id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $id, ':estado' => $estado));
        echo $estado == 'activo' ? 'habilitado' : 'deshabilitado';
    }

    function rellenar_tipo_producto()
    {
        $sql = "SELECT * FROM tipos_productos ORDER BY nombre DESC";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }
    // Habilitar o deshabilitar el ingreso de productos a un almacén
}
