<?php
session_start();
include_once './layouts/header.php';
?>
<style>
    .content-wrapper {
        height: 80vh;
        overflow-y: scroll;
    }

    .content-wrapper::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }

    .content-wrapper::-webkit-scrollbar-thumb {
        background-color: rgba(53, 53, 53, 0.3);
        border-radius: 10px;
    }

    .content-wrapper:hover::-webkit-scrollbar-thumb {
        background-color: rgba(53, 53, 53, 0.3);
    }
</style>
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
                    <div class="card h-100">
                        <div class="card-header border-0">
                            <h3 class="card-title">Facturas Recibidas</h3>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <div class="position-relative mb-4">
                                <canvas id="facturas-recibidas-chart" height="200"></canvas>
                            </div>
                            <div class="table-responsive overflow-auto" style="max-height: 150px;">
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
                                        <!-- Datos aquí -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-6">
                    <div class="card h-100">
                        <div class="card-header border-0">
                            <h3 class="card-title">Facturas Emitidas</h3>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <div class="position-relative mb-4">
                                <canvas id="facturas-emitidas-chart" height="200"></canvas>
                            </div>
                            <div class="table-responsive overflow-auto" style="max-height: 150px;">
                                <table id="tabla-facturas-emitidas" class="table table-striped table-valign-middle">
                                    <thead>
                                        <tr>
                                            <th>Número de Factura</th>
                                            <th>Fecha</th>
                                            <th>Razón Social</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <!-- Datos aquí -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row mt-3">
                <!-- Consumo de Aceite por Vehículo -->
                <div class="col-lg-6">
                    <div class="card h-100">
                        <div class="card-header border-0">
                            <h3 class="card-title">Consumo de Aceite por Vehículo</h3>
                        </div>
                        <div class="card-body">
                            <div class="form-group">
                                <label for="selectVehiculo">Seleccionar Vehículo</label>
                                <select id="selectVehiculo" class="form-control">
                                    <!-- Opciones aquí -->
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
                                <!-- Resultados aquí -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Vencimientos de Documentación de Vehículos -->
                <div class="col-lg-6">
                    <div class="card h-100">
                        <div class="card-header border-0">
                            <h3 class="card-title">Vencimientos de Documentación de Vehículos</h3>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive overflow-auto" style="max-height: 350px;">
                                <table id="tablaVencimientos" class="table table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th>Vehículo</th>
                                            <th>VTV</th>
                                            <th>Cédula</th>
                                            <th>R.U.T.A</th>
                                            <th>Senasa</th>
                                            <th>Seguro</th>
                                            <th>Póliza</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <!-- Datos aquí -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row mt-3">
                <div class="col-lg-6">
                    <div class="text-center card h-100">
                        <div class="card-header border-0">
                            <h3>Calculador de consumos por fecha</h3>
                        </div>
                        <div class="card-body">
                            <form>
                                <div class="form-group">
                                    <label for="fecha_desde">Fecha Desde:</label>
                                    <input type="date" id="fecha_desde" name="fecha_desde" class="form-control">
                                </div>
                                <div class="form-group">
                                    <label for="fecha_hasta">Fecha Hasta:</label>
                                    <input type="date" id="fecha_hasta" name="fecha_hasta" class="form-control">
                                </div>
                                <div class="form-group">
                                    <label for="total_calc_fecha">Total:</label>
                                    <span class="form-control" id="total_calc_fecha"></span>
                                </div>
                                <button type="submit" id="consumo_fecha" class="btn btn-primary align-middle m-1">Calcular</button>
                            </form>
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