<?php
session_start();
include_once './layouts/header.php';
?>

<title>Admin | Editar datos Personales</title>

<div class="modal fade" id="cambiarcontra" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Cambiar Contraseña</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
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
                    <input type="hidden" id="id_user_pass">
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
                        <li class="breadcrumb-item"><a href="../Views/dashboard.php">Inicio</a></li>
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
                    <div class="card card-success card-outline" id="user-profile">

                    </div>
                    <div class="card card-success">
                        <div class="card-header">
                            <h3 class="card-title">Sobre Mi</h3>
                        </div>
                        <div class="card-body" id="info-user-profile">

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
                            <form id="form-usuario-profile" class="form-horizontal">
                                <div class="form-group row">
                                    <label for="telefono" class="col-sm-2 col-form-label">
                                        Telefono
                                    </label>
                                    <div class="col-sm-10">
                                        <input type="number" id="telefono" class="form-control">
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
                                <input type="hidden" id="id_edit_usuario">

                                <button type="submit" class="btn btn-block btn-outline-success">Guardar</button>
                            </form>
                        </div>
                        <div class="card-footer">
                            <p class="text-muted">Cuidado con ingresar datos erroneos</p>
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
<script src="./Usuario.js"></script>