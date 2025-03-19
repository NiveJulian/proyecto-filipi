<?php
session_start();
include_once './layouts/header.php';
?>
<style>
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
</style>

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
                        <input type="hidden" name="funcion" value="cambiar_logo_company">
                        <input type="hidden" name="id_company_profile" id="id_company_profile">
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
                    <h1>Perfil de la Empresa</h1>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="../Views/dashboard.php">Inicio</a></li>
                        <li class="breadcrumb-item active">Perfil de la Empresa</li>
                    </ol>
                </div>
            </div>
        </div>
    </section>
    <section class="content">
        <div class="container-fluid">
            <div class="card p-2">
                <div class="card-header">
                    <ul class="nav nav-pills">
                        <li class="nav-item"><a href="#perfil" class="nav-link active" data-toggle="tab">Perfil</a></li>
                    </ul>
                </div>
                <div class="card-body">
                    <div class="tab-content">
                        <div class="tab-pane active">
                            <div class="row">
                                <div class="col-md-3">

                                    <div class="card card-light card-outline" id="empresa-profile">

                                    </div>

                                    <div class="card card-light">
                                        <div class="card-header">
                                            <h3 class="card-title">Sobre la Empresa</h3>
                                        </div>
                                        <div class="card-body" id="info-empresa-profile">
                                        </div>
                                        <div class="card-footer">
                                            <p class="text-muted">Haz clic en el botón para editar</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-9">

                                    <div class="card card-light">
                                        <div class="card-header">
                                            <h3 class="card-title">Editar Información de la Empresa</h3>
                                        </div>
                                        <div class="card-body">
                                            <form id="form-empresa-profile" class="form-horizontal">

                                                <div class="form-group row">
                                                    <label for="razon-social" class="col-sm-2 col-form-label">
                                                        Razón Social
                                                    </label>
                                                    <div class="col-sm-10">
                                                        <input type="text" id="razon-social" class="form-control">
                                                    </div>
                                                </div>

                                                <div class="form-group row">
                                                    <label for="cuit" class="col-sm-2 col-form-label">
                                                        CUIT
                                                    </label>
                                                    <div class="col-sm-10">
                                                        <input type="text" id="cuit" class="form-control">
                                                    </div>
                                                </div>

                                                <div class="form-group row">
                                                    <label for="direccion" class="col-sm-2 col-form-label">
                                                        Dirección
                                                    </label>
                                                    <div class="col-sm-10">
                                                        <input type="text" id="direccion" class="form-control">
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
                                                        <input type="email" id="correo" class="form-control">
                                                    </div>
                                                </div>

                                                <input type="hidden" id="id_empresa">


                                                <button type="submit" class="btn btn-block btn-outline-secondary">Guardar Cambios</button>
                                            </form>
                                        </div>
                                        <div class="card-footer">
                                            <p class="text-muted">Asegúrate de ingresar datos correctos.</p>
                                        </div>
                                    </div>
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
<script type="module" src="./Company.js"></script>