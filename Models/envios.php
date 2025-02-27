<?php
include_once '../Models/conexion.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../vendor/autoload.php';

class Envio
{
    var $acceso;
    var $objetos;
    public function __construct()
    {
        $db = new Conexion();
        $this->acceso = $db->pdo;
    }

    function obtener_todos_envios()
    {
        $sql = "SELECT e.*,
                       e.id as id_envio,
                       v.codigo AS vehiculo_codigo,
                       v.vehiculo AS vehiculo_nombre,
                       p.nombre AS chofer_nombre,
                       c.nombre AS cliente_nombre,
                       c.razon_social AS cliente_razon_social,
                       es.nombre AS estado_envio
                FROM envios e
                JOIN vehiculos v ON e.vehiculo_id = v.id
                JOIN personal p ON e.personal_id = p.id
                JOIN cliente c ON e.cliente_id = c.id
                JOIN envios_estados es ON e.estado_id = es.id
                ORDER BY e.created_at DESC";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }
    function obtener_envios_cliente($cliente_id)
    {
        $sql = "SELECT e.*,
                       e.id as id_envio,
                       v.codigo AS vehiculo_codigo,
                       v.vehiculo AS vehiculo_nombre,
                       p.nombre AS chofer_nombre,
                       c.nombre AS cliente_nombre,
                       c.razon_social AS cliente_razon_social,
                       es.nombre AS estado_envio
                FROM envios e
                JOIN vehiculos v ON e.vehiculo_id = v.id
                JOIN personal p ON e.personal_id = p.id
                JOIN cliente c ON e.cliente_id = c.id
                JOIN envios_estados es ON e.estado_id = es.id
                WHERE e.cliente_id = :cliente_id
                ORDER BY e.created_at DESC";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':cliente_id' => $cliente_id));
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }

    function verificar_archivo_existente($idEnvio, $url_documento)
    {
        $sql = "SELECT id FROM envios_documentos WHERE envio_id = :envio_id AND url_documento = :url_documento";
        $query = $this->acceso->prepare($sql);
        $query->execute([
            ':envio_id' => $idEnvio,
            ':url_documento' => $url_documento
        ]);
        return $query->fetch(PDO::FETCH_ASSOC) !== false;
    }

    function adjuntar_archivo_pdf($envio_id, $tipo_documento, $url_documento)
    {
        $sql = "INSERT INTO envios_documentos (envio_id, tipo_documento, url_documento) VALUES (:envio_id, :tipo_documento, :url_documento)";
        $query = $this->acceso->prepare($sql);
        return $query->execute([
            ':envio_id' => $envio_id,
            ':tipo_documento' => $tipo_documento,
            ':url_documento' => $url_documento
        ]);
    }

    function crearEnvio($vehiculo_id, $chofer_id, $cliente_id, $estado_id, $lugar_salida, $destino, $peso, $precio, $numero_despacho)
    {
        $tracking_uid = uniqid();
        $sql = "SELECT id FROM envios WHERE numero_despacho = :numero_despacho
        AND tracking_uid = :tracking_uid";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':numero_despacho' => $numero_despacho, ':tracking_uid' => $tracking_uid));
        $this->objetos = $query->fetchAll();
        if (!empty($this->objetos)) {
            echo json_encode(["status" => "error", "message" => "Error al crear el envio, es posible que ya exista"]);
        } else {
            $sql = "INSERT INTO envios (vehiculo_id, personal_id, cliente_id, estado_id, lugar_salida, destino, peso, precio, numero_despacho, tracking_uid) 
                VALUES (:vehiculo_id, :personal_id, :cliente_id, :estado_id, :lugar_salida, :destino, :peso, :precio, :numero_despacho, :tracking_uid)";
            $query = $this->acceso->prepare($sql);
            $query->execute([
                ':vehiculo_id' => $vehiculo_id,
                ':personal_id' => $chofer_id,
                ':cliente_id' => $cliente_id,
                ':estado_id' => $estado_id,
                ':lugar_salida' => $lugar_salida,
                ':destino' => $destino,
                ':peso' => $peso,
                ':precio' => $precio,
                ':numero_despacho' => $numero_despacho,
                ':tracking_uid' => $tracking_uid,
            ]);

            $sqlCliente = "SELECT * FROM cliente WHERE id = :id";
            $queryCliente = $this->acceso->prepare($sqlCliente);
            $queryCliente->execute([':id' => $cliente_id]);
            $cliente = $queryCliente->fetch(PDO::FETCH_ASSOC);

            if (!$cliente) {
                echo json_encode(["error" => "CUIT no encontrado"]);
                return;
            }


            $template = file_get_contents('../Util/email/email_login_template.html');
            $template = str_replace('{{name}}', $cliente['nombre'], $template);
            $template = str_replace('{{cuit}}', $cliente['cuit'], $template);


            $mail = new PHPMailer(true);
            try {
                $mail->isSMTP();
                $mail->Host       = 'smtp.gmail.com';
                $mail->SMTPAuth   = true;
                $mail->Username   = 'techwebstudio.business@gmail.com';
                $mail->Password   = 'pzac uvzi olkw ouzb';
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port       = 587;

                $mail->CharSet = 'UTF-8';
                $mail->Encoding = 'base64';

                $mail->setFrom('techwebstudio.business@gmail.com', 'Nexus software');
                $mail->addAddress($cliente['email']);
                $mail->Subject = 'Tu envio está en proceso! - Ingresa a verlo';
                $mail->isHTML(true);
                $mail->Body    = $template;

                $mail->send();
                echo json_encode(["status" => "success", "message" => "Envio creado correctamente, hemos notificado al cliente"]);
            } catch (Exception $e) {
                echo json_encode(["error" => "Error al enviar el correo: " . $mail->ErrorInfo]);
            }
        }
    }

    function CambiarEstadoEnvio($id, $estado_id)
    {
        $sql = "UPDATE envios
                SET estado_id = :estado_id
                WHERE id = :id";

        $query = $this->acceso->prepare($sql);
        $query->execute(array(
            ':id' => $id,
            ':estado_id' => $estado_id,
        ));


        $sqlEnvio = "SELECT * FROM envios WHERE id = :id";
        $queryEnvio = $this->acceso->prepare($sqlEnvio);
        $queryEnvio->execute([':id' => $id]);
        $envio = $queryEnvio->fetch(PDO::FETCH_ASSOC);

        $sqlCliente = "SELECT * FROM cliente WHERE id = :id";
        $queryCliente = $this->acceso->prepare($sqlCliente);
        $queryCliente->execute([':id' => $envio['cliente_id']]);
        $cliente = $queryCliente->fetch(PDO::FETCH_ASSOC);

        if (!$cliente) {
            echo json_encode(["error" => "CUIT no encontrado"]);
            return;
        }


        $template = file_get_contents('../Util/email/email_state_template.html');
        $template = str_replace('{{numero_despacho}}', $envio['numero_despacho'], $template);


        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = 'techwebstudio.business@gmail.com';
            $mail->Password   = 'pzac uvzi olkw ouzb';
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = 587;

            $mail->CharSet = 'UTF-8';
            $mail->Encoding = 'base64';

            $mail->setFrom('techwebstudio.business@gmail.com', 'Nexus software');
            $mail->addAddress($cliente['email']);
            $mail->Subject = 'Tu envío cambió de estado! - Ingresá a verlo';
            $mail->isHTML(true);
            $mail->Body    = $template;

            $mail->send();
            echo json_encode(["status" => "success", "message" => "Estado editado correctamente, hemos notificado al cliente"]);
        } catch (Exception $e) {
            echo json_encode(["error" => "Error al enviar el correo: " . $mail->ErrorInfo]);
        }
    }

    function CrearEstadoEnvio($id, $nombre)
    {
        $sql = "SELECT id FROM envios_estados 
        where nombre=:nombre";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':nombre' => $nombre,));
        $this->objetos = $query->fetchall();
        if (!empty($this->objetos)) {
            echo json_encode(["status" => "error", "message" => "Error al crear el estado, es posible que ya exista"]);
        } else {
            $sql = "INSERT INTO envios_estados(nombre) values (:nombre);";
            $query = $this->acceso->prepare($sql);
            $query->execute(array(':nombre' => $nombre));
            echo json_encode(["status" => "success", "message" => "Estado creado correctamente"]);

            if ($id) {
                $sql = "SELECT id FROM envios_estados 
                    WHERE id != :id
                    AND (nombre = :nombre)";

                $query = $this->acceso->prepare($sql);
                $query->execute(array(
                    ':id' => $id,
                    ':nombre' => $nombre
                ));

                $this->objetos = $query->fetchall();
                if (!empty($this->objetos)) {
                    echo json_encode(["status" => "error", "message" => "Estado no editado"]);
                } else {

                    $sql = "UPDATE envios_estados 
                        SET nombre = :nombre,
                        WHERE id = :id";

                    $query = $this->acceso->prepare($sql);
                    $query->execute(array(
                        ':id' => $id,
                        ':nombre' => $nombre,
                    ));
                    echo json_encode(["status" => "success", "message" => "Estado editado correctamente"]);
                }
            }
        }
    }

    function obtener_documentos($envioId)
    {
        $sql = "SELECT * FROM envios_documentos WHERE envio_id = :envioId ORDER BY id ASC";
        $query = $this->acceso->prepare($sql);
        $query->execute(array(':envioId' => $envioId));
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }

    function rellenarEstadoEnvio()
    {
        $sql = "SELECT * FROM envios_estados ORDER BY nombre ASC";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $this->objetos = $query->fetchall();
        return $this->objetos;
    }
}
