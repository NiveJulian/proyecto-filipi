<?php
session_start();
include_once './layouts/header.php';
?>
<title>Panel de Control</title>

<div class="content-wrapper" style="min-height: 2838.44px;">
  <section class="content-header">
    <div class="container-fluid">
      <div class="row mb-2">
        <div class="col-sm-6">
          <h1>Calculos Mensuales Recibidos</h1>
        </div>
        <div class="col-sm-6">
          <ol class="breadcrumb float-sm-right">
            <li class="breadcrumb-item"><a href="../Views/facturacion-recibido.php">Volver</a></li>
            <li class="breadcrumb-item active">Calculos Mensuales</li>
          </ol>
        </div>
      </div>
    </div>
  </section>
  <section class="content" id="content_admin">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12 card-notification" id="card_catalogo">
          <div class="card">
            <div class="card-header ">
              <h4 class="card-title">Analisis de Gastos</h4>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="d-flex">
                  <div class="col-md-4">
                    <div class="form-group">
                      <label for="selectMes">Seleccionar Mes:</label>
                      <select class="form-control" style="width: 60%;" id="selectMes">
                      </select>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label for="selectMes">Seleccionar Gasto:</label>
                      <select class="form-control" style="width: 60%;" id="selectGasto">
                      </select>
                    </div>
                  </div>
                </div>

              </div>
              <div class="card-body bg-light-subtle border border-success p-2 border-opacity-10 rounded-2">
                <div class="d-flex row opacity-100" id="widgets"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
<?php
include_once "./layouts/footer.php";
?>
<script src="calculoMensualRecibido.js"></script>