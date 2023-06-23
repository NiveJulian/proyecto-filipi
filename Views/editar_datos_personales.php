<?php 
session_start();
if($_SESSION['us_tipo']==1 || $_SESSION['us_tipo']==3 || $_SESSION['us_tipo']==2) {
?>
<title>Admin | Editar datos Personales</title>
<?php
require_once "layouts/parte_superior.php";
?>
<div class="modal fade" id="cambiarcontra" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Cambiar Contraseña</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
        <div class="alert alert-success text-center" id="update" style='display:none;'>
            <span><i class="fas fa-check m-1"></i>Se cambio password correctamente</span>
        </div>
        <div class="alert alert-danger text-center" id="noupdate" style='display:none;'>
            <span><i class="fas fa-times m-1"></i>El password no es correcto</span>
        </div>
        <form id="form-pass">
            <dib class="input-group mb-3">
                <div class="input-group-prepend">
                <span class="input-group-text"><i class="fas fa-unlock-alt"></i></span>
            </div>
            <input type="password" id="oldpass" class="form-control" placeholder="Ingrese password actual">
            </dib>
            <dib class="input-group mb-3">
                <div class="input-group-prepend">
                <span class="input-group-text"><i class="fas fa-lock"></i></span>
            </div>
            <input type="text" id="newpass" class="form-control" placeholder="Ingrese password nueva">
            </dib>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">cerrar</button>
        <button type="submit" class="btn btn-primary">Guardar</button>
        </form>
      </div>
    </div>
  </div>
</div>
<div class="modal fade" id="cambiophoto" tabindex="-1" aria-labelledby="exampleModalLabel">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Cambiar foto</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="text-center">
            <img id="avatar1" src="../img/avatar2.svg" class="profile-user-img img-fluid img-circle img-sm">
        </div>
        <div class="text-center">
            <b>
                <?php echo $_SESSION['nombre_us']; ?>
            </b>
        </div>
        <div class="alert alert-success text-center" id="edit" style='display:none;'>
            <span><i class="fas fa-check m-1"></i>Se cambio avatar correctamente</span>
        </div>
        <div class="alert alert-danger text-center" id="noedit" style='display:none;'>
            <span><i class="fas fa-times m-1"></i>Formato no soportado</span>
        </div>

        <form id="form-photo" enctype="multipart/form-data">
            <div class="input-group mb-3 ml-5 mt-2">
                <input type="file" name="photo" class="input-group">
                <input type="hidden" name="funcion" value="cambiar_foto">
            </div>
            
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">cerrar</button>
        <button type="submit" class="btn btn-primary">Guardar</button>
        </form>
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
                    <h1>Datos Personales</h1>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="../vistas/adm_catalogo.php">Home</a></li>
                        <li class="breadcrumb-item active">Datos Personales</li>
                    </ol>
                </div>
            </div>
        </div>
    </section>
    <section class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-3">
                    <div class="card card-success card-outline">
                        <div class="card-body box-profile">
                            <div class="text-center">
                                <img id="avatar2" src="../img/avatar2.svg" class="profile-user-img img-fluid img-circle p-4"> 
                            </div>
                            <div class="text-center m-1">
                                <button class="btn btn-primary btn-sm" type="button" data-bs-toggle="modal" data-bs-target="#cambiophoto">Cambiar Avatar</button>
                            </div>
                            <input id="id_usuario" type="hidden" value="<?php echo $_SESSION['usuario']?>">
                            <h3 id="nombre_us" class="profile-username text-center text-success">Nombre</h3>
                            <p id="apellidos_us"class="text-muted text-center">Apellidos</p>
                            <ul class="list-group list-group-unbordered mb-3">
                                <li class="list-group-item">
                                    <b style="color:#0B7300">Edad</b><p id="edad_us" class="float-right">12</p>
                                </li>
                                <li class="list-group-item">
                                    <b style="color:#0B7300">DNI</b><p id="dni_us" class="float-right">12</p>
                                </li>
                                <li class="list-group-item">
                                    <b style="color:#0B7300">Tipo de usuario</b>
                                    <span id="us_tipo" class="float-rigth"></span>
                                </li>
                                <button data-bs-toggle="modal" data-bs-target="#cambiarcontra" type="button" class="btn btn-block btn-outline-warning btn-sm">Cambiar contraseña</button>
                            </ul>
                        </div>
                    </div>
                    <div class="card card-success">
                            <div class="card-header">
                                <h3 class="card-title">Sobre Mi</h3>
                            </div>
                            <div class="card-body">
                                <strong style="color:#0B7300">
                                    <i class="fas fa-phone mr-1"></i>Telefono
                                </strong>
                                <p id="telefono_us" class="text-muted">43434343</p>
                                <strong style="color:#0B7300">
                                    <i class="fas fa-map-marker-alt mr-1"></i>Localidad
                                </strong>
                                <p id="localidad_us"class="text-muted">343434343</p>
                                <strong style="color:#0B7300">
                                <i class="fas fa-at mr-1"></i>Correo
                                </strong>
                                <p id="correo_us" class="text-muted">example@example.com</p>
                                <strong style="color:#0B7300">
                                <i class="fas fa-smile-wink mr-1"></i>Sexo
                                </strong>
                                <p id="sexo_us" class="text-muted">Hombre</p>
                                <strong style="color:#0B7300">
                                <i class="fas fa-pen mr-1"></i>Informacion Adicional
                                </strong>
                                <p id="adicional_us" class="text-muted">asdasdadasda</p>
                                <button class="edit btn btn-block btn-danger">Editar</button>
                            </div>
                            <div class="card-footer">
                                <p class="text-muted">Click en boton si desea editar</p>
                            </div>
                    </div>
                </div>
                <div class="col-md-9">
                    <div class="card card-success">
                        <div class="card-header">
                            <h3 class="card-title">Editar datos Personales</h3>
                        </div>
                        <div class="card-body">
                            <div class="alert alert-success text-center" id="editado" style='display:none;'>
                                <span><i class="fas fa-check m-1"></i>Editado</span>
                            </div>
                            <div class="alert alert-danger text-center" id="noeditado" style='display:none;'>
                                <span><i class="fas fa-times m-1"></i>Edicion Desabilitada</span>
                            </div>
                            <form id="form-usuario" class="form-horizontal">
                                <div class="form-group row">
                                    <label for="telefono" class="col-sm-2 col-form-label">
                                        Telefono
                                    </label>
                                    <div class="col-sm-10">
                                    <input type="number" id="telofono" class="form-control">
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label for="localidad" class="col-sm-2 col-form-label">
                                        Localidad
                                    </label>
                                    <div class="col-sm-10">
                                    <input type="text" id="localidad" class="form-control">
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label for="correo" class="col-sm-2 col-form-label">
                                        Correo
                                    </label>
                                    <div class="col-sm-10">
                                    <input type="text" id="correo" class="form-control">
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label for="Sexo" class="col-sm-2 col-form-label">
                                        Sexo
                                    </label>
                                    <div class="col-sm-10">
                                    <input type="text" id="sexo" class="form-control">
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label for="adicional" class="col-sm-2 col-form-label">
                                        Informacion adicional
                                    </label>
                                    <div class="col-sm-10">
                                    <input type="text" id="adicional" class="form-control">
                                    </div>
                                </div>
                        </div>
                        <div class="card-footer">
                            <div class="form-group row"> 
                                <button class="btn btn-block btn-outline-success">Guardar</button>
                                </form>
                                <p class="text-muted">Cuidado con ingresar datos erroneos</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>


<!-- Fin del cont principal -->

<?php 
require_once "layouts/parte_inferior.php";
?>
<script src="../js/Usuario.js"></script>
<?php 
}
else{
	header('Location: ../index.php');
}?>

