<?php
include_once '../Models/conexion.php';
class Producto
{
    var $acceso;
    var $objetos;
    public function __construct()
    {
        $db = new Conexion();
        $this->acceso = $db->pdo;
    }
    function obtener_productos()
    {
        $sql = "SELECT * FROM productos WHERE estado='A' ORDER BY nombre asc";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }
    function obtener_stock($id)
    {
        $sql = "SELECT SUM(cantidad_lote) as total FROM lote WHERE id=:id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $id));
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }
    function buscar_id($id)
    {
        $sql = "SELECT id,
            nombre,
            codigo,
            precio
            FROM productos WHERE id=:id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $id));
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }

    /************************************************* */
    function crear($nombre, $descripcion, $codigo, $stock, $precio, $id_proveedor, $id_tipo_producto, $id_lote, $avatar)
    {
        $sql = "SELECT * 
        FROM productos WHERE nombre=:nombre 
        AND descripcion=:descripcion 
        AND codigo=:codigo 
        AND precio=:precio
        AND stock=:stock
        AND id_proveedor=:id_proveedor 
        AND id_tipo_producto=:id_tipo_producto 
        AND id_lote=:id_lote";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(
            ':nombre' => $nombre,
            ':descripcion' => $descripcion,
            ':codigo' => $codigo,
            ':precio' => $precio,
            ':stock' => $stock,
            ':id_proveedor' => $id_proveedor,
            ':id_tipo_producto' => $id_tipo_producto,
            ':id_lote' => $id_lote,
        ));
        $this->objetos = $query->fetchall();
        if (!empty($this->objetos)) {
            foreach ($this->objetos as $prod) {
                $prod_id = $prod->id;
                $prod_estado = $prod->estado;
            }
            if ($prod_estado == 'A') {
                echo 'noadd';
            } else {
                $sql = "UPDATE productos SET estado='A' WHERE id=:id";
                $query = $this->acceso->prepare($sql);
                $query->execute(array(':id' => $prod_id));
                echo 'add';
            }
        } else {
            $sql = "INSERT INTO productos(nombre, descripcion, codigo, precio, stock, id_proveedor, id_tipo_producto, id_lote, avatar) VALUES (:nombre, :descripcion, :codigo, :precio, :stock, :id_proveedor, :id_tipo_producto, :id_lote, :avatar)";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(
                ':nombre' => $nombre,
                ':descripcion' => $descripcion,
                ':codigo' => $codigo,
                ':precio' => $precio,
                ':stock' => $stock,
                ':id_proveedor' => $id_proveedor,
                ':id_tipo_producto' => $id_tipo_producto,
                ':id_lote' => $id_lote,
                ':avatar' => $avatar
            ));
            echo 'add';
        }
    }
    function editar($id, $nombre, $descripcion, $precio, $codigo, $tipo, $categoria)
    {
        $sql = "SELECT id 
            FROM productos 
            WHERE id!=:id 
            AND nombre=:nombre
            AND descripcion=:descripcion 
            AND codigo=:codigo
            AND precio=:precio 
            AND id_tipo=:tipo
            AND id_categoria=:categoria";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $id, ':nombre' => $nombre, ':descripcion' => $descripcion, ':codigo' => $codigo, ':precio' => $precio, ':tipo' => $tipo, ':categoria' => $categoria));
        $this->objetos = $query->fetchall();
        if (!empty($this->objetos)) {
            echo 'noedit';
        } else {
            $sql = "UPDATE productos 
            SET nombre=:nombre, 
            descripcion=:descripcion, 
            codigo=:codigo, 
            precio=:precio, 
            id_tipo=:tipo,
            id_categoria=:categoria WHERE id=:id";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':id' => $id, ':nombre' => $nombre, ':descripcion' => $descripcion, ':codigo' => $codigo, ':precio' => $precio, ':tipo' => $tipo, ':categoria' => $categoria));
            echo 'edit';
        }
    }
    function buscar()
    {
        if (!empty($_POST['consulta'])) {
            $consulta = $_POST['consulta'];
            $sql = "SELECT productos.id, 
           productos.nombre as nombre, 
           descripcion, 
           codigo, 
           precio, 
           t.nombre as tipo, 
           c.nombre as categoria, 
           productos.avatar as avatar, 
           id_tipo, 
           id_categoria
           FROM productos 
           JOIN tipo t on id_tipo=t.id AND estado = 'A'
           JOIN categoria c on id_categoria=c.id 
           WHERE estado='A' AND productos.nombre like :consulta limit 25";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':consulta' => "%$consulta%"));
            $this->objetos = $query->fetchall();
            return $this->objetos;
        } else {
            $sql = "SELECT productos.id, 
            productos.nombre as nombre, 
            descripcion, 
            codigo, 
            precio, 
            t.nombre as tipo, 
            c.nombre as categoria, 
            productos.avatar as avatar, 
            id_tipo, 
            id_categoria
            FROM productos 
            JOIN tipo t on id_tipo=t.id AND estado = 'A'
            JOIN categoria c on id_categoria=c.id 
            WHERE estado='A' AND productos.nombre not like '' order by productos.nombre limit 25";
            $query = $this->acceso->prepare($sql);
            $query->execute();
            $this->objetos = $query->fetchall();
            return $this->objetos;
        };
    }
    function cambiar_avatar($id, $nombre)
    {
        $sql = "UPDATE productos SET avatar=:nombre WHERE id=:id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $id, ':nombre' => $nombre));
        return $this->objetos;
    }
    function borrar($id)
    {
        $sql = "SELECT * FROM lote WHERE id=:id AND estado='A'";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $id));
        $lote = $query->fetchall();
        if (!empty($lote)) {
            echo 'noborrado';
        } else {
            $sql = "UPDATE productos SET estado='I' WHERE id=:id";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':id' => $id));
            if (!empty($query->execute(array(':id' => $id)))) {
                echo 'borrado';
            } else {
                echo 'noborrado';
            }
        }
    }
    function rellenar_productos()
    {
        $sql = "SELECT productos.id, 
            productos.nombre as nombre, 
            descripcion, 
            codigo,
            precio, 
            t.nombre as tipo, 
            c.nombre as categoria
            FROM productos
            JOIN tipo t on id_tipo=t.id AND estado = 'A'
            JOIN categoria c on id_categoria=c.id 
            order by nombre asc";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }
}
