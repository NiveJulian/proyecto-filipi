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
        // Validar que los datos no estén vacíos
        if (empty($nombre) || empty($codigo)) {
            echo "Error: Datos inválidos";
            return;
        }

        // Corregir la consulta SQL
        $sql = "SELECT id, estado FROM producto WHERE nombre = :nombre OR codigo = :codigo";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(
            ':nombre' => $nombre,
            ':codigo' => $codigo
        ));
        $this->objetos = $query->fetchAll();

        if (!empty($this->objetos)) {
            foreach ($this->objetos as $prod) {
                $prod_id = $prod->id;
                $prod_estado = isset($prod->estado) ? $prod->estado : 'A'; // Evita error si 'estado' no existe
            }

            if ($prod_estado == 'A') {
                echo 'noadd';
            } else {
                $sql = "UPDATE producto SET estado='A' WHERE id=:id";
                $query = $this->acceso->prepare($sql);
                $query->execute(array(':id' => $prod_id));
                echo 'add';
            }
        } else {
            // Insertar nuevo producto
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

    function editar($id, $nombre, $descripcion, $codigo, $precio, $stock, $id_proveedor, $id_tipo_producto, $id_lote)
    {
        // Verificar si otro producto tiene el mismo nombre o código
        $sql = "SELECT id FROM producto WHERE (nombre = :nombre OR codigo = :codigo) AND id != :id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $id, ':nombre' => $nombre, ':codigo' => $codigo));
        $this->objetos = $query->fetchAll();

        if (!empty($this->objetos)) {
            echo 'noedit'; // Indica que ya existe otro producto con el mismo nombre o código
        } else {
            // Proceder con la actualización
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

            // Verificar si se actualizó algún registro
            if ($query->rowCount() > 0) {
                echo 'edit'; // Indica que la edición fue exitosa
            } else {
                echo 'nochange'; // Indica que no se realizaron cambios en el producto
            }
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
        // Verificar si el producto existe y está activo
        $sql = "SELECT id FROM producto WHERE id = :id AND estado = 'A'";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $id));
        $producto = $query->fetch();

        if ($producto) {
            // Realizar el borrado lógico
            $sql = "UPDATE producto SET estado = 'I' WHERE id = :id";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':id' => $id));

            if ($query->rowCount() > 0) {
                echo 'borrado';
            } else {
                echo 'noborrado';
            }
        } else {
            echo 'noborrado';
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
