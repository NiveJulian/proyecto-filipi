<?php
session_start();
include_once './layouts/header.php';
?>
<title>Dashboard</title>

<div class="content-wrapper" style="min-height: 1302.12px;">
    <div class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1 class="m-0">Dashboard</h1>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="../Views/catalogo.php">Inicio</a></li>
                        <li class="breadcrumb-item active">Dashboard</li>
                    </ol>
                </div>
            </div>
        </div>
    </div>
    <div class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-6">
                    <div class="card">
                        <div class="card-header border-0">
                            <h3 class="card-title">Facturas Recibidas</h3>
                        </div>
                        <div class="card-body">
                            <div class="position-relative mb-4">
                                <canvas id="facturas-recibidas-chart" height="200"></canvas>
                            </div>
                            <div class="table-responsive">
                                <table id="tabla-facturas-recibidas" class="table table-striped table-valign-middle">
                                    <thead>
                                        <tr>
                                            <th>Número de Factura</th>
                                            <th>Fecha</th>
                                            <th>Razón Social</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <!-- Los datos se llenarán con JavaScript -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="card">
                        <div class="card-header border-0">
                            <h3 class="card-title">Facturas Emitidas</h3>
                        </div>
                        <div class="card-body">
                            <div class="position-relative mb-4">
                                <canvas id="facturas-emitidas-chart" height="200"></canvas>
                            </div>
                            <div class="table-responsive">
                                <table id="tabla-facturas-emitidas" class="table table-striped table-valign-middle table-responsive">
                                    <thead>
                                        <tr>
                                            <th>Número de Factura</th>
                                            <th>Fecha</th>
                                            <th>Razón Social</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <!-- Los datos se llenarán con JavaScript -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <!-- Nueva Sección para Vehículos y Consumos -->
                <div class="col-lg-6">
                    <div class="card">
                        <div class="card-header border-0">
                            <h3 class="card-title">Consumo de Aceite por Vehículo</h3>
                        </div>
                        <div class="card-body">
                            <div class="form-group">
                                <label for="selectVehiculo">Seleccionar Vehículo</label>
                                <select id="selectVehiculo" class="form-control">
                                    <!-- Las opciones se llenarán con JavaScript -->
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="fechaDesde">Fecha Desde</label>
                                <input type="date" id="fechaDesde" class="form-control">
                            </div>
                            <div class="form-group">
                                <label for="fechaHasta">Fecha Hasta</label>
                                <input type="date" id="fechaHasta" class="form-control">
                            </div>
                            <button id="btnCalcularConsumo" class="btn btn-primary">Calcular Consumo</button>
                            <div id="resultadoConsumo" class="mt-3">
                                <!-- Los resultados se mostrarán aquí -->
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="card">
                        <div class="card-header border-0">
                            <h3 class="card-title">Vencimientos de documentacion de Vehículos</h3>
                        </div>
                        <div class="card-body table-responsive">
                            <table id="tablaVencimientos" class="table table-striped table-responsive table-hover">
                                <thead>
                                    <tr>
                                        <th>Vehículo</th>
                                        <th>VTV</th>
                                        <th>Cédula</th>
                                        <th>R.U.T.A</th>
                                        <th>Senasa</th>
                                        <th>Seguro</th>
                                        <th>Poliza</th>
                                    </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<?php
include_once "./layouts/footer.php";
?>

<script type="module" src="./Dashboard.js"></script>