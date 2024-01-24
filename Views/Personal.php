<?php
session_start();
include_once $_SERVER["DOCUMENT_ROOT"].'/filippi/Views/layouts/header.php';
?>
<link rel="stylesheet" href="../Util/css/style_print.css">
<title>Panel de Control</title>


<div class="modal fade" id="orden-compra" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="card card-success">
            <div class="card-header">
                    <h5 class="card-title"><b>Crear Orden de Compra</b></h5>
                        <button data-dismiss="modal" aria-label="close" class="close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-lg-6 border-right">
                            <div class="card card-success">
                                <div class="modal-header">
                                <h1 class="modal-title fs-5 text-sm"></h1>
                                </div>
                                <div class="modal-body">
                                    <form id="form-crear-orden-compra">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label for="order_tipo_gasto">Elegir Tipo de Gasto</label>
                                                    <select name="order_tipo_gasto" class="form-control select2" id="order_tipo_gasto"></select>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label for="autorizado">Autorizado</label>
                                                    <select class="form-control select2" id="autorizado"></select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label for="proveedor">Proveedor</label>
                                            <select class="form-control select2" id="proveedor"></select>
                                        </div>
                                        <div class="form-group">
                                            <hr>
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <div class="form-group">
                                                        <label for="cantidad">Cantidad</label>
                                                        <input type="number" class="form-control" id="cantidad" placeholder="Ingresar cantidad">
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="detalle">Detalle</label>
                                                        <input type="text" class="form-control" id="detalle"  placeholder="Ingresar detalle">
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="obra">Obra</label>
                                                        <input type="text" class="form-control" id="obra" placeholder="Ingresar obra">
                                                    </div>
                                                </div>
                                                
                                                <div class="col-md-6">
                                                    <div class="form-group">
                                                        <label for="equipo">Equipo</label>
                                                        <select class="form-control select2" id="equipo"></select>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="monto">Monto</label>
                                                        <input type="text" class="form-control" id="monto" placeholder="Ingresar monto" require>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="total">Total</label>
                                                        <input type="text" class="form-control" id="total" placeholder="Ingresar total">
                                                    </div>
                                                </div>
                                                <button type="button" class="btn btn-primary" id="agregar-dato">Agregar Pedido</button>
                                            </div>
                                            <hr>
                                        </div>
                                        <div class="form-group">
                                                <label for="observaciones">Observaciones</label>
                                                <textarea class="form-control" name="observaciones" id="observaciones" cols="30" rows="10"></textarea>
                                        </div>
                                        <input type="hidden" id="id_edit_personal">
                                    
                                </div>
                                <div class="card-footer text-center">
                                    <button type="submit" class="btn btn-success" id="subir-orden">Crear Orden</button>
                                
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            
                            <hr>
                            <div class="card card-success">
                                <div class="modal-header">
                                    <h1 class="modal-title text-sm">Orden de Compra</h1>
                                </div>
                                <div class="modal-body">
                                    <div class="orden">
                                        <div class="titulo">ORDEN DE COMPRA</div>
                                        
                                        <div class="row">
                                            <!-- Primera columna -->
                                            <div class="col-sm-6">
                                                <div class="fecha">
                                                    <div class="etiqueta">FECHA</div>
                                                    <div id="auth-fecha">......</div>
                                                    
                                                    <div class="seccion">
                                                        <div>Tipo de Orden</div>
                                                        <span>ORIGINAL</span>
                                                        <div>MATERIALES - <span id="tipos-gastos">......</span></div>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Segunda columna -->
                                            <div class="col-sm-6 info">
                                                <div class="seccion">
                                                    <div class="etiqueta">N°</div>
                                                    <span>001</span>
                                                    <span id="num_order">......</span>
                                                </div>

                                                <div class="seccion">
                                                    <div>Se autoriza a</div>
                                                    <span id="auth-personal">......</span>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Resto de las secciones aquí -->
                                        

                                        <div class="seccion">
                                            <div>A la compra en el establecimiento: </div>
                                            <b><span id="auth-proveedor">..........</span></b>
                                        </div>
                                        <div class="seccion">
                                            <div>De los siguientes materiales o insumos</div>
                                            <table class="tabla" id="tablaMateriales">
                                                <thead>
                                                    <tr>
                                                        <th>Cantidad</th>
                                                        <th>Detalle</th>
                                                        <th>Obra</th>
                                                        <th>Equipo</th>
                                                        <th>Monto</th>
                                                        <th>Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                </tbody>
                                            </table>
                                        </div>

                                        <div class="seccion">
                                            <div>Observación:</div>
                                            <span id="observacion">....................................</span>
                                        </div>

                                        <div class="total">
                                            <div>TOTAL</div>
                                            <span id="total">$..............................</span>
                                        </div>

                                        <div class="firma">
                                            <label for="firma">..............................</label>
                                            <div>FIRMA AUTORIZADOR</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-footer">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-footer" id="card_footer">
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade subir-archivo" id="vista_personal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="card card-success">
                <div class="card-header">
                    <h3 class="card-title">Personal</h3>
                        <button data-bs-dismiss="modal" aria-label="close" class="close">
                            <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-lg-6 border-right">
                            <h5><b>Actividad</b></h5>
                            <hr>
                            <div id="msg" class="form-group"></div>
                              <div class="form-group">
                                  <label for="id_int" class="control-label">N° Interno:</label>
                                  <span id="id_int"></span>
                              </div>
                              <div class="form-group">
                                  <label for="nombre_int" class="control-label">Nombre:</label>
                                  <span id="nombre_int"></span>
                              </div>
                              <div class="form-group">
                                  <label for="dni_int" class="control-label">DNI:</label>
                                  <span id="dni_int"></span>
                              </div>
                              <div class="form-group">
                                  <label for="cuil_int" class="control-label">Cuil:</label>
                                  <span id="cuil_int"></span>
                              </div>
                              <div class="form-group">
                                  <label for="fecha_ingreso_int" class="control-label">Fecha ingreso: </label>
                                  <span id="fecha_ingreso_int"></span>
                              </div>
                              <div class="form-group">
                                  <label for="obra_social_int" class="control-label">Obra Social: </label>
                                  <span id="obra_social_int"></span>
                              </div>
                              <div class="form-group">
                                  <label for="direccion_int" class="control-label">Direccion: </label>
                                  <span id="direccion_int"></span>
                              </div>
                              <div class="form-group" id="avatar_personal">

                              </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="card card-success">
                                <div class="modal-header">
                                <h1 class="modal-title fs-5 text-sm">Adjuntar Archivos</h1>
                                </div>
                                <div class="modal-body">
                                    <form id="form-adjuntar-archivo-personal" enctype="multipart/form-data">
                                        <div class="form-group text-center" id="adjuntar-archivos">
                                            <label for="archivo" class="custom-file-upload">
                                                <div class="cuadrado">
                                                <div class="linea horizontal"></div>
                                                <div class="linea vertical"></div>
                                                <div class="mas"></div>
                                                </div>
                                                <span>Adjuntar Archivos</span>
                                            </label>
                                            <input type="hidden" name="funcion" id="funcion-personal-pdf">
                                            <input type="hidden" name="id_personal" id="id-personal-pdf">
                                            <input type="hidden" name="id_tipo_archivo_personal" id="id-tipo-archivo-pdf">
                                            <input type="hidden" name="nombre" id="nombre-archivo-pdf">
                                            
                                            <input type="file" id="archivo" name="pdf" class="input-file">
                                            
                                            <select id="tipo_archivos_personal" class="tipo-archivos form-control select2" style="width: 100%; z-index: 1051;"></select>
                                        </div>
                                        <div class="form-group">
                                            <ul class="text-center" id="personal-archivos-lista" class="list-group"></ul>
                                        </div>
                                </div>
                                <div class="card-footer">
                                    <button type="submit" class="btn btn-primary" id="subir">Subir</button>
                                </div>
                                    </form>
                            </div>
                            <hr>
                            <div class="form-group mb-2">
                                <label for="tipo_archivos-select" class="control-label">Buscar Archivos</label>
                                <select id="tipo_archivos-select" class="form-control select2" style="width: 100%;">
                                </select>
                            </div>
                            <div class="d-flex justify-content-center align-items-center">
                                <ul class="list-group m-1" id="archivos-list">
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-footer" id="card_footer">
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="crear-personal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="card card-success">
                <div class="card-header">
                    <h3 class="card-title">Crear Personal</h3>
                        <button data-dismiss="modal" aria-label="close" class="close">
                            <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="card-body">
                    <form id="form-crear-personal">
                        <div class="form-group">
                            <label for="nombre">Nombre Completo</label>
                            <input type="text" class="form-control" id="nombre" placeholder="Ingresar Nombre" required>
                        </div>
                        <div class="form-group">
                            <label for="dni">DNI</label>
                            <input type="text" class="form-control" id="dni" placeholder="Ingresar DNI" required>
                        </div>
                        <div class="form-group">
                            <label for="direccion">Direccion</label>
                            <input type="text" class="form-control" id="direccion" placeholder="Ingresar direccion">
                        </div>
                        <div class="form-group">
                            <label for="cuil">cuil</label>
                            <input type="text" class="form-control" id="cuil" placeholder="Ingresar cuil">
                        </div>
                        <div class="form-group">
                            <label for="fecha_ingreso">Fecha de Ingreso</label>
                            <input type="date" class="form-control" id="fecha_ingreso">
                        </div>
                        <div class="form-group">
                            <label for="fecha_alta">Fecha de Alta</label>
                            <input type="date" class="form-control" id="fecha_alta">
                        </div>
                        <div class="form-group">
                            <label for="fecha_baja">Fecha de baja</label>
                            <input type="date" class="form-control" id="fecha_baja">
                        </div>
                        <div class="form-group">
                            <label for="obrasocial">Obra Social</label>
                            <input type="text" class="form-control" id="obrasocial" placeholder="Ingresar Obrasocial" require>
                        </div>
                        <div class="form-group">
                            <label for="carnet">Vencimiento Carnet</label>
                            <input type="date" class="form-control" id="carnet" placeholder="Ingresar Vencimiento Carnet">
                        </div>
                    <input type="hidden" id="id_edit_personal">
                </div>
                <div class="card-footer">
                    <button type="submit" class="btn btn-primary float-right m-1">Registrar</button>
                    <button type="button" id="close" data-dismiss="modal" class="btn btn-outline-secondary float-right m-1">Cerrar</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="vista_asistencia" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="card card-success">
                <div class="card-header">
                    <h3 class="card-title">Personal</h3>
                        <button data-dismiss="modal" aria-label="close" class="close">
                            <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="card-body">

                <input type="hidden" name="semanaInicio" id="semanaInicio">
                <input type="hidden" name="semanaFin" id="semanaFin">

                    <form id="form-planilla-personal">
                        <div class="form-group d-flex m-1">
                            <h2><b>Elegir Semana</b></h2>
                            <input class="form-control w-1 p-1 m-1" type="date" name="dia-1" id="comienzo-semana" style="width: 20%;"> 
                            //
                            <input class="form-control w-1 p-1 m-1" type="date" name="dia-2" id="final-semana" style="width: 20%;">
                        </div>
                        <table class="table table-bordered table-sm table-hover table-responsive" id="tablaEmpleados">
                            <thead>
                                <tr>
                                    <th>Apellido / nombre</th>
                                    <th>Lun</th>
                                    <th>Mar</th>
                                    <th>Mie</th>
                                    <th>Jue</th>
                                    <th>Vie</th>
                                    <th>Sab</th>
                                    <th>Total Dias</th>
                                    <th>Puesto</th>
                                    <th>Trabajo</th>
                                    <th>Adelanto</th>
                                    <th>Comida</th>
                                    <th>Viaje</th>
                                    <th>Domingos</th>
                                    <th>Extras</th>
                                    <th>Total Bonificacion</th>
                                    <th>Sueldo Mensual</th>
                                    <th>Sueldo Semanal</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </form>
                </div>
                <div class="card-footer float-end">
                        <button id="registrarSemanaBtn" class="btn btn-success d-flex py-1 px-2">
                                 Registrar Semana <i class="fa-solid fa-calendar-week ml-1" style="color:white;"></i>
                        </button>
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
                        <img src="/filippi/Util/img/productos/prod_default.png" id="logoactual" class="img-fluid redounded">
                    </div>
                    <div class="text-center">
                        <p id="nombre_img"></p>
                    </div>
                    <form id="form-logo-prod" enctype="multipart/form-data">
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

<div class="content-wrapper" style="min-height: 2838.44px;">
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1>Personal 
                    <button type="button" data-toggle="modal" data-target="#crear-personal" class="btn btn-primary btn-sm ml-1">Crear Nuevo Personal</button>
                </h1>
            </div>
            <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item"><a href="#">Inicio</a></li>
                <li class="breadcrumb-item active">Personal</li>
                </ol>
            </div>
        </div>
      </div>
    </section>
    <section class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-7">
                    <div class="card card-solid">
                        <div class="card-body pb-0">
                            <p class="text-center text-sm text-muted p-0">Datos ficticios solo para demostracion</p>
                            <div class="row">
                                <div class="col-12 col-sm-8 col-md-12 d-flex align-items-stretch flex-column" id="personal">
                                    
                                </div>
                                <div class="card-footer">
                                    <nav aria-label="Contacts Page Navigation">
                                        <ul class="pagination justify-content-center m-0" id="pagination-container">
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-5">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Ordenes de compra</h3>
                        </div>
                        <div class="card-body">
                        <button type="button" data-toggle="modal" data-target="#orden-compra" class="btn btn-success btn-sm ml-1">Crear Orden</button>
                        
                            <div class="table-responsive text-center">
                                <table class="table table-bordered table-sm table-hover" id="orden_compras_compra">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>N° orden</th>
                                            <th>Proveedor</th>
                                            <th>Autorizado</th>
                                            <th>Fecha</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="card-footer clearfix">
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Seguimiento asistencias</h3>
                            <button type="button" data-toggle="modal" data-target="#vista_asistencia" class="btn btn-primary btn-sm ml-1">Seguimiento</button>

                        </div>
                        <div class="card-body">
                        
                            <div class="table-responsive text-center">
                                <table class="table table-bordered table-sm table-hover" id="tablaAsistencia">
                                    <thead>
                                        <tr>
                                            <th>Apellido / nombre</th>
                                            <th>Total Semanal</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="card-footer clearfix">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>
<?php 
include_once $_SERVER["DOCUMENT_ROOT"]."/filippi/Views/layouts/footer.php";
?>
<script src="/filippi/Views/Personal.js"></script>
<script src="/filippi/Views/orden_compra.js"></script>