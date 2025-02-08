<?php
include_once '../Models/producto.php';
$producto = new Producto();
if ($_POST['funcion'] == 'obtener_productos') {
    $producto->obtener_productos();
    $json = array();
    foreach ($producto->objetos as $objeto) {
        $producto->obtener_stock($objeto->id_producto);
        $stock = $producto->objetos[0]->total;
        $json[] = array(
            'id' => $objeto->id_producto,
            'nombre' => $objeto->nombre,
            'descripcion' => $objeto->descripcion,
            'codigo' => $objeto->codigo,
            'precio' => $objeto->precio,
            'stock' => $stock,
            'tipo' => $objeto->tipo,
            'proveedor' => $objeto->proveedor,
            'presentacion' => $objeto->presentacion,
            'avatar' => $objeto->avatar,
        );
    }
    $jsonstring = json_encode($json);
    echo $jsonstring;
}
if ($_POST['funcion'] == 'crear') {
    $nombre = $_POST['nombre'];
    $descripcion = $_POST['descripcion'];
    $codigo = $_POST['codigo'];
    $precio = $_POST['precio'];
    $stock = $_POST['stock'];
    $tipo = $_POST['tipo'];
    $proveedor = $_POST['proveedor'];
    $id_lote = $_POST['almacenes'];
    $avatar = 'prod_default.png';
    $producto->crear($nombre, $descripcion, $codigo, $precio, $stock, $proveedor, $tipo, $id_lote, $avatar);
}
if ($_POST['funcion'] == 'editar') {
    $id = $_POST['id'];
    $nombre = $_POST['nombre'];
    $descripcion = $_POST['descripcion'];
    $codigo = $_POST['codigo'];
    $precio = $_POST['precio'];
    $stock = $_POST['stock'];
    $tipo = $_POST['tipo'];
    $proveedor = $_POST['proveedor'];
    $id_lote = $_POST['almacenes'];

    $producto->editar($id, $nombre, $descripcion, $codigo, $precio, $stock, $proveedor, $tipo, $id_lote);
}
if ($_POST['funcion'] == 'buscar') {
    $producto->buscar();
    $json = array();
    foreach ($producto->objetos as $objeto) {

        $json[] = array(
            'id' => $objeto->id_producto,
            'nombre' => $objeto->nombre_producto,
            'descripcion' => $objeto->descripcion,
            'codigo' => $objeto->codigo,
            'precio' => $objeto->precio,
            'stock' => $objeto->stock,
            'tipo' => $objeto->tipo,
            'proveedor' => $objeto->proveedor,
            'almacen' => $objeto->almacen,
            'id_tipo_producto' => $objeto->id_tipo_producto,
            'id_proveedor' => $objeto->id_proveedor,
            'id_lote' => $objeto->id_lote,
            'avatar' => $objeto->avatar,
        );
    }
    $jsonstring = json_encode($json);
    echo $jsonstring;
}
if ($_POST['funcion'] == 'cambiar_avatar') {
    $id = $_POST['id_logo_prod'];
    $avatar = $_POST['avatar'];

    // Verificar si el archivo subido es una imagen válida
    if (($_FILES['photo']['type'] == 'image/jpeg') || ($_FILES['photo']['type'] == 'image/png') || ($_FILES['photo']['type'] == 'image/gif')) {
        // Generar un nombre único para el archivo
        $nombre = uniqid() . '-' . $_FILES['photo']['name'];
        $ruta = '../Util/img/productos/' . $nombre;

        // Mover el archivo subido a la ruta especificada
        move_uploaded_file($_FILES['photo']['tmp_name'], $ruta);

        // Actualizar el avatar en la base de datos
        $producto->cambiar_avatar($id, $nombre);

        // Verificar si el avatar anterior no es el predeterminado y si existe antes de eliminarlo
        if ($avatar != '../Util/img/productos/prod_default.png' && file_exists($avatar)) {
            unlink($avatar); // Eliminar el archivo antiguo
        }

        // Preparar la respuesta JSON
        $json = array();
        $json[] = array(
            'ruta' => $ruta,
            'alert' => 'edit'
        );
        $jsonstring = json_encode($json[0]);
        echo $jsonstring;
    } else {
        // Si el archivo no es una imagen válida, devolver un error
        $json = array();
        $json[] = array(
            'alert' => 'noedit'
        );
        $jsonstring = json_encode($json[0]);
        echo $jsonstring;
    }
}
if ($_POST['funcion'] == 'borrar') {
    $id = $_POST['id'];
    $producto->borrar($id);
}
if ($_POST['funcion'] == 'buscar_id') {
    $id = $_POST['id_producto'];
    $producto->buscar_id($id);
    $json = array();
    foreach ($producto->objetos as $objeto) {
        $producto->obtener_stock($objeto->id_producto);
        foreach ($producto->objetos as $obj) {
            $total = $obj->total;
        };
        $json[] = array(
            'id' => $objeto->id_producto,
            'nombre' => $objeto->nombre,
            'descripcion' => $objeto->descripcion,
            'codigo' => $objeto->codigo,
            'precio' => $objeto->precio,
            'stock' => $total,
            'tipo' => $objeto->tipo,
            'proveedor' => $objeto->proveedor,
            'presentacion' => $objeto->presentacion,
            'tipo_id' => $objeto->prod_tip,
            'proveedor_id' => $objeto->prod_prov,
            'presentacion_id' => $objeto->prod_pre,
            'avatar' => '../img/prod' . $objeto->avatar,
        );
    }
    $jsonstring = json_encode($json[0]);
    echo $jsonstring;
}
if ($_POST['funcion'] == 'verificar_stock') {
    $error = 0;
    $productos = json_decode($_POST['productos']);
    foreach ($productos as $objeto) {
        $producto->obtener_stock($objeto->id);

        foreach ($producto->objetos as $obj) {
            $total = $obj->total;
        }
        if ($total >= $objeto->cantidad && $objeto->cantidad > 0) {
            $error = $error + 0;
        } else {
            $error = $error + 1;
        }
    }
    echo $error;
}
if ($_POST['funcion'] == 'rellenar_productos') {
    $producto->rellenar_productos();
    $json = array();
    foreach ($producto->objetos as $objeto) {
        $json[] = array(
            'nombre' => $objeto->id_producto . ' | ' . $objeto->nombre . ' | ' . $objeto->tipo . ' | ' . $objeto->proveedor
        );
    }
    $jsonstring = json_encode($json);
    echo $jsonstring;
}
if ($_POST['funcion'] == 'traer_productos') {
    $html = "";
    $productos = json_decode($_POST['productos']);
    foreach ($productos as $resultado) {
        $producto->buscar_id($resultado->id);
        foreach ($producto->objetos as $objeto) {
            if ($resultado->cantidad == '') {
                $resultadoCantidad = 0;
            } else {
                $resultadoCantidad = $resultado->cantidad;
            }
            $subtotal = $objeto->precio * $resultadoCantidad;
            $producto->obtener_stock($objeto->id_producto);
            foreach ($producto->objetos as $obj) {
                $stock = $obj->total;
            }
            $html .= "<tr prodId='$objeto->id_producto' prodPrecio='$objeto->precio'>
            <td>$objeto->nombre</td>
            <td>$stock</td>
            <td>$objeto->precio</td>
            <td>$objeto->codigo</td>
            <td>$objeto->descripcion</td>
            <td>$objeto->tipo</td>
            <td>$objeto->presentacion</td>
            <td>
                <input type='number' min='1' class='form-control cantidad_producto' value='$resultado->cantidad'>
            </td>
            <td class='subtotales'>
                <h5>$subtotal</h5>
            </td>
            <td><button class='borrar-producto btn btn-danger'><i class='fas fa-times-circle'></i></button></td>
    </tr>
    ";
        }
    }
    echo $html;
}
