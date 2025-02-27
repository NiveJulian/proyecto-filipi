<?php
session_start();
include_once './layouts/header.php';
?>

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

    .btn-custom {
        margin-left: 10px;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
    }

    .btn-custom:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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

                        <div class="col-lg-6">
                            <form id="form-remito">
                                <div class="remito">
                                    <div class="header" id="header-remito">
                                        <img src="../Util/img/logo.svg" alt="Logo">
                                        <p><strong>Razón Soc <span id="razon_social"></span></strong></p>
                                        <p>CUIT: <span id="cuit"></span></p>
                                        <p>Correo: <span id="email"></span></p>
                                        <p>Localidad: <span id="localidad"></span></p>
                                        <p>REMITO N°: 00<span id="num-remito"></span></p>
                                    </div>
                                    <hr>
                                    <div class="details">
                                        <p><label>Cliente:</label> <span id="remito-empresa"></span></p>
                                        <p><label>Fecha:</label> <span id="remito-fecha"></span></p>
                                        <p><label>CUIT:</label> <span id="remito-cuit"></span></p>
                                        <p><label>Correo:</label> <span id="remito-correo"></span></p>
                                    </div>
                                    <hr>
                                    <table class="table" id="table-remito">
                                        <thead>
                                            <tr>
                                                <th>COD</th>
                                                <th>DET</th>
                                                <th>CANT</th>
                                                <th>UNI.</th>
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

                        <div class="col-lg-6 mt-1">
                            <form id="form-clientes">
                                <h5>Datos cliente</h5>
                                <hr>
                                <div class="form-group">
                                    <label for="cliente">Cliente</label>
                                    <select class="form-control select2" name="cliente" id="cliente"></select>
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
                                    <label for="fecha">Fecha</label>
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <input type="date" class="form-control" id="fecha" placeholder="Ingresar fecha" required>
                                        </div>
                                        <div class="col-sm-6">
                                            <input type="time" class="form-control" id="hora" placeholder="Ingresar hora" required>
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
                                    <label for="empresa">Empresa</label>
                                    <input type="text" class="form-control" id="empresa" placeholder="Ingresar empresa" required>
                                </div>
                                <div class="form-group">
                                    <label for="motivo">Motivo</label>
                                    <input type="text" class="form-control" id="motivo" placeholder="Ingresar motivo" required>
                                </div>
                                <div class="form-group">
                                    <label for="observacion">Observación</label>
                                    <input type="text" class="form-control" id="observacion" placeholder="Ingresar observación">
                                </div>
                            </div>
                            <div class="col-lg-6 mt-4">
                                <h5><b>Productos</b></h5>
                                <hr>
                                <div class="form-group">
                                    <label for="producto">Producto</label>
                                    <select class="form-control select2" id="producto">

                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="lote">Almacén</label>
                                    <select class="form-control select2" id="lote">

                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="cantidad-producto">Cantidad</label>
                                    <input type="number" class="form-control" id="cantidad-producto" placeholder="Ingresar cantidad" min="1">
                                </div>
                                <button type="button" class="btn btn-primary" id="agregar-producto">Agregar Producto</button>
                                <hr>
                                <div id="lista-productos">

                                </div>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary float-right m-1">Guardar</button>
                    </form>
                </div>
                <div class="card-footer" id="card_footer">
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="crear-seguimiento-viaje" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="card card-secondary">
                <div class="card-header">
                    <h3 class="card-title">Seguimiento de Viaje</h3>
                    <button data-dismiss="modal" aria-label="close" class="close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="card-body">
                    <form id="form-crear-seguimiento-viaje">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Vehículo</label>
                                    <select class="form-control" id="vehiculo_id" name="vehiculo_id" required>
                                        <option value="">Seleccione...</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Chofer</label>
                                    <select class="form-control" id="chofer_id" name="chofer_id" required>
                                        <option value="">Seleccione...</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Razon social del cliente</label>
                                    <select class="form-control" id="cliente_id" name="cliente_id" required>
                                        <option value="">Seleccione...</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Estado del Envío</label>
                                    <select class="form-control" id="estado_id" name="estado_id" required>
                                        <option value="">Seleccione...</option>
                                    </select>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Lugar de salida</label>
                                    <input type="text" class="form-control" id="lugar_salida" name="lugar_salida" required>
                                </div>
                                <div class="form-group">
                                    <label>Destino</label>
                                    <input type="text" class="form-control" id="destino" name="destino" required>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label>Peso Total (kg)</label>
                                            <input type="number" class="form-control" id="peso" name="peso" step="0.01" required>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label>Precio Total</label>
                                            <input type="number" class="form-control" id="precio" name="precio" step="0.01" required>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>Número de Despacho</label>
                                    <input type="text" class="form-control" id="numero_despacho" name="numero_despacho" required>
                                </div>
                            </div>
                        </div>

                </div>
                <div class="card-footer">
                    <button type="submit" class="btn btn-primary float-right m-1">Guardar</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal modal-op-facturas fade" id="config_estado_envio" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="card card-secondary">
                <div class="card-header">
                    <h3 class="card-title">Crear estados de envios</h3>
                    <button data-dismiss="modal" aria-label="close" class="close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="card-body">
                    <div class="col-lg-12">
                        <form id="crear_estado_envio">
                            <div class="form-group">
                                <label for="estado_envio" class="control-label">Estado:</label>
                                <input class="form-control" type="text" name="estado_envio" id="estado_envio">
                            </div>
                            <button type="submit" id="crearRolesBtn" class="btn btn-primary">Crear</button>
                        </form>
                    </div>
                </div>
                <div class="card-footer" id="card_footer">
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-subir-doc" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">📄 Subir Documentación</h5>
                <button type="button" class="btn-close" data-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="form-subir-documento" enctype="multipart/form-data">
                    <div class="form-group">
                        <label for="nombre-doc">¿Que tipo documentacion es?</label>
                        <select class="form-control" id="nombre-doc" name="nombre-doc">
                            <option value="Factura">Factura</option>
                            <option value="Guia de despacho">Guía de despacho</option>
                            <option value="Permiso">Permiso</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <input type="hidden" id="envio-id-doc">
                        <input type="file" class="form-control mb-2" id="documento-envio">
                    </div>
                    <button class="btn btn-success" id="btn-subir-doc-final">Subir</button>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-cambiar-estado" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">🔄 Cambiar Estado del Envío</h5>
                <button type="button" class="btn-close" data-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="form-cambiar-estado">
                    <input type="hidden" id="envio-id-estado">
                    <select class="form-control" id="nuevo-estado">
                        <option value="">Seleccione...</option>

                    </select>
                    <button class="btn btn-primary mt-2" id="btn-cambiar-estado-final">Guardar</button>
                </form>
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
            <div class="card-header">
                <ul class="nav nav-pills">
                    <li class="nav-item"><a href="#controlSalida" class="nav-link active" data-toggle="tab">Control Salida</a></li>
                    <li class="nav-item"><a href="#seguimientoViajes" class="nav-link" data-toggle="tab">Seguimiento de viajes</a></li>
                </ul>
            </div>
        </div>
    </section>

    <section class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-12">

                    <div class="tab-content">
                        <div class="tab-pane active" id="controlSalida">

                            <div class="card">
                                <div class="card-header">
                                    <div class="d-flex justify-content-end align-items-center gap-2 mb-3">
                                        <button class="btn btn-primary text-white" type="button" data-toggle="modal" data-target="#crear-salida">
                                            Registrar salida
                                        </button>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <div class="timeline" id="timeline">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tab-pane" id="seguimientoViajes">
                            <div class="card">
                                <div class="card-header">
                                    <div class="d-flex justify-content-end align-items-center gap-2 mb-3">
                                        <button class="btn btn-secondary" type="button" data-toggle="modal" data-target="#config_estado_envio">
                                            Estado de envío
                                        </button>
                                        <button class="btn btn-success" type="button" data-toggle="modal" data-target="#crear-seguimiento-viaje">
                                            Registrar viaje
                                        </button>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <!-- Pestañas de clientes -->
                                    <ul class="nav nav-tabs bg-white" id="clientesTab" role="tablist"></ul>
                                    <!-- Contenido de las pestañas -->
                                    <div class="tab-content" id="clientesTabContent"></div>
                                </div>
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
<script type="module" src="./ControlSalida.js"></script>