<?php 
session_start();
include_once '../Views/layouts/header.php';
?>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../Util/css/sorteo_print.css">
<title>Admin | Gestion compras</title>
<div class="content-wrapper">
    <section class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1>Gestion rifa</h1>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="../Views/catalogo.php">Inicio</a></li>
                        <li class="breadcrumb-item active">Gestion compras</li>
                    </ol>
                </div>
            </div>
        </div>
    </section>
    <section>
        <div class="container-fluid">
            <div class="card card-secondary">
                <div class="card-header">
                    <h4 class="card-title">Crear rifa</h4>
                </div>
                <div class="card-body p-4 text-center">
                    <div class="form-group">
                        <label for="rangoNumeracionInicio">Rango de Numeración (Inicio):</label>
                        <input type="number" class="form-control text-center" id="rangoNumeracionInicio" name="rangoNumeracionInicio" min="1" value="1">
                    </div>

                    <div class="form-group mt-1">
                        <label for="rangoNumeracionFin">Rango de Numeración (Fin):</label>
                        <input type="number" class="form-control text-center" id="rangoNumeracionFin" name="rangoNumeracionFin" min="1" value="1">
                    </div>
                    
                </div>
                <div class="card-footer">
                <button id="generarPdfBtn" class="btn btn-success">Generar PDF</button>

                </div>
            </div>
        </div>
    </section>
<?php
include_once $_SERVER["DOCUMENT_ROOT"]."../Views/layouts/footer.php";
?>
<script src="../Views/rifa.js"></script>
