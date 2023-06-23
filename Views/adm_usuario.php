<?php 
session_start();
if($_SESSION['us_tipo']==1 || $_SESSION['us_tipo']==3 || $_SESSION['us_tipo']==2) {
?>
<title>Admin | Gestion Usuarios</title>
<?php
require_once "layouts/parte_superior.php";
?>

<!-- Modal -->
<div class="modal fade" id="confirmar" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Comfirmar Accion</h1>
        <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="text-center">
            <img id="avatar3" src="../img/avatar2.svg" class="profile-user-img img-fluid img-circle img-sm">
        </div>
        <div class="text-center">
            <b>
                <?php echo $_SESSION['nombre_us']; ?>
            </b>
        </div>
        <span>Necesitamos tu password para continuar</span>
        <div class="alert alert-success text-center" id="confirmado" style='display:none;'>
            <span><i class="fas fa-check m-1"></i>Se modifico al usuario</span>
        </div>
        <div class="alert alert-danger text-center" id="rechazado" style='display:none;'>
            <span><i class="fas fa-times m-1"></i>El password no es correcto</span>
        </div>
        <form id="form-confirmar">
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text"><i class="fas fa-unlock-alt"></i></span>
                </div>
                <input type="password" id="oldpass" class="form-control" placeholder="Ingrese password actual">
                <input type="hidden" id="id_user">
                <input type="hidden" id="funcion">
            </div>
            
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">cerrar</button>
        <button type="submit" class="btn btn-primary">Guardar</button>
        </form>
      </div>
    </div>
  </div>
</div>
<div class="modal fade" id="crearusuario" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                    <div class="aler alert-success text-center" id="add_us" style="display:none;">
                        <span><i class="fas fa-check m-1"></i>Se agrego correctamente</span>
                    </div>
                    <div class="aler alert-danger text-center" id="noadd_us" style="display:none;">
                        <span><i class="fas fa-times m-1"></i>No se puede agregar</span>
                    </div>
                    <div class="alert alert-success text-center" id="edit_us" style="display:none;">
                        <span><i class="fas fa-check m-1"></i>Se edito correctamente</span>
                    </div>
                    <form id="form-crear" class="form-horizontal">
                                <div class="form-group row">
                                    <label for="nombre">Nombre</label>
                                    <input type="text" id="nombre" class="form-control" placeholder="Ingrese Nombre" require>
                                </div>
                                <div class="form-group row">
                                    <label for="apellido">Apellido</label>
                                    <input type="text" id="apellido" class="form-control" placeholder="Ingrese Apellido" require>
                                </div>
                                <div class="form-group row">
                                    <label for="edad">Nacimiento</label>
                                    <input type="date" id="edad" class="form-control" placeholder="Ingrese nacimiento" require>
                                </div>
                                <div class="form-group row">
                                    <label for="dni">DNI</label>
                                    <input type="text" id="dni" class="form-control"  placeholder="Ingrese dni" require>
                                </div>
                                <div class="form-group row">
                                    <label for="pass">Contraseña</label>
                                    <input type="password" id="pass" class="form-control" placeholder="Ingrese contraseña" require>
                                </div>
                        </div>
                        <div class="card-footer">
                            <div class="form-group row"> 
                                <button type="submit" class="btn btn-block btn-outline-success">Guardar</button>
                                </form>
                            </div>
                            
                            <p class="text-muted">Cuidado con ingresar datos erroneos</p>
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
                    <h1>Gestion de Usuarios<button id="button-crear" type="button" data-toggle="modal" data-target="#crearusuario" class="btn btn-primary ml-2">Crear usuario</button></h1>
                    <input type="hidden" name="tipo_usuario" id="tipo_usuario" value="<?php echo $_SESSION['us_tipo']?>">
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="adm_catalogo.php">Home</a></li>
                        <li class="breadcrumb-item active">Gestion Usuario</li>
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
                                <input id="buscar" type="text" class="form-control float-left" placeholder="Ingresar Nombre">
                                <div class="input-group-append">
                                    <button class="btn btn-default"><i class="fas fa-search"></i></button>
                                </div>
                            </div>
                    </div>
                    <div class="card-body p-0 m-2">
                            <div id="usuarios" class="row d-flex align-items-stretch">
                            </div>
                    </div>
                    <div class="card-footer"></div>
                </div>
            </div>
        </div>
    </section>
</div>


<!-- Fin del cont principal -->


<?php 
require_once "layouts/parte_inferior.php";
?>
<script src="../js/Gestion_Usuario.js"></script>
<?php 
}
else{
	header('Location: ../index.php');
}?>
