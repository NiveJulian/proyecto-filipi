<?php
session_start();
include_once './layouts/header.php';
?>
<style>
    #tablaAlmacenes tbody tr {
        cursor: pointer;
    }
</style>
<div class="modal fade" id="modalAlmacen" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalTitulo">Crear Almacén</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="formAlmacen">
                    <input type="hidden" id="idAlmacen">
                    <div class="form-group">
                        <label>Nombre</label>
                        <input type="text" id="nombreAlmacen" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Ubicación</label>
                        <input type="text" id="ubicacionAlmacen" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Tipo de Producto</label>
                        <select id="tipo_producto" class="form-control" required>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Estado</label>
                        <select id="estadoAlmacen" class="form-control" required>
                            <option value="A">Activo</option>
                            <option value="I">Inactivo</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                <button type="button" id="guardarAlmacen" class="btn btn-primary">Guardar</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="modalProductos" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Productos del Almacén</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <table class="table table-bordered" id="tablaProductos">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Aquí se listarán los productos dinámicamente -->
                    </tbody>
                </table>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
            </div>
        </div>
    </div>
</div>

<title>Admin | Gestión de Almacenes</title>
<div class="content-wrapper">
    <section class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1>Gestión de Almacenes</h1>
                    <button type="button" data-toggle="modal" data-target="#modalAlmacen" class="btn btn-primary btn-sm mt-2">
                        Crear Nuevo Almacén
                    </button>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="../Views/dashboard.php">Inicio</a></li>
                        <li class="breadcrumb-item active">Gestión de Almacenes</li>
                    </ol>
                </div>
            </div>
        </div>
    </section>
    <section>
        <div class="container-fluid">
            <div class="card card-light">
                <div class="card-header">
                    <h4 class="card-title mb-0">Almacenes</h4>
                </div>
                <div class="card-body">
                    <table id="tablaAlmacenes" class="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Ubicación</th>
                                <th>Tipo de Producto</th>
                                <th>Estado</th>
                                <th>Cantidad Productos</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>
</div>

<?php
include_once "./layouts/footer.php";
?>
<script src="./lote.js"></script>