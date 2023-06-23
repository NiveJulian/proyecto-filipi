
<?php 
session_start();
if($_SESSION['us_tipo']==1 || $_SESSION['us_tipo']==3) {
?>
<title>Admin | Gestion Producto</title>
<?php
require_once "layouts/parte_superior.php";
?>
<div class="modal fade" id="crear-lote" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="card card-success">
                <div class="card-header">
                    <h3 class="card-title">Crear Lote</h3>
                        <button data-dismiss="modal" aria-label="close" class="close">
                            <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="card-body">
                    <div class="aler alert-success text-center" id="add-lote" style="display:none;">
                        <span><i class="fas fa-check m-1"></i>Se agrego correctamente</span>
                    </div>
                    <div class="alert alert-danger text-center" id="noadd-lote" style="display:none;">
                        <span><i class="fas fa-times m-1"></i>No se pudo agregar correctamente</span>
                    </div>
                    <form id="form-crear-lote">
                        <div class="form-group">
                            <label for="nombre_producto_lote">Producto: </label>
                            <label id="nombre_producto_lote">Nombre del producto</label>
                        </div>
                        <div class="form-group">
                        <label for="lote-prov">Proveedor</label>
                        <select name="lote-prov" id="lote-prov" class="form-control select2" style="width:100%;"></select>
                        </div>
                        <div class="form-group">
                            <label for="stock">Stock: </label>
                            <input type="number" name="stock" id="stock" class="form-control" placeholder="Ingrese stock">
                        </div>
                        <div class="form-group">
                            <label for="recibido">Fecha de recibido</label>
                            <input type="date" class="form-control" id="recibido" placeholder="Ingresar recibido">
                        </div>
                        <input type="hidden" id="id_lote_prov">
                       
                </div>
                <div class="card-footer">
                        <button type="submit" class="btn btn-primary float-right m-1">Guardar</button>
                        <button type="button" data-dismiss="modal" class="btn btn-outline-secondary float-right m-1">Cerrar</button>
                        </form>
                </div> 
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="cambiarlogo" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="card card-success">
                <div class="card-header">
                    <h3 class="card-title">Cambiar Imagen</h3>
                        <button type="button" data-dismiss="modal" aria-label="Close" class="close">
                            <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body p-0">
                    <div class="text-center">
                        <img src="../img/prod/prod_default.png" id="logoactual" class="img-fluid redounded">
                    </div>
                    <div class="text-center">
                        <p id="nombre_img"></p>
                    </div>
                    <div class="aler alert-success text-center" id="edit" style="display:none;">
                        <span><i class="fas fa-check m-1"></i>La imagen se edito</span>
                    </div>
                    <div class="aler alert-danger text-center" id="noedit" style="display:none;">
                        <span><i class="fas fa-times m-1"></i>Formato no soportado</span>
                    </div>
                    <form id="form-logo" enctype="multipart/form-data">
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

<!-- Modal -->

<div class="modal fade" id="crear-producto" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="card card-success">
                <div class="card-header">
                    <h3 class="card-title">Crear Producto</h3>
                        <button data-dismiss="modal" aria-label="close" class="close">
                            <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="card-body">
                    <div class="aler alert-success text-center" id="add" style="display:none;">
                        <span><i class="fas fa-check m-1"></i>Se agrego correctamente</span>
                    </div>
                    <div class="aler alert-danger text-center" id="noadd" style="display:none;">
                        <span><i class="fas fa-times m-1"></i>No se puede agregar</span>
                    </div>
                    <div class="alert alert-success text-center" id="edit_prod" style="display:none;">
                        <span><i class="fas fa-check m-1"></i>Se edito correctamente</span>
                    </div>
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
                            <label for="tipo">Tipo</label>
                            <select name="tipo" id="tipo" class="form-control select2" style="width:100%;"></select>
                        </div>
                        <div class="form-group">
                            <label for="proveedor">Proveedor</label>
                            <select name="proveedor" id="proveedor" class="form-control select2" style="width:100%;"></select>
                        </div>
                        <div class="form-group">
                            <label for="presentacion">Presentacion</label>
                            <select name="presentacion" id="presentacion" class="form-control select2" style="width:100%;"></select>
                        </div>
                        <input type="hidden" id="id_edit_prod">
                </div>
                <div class="card-footer">
                            <button type="submit" class="btn btn-primary float-right m-1">Guardar</button>
                            <button type="button" data-dismiss="modal" class="btn btn-outline-secondary float-right m-1">Cerrar</button>
                            </form>
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
                        <li class="breadcrumb-item"><a href="../vistas/adm_catalogo.php">Home</a></li>
                        <li class="breadcrumb-item active">Gestion Productos</li>
                    </ol>
                </div>
            </div>
        </div>
    </section>
    <section>
        <div class="container-fluid">
            <div class="card card-success">
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
        </div>
    </section>
</div>




<!-- Fin del cont principal -->






<!-- select 2 -->
<?php 
require_once "layouts/parte_inferior.php";
?>

<?php 
}
else{
	header('Location: ../index.php');
}?>
<script src="../js/select2.js"></script>
<script src="../js/Producto.js"></script>
