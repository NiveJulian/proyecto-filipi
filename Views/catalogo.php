<?php
session_start();
include_once './layouts/header.php';
?>
<style>
    .table_scroll {
        overflow: scroll;
        height: 400px;
        overflow-x: hidden;
    }

    #carrito_compras {
        padding: 0px !important;
        margin: 0px !important;
    }

    .vencimientos-columna {
        max-height: 80px;

        overflow-y: auto;

        padding-right: 5px;

    }


    .vencimientos-columna::-webkit-scrollbar {
        width: 5px;

    }

    .vencimientos-columna::-webkit-scrollbar-thumb {
        background: #888;

        border-radius: 5px;

    }

    .vencimientos-columna::-webkit-scrollbar-thumb:hover {
        background: #555;

    }


    .vencimientos-columna {
        scrollbar-width: thin;
        scrollbar-color: #888 transparent;
    }

    .fixed-card-height {
        height: 520px;

        display: flex;
        flex-direction: column;
    }

    .fixed-card-height-first {
        height: 1080px;

        display: flex;
        flex-direction: column;
    }

    .fixed-card-height .card-body {
        flex-grow: 1;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .fixed-card-height-first .card-body {
        flex-grow: 1;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .dataTables_length select {
        padding-right: 25px !important;

        text-align: center;

        appearance: none;

        background-position: right 10px center;

        background-repeat: no-repeat;
    }


    ::-webkit-scrollbar {
        width: 6px;

    }

    ::-webkit-scrollbar-track {
        background: #f1f1f1;

        border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb {
        background: #888;

        border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: #555;

    }
</style>
<!-- Modal -->
<div class="modal modal-op-facturas fade" id="crear-tipos-archivo" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabindex="2">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Crear tipo de archivo</h1>
                <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form>
                    <div class="mb-3">
                        <label for="tipo_archivo" class="col-form-label">Nombre:</label>
                        <input type="text" class="form-control" id="tipos_archivo">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                <button type="button" class="btn btn-primary" id="crear_tipos_archivo">Crear</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="adjuntar-archivos-pdf" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="card card-light">
                <div class="modal-header">
                    <h1 class="modal-title fs-5 text-sm">Adjuntar Archivos</h1>
                    <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="form-adjuntar-archivo-pdf" enctype="multipart/form-data">
                        <div class="form-group text-center" id="adjuntar-archivos">
                            <label for="archivo" class="custom-file-upload">
                                <div class="cuadrado">
                                    <div class="linea horizontal"></div>
                                    <div class="linea vertical"></div>
                                    <div class="mas"></div>
                                </div>
                                <span>Adjuntar Archivos</span>
                            </label>
                            <input type="hidden" name="funcion" id="funcion-pdf">
                            <input type="hidden" name="id_vehiculo" id="id-vehiculo-pdf">
                            <input type="hidden" name="id_tipo_archivo" id="id-tipo-archivo-pdf">
                            <input type="hidden" name="nombre" id="nombre-archivo-pdf">

                            <input type="file" id="archivo" name="pdf" class="input-file">

                            <select id="tipo_archivos" class="tipo-archivos form-control select2" style="width: 100%; z-index: 1051;"></select>
                        </div>
                        <div class="form-group">
                            <ul class="text-center" id="archivos-lista" class="list-group"></ul>
                        </div>
                </div>
                <div class="card-footer position-relative">
                    <button type="button" data-dismiss="modal" class="btn btn-secondary">Cerrar</button>
                    <button type="button" class="btn btn-success" data-toggle="modal" data-dismiss="modal" data-target="#crear-tipos-archivo">Crear tipo de archivo</button>
                    <button type="submit" class="btn btn-primary">Guardar</button>
                    </form>

                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="vista_vehiculo" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="card card-light">
                <div class="card-header">
                    <h3 class="card-title">Resumen</h3>
                    <button data-bs-dismiss="modal" aria-label="close" class="close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="card-body">
                    <form action="" id="manage-course">
                        <div class="row">
                            <div class="col-lg-6 border-right">
                                <h5><b>Actividad</b></h5>
                                <hr>
                                <div id="msg" class="form-group"></div>
                                <div class="form-group">
                                    <label for="" class="control-label">Patente:</label>
                                    <span id="patente"></span>
                                </div>
                                <div class="form-group">
                                    <label for="" class="control-label">Vehículo:</label>
                                    <span id="dato_vehiculo"></span>
                                </div>
                                <div class="form-group">
                                    <label for="" class="control-label">N° Motor:</label>
                                    <span id="numero_motor"></span>
                                </div>
                                <div class="form-group">
                                    <label for="" class="control-label">N° Cédula:</label>
                                    <span id="numero_cedula"></span>
                                </div>
                                <div class="form-group" id="avatar_vehiculo">

                                </div>
                            </div>
                            <div class="col-lg-6">
                                <h5><b>Información de los Vencimientos</b></h5>
                                <hr>
                                <div class="">
                                    <div class="form-group mb-2">
                                    </div>
                                    <div class="form-group">
                                    </div>
                                </div>
                                <hr>
                                <div class="form-group mb-2">
                                    <label for="tipo_archivos-select" class="control-label">Tipo de Archivo</label>
                                    <select id="tipo_archivos-select" class="form-control select2" style="width: 100%;">
                                    </select>
                                </div>
                                <div class="d-flex justify-content-center align-items-center">
                                    <ul class="list-group m-1" id="archivos-list">
                                    </ul>
                                </div>
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

<div class="modal fade" id="vista_resumen" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="card card-light">
                <div class="card-header">
                    <h3 class="card-title">Resumen</h3>
                    <button data-dismiss="modal" aria-label="close" class="close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="num_ref">Referencia:</label>
                                <span id="num_ref"></span>
                            </div>
                            <div class="form-group">
                                <label for="patente_vista">Patente / Código:</label>
                                <span id="patente_vista"></span>
                            </div>
                            <div class="form-group">
                                <label for="vehiculo_vista">Vehículo:</label>
                                <span id="vehiculo_vista"></span>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <table class="table table-hover table-responsive">
                                <thead class="table-light">
                                    <tr>
                                        <th>#</th>
                                        <th>VTV</th>
                                        <th>CÉDULA</th>
                                        <th>R.U.T.A</th>
                                        <th>SENASA</th>
                                        <th>SEGURO</th>
                                        <th>PÓLIZA</th>
                                    </tr>
                                </thead>
                                <tbody class="table-warning table-nowrap" id="detalles">

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="card-footer" id="card_footer">
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="cambiarlogo" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="card card-light">
                <div class="card-header">
                    <h3 class="card-title">Cambiar Imagen</h3>
                    <button type="button" data-dismiss="modal" aria-label="Close" class="close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body p-0">
                    <div class="text-center">
                        <img src="../Util/img/productos/prod_default.png" id="logoactual" class="img-fluid redounded">
                    </div>
                    <div class="text-center">
                        <p id="nombre_img"></p>
                    </div>
                    <form id="form-logo-prod" enctype="multipart/form-data">
                        <div class="input-group mb-3 ml-5 mt-2" id="form-group">
                            <input type="file" name="photo" class="input-group">
                            <input type="hidden" name="funcion" id="funcion">
                            <input type="hidden" name="id_logo_prod" id="id_logo_prod">
                            <input type="hidden" name="avatar" id="avatar">
                        </div>
                        <div class="modal-footer">
                            <button type="submit" class="btn btn-primary float-right m-1">Guardar</button>
                            <button type="button" data-dismiss="modal" class="btn btn-outline-secondary float-right m-1">Cerrar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="crear-producto" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="card card-light">
                <div class="card-header">
                    <h3 class="card-title">Crear Vehículo</h3>
                </div>
                <div class="card-body">
                    <form id="form-crear-producto" enctype="multipart/form-data">
                        <div class="form-group">
                            <label for="codigo_vehiculo">Patente Vehículo</label>
                            <input type="text" class="form-control" id="codigo_vehiculo" placeholder="Ingresar Código de Vehículo" required>
                        </div>
                        <div class="form-group">
                            <label for="vehiculo">Vehículo</label>
                            <input type="text" class="form-control" id="vehiculo" placeholder="Ingresar vehículo" required>
                        </div>
                        <!-- AGREGAR OPCIONES -->
                        <div class="form-group">
                            <label for="registro">Elige lo que vas a registrar</label>
                            <p class="text-muted text-sm">Puedes elegir varias opciones</p>
                            <hr>
                            <div class="text-center">
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" value="" id="motor-toggle">
                                    <label class="form-check-label" for="motor-toggle">N° Motor</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" value="" id="cedula-toggle">
                                    <label class="form-check-label" for="cedula-toggle">Cédula</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" value="" id="logistica-toggle">
                                    <label class="form-check-label" for="logistica-toggle">R.U.T.A</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" value="" id="vtv-toggle">
                                    <label class="form-check-label" for="vtv-toggle">VTV</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" value="" id="senasa-toggle">
                                    <label class="form-check-label" for="senasa-toggle">SENASA</label>
                                </div>
                            </div>
                        </div>
                        <div class="form-group" id="vtv-input-group" style="display: none;">
                            <label for="vtv">VTV</label>
                            <input type="date"
                                class="form-control"
                                id="vencimiento_vtv"
                                placeholder="Ingresar Vencimiento">
                        </div>
                        <div class="form-group" id="motor-input-group" style="display: none;">
                            <label for="motor">N° Motor</label>
                            <input type="text"
                                class="form-control"
                                id="motor"
                                placeholder="Ingresar N° Motor">
                        </div>
                        <div class="form-group" id="cedula-input-group" style="display: none;">
                            <label for="cedula">N° Chasis</label>
                            <input type="text"
                                class="form-control"
                                id="cedula"
                                placeholder="Ingresar N° Chasis">

                            <label for="vencimiento_cedula">Vencimiento Cédula Verde</label>
                            <input type="date"
                                class="form-control"
                                id="vencimiento_cedula"
                                placeholder="Ingresar Vencimiento">
                        </div>
                        <div class="form-group" id="ruta-input-group" style="display: none;">
                            <label for="vencimiento_logistica">Ruta Logística</label>
                            <input type="date"
                                class="form-control"
                                id="vencimiento_logistica"
                                placeholder="Ingresar vencimiento">
                        </div>
                        <div class="form-group" id="senasa-input-group" style="display: none;">
                            <label for="vencimiento_senasa">Senasa</label>
                            <input type="date"
                                class="form-control"
                                id="vencimiento_senasa"
                                placeholder="Ingresar vencimiento">
                        </div>
                        <hr>
                        <hr>
                        <div class="form-group">
                            <div class="toggle-container form-check form-switch">
                                <input class="form-check-input" type="checkbox" role="switch" id="otros-datos-toggle">
                                <label for="otros-datos-toggle">Otros datos</label>
                                <span class="icon">></span>
                            </div>
                        </div>

                        <div id="otros-datos" style="display: none;">
                            <div class="form-group">
                                <label for="matafuego">Vencimiento Matafuegos</label>
                                <input type="date" class="form-control" id="matafuego" placeholder="Ingresar vencimiento">
                            </div>
                            <div class="form-group">
                                <label for="vencimiento_seguro">Pago Seguro</label>
                                <input type="date" class="form-control" id="vencimiento_seguro" placeholder="Ingresar vencimiento">
                            </div>
                            <div class="form-group">
                                <label for="poliza">Póliza</label>
                                <input type="text" class="form-control" id="poliza" placeholder="Ingresar Número de Póliza">
                                <b>Vencimiento Póliza</b>
                                <input type="date" class="form-control" id="vencimiento_poliza" placeholder="Ingresar vencimiento">
                            </div>
                        </div>
                        <input type="hidden" id="id_edit_prod">
                </div>
                <div class="card-footer">
                    <button type="submit" class="btn btn-primary float-right m-1">Guardar</button>
                    <button type="button" id="close" data-dismiss="modal" class="btn btn-outline-secondary float-right m-1">Cerrar</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="configuracion_consumo" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="card card-light">
                <div class="card-header">
                    <h3 class="card-title">Consumo</h3>
                    <button data-dismiss="modal" aria-label="close" class="close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-lg-6 border-right">
                            <h5><b>Registro de consumo</b></h5>
                            <hr>
                            <form id="form-asignar-tipo">
                                <div class="form-group">
                                    <label for="vehiculo_asignar">Asignar Vehículo</label>
                                    <select class="form-control select2" name="vehiculo_asignar" id="vehiculo_asignar"></select>
                                </div>
                                <div class="form-group text-center bg-light bg-gradient">
                                    <label for="tipo_vehiculos">Tipo vehículo:</label>
                                    <div class="card-body d-flex flex-wrap justify-content-center m-1" id="tipo_vehiculos">

                                    </div>
                                    <input type="hidden" id="id_tipo_vehiculo">
                                </div>
                                <button type="submit" class="btn btn-primary float-right m-1">Guardar</button>
                            </form>
                        </div>
                        <div class="col-lg-6">
                            <h5>
                                <b>Actualizar precio de combustible</b>
                            </h5>
                            <hr>
                            <form id="form-precio-combustible">
                                <div class="form-group">
                                    <label for="precio_combustible">Precio actual de combustible</label>
                                    <input class="form-control" name="precio_combustible" id="precio_combustible" placeholder="Ingresar precio de combustible"></input>
                                </div>
                                <button type="submit" class="btn btn-primary float-right m-1">Guardar</button>
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

<title>Panel de Control</title>

<div class="content-wrapper" style="min-height: 1080px;">
    <section class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1>Panel Vehículos</h1>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="../Views/dashboard.php">Inicio</a></li>
                        <li class="breadcrumb-item active">Panel Vehículos</li>
                    </ol>
                </div>
            </div>
        </div>
    </section>
    <section class="content" id="content_admin">
        <div class="container-fluid">
            <div class="row">
                <!-- Columna izquierda -->
                <div class="col-md-7">
                    <div class="card fixed-card-height-first">
                        <div class="card-header">
                            <h3 class="card-title">Vehículos
                                <a href="#" class="btn btn-primary ml-auto" type="button" data-toggle="modal" data-target="#crear-producto">Crear Vehiculo</a>
                            </h3>
                        </div>
                        <div class="card-body">
                            <table id="datos_vehiculos" class="table table-hover">
                                <thead class="table-light">
                                    <tr>
                                        <th class="text-center">Documentación</th>
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

                <!-- Columna derecha -->
                <div class="col-md-5">
                    <!-- Primera carta -->
                    <div class="card fixed-card-height">
                        <div class="card-header text-center">
                            <h2 class="card-title">Resumen de la Actividad</h2>
                        </div>
                        <div class="card-body p-0 m-1">
                            <table id="obtener_resumen" class="table table-sm responsive table-hover">
                                <thead class="table-light">
                                    <tr>
                                        <th>#</th>
                                        <th>Patente</th>
                                        <th>Vehículo</th>
                                        <th>Días para Vencer</th>
                                    </tr>
                                </thead>
                                <tbody id="ver_resumen">
                                </tbody>
                            </table>
                        </div>
                        <div class="card-footer"></div>
                    </div>

                    <!-- Segunda carta -->
                    <!-- <div class="card fixed-card-height mt-3">
                        <div class="card-header text-center">
                            <div class="row">
                                <div class="col-md-10 col-12">
                                    <h2 class="card-title">
                                        Consumo
                                    </h2>
                                </div>
                                <div class="col-md-2 col-12">
                                    <button
                                        class="btn btn-secondary ml-auto"
                                        type="button"
                                        title="Configuración para consumo"
                                        data-toggle="modal" data-target="#configuracion_consumo"><i class="fas fa-cog"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="card-body p-0 m-1">
                            <div class="row" id="obtener_consumo">
                            </div>
                        </div>
                        <div class="card-footer"></div>
                    </div> -->
                </div>
            </div>
        </div>
    </section>
</div>
<?php
include_once "./layouts/footer.php";
?>
<script type="module" src="./Catalogo.js"></script>