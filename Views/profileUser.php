<?php
session_start();
include_once './layouts/header.php';
?>
<div class="modal modal-op-facturas fade" id="cambiarcontra" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabindex="2">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Cambiar Contraseña</h1>
                <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
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
                <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">cerrar</button>
                <button type="submit" class="btn btn-primary">Guardar</button>
                </form>
            </div>
        </div>
    </div>
</div>
<div class="modal modal-op-facturas fade" id="cambiophoto" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabindex="2">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Cambiar foto</h1>
                <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="form-photo" enctype="multipart/form-data">
                    <div class="input-group mb-3 ml-5 mt-2">
                        <input type="file" name="photo" class="input-group">
                        <input type="hidden" name="funcion" value="cambiar_foto">
                        <input type="hidden" name="id_user_profile" id="id_user_profile">
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

<title>Admin | Editar datos Personales</title>

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
                    <div class="card card-light card-outline" id="user-profile">

                    </div>
                    <div class="card card-light">
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
                    <div class="card card-light">
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

                                <button type="submit" class="btn btn-block btn-outline-light">Guardar</button>
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
<script type="module" src="./Usuario.js"></script>