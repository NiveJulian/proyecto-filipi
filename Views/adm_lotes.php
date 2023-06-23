
<?php 
session_start();
if($_SESSION['us_tipo']==1 || $_SESSION['us_tipo']==2 || $_SESSION['us_tipo']==3) {
?>
<title>Admin | Gestion Stock</title>
<?php
require_once "layouts/parte_superior.php";
?>
<div class="modal fade" id="crear-lote" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="card card-success">
                <div class="card-header">
                    <h3 class="card-title">Crear Lote</h3>
                        <button data-dismiss="modal" aria-label="close" class="close">
                            <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="card-body">
                    <div class="aler alert-success text-center" id="add-lote" style="display:none;">
                        <span><i class="fas fa-check m-1"></i>Se agrego correctamente</span>
                    </div>
                    <div class="alert alert-danger text-center" id="noadd-lote" style="display:none;">
                        <span><i class="fas fa-times m-1"></i>No se pudo agregar correctamente</span>
                    </div>
                    <form id="form-crear-lote">
                        <div class="form-group">
                            <label for="nombre_producto_lote">Producto: </label>
                            <label id="nombre_producto_lote">Nombre del producto</label>
                        </div>
                        <div class="form-group">
                        <label for="lote-proveedor">Proveedor</label>
                        <select name="lote-proveedor" id="lote-proveedor" class="form-control select2" style="width:100%;"></select>
                        </div>
                        <div class="form-group">
                            <label for="stock">Stock: </label>
                            <input type="number" name="stock" id="stock" class="form-control" placeholder="Ingrese stock">
                        </div>
                        <div class="form-group">
                            <label for="recibido">Fecha de recibido</label>
                            <input type="date" class="form-control" id="recibido" placeholder="Ingresar recibido">
                        </div>
                        <input type="hidden" id="id_lote_prov">
                       
                </div>
                <div class="card-footer">
                        <button type="submit" class="btn btn-primary float-right m-1">Guardar</button>
                        <button type="button" data-dismiss="modal" class="btn btn-outline-secondary float-right m-1">Cerrar</button>
                        </form>
                </div> 
            </div>
        </div>
    </div>
</div>

<!-- Inicio del cont principal -->
<div class="content-wrapper">
    <section class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1>Gestion Stock</h1>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="../vistas/adm_catalogo.php">Home</a></li>
                        <li class="breadcrumb-item active">Gestion Stock</li>
                    </ol>
                </div>
            </div>
        </div>
    </section>
    <section>
        <div class="container-fluid">
            <div class="card card-success">
                    <div class="card-header">
                        <h4 class="card-title">Buscar lotes</h4>
                            <div class="input-group">
                                <input id="buscar-lote" type="text" class="form-control float-left" placeholder="Ingresar nombre de producto">
                                <div class="input-group-append">
                                    <button class="btn btn-default"><i class="fas fa-search"></i></button>
                                </div>
                            </div>
                    </div>
                    <div class="card-body p-0 m-2">
                        <div class="row d-flex alingn-items-stretch" id="lote">
                            
                        </div>
                    </div>
                    <div class="card-footer"></div>
                </div>
            </div>
        </div>
    </section>
</div>




<!-- Fin del cont principal -->






<!-- select 2 -->
<?php 
require_once "layouts/parte_inferior.php";
?>
<script src="../js/lote.js"></script>
<?php 
}
else{
	header('Location: ../index.php');
}?>
