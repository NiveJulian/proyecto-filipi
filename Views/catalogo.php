<?php
session_start();
include_once $_SERVER["DOCUMENT_ROOT"].'/gasolero/Views/layouts/header.php';
?>
<style>
.table_scroll{
  overflow: scroll;
  height: 400px;
  overflow-x: hidden;
}
#carrito_compras{
  padding: 0px !important;
  margin: 0px !important;
}
</style>
<title>Catalogo | GAS</title>
<div class="modal fade" id="abrirCarrito" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Carrito</h5>
      </div>
      <div class="modal-body p-0 table_scroll">
        <form action="">
        <div class="form-group m-1">
            <label for="cliente">Cliente</label>
            <input type="text" id="cliente" class="form-control" placeholder="Ingrese nombre del cliente" required>
        </div>
        <div class="form-group m-1">
            <label for="direccion">Direccion</label>
            <input type="text" id="direccion" class="form-control" placeholder="Ingrese direccion del cliente" required>
        </div>
        
        <table id="carrito_compras" class="table table-borderless table-secondary">
          <thead class="bg-success">
            <tr>
              <th>Productos</th>
            </tr>
          </thead>
          <tbody>

          </tbody>
        </table>
        
        <div class="form-group m-1">
          <div class="info-box-content">             
            <span class="info-box-text">Subtotal: $</span>
            <span class="info-box-text text-left" id="subtotal"></span>
          </div>
        </div>
        <div class="form-group m-1">
          <div class="info-box-content">
            <span class="info-box-text">IVA: $</span>
            <span class="info-box-number"id="con_iva"></span>
          </div>
        </div>
        <div class="form-group m-1">
          <div class="info-box-content">
              <span class="info-box-text text-left ">TOTAL: $</span>
              <span class="info-box-number" id="total"></span>
          </div>
        </div>
        </form>
      </div>
      
      <div class="modal-footer">
        <button type="button" title="Salir" class="btn btn-outline-secondary btn-circle btn-lg" data-dismiss="modal"><i class="fas fa-sign-out-alt"></i></button>
        <button type="button" title="Vaciar Carrito" class="vaciar-carrito btn btn-outline-danger btn-circle btn-lg"><i class="far fa-trash-alt"></i></button>
        <button type="button" title="Confirmar" id="procesar-compra" class="btn btn-outline-success btn-circle btn-lg"><i class="fas fa-check"></i></button>
      </div>
    </div>
  </div>
</div>
<div class="content-wrapper" style="min-height: 2838.44px;">
  <section class="content-header">
    <div class="container-fluid">
      <div class="row mb-2">
        <div class="col-sm-6">
          <h1>Catalogo</h1>
        </div>
        <div class="col-sm-6">
          <ol class="breadcrumb float-sm-right">
            <li class="breadcrumb-item"><a href="#">Inicio</a></li>
            <li class="breadcrumb-item active">Catalogo</li>
          </ol>
        </div>
      </div>
    </div>
  </section>
  <section class="content">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Productos</h3>
      </div>
      <div class="card-body">
        <table id="productos" class="table table-hover">
            <thead class="table-success">
                <tr>
                  <th class="text-center">Productos</th>
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
    <script src="/gasolero/Views/Catalogo.js"></script>


 