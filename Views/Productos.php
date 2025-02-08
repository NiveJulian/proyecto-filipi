<?php
session_start();
include_once './layouts/header.php';
?>

<title>Admin | Gestion Producto</title>

<div class="modal fade" id="cambiarlogo" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="card card-secondary">
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

                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary float-right m-1">Guardar</button>
                    <button type="button" data-dismiss="modal" class="btn btn-outline-secondary float-right m-1">Cerrar</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="crear-producto" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="card card-secondary">
                <div class="card-header">
                    <h3 class="card-title">Crear Producto</h3>
                    <button data-dismiss="modal" aria-label="close" class="close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="card-body">
                    <form id="form-crear-producto">
                        <div class="form-group">
                            <label for="nombre_producto">Nombre</label>
                            <input type="text" class="form-control" id="nombre_producto" placeholder="Ingresar Nombre" required>
                        </div>
                        <div class="form-group">
                            <label for="descripcion">Descripcion</label>
                            <input type="text" class="form-control" id="descripcion" placeholder="Ingresar descripcion">
                        </div>
                        <div class="form-group">
                            <label for="codigo">Codigo de Producto</label>
                            <input type="text" class="form-control" id="codigo" placeholder="Ingresar codigo">
                        </div>
                        <div class="form-group">
                            <label for="precio">Precio</label>
                            <input type="number" value="1" step="any" class="form-control" id="precio" placeholder="Ingresar precio">
                        </div>
                        <div class="form-group">
                            <label for="stock">Stock</label>
                            <input type="number" value="1" step="any" class="form-control" id="stock" placeholder="Ingresar precio">
                        </div>
                        <div class="form-group">
                            <label for="tipo">Tipo</label>
                            <select name="tipo" id="tipo" class="form-control"></select>
                        </div>
                        <div class="form-group">
                            <label for="proveedor">Proveedor</label>
                            <select name="proveedor" id="proveedor" class="form-control"></select>
                        </div>
                        <div class="form-group">
                            <label for="almacenes">Almacen</label>
                            <select name="almacenes" id="almacenes" class="form-control"></select>
                        </div>
                        <input type="hidden" id="id_edit_prod">
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <div class="align-items-start">
                        <button type="submit" class="btn btn-primary float-right m-1">Guardar</button>
                        <button type="button" data-dismiss="modal" class="btn btn-outline-secondary float-right m-1">Cerrar</button>
                        </form>
                    </div>
                    <a href="#" class="mt-2 text-muted text-sm" data-dismiss="modal" data-toggle="modal" data-target="#modalTipoProducto">
                        ¿No registraste tipos de productos?
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Inicio del cont principal -->
<div class="content-wrapper">
    <section class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1>Gestion Producto<button type="button" id="button-crear" data-toggle="modal" data-target="#crear-producto" class="btn btn-primary ml-2">Crear Producto</button></h1>

                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="../Views/dashboard.php">Inicio</a></li>
                        <li class="breadcrumb-item active">Gestion Productos</li>
                    </ol>
                </div>
            </div>
        </div>
    </section>
    <section>
        <div class="container-fluid">
            <div class="card card-light ">
                <div class="card-header">
                    <h4 class="card-title">Buscar producto</h4>
                    <div class="input-group">
                        <input id="buscar-producto" type="text" class="form-control float-left" placeholder="Ingresar Nombre">
                        <div class="input-group-append">
                            <button class="btn btn-default"><i class="fas fa-search"></i></button>
                        </div>
                    </div>
                </div>
                <div class="card-body p-0 m-2">
                    <div class="row d-flex alingn-items-stretch" id="productos">

                    </div>
                </div>
                <div class="card-footer"></div>
            </div>
        </div>
    </section>
</div>
<?php
include_once "./layouts/footer.php";
?>
<script src="../Util/js/select2.js"></script>
<script type="module" src="./Producto.js"></script>