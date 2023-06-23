<?php 
session_start();
if($_SESSION['us_tipo']==1 || $_SESSION['us_tipo']==3) {
    require_once "layouts/parte_superior.php";
?>
<title>Admin | Gestion Proveedores</title>
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
                        <img src="../img/prov/prov_default.png" id="logoactual" class="profile-user-img img-fluid img-circle">
                    </div>
                    <div class="text-center">
                        <p id="nombre_img"></p>
                    </div>
                    <div class="aler alert-success text-center" id="edit-prov" style="display:none;">
                        <span><i class="fas fa-check m-1"></i>La imagen se edito</span>
                    </div>
                    <div class="aler alert-danger text-center" id="noedit-prov" style="display:none;">
                        <span><i class="fas fa-times m-1"></i>Formato no soportado</span>
                    </div>
                    <form id="form-logo" enctype="multipart/form-data">
                            <div class="input-group mb-3 ml-5 mt-2" id="form-group">
                                    <input type="file" name="photo" class="input-group">
                                    <input type="hidden" name="funcion" id="funcion">
                                    <input type="hidden" name="id_logo_prov" id="id_logo_prov">
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

<div class="modal fade" id="crearproveedor" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="card card-success">
                <div class="card-header">
                    <h3 class="card-title">Crear Proveedor</h3>
                        <button data-dismiss="modal" aria-label="close" class="close">
                            <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="card-body">
                    <div class="aler alert-success text-center" id="add-prov" style="display:none;">
                        <span><i class="fas fa-check m-1"></i>Se agrego correctamente</span>
                    </div>
                    <div class="aler alert-danger text-center" id="noadd-prov" style="display:none;">
                        <span><i class="fas fa-times m-1"></i>El proveedor ya existe</span>
                    </div>
                    <form id="form-crear">
                        <div class="form-group">
                        <label for="nombre">Nombre</label>
                        <input type="text" class="form-control" id="nombre" placeholder="Ingresar Nombre" required>
                        </div>
                        <div class="form-group">
                        <label for="telefono">Telefono</label>
                        <input type="number" class="form-control" id="telefono" placeholder="Ingresar telefono" require>
                        </div>
                        <div class="form-group">
                        <label for="correo">Correo</label>
                        <input type="email" class="form-control" id="correo" placeholder="Ingresar correo">
                        </div>
                        <div class="form-group">
                        <label for="localidad">Localidad</label>
                        <input type="text" class="form-control" id="localidad" placeholder="Ingresar localidad">
                        </div>
                        <input type="hidden" id="id_edit_prov">
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
                    <h1>Proveedores<button type="button" data-toggle="modal" data-target="#crearproveedor" class="btn btn-primary ml-2">Crear Proveedor</button></h1>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="../vistas/adm_catalogo.php">Home</a></li>
                        <li class="breadcrumb-item active">Proveedores</li>
                    </ol>
                </div>
            </div>
        </div>
    </section>
    <section>
        <div class="container-fluid">
            <div class="card card-success"></div>
                <div class="card-header">
                    <h4 class="card-title">Buscar proveedor</h4>
                        <div class="input-group">
                            <input id="buscar_proveedor" type="text" class="form-control float-left" placeholder="Ingresar proveedor">
                            <div class="input-group-append">
                                <button class="btn btn-default"><i class="fas fa-search"></i></button>
                            </div>
                        </div>
                </div>
                <div class="card-body">
                        <div class="row d-flex alingn-items-stretch" id="proveedores">
                        </div>
                </div>
                <div class="card-footer"></div>
            </div>
        </div>
    </section>
</div>



<!-- Fin del cont principal -->


<?php require_once "layouts/parte_inferior.php"; ?>
<script src="../js/Proveedor.js"></script>

<?php
}
else{
	header('Location: ../index.php');
}?>