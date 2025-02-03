<?php
session_start();
include_once './layouts/header.php';
?>
<link rel="stylesheet" href="../Util/css/style_print.css">
<link rel="stylesheet" href="../Util/css/personal.css">

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
                                                        <input type="text" class="form-control" id="detalle" placeholder="Ingresar detalle">
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
                    <button data-dismiss="modal" aria-label="close" class="close">
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
                                    <button type="submit" data-toggle="modal" data-target="#crear-tipo-archivo" class="btn btn-success">Crear tipo de archivo</button>
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

<div class="modal fade" id="crear-tipo-archivo" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Crear tipo de archivo</h1>
                <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form>
                    <div class="mb-3">
                        <label for="tipo_archivo" class="col-form-label">Nombre:</label>
                        <input type="text" class="form-control" id="tipo_archivo">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                <button type="button" class="btn btn-primary" id="tipo_archivo_crear">Crear</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="crear-personal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
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
                        <div class="row">
                            <div class="col-md-6">
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
                                    <label for="cuil">Cuil</label>
                                    <input type="text" class="form-control" id="cuil" placeholder="Ingresar cuil">
                                </div>
                                <div class="form-group">
                                    <label for="roles-form">Rol a cumplir</label>
                                    <select class="form-control select2 roles-form" name="roles-form" id="roles_form"></select>
                                </div>
                            </div>
                            <div class="col-md-6">
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
                            </div>
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
                        <img src="../Util/img/productos/prod_default.png" id="logoactual" class="img-fluid redounded">
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

<div class="modal fade" id="vista_asistencia" tabindex="1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="card card-success">
                <div class="card-header">
                    <button data-dismiss="modal" aria-label="close" class="close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <div class="d-flex float-left form-group">
                        <h3><b>Elegir Semana</b></h3>
                    </div>

                </div>
                <div class="card-body">
                    <div class="d-flex float-right border border-solid text-center mr-2">

                        <div class="form-group text-center">
                            <label for="fecha-inicio">Fecha inicio</label>
                            <input class="form-control ml-1" style="width: 90%;" type="date" name="inicio" id="fecha_inicio">
                        </div>
                        <div class="form-group mr-1">
                            <label for="fecha-final">Fecha final</label>
                            <input class="form-control" style="width: 100%;" type="date" name="final" id="fecha_final">
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-md-4 form-group">
                            <label for="buscar">Buscar</label>
                            <input type="text" class="form-control" id="buscarPersonal" placeholder="Buscar por nombre">
                        </div>
                    </div>

                    <div class="btn-container">
                        <div class="btn-group btn-group-rol" role="group" aria-label="Filtros por rol">

                        </div>
                    </div>

                    <form id="form-planilla-personal">

                        <div class="form-group">
                            <table class="table table-bordered table-sm table-hover table-responsive" id="tablaEmpleados">
                                <thead>
                                    <tr>
                                        <th class="text-center">Apellido & nombre</th>
                                        <th>Puesto</th>
                                        <th>Lun</th>
                                        <th>Mar</th>
                                        <th>Mie</th>
                                        <th>Jue</th>
                                        <th>Vier</th>
                                        <th>Sab</th>
                                        <th>Total Dias</th>
                                        <th>Adelanto</th>
                                        <th class="text-center">Cant Viandas</th>
                                        <th>Viaje</th>
                                        <th>Domingos</th>
                                        <th>Extras</th>
                                        <th class="text-center">Total Bonificacion</th>
                                        <th class="text-center">Sueldo Mensual</th>
                                        <th class="text-center">Sueldo Semanal</th>
                                        <th class="text-center">Guardar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
                        </div>

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

<div class="modal modal-op-facturas fade" id="crear-rol" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="card card-success">
                <div class="card-header">
                    <h3 class="card-title">Personal</h3>
                    <button data-dismiss="modal" aria-label="close" class="close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-lg-12 border-right">
                            <h5><b>Crear un nuevo rol</b></h5>
                            <hr>
                            <div id="msg" class="form-group">
                                <div class="form-group">
                                    <label for="rol" class="control-label">Rol:</label>
                                    <input class="form-control" type="text" name="rol" id="rol_name">

                                </div>
                                <div class="form-group">
                                    <label for="valor_sueldo_semanal_rol" class="control-label">Valor sueldo semanal:</label>
                                    <input class="form-control" type="number" name="valor_sueldo_semanal_rol" id="valor_sueldo_semanal_rol">
                                </div>
                                <div class="form-group">
                                    <label for="valor_sueldo_mensual_rol" class="control-label">Valor sueldo mensual:</label>
                                    <input class="form-control" type="number" name="valor_sueldo_mensual_rol" id="valor_sueldo_mensual_rol">
                                </div>

                                <button id="crearRolesBtn" class="btn btn-success">Enviar</button>
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

<div class="modal fade" id="config_asistencia" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                    <div class="row">
                        <div class="col-lg-6 border-right">
                            <h5><b>Configurar sueldos de cada Rol</b></h5>
                            <hr>
                            <div class="form-group">
                                <div class="form-group">
                                    <label for="roles" class="control-label">Rol:</label>
                                    <select class="form-control select2 rol-select" name="roles" id="roles">
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="valor_sueldo_semanal" class="control-label">Valor sueldo semanal:</label>
                                    <input class="form-control" type="number" name="valor_sueldo_semanal" id="valor_sueldo_semanal">
                                </div>
                                <div class="form-group">
                                    <label for="valor_sueldo_mensual" class="control-label">Valor sueldo mensual:</label>
                                    <input class="form-control" type="number" name="valor_sueldo_mensual" id="valor_sueldo_mensual">
                                </div>

                                <button id="enviarRolesBtn" class="btn btn-success">Enviar</button>
                            </div>
                            <div class="card">
                                <div class="card-body">
                                    <table class="table responsive table-hover" id="tablaRoles">
                                        <thead>
                                            <tr>
                                                <th>Rol</th>
                                                <th>Sueldo Semanal</th>
                                                <th>Sueldo Mensual</th>
                                            </tr>
                                        </thead>
                                        <tbody></tbody>
                                    </table>
                                </div>
                            </div>

                        </div>

                        <!-- Comida -->
                        <div class="col-lg-6">
                            <h5><b>Configurar otros valores</b></h5>
                            <hr>
                            <div id="msg" class="form-group">
                                <div class="form-group">
                                    <label for="valor_viandas" class="control-label">Valor de las viandas:</label>
                                    <div class="d-flex">
                                        <input class="form-control" style="width: 80%;" type="number" name="valor_viandas" id="valor_viandas">
                                        <button id="enviarViandasBtn" class="btn btn-primary ml-1">Enviar</button>
                                    </div>


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

<title>Panel de Control</title>

<div class="content-wrapper" style="min-height: 2838.44px;">
    <section class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1>Personal</h1>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="../Views/dashboard.php">Inicio</a></li>
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
                        <div class="card-header">
                            <button type="button" data-toggle="modal" data-target="#crear-personal" class="btn btn-primary btn-sm ml-1">Crear Nuevo Personal</button>
                            <button type="button" data-toggle="modal" data-target="#crear-rol" class="btn btn-primary btn-sm ml-1">Crear Rol</button>
                        </div>
                        <div class="card-body pb-0">
                            <p class="text-center text-sm text-muted p-0">Buscar Personal</p>
                            <div class="row">
                                <div class="text-center form-group">
                                </div>
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
                    <div class="card" id="ordenCompraCard">
                        <div class="card-header">
                            <h3 class="card-title">Ordenes de compra</h3>
                            <button id="toggleCardBtn" class="btn btn-sm btn-link float-right">Mostrar/Ocultar</button>
                        </div>
                        <div class="card-body" id="ordenCompraCardBody">
                            <button type="button" data-toggle="modal" data-target="#orden-compra" class="btn btn-success btn-sm ml-1">Crear Orden</button>

                            <div class="table-responsive text-center">
                                <table class="table table-bordered table-sm table-hover scrollable-table" id="orden_compras_compra">
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
                            <div class="row">
                                <div class="col-sm-10 col-12">
                                    <button type="button" data-toggle="modal" data-target="#vista_asistencia" class="btn btn-primary btn-sm ml-1">Seguimiento</button>
                                </div>
                                <div class="col-sm-2 col-12">
                                    <button type="button" data-toggle="modal" data-target="#config_asistencia" class="btn btn-secondary btn-sm ml-1">
                                        <i class="fas fa-cog"></i>
                                    </button>

                                </div>
                            </div>
                        </div>
                        <div class="card-body">

                            <div class="table-responsive text-center">
                                <table class="table table-bordered table-sm table-hover" id="tablaAsistencia">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Cantidad de Recibos</th>
                                            <th>Inicio / Final</th>
                                            <th>Fecha de Creacion</th>
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
include_once "./layouts/footer.php";
?>
<script src="./Personal.js"></script>
<script src="./orden_compra.js"></script>