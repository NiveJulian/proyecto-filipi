<?php
session_start();
include_once './layouts/header.php';
?>
<title>Panel | Gestion Atributo</title>

<div class="content-wrapper">
    <section class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1>Reciclaje de Facturas</h1>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="../Views/facturacion.php">Inicio</a></li>
                        <li class="breadcrumb-item active">
                            <Ri:art></Ri:art>eciclaje de Facturas
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    </section>
    <section class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-header">
                            <ul class="nav nav-pills">
                                <li class="nav-item"><a href="#recibido" class="nav-link active" data-toggle="tab">Recibidos</a></li>
                                <li class="nav-item"><a href="#emitido" class="nav-link" data-toggle="tab">Emitidos</a></li>
                            </ul>

                        </div>
                        <div class="card-body">
                            <div class="tab-content">
                                <div class="tab-pane active" id="recibido">
                                    <div class="card card-secondary">
                                        <div class="card-header">
                                            <h3><b>Recibidos</b></h3>
                                        </div>
                                        <div class="card-body p-0 bg-light text-center d-flex justify-content-center">
                                            <table class="table table-danger table-hover table-responsive" style="width:100%;" id="tab_recibidos">
                                                <thead>
                                                    <tr>
                                                        <td>Datos de factura</td>
                                                        <td>Factura</td>
                                                        <td>Proveedor</td>
                                                        <td>Vehiculo</td>
                                                        <td>Fecha de eliminacion</td>
                                                        <td>Accion</td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div class="card-footer">
                                            <div class="row" id="all_proveedores">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="tab-pane" id="emitido">
                                    <div class="card card-secondary">
                                        <div class="card-header">
                                            <h3><b>Emitido</b></h3>
                                        </div>
                                        <div class="card-body p-0 bg-light text-center d-flex justify-content-center">
                                            <table class="table table-danger table-hover table-responsive" style="width:100%;" id="tab_emitidos">
                                                <thead>
                                                    <tr>
                                                        <td>Datos de factura</td>
                                                        <td>Factura</td>
                                                        <td>Cliente</td>
                                                        <td>Fecha de eliminacion</td>
                                                        <td>Accion</td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div class="card-footer">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer">
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
<script  type="module" src="papeleraFacturasEmitidas.js"></script>
<script  type="module" src="papeleraFacturasRecibidas.js"></script>