
<?php
session_start();

if($_SESSION['us_tipo']==1 || $_SESSION['us_tipo']==3 || $_SESSION['us_tipo']==2) {
    require_once "layouts/parte_superior.php";
?>
<title>Admin | Gestion Ventas</title>
<div class="modal fade" id="vista_venta" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="card card-success">
                <div class="card-header">
                    <h3 class="card-title">Venta</h3>
                        <button data-dismiss="modal" aria-label="close" class="close">
                            <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="card-body">
                    <div class="form-group">
                        <label for="codigo_venta"><b>Codigo Venta:</b> </label>
                        <span id="codigo_venta"></span>
                    </div>
                    <div class="form-group">
                        <label for="fecha"><b>Fecha:</b> </label>
                        <span id="fecha"></span>
                    </div>
                    <div class="form-group">
                        <label for="cliente"><b> Cliente:</b> </label>
                        <span id="cliente"></span>
                    </div>
                    <div class="form-group">
                        <label for="firma"><b>Firma:</b> </label>
                        <span id="firma"></span>
                    </div>
                    <div class="form-group">
                        <label for="vendedor"><b>Vendedor:</b> </label>
                        <span id="vendedor"></span>
                    </div>
                    <table class="table table-hover">
                        <thead class="table-success">
                            <tr>
                                <th>Cantidad</th>
                                <th>Precio</th>
                                <th>Producto</th>
                                <th>Descripcion</th>
                                <th>Codigo</th>
                                <th>Presentacion</th>
                                <th>Tipo</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody class="table-warning table-nowrap" id="registros">

                        </tbody>
                    </table>
                    <div class="float-right input-group-append">
                        <h3 class="m-3">Total: </h3>
                        <h3 class="m-3" id="total"></h3>
                    </div>
                </div>
                <div class="card-footer">
                        <button type="button" data-dismiss="modal" class="btn btn-outline-secondary float-right m-1">Cerrar</button>
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
                    <h1>Gestion Ventas</h1>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="../vistas/adm_catalogo.php">Home</a></li>
                        <li class="breadcrumb-item active">Gestion Ventas</li>
                    </ol>
                </div>
            </div>
        </div>
    </section>
    <section>
        <div class="container-fluid">
            <div class="card card-success">
                    <div class="card-header">
                        <h4 class="card-title">Buscar Ventas</h4>
                            
                    </div>
                   
                    <div class="card-body">
                        <table id="tabla_venta" class="display table table-hover text-nowrap" style="width:100%">
                            <thead>
                                <tr>
                                    <th>#N°</th>
                                    <th>Fecha</th>
                                    <th>Cliente</th>
                                    <th>Firma</th>
                                    <th>Total</th>
                                    <th>Vendedor</th>
                                    <th>Accion</th>
                                </tr>
                            </thead>
                            
                            <tbody>
                                
                            </tbody>
                        </table>
                    </div>
                    <div class="card-footer"></div>
            </div>
        </div>
    </section>
</div>




<!-- Fin del cont principal -->






<!-- select 2 -->
<?php 
require_once "layouts/parte_inferior.php";
?>

<script src="../js/datatables.js"></script>
<script src="../js/Ventas.js"></script>
<?php 
}
else{
	header('Location: ../index.php');
}?>