<?php
session_start();
include_once $_SERVER["DOCUMENT_ROOT"].'/gasolero/Views/layouts/header.php';
?>
<title>Mis Ventas | GAS</title>
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
                        <label for="direccion"><b>Direccion:</b> </label>
                        <span id="direccion"></span>
                    </div>
                    <table id="registros" class="table table-hover text-center text-nowrap">
                        <thead class="table-success">
                            <tr>
                                <th>Datos</th>
                            </tr>
                        </thead>
                        <tbody class="table-warning table-nowrap" >

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
<div class="content-wrapper" style="min-height: 2838.44px;">
  <section class="content-header">
    <div class="container-fluid">
      <div class="row mb-2">
        <div class="col-sm-6">
          <h1>Mis ventas</h1>
        </div>
        <div class="col-sm-6">
          <ol class="breadcrumb float-sm-right">
            <li class="breadcrumb-item"><a href="#">Inicio</a></li>
            <li class="breadcrumb-item active">Ventas</li>
          </ol>
        </div>
      </div>
    </div>
  </section>
  <section class="content">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Mis Ventas</h3>
      </div>
      <div class="card-body">
        <table class="table table-hover" id="listar_ventas">
            <thead class="table-info">
                <tr>
                  <th class="text-center">Mis ventas</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
      </div>
      <div class="card-footer">
        Busque los productos para agregar al carrito.
      </div>
    </div>
  </section>
</div>
<?php 
    include_once $_SERVER["DOCUMENT_ROOT"]."/gasolero/Views/layouts/footer.php";
?>
<script src="/gasolero/Views/misventas.js"></script>


 