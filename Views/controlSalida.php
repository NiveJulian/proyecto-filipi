<?php
session_start();
include_once './layouts/header.php';
?>
<!-- Modal -->
<style>
    .remito {
        border: 1px solid #000;
        width: 100%;
        padding: 10px;
    }

    .header {
        text-align: center;
        margin-bottom: 20px;
    }

    .header img {
        max-width: 100px;
    }

    .header p {
        margin: 2px 0;
    }

    .details {
        margin-bottom: 20px;
    }

    .details p {
        margin: 2px 0;
    }

    .details label {
        display: inline-block;
        width: 100px;
        font-weight: bold;
    }

    .table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
    }

    .table th,
    .table td {
        border: 1px solid #000;
        padding: 5px;
        text-align: left;
    }

    .footer {
        margin-top: 20px;
    }

    .footer p {
        margin: 2px 0;
    }

    .original {
        background-color: yellow;
        font-weight: bold;
        text-align: center;
    }

    .duplicado {
        background-color: green;
        color: white;
        font-weight: bold;
        text-align: center;
    }
</style>

<div class="modal fade" id="remito-salida" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="card card-secondary">
                <div class="card-header">
                    <h3 class="card-title">Resumen</h3>
                    <button data-dismiss="modal" aria-label="close" class="close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="card-body" id="remito_control">
                    <div class="row">
                        <!-- Remito Original -->
                        <div class="col-lg-6">
                            <form id="form-remito">
                                <div class="remito">
                                    <div class="header" id="header-remito">
                                        <img src="../Util/img/Filippi.jpeg" alt="Logo">
                                        <p><strong>Razón Soc JL srl</strong></p>
                                        <p>CUIT: 30-71598338-5</p>
                                        <p>Correo: gestionjlsrl@gmail.com</p>
                                        <p>Localidad: Paso de los Libres Ctes</p>
                                        <p>REMITO N°: <span id="num-remito">00000</span></p>
                                    </div>
                                    <hr>
                                    <div class="details">
                                        <p><label>Cliente:</label> <span id="remito-cliente"></span></p>
                                        <p><label>Fecha:</label> <span id="remito-fecha"></span></p>
                                        <p><label>CUIT:</label> <span id="remito-cuit"></span></p>
                                        <p><label>Correo:</label> <span id="remito-correo"></span></p>
                                    </div>
                                    <hr>
                                    <table class="table" id="table-remito">
                                        <thead>
                                            <tr>
                                                <th>CANTIDAD</th>
                                                <th>DETALLE</th>
                                                <th>VALOR</th>
                                            </tr>
                                        </thead>
                                        <tbody id="remito-tbody"></tbody>
                                    </table>
                                    <hr>
                                    <div class="footer">
                                        <p><strong>TRANSPORTISTA</strong></p>
                                        <p><label>EMPRESA:</label> <span id="remito-empresa"></span></p>
                                        <p><label>CHOFER:</label> <span id="remito-chofer"></span></p>
                                        <p><label>PATENTE:</label> <span id="remito-patente"></span></p>
                                        <p class="text-center mt-2"><label>Firma:</label> ..................................</p>
                                    </div>
                                    <div class="original">ORIGINAL</div>
                                </div>
                                <button type="submit" class="btn btn-primary float-right m-1">Generar remito</button>

                            </form>
                        </div>
                        <!-- Formulario -->
                        <div class="col-lg-6 mt-1">
                            <form id="form-clientes">
                                <h5>Datos cliente</h5>
                                <hr>
                                <div class="form-group">
                                    <label for="cliente">Cliente</label>
                                    <input type="text" class="form-control" id="cliente" placeholder="Ingresar cliente" required>
                                </div>
                                <div class="form-group">
                                    <label for="cuit">CUIT</label>
                                    <input type="text" class="form-control" id="cuit" placeholder="Ingresar CUIT" required>
                                </div>
                                <div class="form-group">
                                    <label for="correo">Correo</label>
                                    <input type="email" class="form-control" id="correo" placeholder="Ingresar correo" required>
                                </div>
                                <hr>
                                <div class="form-group">
                                    <label for="detalle">Detalle</label>
                                    <input type="text" class="form-control" id="detalle" placeholder="Ingresar detalle">
                                </div>
                                <div class="form-group">
                                    <div class="row">
                                        <div class="col-lg-6">
                                            <div class="form-group">
                                                <label for="cantidad">Cantidad</label>
                                                <input type="number" class="form-control" id="cantidad-detail" placeholder="Ingresar cantidad">
                                            </div>
                                        </div>
                                        <div class="col-lg-6">
                                            <div class="form-group">
                                                <label for="valor">Valor</label>
                                                <input type="number" class="form-control" id="valor" placeholder="Ingresar valor">
                                            </div>
                                        </div>
                                        <button type="button" id="agregar-detalle" class="btn btn-primary float-right m-1">Agregar detalle al remito</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="card-footer" id="card_footer">
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="crear-salida" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="card card-secondary">
                <div class="card-header">
                    <h3 class="card-title">Resumen</h3>
                    <button data-dismiss="modal" aria-label="close" class="close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="card-body">
                    <form id="form-crear-control">
                        <div class="row">
                            <div class="col-lg-6 border-right">
                                <h5><b>Control de patio</b></h5>
                                <hr>
                                <div class="form-group">
                                    <label for="fecha">fecha</label>
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <input type="date" class="form-control" id="fecha" placeholder="Ingresar fecha y hora" required>
                                        </div>
                                        <div class="col-sm-6">
                                            <input type="text" class="form-control" id="hora" placeholder="Ingresar hora" required>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="vehiculo">Patente</label>
                                    <select class="form-control select2" name="vehiculo" id="vehiculo"></select>
                                </div>
                                <div class="form-group">
                                    <label for="chofer">Chofer</label>
                                    <select class="form-control select2" name="chofer" id="chofer"></select>
                                </div>
                                <div class="form-group">
                                    <label for="cantidad">Cantidad</label>
                                    <input type="text" class="form-control" id="cantidad" placeholder="Ingresar cantidad" required>
                                </div>

                            </div>
                            <div class="col-lg-6 mt-4">
                                <hr>
                                <div class="form-group">
                                    <label for="observacion">Observacion</label>
                                    <input type="text" class="form-control" id="observacion" placeholder="Ingresar observacion" required>
                                </div>
                                <div class="form-group">
                                    <label for="empresa">Empresa</label>
                                    <input type="text" class="form-control" id="empresa" placeholder="Ingresar empresa" required>
                                </div>
                                <div class="form-group">
                                    <label for="motivo">Motivo</label>
                                    <input type="text" class="form-control" id="motivo" placeholder="Ingresar motivo" required>
                                </div>

                                <button type="submit" class="btn btn-primary float-right m-1">Guardar</button>

                            </div>
                        </div>
                    </form>
                </div>
                <div class="card-footer" id="card_footer">
                </div>
            </div>
        </div>
    </div>
</div>


<title>Panel de Control</title>

<div class="content-wrapper" style="min-height: 1080px;">
    <section class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1>Control de patio</h1>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="../Views/dashboard.php">Inicio</a></li>
                        <li class="breadcrumb-item active">Linea de tiempo</li>
                    </ol>
                </div>
            </div>
        </div>
    </section>

    <section class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-12">
                    <div class="d-flex">
                        <a href="#" class="btn btn-primary ml-auto" type="button" data-toggle="modal" data-target="#crear-salida">Ingresar Datos</a>
                    </div>
                    <div class="timeline" id="timeline">
                        <!-- Aquí se insertarán las cartas dinámicamente -->
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>

<?php
include_once "./layouts/footer.php";
?>
<script type="module" src="./ControlSalida.js"></script>