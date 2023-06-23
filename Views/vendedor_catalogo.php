<?php 
session_start();
if($_SESSION['us_tipo']==2) {
require_once "layouts/parte_superior.php";
?>
<title>Admin | Catalogo</title>
<!-- Inicio del cont principal -->
<div class="content-wrapper">
    <section class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1>Catalogo</h1>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="../vistas/adm_catalogo.php">Home</a></li>
                        <li class="breadcrumb-item active">Catalogo</li>
                    </ol>
                </div>
            </div>
        </div>
    </section>
    <section>
        <div class="container-fluid">
            <div class="card card-success">
                    <div class="card-header">
                        <h4 class="card-title">Buscar producto</h4>
                            <div class="input-group">
                                <input id="buscar-producto" type="text" class="form-control float-left" placeholder="Ingresar Nombre">
                                <div class="input-group-append">
                                    <button class="btn btn-default"><i class="fas fa-search"></i></button>
                                </div>
                            </div>
                    </div>
                    <div class="card-body p-0 m-2">
                        <div class="row d-flex alingn-items-stretch" id="productos">
                            
                        </div>
                    </div>
                    <div class="card-footer"></div>
                </div>
            </div>
        </div>
    </section>
</div>
<!-- Fin del cont principal -->

<?php
require_once "layouts/parte_inferior.php";
}
else{
	header('Location: ../index.php');
}
?>
<script src="../js/Carrito.js"></script>
<script src="../js/Catalogo.js"></script>

<script src="../js/select2.js"></script>
