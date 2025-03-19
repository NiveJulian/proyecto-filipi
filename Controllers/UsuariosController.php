<?php
session_start();
include_once '../Models/usuario.php';
include_once '../Util/config/config.php';
include_once '../Models/cliente.php';
require '../vendor/autoload.php'; // Cargar la librería JWT
use Firebase\JWT\JWT;

$cliente = new Cliente();

$usuario = new Usuario();

if ($_POST['funcion'] == 'verificar_sesion') {
    try {
        if (!empty($_SESSION['id'])) {
            $json = array(
                'id' => $_SESSION['id'],
                'nombre' => $_SESSION['nombre'],
                'apellido' => $_SESSION['apellido'],
                'dni' => $_SESSION['dni'],
                'id_tipo' => $_SESSION['id_tipo'],
                'tipo' => $_SESSION['tipo'],
                'avatar' => $_SESSION['avatar'],
                'sexo' => $_SESSION['sexo'],
                'telefono' => $_SESSION['telefono'],
                'correo' => $_SESSION['correo'],
                'localidad' => $_SESSION['localidad'],
                'adicional' => $_SESSION['adicional'],
                'edad' => $_SESSION['edad'],
                'company_id' => $_SESSION['company_id'],
                'company_name' => $_SESSION['company_name'],
                'company_logo' => $_SESSION['company_logo'],
                'company_address' => $_SESSION['company_address'],
                'company_email' => $_SESSION['company_email'],
                'company_cuit' => $_SESSION['company_cuit'],
                'company_billing' => $_SESSION['company_billing'],
                'company_locality' => $_SESSION['company_locality'],
                'token' => $_SESSION['token']
            );
        } else {
            $json = array();
        }
        echo json_encode($json);
    } catch (Throwable $th) {
        http_response_code(500);
        echo json_encode(['error' => $th->getMessage()]);
    }
} else if ($_POST['funcion'] == 'login') {
    $dni = $_POST['dni'];
    $pass = $_POST['pass'];
    $usuario->login($dni);
    $mensaje = '';
    if (!empty($usuario->objetos)) {
        $contrasena = $usuario->objetos[0]->contrasena;
        if ($pass == $contrasena) {
            $_SESSION['id'] = $usuario->objetos[0]->id;
            $_SESSION['nombre'] = $usuario->objetos[0]->nombre;
            $_SESSION['apellido'] = $usuario->objetos[0]->apellido;
            $_SESSION['dni'] = $usuario->objetos[0]->dni;
            $_SESSION['id_tipo'] = $usuario->objetos[0]->id_tipo;
            $_SESSION['tipo'] = $usuario->objetos[0]->tipo;
            $_SESSION['avatar'] = $usuario->objetos[0]->avatar;
            $_SESSION['sexo'] = $usuario->objetos[0]->sexo;
            $_SESSION['correo'] = $usuario->objetos[0]->correo;
            $_SESSION['adicional'] = $usuario->objetos[0]->adicional;
            $_SESSION['localidad'] = $usuario->objetos[0]->localidad;
            $_SESSION['telefono'] = $usuario->objetos[0]->telefono;
            $_SESSION['edad'] = $usuario->objetos[0]->edad;
            $_SESSION['company_id'] = $usuario->objetos[0]->company_id;
            $_SESSION['company_name'] = $usuario->objetos[0]->company_name;
            $_SESSION['company_logo'] = $usuario->objetos[0]->company_logo;
            $_SESSION['company_address'] = $usuario->objetos[0]->company_address;
            $_SESSION['company_email'] = $usuario->objetos[0]->company_email;
            $_SESSION['company_cuit'] = $usuario->objetos[0]->company_cuit;
            $_SESSION['company_billing'] = $usuario->objetos[0]->company_billing;
            $_SESSION['company_locality'] = $usuario->objetos[0]->company_locality;

            $isAdmin = $usuario->objetos[0]->tipo === 'admin' ? true : false;
            $key = '/y2bJaOcRUtW4IUWSp1coFFgJkPtyVboR4J+EwhH+TE=';
            $tokenData = array(
                "sub" => $usuario->objetos[0]->id,
                "username" => $usuario->objetos[0]->nombre,
                "companyToken" => $usuario->objetos[0]->company_token,
                "isAdmin" => $isAdmin
            );
            $token = JWT::encode($tokenData, $key, 'HS256');

            $_SESSION['token'] = $token;

            $mensaje = 'success';
        } else {
            $mensaje = 'error';
        }
    } else {
        $mensaje = 'error';
    }
    // echo $dni.' '.$pass;
    $json = array(
        'mensaje' => $mensaje
    );
    $jsonstring = json_encode($json);
    echo $jsonstring;
}
if ($_POST['funcion'] == 'validar_codigo') {
    $cuit = $_POST['cuit'];
    $codigo = $_POST['codigo'];
    $resultado = $cliente->validar_codigo_otp($cuit, $codigo);

    // Decodificar el JSON para verificar si hubo un error
    $respuesta = json_decode($resultado['json'], true);

    if (isset($respuesta['success'])) {
        // Si el código OTP es válido, crear una sesión temporal para el cliente
        $_SESSION['cliente_temp'] = $resultado['cliente'];
        $_SESSION['otp_temp'] = $resultado['otp'];

        // También puedes almacenar el ID encriptado en la sesión si lo necesitas
        $_SESSION['cliente_temp_id'] = $respuesta['cliente_id'];

        echo $resultado['json'];
    } else {
        echo $resultado['json'];
    }
}
if ($_POST['funcion'] == 'verificar_sesion_temp') {
    try {
        if (!empty($_SESSION['cliente_temp'])) {
            $json = array(
                'cliente' => $_SESSION['cliente_temp'],
                'otp' => $_SESSION['otp_temp']
            );
        } else {
            $json = array();
        }
        echo json_encode($json);
    } catch (Throwable $th) {
        http_response_code(500);
        echo json_encode(['error' => $th->getMessage()]);
    }
}
if ($_POST['funcion'] == 'crear_rol') {
    $nombre_rol = $_POST['nombre_rol'];
    $modulos = $_POST['modulos'];
    if (empty($nombre_rol) || empty($modulos)) {
        echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
        exit;
    }
    $usuario->crearRol($nombre_rol, $modulos);
}
if ($_POST['funcion'] == 'obtener_permisos') {
    $rol_id = $_POST['rol_id'];
    $usuario->obtenerPermisos($rol_id);
}
/***********************************/
if ($_POST['funcion'] == 'rellenar_roles') {
    $usuario->rellenar_roles();
    $json = array();
    foreach ($usuario->objetos as $objeto) {
        $json[] = array(
            'id' => $objeto->id,
            'nombre' => $objeto->nombre,
        );
    };
    $jsonstring = json_encode($json);
    echo $jsonstring;
}
if ($_POST['funcion'] == 'crear_usuario') {
    $nombre = $_POST['nombre'];
    $apellido = $_POST['apellido'];
    $telefono = $_POST['telefono'];
    $correo = $_POST['correo'];
    $dni = $_POST['dni'];
    $pass = $_POST['pass'];
    $tipo = $_POST['tipo'];
    $avatar = 'user_default.png';
    $usuario->crear($nombre, $apellido, $dni, $correo, $telefono, $pass, $avatar, $tipo);
}
if ($_POST['funcion'] == 'buscar_usuario') {
    $json = array();
    $fecha_actual = new DateTime();
    $usuario->obtener_datos($_POST['dato']);

    foreach ($usuario->objetos as $objeto) {
        $nacimiento = new DateTime($objeto->edad_us);
        $edad = $nacimiento->diff($fecha_actual);
        $edad_years = $edad->y;
        $json[] = array(
            'nombre' => $objeto->nombre,
            'apellido' => $objeto->apellido,
            'edad' => $edad_years,
            'dni' => $objeto->dni,
            'tipo' => $objeto->nombre_tipo,
            'telefono' => $objeto->telefono,
            'correo' => $objeto->correo,
            'avatar' => '../img/' . $objeto->avatar
        );
    }
    $jsonstring = json_encode($json[0]);
    echo $jsonstring;
}
if ($_POST['funcion'] == 'buscar_usuarios_adm') {
    $json = array();
    $fecha_actual = new DateTime();
    $usuario->buscar();
    foreach ($usuario->objetos as $objeto) {
        $json[] = array(
            'id' => $objeto->id_usuario,
            'nombre' => $objeto->names,
            'apellido' => $objeto->apellido,
            'dni' => $objeto->dni,
            'telefono' => $objeto->telefono,
            'tipo' => $objeto->nombre_tipo,
            'correo' => $objeto->correo,
            'avatar' => '../Util/img/' . $objeto->avatar,
            'tipo_usuario' => $objeto->tipos
        );
    }
    $jsonstring = json_encode($json);
    echo $jsonstring;
}
if ($_POST['funcion'] == 'capturar_datos') {
    $json = array();
    $id_usuario = $_POST['id_usuario'];
    $usuario->obtener_datos($id_usuario);
    foreach ($usuario->objetos as $objeto) {
        $json[] = array(
            'telefono' => $objeto->telefono_us,
            'localidad' => $objeto->localidad_us,
            'correo' => $objeto->correo_us,
            'sexo' => $objeto->sexo_us,
            'adicional' => $objeto->adicional_us
        );
    }
    $jsonstring = json_encode($json[0]);
    echo $jsonstring;
}
if ($_POST['funcion'] == 'editar_usuario') {
    $id_usuario = $_POST['id_usuario'];
    $telefono = $_POST['telefono'];
    $localidad = $_POST['localidad'];
    $correo = $_POST['correo'];
    $sexo = $_POST['sexo'];
    $adicional = $_POST['adicional'];
    $usuario->editar($id_usuario, $telefono, $localidad, $correo, $sexo, $adicional);
} else
if ($_POST['funcion'] == 'editar_compania') {
    $id_usuario = $_POST['id_usuario'];
    $name = $_POST['name'];
    $cuit = $_POST['cuit'];
    $address = $_POST['address'];
    $email = $_POST['email'];
    $locality = $_POST['locality'];

    // Validar datos antes de pasarlos al modelo
    if (empty($id_usuario) || empty($name) || empty($cuit) || empty($address) || empty($email) || empty($locality)) {
        echo "Campos incompletos";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Correo electrónico no válido";
    } else {
        $usuario->editarCompany($id_usuario, $name, $address, $email, $cuit, $locality);
    }
}
if ($_POST['funcion'] == 'cambiar_contra') {
    $id_usuario = $_POST['id_usuario'];
    $oldpass = $_POST['oldpass'];
    $newpass = $_POST['newpass'];
    $usuario->cambiar_contra($id_usuario, $newpass, $oldpass);
}
if ($_POST['funcion'] == 'cambiar_foto') {
    $id_usuario = $_POST['id_user_profile'];

    // Verificar el tipo de archivo
    if (($_FILES['photo']['type'] == 'image/jpeg') || ($_FILES['photo']['type'] == 'image/png') || ($_FILES['photo']['type'] == 'image/gif')) {
        // Generar un nombre único para el archivo
        $nombre = uniqid() . '-' . $_FILES['photo']['name'];
        $ruta = '../Util/img/' . $nombre;

        // Mover el archivo subido a la ruta especificada
        move_uploaded_file($_FILES['photo']['tmp_name'], $ruta);

        // Cambiar la foto en la base de datos y obtener el avatar anterior
        $avatar_anterior = $usuario->cambiar_photo($id_usuario, $nombre);

        // Si existe un avatar anterior, eliminarlo
        if ($avatar_anterior && file_exists('../Util/img/' . $avatar_anterior)) {
            unlink('../Util/img/' . $avatar_anterior);
        }

        // Devolver una respuesta JSON
        $json = array(
            'ruta' => $ruta,
            'alert' => 'edit'
        );
        echo json_encode($json);
    } else {
        // Si el tipo de archivo no es válido, devolver un error
        $json = array(
            'alert' => 'noedit'
        );
        echo json_encode($json);
    }
}

if ($_POST['funcion'] == 'cambiar_logo_company') {
    $id_usuario = $_POST['id_company_profile'];

    // Verificar el tipo de archivo
    if (($_FILES['photo']['type'] == 'image/jpeg') || ($_FILES['photo']['type'] == 'image/png') || ($_FILES['photo']['type'] == 'image/gif')) {
        // Generar un nombre único para el archivo
        $nombre = uniqid() . '-' . $_FILES['photo']['name'];
        $ruta = '../Util/img/' . $nombre;

        // Mover el archivo subido a la ruta especificada
        move_uploaded_file($_FILES['photo']['tmp_name'], $ruta);

        // Cambiar la foto en la base de datos y obtener el avatar anterior
        $avatar_anterior = $usuario->cambiar_logo_company($id_usuario, $nombre);

        // Si existe un avatar anterior, eliminarlo
        if ($avatar_anterior && file_exists('../Util/img/' . $avatar_anterior)) {
            unlink('../Util/img/' . $avatar_anterior);
        }

        // Devolver una respuesta JSON
        $json = array(
            'ruta' => $ruta,
            'alert' => 'edit'
        );
        echo json_encode($json);
    } else {
        // Si el tipo de archivo no es válido, devolver un error
        $json = array(
            'alert' => 'noedit'
        );
        echo json_encode($json);
    }
}
if ($_POST['funcion'] == 'ascender') {
    $pass = $_POST['pass'];
    $id_ascendido = $_POST['id_usuario'];
    $usuario->ascender($pass, $id_ascendido, $id_usuario);
}
if ($_POST['funcion'] == 'descender') {
    $pass = $_POST['pass'];
    $id_descendido = $_POST['id_usuario'];
    $usuario->descender($pass, $id_descendido, $id_usuario);
}
if ($_POST['funcion'] == 'borrar_usuario') {
    $pass = $_POST['pass'];
    $id_borrado = $_POST['id_usuario'];
    $usuario->borrar($pass, $id_borrado);
}
