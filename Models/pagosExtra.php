<?php
include_once $_SERVER["DOCUMENT_ROOT"].'/filippi/Models/conexion.php';

class PagosExtra{
    var $objetos;
    public function __construct(){
        $db= new Conexion();
        $this->acceso= $db->pdo;
    }

    function actualizarValorPredeterminadoVianda($valor_vianda) {
        // Modificar la definición de la tabla para cambiar el valor predeterminado
        $sqlAlterTable = "ALTER TABLE pagos_extras MODIFY COLUMN viandas_valor_predeterminado DECIMAL(10,2) DEFAULT :valor_vianda";
        $query = $this->acceso->prepare($sqlAlterTable);
        $query->bindParam(':valor_vianda', $valor_vianda, PDO::PARAM_STR);
        return $query->execute();
    }
    
    
    function obtener_valor_predeterminado() {
        $sql = "SELECT COALESCE(MAX(viandas_valor_predeterminado), 1200) AS valor_predeterminado FROM pagos_extras";
        $query = $this->acceso->prepare($sql);
        $query->execute();
        $valor_predeterminado = $query->fetchColumn();
        return $valor_predeterminado;
    }
    
    
    
}

?>