<?php session_start();
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
<title>Admin | Gestión Usuarios</title>

<!-- Modal -->
<div class="modal fade" id="confirmar" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Comfirmar Acción</h1>
                <button type="button" class="btn-close btn" data-dismiss="modal" aria-label="Close"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <div class="text-center">
                    <b id="nombre_usuario">
                    </b>
                </div>
                <span>Necesitamos tu contraseña para continuar</span>
                <div class="alert alert-success text-center" id="confirmado" style='display:none;'>
                    <span><i class="fas fa-check m-1"></i>Se modificó al usuario</span>
                </div>
                <div class="alert alert-danger text-center" id="rechazado" style='display:none;'>
                    <span><i class="fas fa-times m-1"></i>La contraseña no es correcta</span>
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

<div class="modal modal-op-facturas fade" id="crear-rol" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="card card-secondary">
                <div class="card-header">
                    <h3 class="card-title">Crear Rol</h3>
                    <button data-dismiss="modal" aria-label="close" class="close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-lg-12 border-right">
                            <h5><b>Crear un nuevo rol</b></h5>
                            <hr>
                            <form id="form-crear-rol">
                                <div class="form-group">
                                    <label for="rol_name" class="control-label">Nombre del Rol:</label>
                                    <input class="form-control" type="text" name="rol" id="rol_name" required>
                                </div>
                                <div class="form-group">
                                    <label class="control-label">Módulos Permitidos:</label>
                                    <div>
                                        <label><input type="checkbox" name="modulos[]" value="gestion_usuario"> Gestión Usuario</label><br>
                                        <label><input type="checkbox" name="modulos[]" value="vehiculos"> Vehículos</label><br>
                                        <label><input type="checkbox" name="modulos[]" value="consumo"> Consumo</label><br>
                                        <label><input type="checkbox" name="modulos[]" value="facturacion"> Facturación</label><br>
                                        <label><input type="checkbox" name="modulos[]" value="patio"> Patio</label><br>
                                        <label><input type="checkbox" name="modulos[]" value="personal"> Personal</label><br>
                                        <label><input type="checkbox" name="modulos[]" value="clientes_proveedores"> Clientes y Proveedores</label><br>
                                        <label><input type="checkbox" name="modulos[]" value="almacenes"> Almacenes</label><br>
                                        <label><input type="checkbox" name="modulos[]" value="productos"> Productos</label><br>
                                    </div>
                                </div>
                                <button type="submit" id="crearRolesBtn" class="btn btn-primary">Crear Rol</button>
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

<div class="modal fade" id="crearusuario" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="card card-light">
                <div class="card-header">
                    <h3 class="card-title" data-toggle="tooltip" data-placement="bottom" title="Asegúrese de ingresar datos correctos para evitar errores">
                        <span class="placeholder-wave">
                            <i class="fa-solid fa-circle-exclamation text-yellow"></i>
                        </span>

                        Crear Usuario
                    </h3>

                    <button data-dismiss="modal" aria-label="close" class="close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="card-body">


                    <form id="form-crear" class="form-horizontal">
                        <div class="form-group row">
                            <label for="nombre">Nombre</label>
                            <input type="text" id="nombre" class="form-control" placeholder="Ingrese Nombre">
                        </div>
                        <div class="form-group row">
                            <label for="apellido">Apellido</label>
                            <input type="text" id="apellido" class="form-control" placeholder="Ingrese Apellido" required>
                        </div>
                        <div class="form-group row">
                            <label for="correo">Correo</label>
                            <input type="email" id="correo" class="form-control" placeholder="Ingrese Correo" required>
                        </div>
                        <div class="form-group row">
                            <label for="telefono">Telefono</label>
                            <input type="number" id="telefono" class="form-control" placeholder="Ingrese Telefono" required>
                        </div>
                        <div class="form-group row">
                            <label for="dni">DNI o Numero de Usuario</label>
                            <input type="number" id="dni" class="form-control" placeholder="Ingrese dni" required>
                        </div>
                        <div class="form-group row">
                            <label for="pass">Contraseña</label>
                            <input type="password" id="pass" class="form-control" placeholder="Ingrese contraseña" required>
                        </div>
                        <div class="form-group row">
                            <label for="rol">Asignar rol</label>
                            <select id="asignar_rol" class="tipo-archivos form-control select2" style="width: 100%; z-index: 1051;"></select>
                        </div>
                </div>
                <div class="card-footer">
                    <div class="form-group row">
                        <button type="submit" class="btn btn-block btn-outline-success">Guardar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="content-wrapper">
    <section class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1>Gestión de Usuarios</h1>
                    <button id="button-crear" type="button" data-toggle="modal" data-target="#crearusuario" class="btn btn-primary ml-2">Crear usuario</button>
                    <button id="button-crear" type="button" data-toggle="modal" data-target="#crear-rol" class="btn btn-secondary ml-2">Crear rol</button>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="../Views/dashboard.php">Inicio</a></li>
                        <li class="breadcrumb-item active">Gestión Usuario</li>
                    </ol>
                </div>
            </div>
        </div>
    </section>
    <section>
        <div class="container-fluid">
            <div class="card card-light">
                <div class="card-header">
                    <h4 class="card-title">Buscar usuario</h4>
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
    </section>
</div>

<?php
include_once "./layouts/footer.php";
?>
<script type="module" src="./Gestion_Usuario.js"></script>