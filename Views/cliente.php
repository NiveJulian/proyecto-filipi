<?php 
session_start();
if($_SESSION['us_tipo']==1 || $_SESSION['us_tipo']==3) {
    require_once "layouts/parte_superior.php";
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
<title>Admin | Gestion Cliente</title>
<!-- Modal -->
<div class="modal fade" id="editarcliente" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="card card-secondary">
                <div class="card-header">
                    <h3 class="card-title">Editar cliente</h3>
                        <button data-dismiss="modal" aria-label="close" class="close">
                            <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="card-body">
                    <div class="aler alert-success text-center" id="edit-cli" style="display:none;">
                        <span><i class="fas fa-check m-1"></i>Se edito correctamente</span>
                    </div>
                    <div class="aler alert-danger text-center" id="noedit-cli" style="display:none;">
                        <span><i class="fas fa-times m-1"></i>No se pudo editar</span>
                    </div>
                    <form id="form_editar_cliente">
                        <div class="form-group">
                            <label for="telefono_edit">Telefono</label>
                            <input name="telefono_edit" type="number" class="form-control" id="telefono_edit" placeholder="Ingresar telefono" require>
                        </div>
                        <div class="form-group">
                            <label for="correo_edit">Correo</label>
                            <input type="email" class="form-control" id="correo_edit" placeholder="Ingresar correo">
                        </div>
                        <div class="form-group">
                            <label for="razon_social_edit">Razon Social</label>
                            <input type="text" class="form-control" id="razon_social_edit" placeholder="Ingresar razon social" require>
                        </div>
                        <div class="form-group">
                            <label for="adicional_edit">Adicional</label>
                            <input type="text" class="form-control" id="adicional_edit" placeholder="Ingresar adicional">
                        </div>
                        <input type="hidden" id="id_cliente">
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
<div class="modal fade" id="crearcliente" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="card card-secondary">
                <div class="card-header">
                    <h3 class="card-title">Crear cliente</h3>
                        <button data-dismiss="modal" aria-label="close" class="close">
                            <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="card-body">
                    <div class="aler alert-success text-center" id="add-cli" style="display:none;">
                        <span><i class="fas fa-check m-1"></i>Se agrego correctamente</span>
                    </div>
                    <div class="aler alert-danger text-center" id="noadd-cli" style="display:none;">
                        <span><i class="fas fa-times m-1"></i>El cliente ya existe</span>
                    </div>
                    <form id="form-crear-cliente">
                        <div class="form-group">
                            <label for="nombre">Nombre</label>
                            <input type="text" class="form-control" id="nombre" placeholder="Ingresar Nombre" required>
                        </div>
                        <div class="form-group">
                            <label for="apellido">Apellido</label>
                            <input type="text" class="form-control" id="apellido" placeholder="Ingresar apellido" required>
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
                            <label for="razon_social">Razon Social</label>
                            <input type="text" class="form-control" id="razon_social" placeholder="Ingresar razon social">
                        </div>
                        <div class="form-group">
                            <label for="adicional">Adicional</label>
                            <input type="text" class="form-control" id="adicional" placeholder="Ingresar adicional">
                        </div>
                        <input type="hidden" id="id_edit_cliente">
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
                    <h1>Clientes<button type="button" data-toggle="modal" data-target="#crearcliente" class="btn btn-primary ml-2">Crear cliente</button></h1>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="../vistas/adm_catalogo.php">Home</a></li>
                        <li class="breadcrumb-item active">Clientes</li>
                    </ol>
                </div>
            </div>
        </div>
    </section>
    <section>
        <div class="container-fluid">
            <div class="card card-secondary"></div>
                <div class="card-header">
                    <h4 class="card-title">Buscar cliente</h4>
                        <div class="input-group">
                            <input id="buscar_cliente" type="text" class="form-control float-left" placeholder="Ingresar nombre cliente">
                            <div class="input-group-append">
                                <button class="btn btn-default"><i class="fas fa-search"></i></button>
                            </div>
                        </div>
                </div>
                <div class="card-body">
                        <div class="row d-flex alingn-items-stretch" id="clientes">
                        </div>
                </div>
                <div class="card-footer"></div>
            </div>
        </div>
    </section>
</div>



<!-- Fin del cont principal -->


<?php require_once "layouts/parte_inferior.php"; ?>
<script src="../js/cliente.js"></script>

<?php
}
else{
	header('Location: ../index.php');
}
?>