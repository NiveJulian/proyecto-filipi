<?php 
require_once '../vendor/autoload.php';
require_once '../modelo/pdf.php';
$id_venta = $_POST['id'];
$html = getHtml($id_venta);
$css = file_get_contents("../css/pdf.css");
$mpdf=new \Mpdf\Mpdf();

$mpdf->writeHTML($css, \Mpdf\HTMLParserMode::HEADER_CSS);
$mpdf->writeHTML($html, \Mpdf\HTMLParserMode::HTML_BODY);


$mpdf->output("../pdf/pdf-".$id_venta.".pdf", "F");
