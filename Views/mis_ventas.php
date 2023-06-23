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


 