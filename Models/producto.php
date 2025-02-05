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
        $sql = "SELECT * FROM producto WHERE producto.estado='A' ORDER BY nombre asc";
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
            FROM producto WHERE id=:id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $id));
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }

    /************************************************* */
    function crear($nombre, $descripcion, $codigo, $precio, $stock, $id_proveedor, $id_tipo_producto, $id_lote, $avatar)
    {
        $sql = "SELECT * 
        FROM producto WHERE nombre=:nombre 
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
                $sql = "UPDATE producto SET producto.estado='A' WHERE id=:id";
                $query = $this->acceso->prepare($sql);
                $query->execute(array(':id' => $prod_id));
                echo 'add';
            }
        } else {
            $sql = "INSERT INTO producto(nombre, descripcion, codigo, precio, stock, id_proveedor, id_tipo_producto, id_lote, avatar) 
            VALUES (:nombre, :descripcion, :codigo, :precio, :stock, :id_proveedor, :id_tipo_producto, :id_lote, :avatar)";
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
    function editar($id, $nombre, $descripcion, $codigo, $stock, $precio, $id_proveedor, $id_tipo_producto, $id_lote)
    {
        $sql = "SELECT id 
            FROM producto 
            WHERE id!=:id 
            AND nombre=:nombre";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $id, ':nombre' => $nombre));
        $this->objetos = $query->fetchall();
        if (!empty($this->objetos)) {
            echo 'noedit';
        } else {
            $sql = "UPDATE producto 
            SET nombre=:nombre, 
            descripcion=:descripcion, 
            codigo=:codigo, 
            precio=:precio, 
            stock=:stock, 
            id_proveedor=:id_proveedor,
            id_tipo_producto=:id_tipo_producto,
            id_lote=:id_lote
            WHERE id=:id";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(
                ':id' => $id,
                ':nombre' => $nombre,
                ':descripcion' => $descripcion,
                ':codigo' => $codigo,
                ':precio' => $precio,
                ':stock' => $stock,
                ':id_proveedor' => $id_proveedor,
                ':id_tipo_producto' => $id_tipo_producto,
                ':id_lote' => $id_lote,
            ));
            echo 'edit';
        }
    }
    function buscar()
    {
        if (!empty($_POST['consulta'])) {
            $consulta = $_POST['consulta'];
            $sql = "SELECT producto.id as id_producto, 
           producto.nombre as nombre_producto, 
           descripcion, 
           codigo, 
           precio, 
           stock, 
           t.nombre as tipo, 
           l.nombre as almacen, 
           p.nombre as proveedor, 
           producto.avatar as avatar, 
           id_proveedor, 
           id_tipo_producto, 
           id_lote
           FROM producto 
           JOIN tipos_productos t on id_tipo_producto=t.id
           JOIN lote l on id_lote=l.id 
           JOIN proveedor p on id_proveedor=p.id 
           WHERE producto.estado='A' AND producto.nombre like :consulta limit 25";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':consulta' => "%$consulta%"));
            $this->objetos = $query->fetchall();
            return $this->objetos;
        } else {
            $sql = "SELECT producto.id as id_producto, 
            producto.nombre as nombre_producto, 
            descripcion, 
            codigo, 
            precio, 
            stock, 
            t.nombre as tipo, 
            l.nombre as almacen, 
            p.nombre as proveedor, 
            producto.avatar as avatar, 
            id_proveedor, 
            id_tipo_producto, 
            id_lote
            FROM producto 
            JOIN tipos_productos t on id_tipo_producto=t.id 
            JOIN lote l on id_lote=l.id 
            JOIN proveedor p on id_proveedor=p.id 
            WHERE producto.estado='A' AND producto.nombre not like '' order by producto.nombre limit 25";
            $query = $this->acceso->prepare($sql);
            $query->execute();
            $this->objetos = $query->fetchall();
            return $this->objetos;
        };
    }
    function cambiar_avatar($id, $nombre)
    {
        $sql = "UPDATE producto SET avatar=:nombre WHERE id=:id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $id, ':nombre' => $nombre));
        return $this->objetos;
    }
    function borrar($id)
    {
        $sql = "SELECT * FROM producto WHERE id!=:id AND producto.estado='A'";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $id));
        $lote = $query->fetchall();
        if (!empty($lote)) {
            echo 'noborrado';
        } else {
            $sql = "UPDATE producto SET estado='I' WHERE id=:id";
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
        $sql = "SELECT producto.id, 
            producto.nombre as nombre, 
            descripcion, 
            codigo,
            precio, 
            t.nombre as tipo, 
            c.nombre as categoria
            FROM producto
            JOIN tipo t on id_tipo=t.id AND estado = 'A'
            JOIN categoria c on id_categoria=c.id 
            order by nombre asc";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }
}
