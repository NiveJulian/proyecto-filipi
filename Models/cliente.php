<?php
include_once '../Models/conexion.php';
include_once '../Util/config/config.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../vendor/autoload.php';

class Cliente
{
    var $acceso;
    var $objetos;
    public function __construct()
    {
        $db = new Conexion();
        $this->acceso = $db->pdo;
    }

    function buscarClientes($term)
    {
        $sql = "SELECT id, razon_social, cuit, email, direccion 
                FROM cliente 
                WHERE cuit LIKE :term OR razon_social LIKE :term";
        $stmt = $this->acceso->prepare($sql);
        $stmt->execute([':term' => "%$term%"]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    function buscar()
    {
        if (!empty($_POST['consulta'])) {
            $consulta = $_POST['consulta'];
            $sql = "SELECT id,
            nombre,
            telefono,
            direccion,
            razon_social,
            cuit,
            condicion_iva,
            avatar 
            FROM cliente WHERE estado='A' and nombre LIKE :consulta limit 20";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':consulta' => "%$consulta%"));
            $this->objetos = $query->fetchall();
            return $this->objetos;
        } else {
            $sql = "SELECT id,
             nombre,
             telefono,
             direccion,
             razon_social,
             cuit,
             condicion_iva,
             avatar FROM cliente WHERE estado='A' and nombre NOT LIKE '' ORDER BY id desc LIMIT 20";
            $query = $this->acceso->prepare($sql);
            $query->execute();
            $this->objetos = $query->fetchall();
            return $this->objetos;
        };
    }

    function obtener_clientes()
    {
        $sql = "SELECT * FROM cliente";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }

    function obtener_clientes_id($cuit)
    {
        $sql = "SELECT * FROM cliente WHERE cuit = :cuit";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':cuit' => $cuit));
        $this->objetos = $query->fetchall();
        if (!empty($this->objetos)) {
            echo json_encode(['alert' => 'isvalid']);
        } else {
            echo json_encode(['alert' => 'novalid']);
        }
    }

    function enviar_codigo_otp($cuit)
    {
        // Verificar si el CUIT existe
        $sql = "SELECT * FROM cliente WHERE cuit = :cuit";
        $query = $this->acceso->prepare($sql);
        $query->execute([':cuit' => $cuit]);
        $cliente = $query->fetch(PDO::FETCH_ASSOC);

        if (!$cliente) {
            echo json_encode(["error" => "CUIT no encontrado"]);
            return;
        }

        // Generar código OTP y fecha de expiración
        $codigo = rand(100000, 999999);
        $expiracion = date("Y-m-d H:i:s", strtotime("+10 minutes"));

        // Guardar en la base de datos
        $sql = "INSERT INTO otp_codes (cuit, code, expires_at) VALUES (:cuit, :code, :expires_at)";
        $query = $this->acceso->prepare($sql);
        $query->execute([
            ':cuit' => $cuit,
            ':code' => $codigo,
            ':expires_at' => $expiracion
        ]);

        // Cargar la plantilla HTML
        $template = file_get_contents('../Util/email/email_code_template.html'); // Ruta al archivo HTML
        $template = str_replace('{{codigo}}', $codigo, $template); // Reemplazar el marcador de posición

        // Configuración de PHPMailer
        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = 'techwebstudio.business@gmail.com'; // Cambia esto
            $mail->Password   = 'pzac uvzi olkw ouzb'; // Cambia esto o usa una clave de aplicación
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = 587;

            $mail->CharSet = 'UTF-8'; // Establecer la codificación de caracteres
            $mail->Encoding = 'base64'; // Codificación del contenido (opcional, pero recomendado)

            $mail->setFrom('techwebstudio.business@gmail.com', 'Nexus software');
            $mail->addAddress($cliente['email']); // Usa el email del cliente desde la base de datos
            $mail->Subject = 'Tu Código de Acceso';
            $mail->isHTML(true); // Indicar que el correo es HTML
            $mail->Body    = $template; // Usar la plantilla HTML como cuerpo del correo

            $mail->send();
            echo json_encode(["success" => "Código enviado, revise su correo por favor"]);
        } catch (Exception $e) {
            echo json_encode(["error" => "Error al enviar el correo: " . $mail->ErrorInfo]);
        }
    }

    function validar_codigo_otp($cuit, $codigo)
    {
        // Verificar si el código es válido y aún no ha expirado
        $sql = "SELECT * FROM otp_codes WHERE cuit = :cuit AND code = :code AND expires_at > NOW()";
        $query = $this->acceso->prepare($sql);
        $query->execute([
            ':cuit' => $cuit,
            ':code' => $codigo
        ]);
        $otp = $query->fetch(PDO::FETCH_ASSOC);

        if ($otp) {
            // Buscar el ID del cliente en la base de datos
            $sql_cliente = "SELECT * FROM cliente WHERE cuit = :cuit";
            $query_cliente = $this->acceso->prepare($sql_cliente);
            $query_cliente->execute([':cuit' => $cuit]);
            $cliente = $query_cliente->fetch(PDO::FETCH_ASSOC);

            if ($cliente) {
                // Encriptar el ID del cliente
                $id_encriptado = encrypt($cliente['id']);

                // Devolver un array con ambos conjuntos de datos
                return [
                    "json" => json_encode([
                        "success" => "Código válido",
                        "cliente_id" => $id_encriptado
                    ]),
                    "cliente" => $cliente,
                    "otp" => $otp
                ];
            } else {
                return [
                    "json" => json_encode(["error" => "Cliente no encontrado"])
                ];
            }
        } else {
            return [
                "json" => json_encode(["error" => "Código inválido o expirado"])
            ];
        }
    }

    function crear($nombre, $direccion, $email, $telefono, $cuit, $razonsocial, $condicion_iva, $avatar)
    {
        $sql = "SELECT id,estado FROM cliente 
        WHERE nombre=:nombre 
        AND telefono=:telefono 
        AND direccion=:direccion 
        AND razon_social=:razon_social
        AND cuit=:cuit
        AND condicion_iva=:condicion_iva
        AND email=:email 
        ";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(
            ':nombre' => $nombre,
            ':telefono' => $telefono,
            ':cuit' => $cuit,
            ':direccion' => $direccion,
            ':razon_social' => $razonsocial,
            ':condicion_iva' => $condicion_iva,
            ':email' => $email
        ));
        $this->objetos = $query->fetchall();
        if (!empty($this->objetos)) {
            echo 'noadd';
        } else {
            $sql = "INSERT INTO cliente(nombre,telefono,direccion, razon_social, cuit, condicion_iva,avatar, email) values (:nombre, :telefono, :direccion, :razon_social, :cuit, :condicion_iva, :avatar, :email);";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(
                ':nombre' => $nombre,
                ':telefono' => $telefono,
                ':cuit' => $cuit,
                ':direccion' => $direccion,
                ':razon_social' => $razonsocial,
                ':condicion_iva' => $condicion_iva,
                ':avatar' => $avatar,
                ':email' => $email
            ));
            echo 'add';
        }
    }

    function editar($id, $nombre, $direccion, $telefono, $cuit, $razonsocial, $condicion_iva, $email)
    {
        $sql = "SELECT id FROM cliente WHERE id != :id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $id));
        $this->objetos = $query->fetchall();
        if (!empty($this->objetos)) {
            echo 'noedit';
        } else {
            $sql = "UPDATE cliente 
            SET nombre=:nombre, 
            telefono=:telefono, 
            direccion=:direccion, 
            cuit=:cuit, 
            razon_social=:razon_social, 
            condicion_iva=:condicion_iva,
            email=:email
            WHERE id=:id";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(
                ':id' => $id,
                ':nombre' => $nombre,
                ':telefono' => $telefono,
                ':cuit' => $cuit,
                ':direccion' => $direccion,
                ':razon_social' => $razonsocial,
                ':condicion_iva' => $condicion_iva,
                ':email' => $email
            ));
            echo 'edit';
        }
    }

    function borrar($id)
    {
        $sql = "DELETE FROM cliente WHERE id=:id";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':id' => $id));
        if (!empty($query->execute(array(':id' => $id)))) {
            echo 'borrado';
        } else {
            echo 'noborrado';
        }
    }

    function rellenar_clientes()
    {
        $sql = "SELECT * FROM cliente ORDER BY nombre ASC";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }
}
