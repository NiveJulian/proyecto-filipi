<?php
session_start();
include_once $_SERVER["DOCUMENT_ROOT"].'/gasolero/Views/layouts/header.php';
?>
<title>Mis Ventas | GAS</title>
<div class="content-wrapper" style="min-height: 2838.44px;">
  <section class="content-header">
    <div class="container-fluid">
      <div class="row mb-2">
        <div class="col-sm-6">
          <h1>Controla tu stock</h1>
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
        <h3 class="card-title">Tu Stock<span class="badge badge-secondary ml-1 text-center">Nuevo</span></h3>
      </div>
      <div class="card-body text-center">
        <h3>Desarrollando</h3>

        <h5 class=" m-2">Aca se vas a poder controlar el stock de cada producto</h5>
        <h6 class=" m-2">Con las siguientes alertas </h6>
            <span class="badge badge-danger ml-1 text-center">Sin Stock</span>
            <span class="badge badge-warning ml-1 text-center">Poco Stock</span>
            <span class="badge badge-success ml-1 text-center">Con Stock</span>
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
<script src="/gasolero/Views/lote.js"></script>


 