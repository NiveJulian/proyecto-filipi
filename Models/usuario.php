<?php
include_once '../Models/conexion.php';
class Usuario
{
    var $acceso;
    var $objetos;
    public function __construct()
    {
        $db = new Conexion();
        $this->acceso = $db->pdo;
    }
    function login($dni)
    {
        $sql = "SELECT 
                u.id as id,
                u.nombre as nombre,
                u.apellido as apellido,
                u.dni as dni,
                u.id_tipo as id_tipo,
                u.contrasena as contrasena,
                t.nombre as tipo,
                u.avatar as avatar,
                u.correo as correo,
                u.telefono as telefono,
                u.localidad as localidad,
                u.adicional as adicional,
                u.sexo as sexo,
                u.edad as edad,
                c.id as company_id,
                c.name as company_name,
                c.logo as company_logo,
                c.address as company_address,
                c.token as company_token,
                c.email as company_email,
                c.cuit as company_cuit,
                c.locality as company_locality
                FROM usuario u
                JOIN tipo_usuario t ON u.id_tipo = t.id
                LEFT JOIN company c ON u.id_company = c.id -- Relación con company
                WHERE u.dni = :dni";
        $variables = array(':dni' => $dni);
        $query = $this->acceso->prepare($sql);
        $query->execute($variables);
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }

    function buscar()
    {
        if (!empty($_POST['consulta'])) {
            $consulta = $_POST['consulta'];
            $sql = "SELECT 
           u.id id_usuario,
           u.nombre names,
           apellido,
           dni,
           correo,
           telefono,
           contrasena,
           avatar,
           t.nombre as nombre_tipo,
           t.id tipos
           FROM usuario u
           JOIN tipo_usuario t on id_tipo=t.id
           WHERE u.nombre LIKE :consulta";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':consulta' => "%$consulta%"));
            $this->objetos = $query->fetchall();
            return $this->objetos;
        } else {
            $sql = "SELECT 
            u.id id_usuario,
            u.nombre names,
            apellido,
            dni,
            telefono,
            correo,
            contrasena,
            avatar,
            t.nombre as nombre_tipo,
            t.id tipos
            FROM usuario u
            JOIN tipo_usuario t on id_tipo=t.id
            WHERE u.nombre NOT LIKE '' ORDER BY id_usuario LIMIT 15";
            $query = $this->acceso->prepare($sql);
            $query->execute();
            $this->objetos = $query->fetchall();
            return $this->objetos;
        }
    }

    function obtener_datos($id)
    {
        $sql = "SELECT 
            u.nombre as nombre,
            apellido,
            dni,
            correo,
            contrasena,
            t.nombre as nombre_tipo,
            t.id id_usuario
            FROM usuario u
            join tipo_usuario t on u.id_tipo=t.id and u.id=:id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $id));
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }

    function editar($id_usuario, $telefono, $localidad, $correo, $sexo, $adicional)
    {
        $sql = "SELECT id FROM usuario WHERE id != :id AND (telefono = :telefono)";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $id_usuario, ':telefono' => $telefono));

        $this->objetos = $query->fetchall();
        if (!empty($this->objetos)) {
            echo "noeditado";
        } else {
            $sql = "UPDATE usuario 
                SET 
                telefono=:telefono, 
                localidad=:localidad, 
                correo=:correo, 
                sexo=:sexo, 
                adicional=:adicional
                WHERE id=:id";

            $query = $this->acceso->prepare($sql);
            $query->execute(array(
                ':id' => $id_usuario,
                ':telefono' => $telefono,
                ':localidad' => $localidad,
                ':correo' => $correo,
                ':sexo' => $sexo,
                ':adicional' => $adicional
            ));

            echo 'editado';
        }
    }

    function editarCompany($id_usuario, $name, $address, $email, $cuit, $locality)
    {
        try {
            // Validar que ningún campo esté vacío
            if (empty($id_usuario) || empty($name) || empty($address) || empty($email) || empty($cuit) || empty($locality)) {
                throw new Exception("Todos los campos son obligatorios.");
            }

            // Validar formato de email
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                throw new Exception("El correo electrónico no es válido.");
            }

            // Consulta SQL para actualizar la empresa
            $sql = "UPDATE company 
                    SET 
                        name = :name, 
                        address = :address, 
                        email = :email, 
                        cuit = :cuit, 
                        locality = :locality
                    WHERE id = :id";

            // Preparar la consulta
            $query = $this->acceso->prepare($sql);

            // Ejecutar la consulta con los parámetros
            $resultado = $query->execute(array(
                ':id' => $id_usuario,
                ':name' => $name,
                ':address' => $address,
                ':email' => $email,
                ':cuit' => $cuit,
                ':locality' => $locality
            ));

            if ($resultado) {
                echo 'editado';
            } else {
                echo "noeditado";
            }
        } catch (Exception $e) {
            // Manejar errores
            error_log("Error en editarCompany: " . $e->getMessage());
            echo "error"; // Devuelve un mensaje de error al frontend
        }
    }

    function cambiar_contra($id_usuario, $newpass, $oldpass)
    {
        $sql = "SELECT * FROM usuario 
        WHERE id!=:id AND contrasena = :oldpass";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $id_usuario, ':oldpass' => $oldpass));
        $this->objetos = $query->fetchall();
        if (!empty($this->objetos)) {
            echo 'noupdate';
            return $this->objetos;
        } else {
            $sql = "UPDATE usuario SET contrasena=:newpass WHERE id=:id";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':id' => $id_usuario, ':newpass' => $newpass));
            echo 'update';
            return $this->objetos;
        }
    }

    function cambiar_photo($id_usuario, $nombre)
    {

        $sql = "SELECT avatar FROM usuario WHERE id = :id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $id_usuario));
        $usuario = $query->fetch(PDO::FETCH_ASSOC);

        if ($usuario) {

            $sql = "UPDATE usuario SET avatar = :nombre WHERE id = :id";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':id' => $id_usuario, ':nombre' => $nombre));


            return $usuario['avatar'];
        } else {

            return false;
        }
    }

    function crear($nombre, $apellido, $dni, $correo, $telefono, $pass, $avatar, $tipo)
    {
        $sql = "SELECT id FROM usuario WHERE dni=:dni";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':dni' => $dni));
        $this->objetos = $query->fetchall();
        if (!empty($this->objetos)) {
            echo 'noadd';
        } else {
            $sql = "INSERT INTO usuario(nombre,apellido,dni,correo,telefono,contrasena,avatar,id_tipo) VALUES (:nombre,:apellido,:dni,:correo,:telefono,:pass,:avatar,:tipo)";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':nombre' => $nombre, ':apellido' => $apellido, ':dni' => $dni, ':correo' => $correo, ':telefono' => $telefono, ':pass' => $pass, ':avatar' => $avatar, ':tipo' => $tipo));
            echo 'add';
        }
    }

    function ascender($pass, $id_ascendido, $id_usuario)
    {
        $sql = "SELECT id_usuario FROM usuario WHERE id_usuario=:id_usuario and contrasena=:pass";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id_usuario' => $id_usuario, ':pass' => $pass));
        $this->objetos = $query->fetchall();
        if (!empty($this->objetos)) {
            $tipo = 1;
            $sql = "UPDATE usuario SET us_tipo=:tipo WHERE id_usuario=:id";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':id' => $id_ascendido, ':tipo' => $tipo));
            $this->objetos = $query->fetchall();
            echo 'ascendido';
        } else {
            echo 'noascendido';
        }
    }

    function descender($pass, $id_descendido, $id_usuario)
    {
        $sql = "SELECT id_usuario FROM usuario WHERE id_usuario=:id_usuario and contrasena=:pass";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id_usuario' => $id_usuario, ':pass' => $pass));
        $this->objetos = $query->fetchall();
        if (!empty($this->objetos)) {
            $tipo = 2;
            $sql = "UPDATE usuario SET us_tipo=:tipo WHERE id_usuario=:id";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':id' => $id_descendido, ':tipo' => $tipo));
            $this->objetos = $query->fetchall();
            echo 'descendido';
        } else {
            echo 'nodescendido';
        }
    }

    function borrar($pass, $id_borrado)
    {
        $sql = "SELECT id, contrasena FROM usuario 
        WHERE id=:id_usuario and contrasena=:pass";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id_usuario' => $id_borrado, ':pass' => $pass));
        $this->objetos = $query->fetchall();

        if (!empty($this->objetos)) {
            $sql = "DELETE FROM usuario WHERE id=:id";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':id' => $id_borrado));
            $this->objetos = $query->fetchall();
            echo 'borrado';
        } else {
            echo 'noborrado';
        }
    }

    function crearRol($nombre, $modulos)
    {
        $sql = "INSERT INTO tipo_usuario (nombre) VALUES (:nombre)";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':nombre' => $nombre));
        $tipo_usuario_id = $this->acceso->lastInsertId();


        foreach ($modulos as $modulo) {
            $sql = "INSERT INTO permisos (tipo_usuario_id, modulo) VALUES (:tipo_usuario_id, :modulo)";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':tipo_usuario_id' => $tipo_usuario_id, ':modulo' => $modulo));
        }

        echo json_encode(["status" => "success", "message" => "Rol creado correctamente"]);
    }

    function rellenar_roles()
    {
        $sql = "SELECT * FROM tipo_usuario";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }

    function obtenerPermisos($tipo_usuario_id)
    {
        $sql = "SELECT modulo FROM permisos WHERE tipo_usuario_id = :tipo_usuario_id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':tipo_usuario_id' => $tipo_usuario_id));
        $permisos = $query->fetchAll(PDO::FETCH_COLUMN);

        echo json_encode($permisos);
    }
}
