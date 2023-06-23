<?php 
session_start();
if($_SESSION['us_tipo']==1 || $_SESSION['us_tipo']==3) {
?>
<title>Admin | Gestion Atributo</title>
<?php
require_once "layouts/parte_superior.php";
?>
<div class="modal fade" id="creartipo" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="card card-success">
                <div class="card-header">
                    <h3 class="card-title">Crear tipo</h3>
                        <button data-dismiss="modal" aria-label="close" class="close">
                            <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="card-body">
                    <div class="aler alert-success text-center" id="add-tipo" style="display:none;">
                        <span><i class="fas fa-check m-1"></i>Se agrego correctamente</span>
                    </div>
                    <div class="aler alert-danger text-center" id="noadd-tipo" style="display:none;">
                        <span><i class="fas fa-times m-1"></i>Se agrego correctamente</span>
                    </div>
                    <form id="form-crear-tipo">
                        <div class="form-group">
                            <label for="nombre_tipo">Nombre</label>
                            <input type="text" class="form-control" id="nombre_tipo" placeholder="Ingresar Nombre">
                            <input type="hidden" id="id_editar_tip">
                        </div>
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
<div class="modal fade" id="crearpresentacion" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="card card-success">
                <div class="card-header">
                    <h3 class="card-title">Crear presentacion</h3>
                        <button data-dismiss="modal" aria-label="close" class="close">
                            <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="card-body">
                    <div class="aler alert-success text-center" id="add-presentacion" style="display:none;">
                        <span><i class="fas fa-check m-1"></i>Se agrego correctamente</span>
                    </div>
                    <div class="aler alert-danger text-center" id="noadd-presentacion" style="display:none;">
                        <span><i class="fas fa-times m-1"></i>Se agrego correctamente</span>
                    </div>
                    <form id="form-crear-presentacion">
                        <div class="form-group">
                        <label for="nombre_presentacion">Nombre</label>
                        <input type="text" class="form-control" id="nombre_presentacion" placeholder="Ingresar Nombre">
                        <input type="hidden" id="id_editar_pre">
                        </div>
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
                    <h1>Gestion de Atributos</h1>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="../vistas/adm_catalogo.php">Home</a></li>
                        <li class="breadcrumb-item active">Gestion de Atributos</li>
                    </ol>
                </div>
            </div>
        </div>
    </section>
    <section class="content">
      <div class="container-fluid">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <ul class="nav nav-pills">
                            <li class="nav-item"><a href="#tipo" class="nav-link active" data-toggle="tab">Tipo</a></li>
                            <li class="nav-item"><a href="#presentacion" class="nav-link" data-toggle="tab">Presentacion</a></li>
                        </ul>
                    </div>
                    <div class="card-body">
                        <div class="tab-content">
                            <div class="tab-pane active" id="tipo">
                                <div class="card card-success">
                                    <div class="card-header">
                                        <div class="card-title">Buscar tipo <button type="button" data-toggle="modal" data-target="#creartipo" class="btn btn-primary btn-sm">Crear Tipo</button></div>
                                        <div class="input-group-append">
                                            <input id="buscar-tipo" type="text" class="form-control float-left" placeholder="Ingresar Nombre">
                                            <div class="input-group-append">
                                                <button class="btn btn-default"><i class="fas fa-search"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-body p-0">
                                        <table class="table table-over">
                                            <thead class="table-success">
                                                <tr>
                                                    <th>Tipo</th>
                                                    <th>Accion</th>
                                                </tr>
                                            </thead>
                                            <tbody class="table-active" id="tipos">

                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="card-footer"></div>
                                </div>
                            </div>
                            <div class="tab-pane" id="presentacion">
                                <div class="card card-success">
                                    <div class="card-header">
                                        <div class="card-title">Busca Presentacion <button type="button" data-toggle="modal" data-target="#crearpresentacion" class="btn btn-primary btn-sm">Crear Presentacion</button></div>
                                        <div class="input-group">
                                            <input id="buscar-presentacion" type="text" class="form-control float-left" placeholder="Ingresar Nombre">
                                            <div class="input-group-append">
                                                <button class="btn btn-default"><i class="fas fa-search"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-body p-0">
                                        <table class="table table-over">
                                            <thead class="table-success">
                                                <tr>
                                                    <th>Presentacion</th>
                                                    <th>Accion</th>
                                                </tr>
                                            </thead>
                                            <tbody class="table-active" id="presentaciones">

                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="card-footer"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer">

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

<?php 
}
else{
	header('Location: ../index.php');
    
}?>
<script src="../js/tipo.js"></script>
<script src="../js/presentacion.js"></script>
