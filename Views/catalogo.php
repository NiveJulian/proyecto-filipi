<?php
session_start();
include_once $_SERVER["DOCUMENT_ROOT"].'/filippi/Views/layouts/header.php';
?>
<style>
.table_scroll{
  overflow: scroll;
  height: 400px;
  overflow-x: hidden;
}
#carrito_compras{
  padding: 0px !important;
  margin: 0px !important;
}
</style>
<title>Panel de Control</title>

<!-- Modal -->
<div class="modal fade" id="vista_vehiculo" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="card card-success">
                <div class="card-header">
                    <h3 class="card-title">Resumen</h3>
                        <button data-bs-dismiss="modal" aria-label="close" class="close">
                            <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="card-body">
                  <form action="" id="manage-course">
                    <div class="row">
                        <div class="col-lg-6 border-right">
                            <h5><b>Actividad</b></h5>
                            <hr>
                            <div id="msg" class="form-group"></div>
                              <div class="form-group">
                                  <label for="" class="control-label" >Patente:</label>
                                  <span id="patente"></span>
                              </div>
                              <div class="form-group">
                                  <label for="" class="control-label" >Vehiculo:</label>
                                  <span id="dato_vehiculo"></span>
                              </div>
                              <div class="form-group">
                                  <label for="" class="control-label" >N° Motor:</label>
                                  <span id="numero_motor"></span>
                              </div>
                              <div class="form-group">
                                  <label for="" class="control-label" >N° Cedula:</label>
                                  <span id="numero_cedula"></span>
                              </div>
                              <div class="form-group" id="avatar_vehiculo">
                            
                              </div>
                        </div>
                        <div class="col-lg-6">
                            <h5><b>Información de los Vencimiento</b></h5>
                            <hr>
                            <div class="">
                                <div class="form-group mb-2">
                                </div>
                                <div class="form-group">
                                </div>
                            </div>
                            <hr>
                            <div class="form-group mb-2">
                                <label for="tipo_archivos-select" class="control-label">Tipo de Archivo</label>
                                <select id="tipo_archivos-select" class="form-control select2" style="width: 100%;">
                                </select>
                            </div>
                            <div class="d-flex justify-content-center align-items-center">
                                <ul class="list-group m-1" id="archivos-list">
                                </ul>
                            </div>
                        </div>
                    </div>
                </form>
                </div>
                <div class="card-footer" id="card_footer">
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="adjuntar-archivos-pdf" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="card card-success">
            <div class="modal-header">
              <h1 class="modal-title fs-5 text-sm">Adjuntar Archivos</h1>
              <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form id="form-adjuntar-archivo-pdf" enctype="multipart/form-data">
                <div class="form-group text-center" id="adjuntar-archivos">
                  <label for="archivo" class="custom-file-upload">
                    <div class="cuadrado">
                      <div class="linea horizontal"></div>
                      <div class="linea vertical"></div>
                      <div class="mas"></div>
                    </div>
                    <span>Adjuntar Archivos</span>
                  </label>
                  <input type="hidden" name="funcion" id="funcion-pdf">
                  <input type="hidden" name="id_vehiculo" id="id-vehiculo-pdf">
                  <input type="hidden" name="id_tipo_archivo" id="id-tipo-archivo-pdf">
                  <input type="hidden" name="nombre" id="nombre-archivo-pdf">
                  
                  <input type="file" id="archivo" name="pdf" class="input-file">
                  
                  <select id="tipo_archivos" class="tipo-archivos form-control select2" style="width: 100%; z-index: 1051;"></select>
                </div>
                <div class="form-group">
                  <ul class="text-center" id="archivos-lista" class="list-group"></ul>
                </div>
            </div>
            <div class="card-footer">
                <button type="button" data-dismiss="modal" class="btn btn-secondary">Cerrar</button>
                <button type="submit" class="btn btn-primary">Guardar</button>
              </form>
            </div>
          </div>
        </div>
    </div>
</div>

<div class="modal fade" id="vista_resumen" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="card card-success">
                <div class="card-header">
                    <h3 class="card-title">Resumen</h3>
                        <button data-dismiss="modal" aria-label="close" class="close">
                            <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-sm-4">
                        <div class="form-group">
                            <label for="num_ref">Referencia:</label>
                            <span id="num_ref"></span>
                        </div>
                        <div class="form-group">
                            <label for="patente_vista">Patente / Codigo:</label>
                            <span id="patente_vista"></span>
                        </div>
                        <div class="form-group">
                            <label for="vehiculo_vista">Vehiculo:</label>
                            <span id="vehiculo_vista"></span>
                        </div>
                    </div>
                    <div class="col-md-8">
                      <table class="table table-hover table-responsive">
                        <thead class="table-success">
                            <tr>
                                <th>#</th>
                                <th>VTV</th>
                                <th>CEDULA</th>
                                <th>R.U.T.A</th>
                                <th>SENASA</th>
                                <th>SEGURO</th>
                                <th>POLIZA</th>
                            </tr>
                        </thead>
                        <tbody class="table-warning table-nowrap" id="detalles">

                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div class="card-footer" id="card_footer">
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

<div class="modal fade" id="crear_compra" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-fullscreen">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Crear Compra</h5>
      </div>
      <div class="modal-body p-0">
          <div class="card col-sm-12 p-3">
            <div class="alert alert-danger text-center" id="noadd-compra" style='display:none;'>
                <span id='error-compra'><i class="fas fa-times m-1"></i>no se agrego</span>
            </div>
            <form id="form-crear-compra">
                <div class="form-group">
                    <label for="num_factura">N° Factura: </label>
                    <input id="num_factura"type="text" class="form-control" placeholder="Ingrese codigo de factura" required>
                </div>
                <div class="form-group">
                    <label for="fecha_compra">Fecha de compra: </label>
                    <input id="fecha_compra"type="date" class="form-control" placeholder="Ingrese fecha de compra" required>
                </div>
                <div class="form-group">
                    <label for="fecha_entrega">Fecha de entrega: </label>
                    <input id="fecha_entrega"type="date" class="form-control" placeholder="Ingrese fecha de entrega" required>
                </div>
                <div class="form-group">
                    <label for="total">Total</label>
                    <input id="factura"type="number" class="form-control" value='1' placeholder="Ingrese total" required>
                </div>
                <div class="form-group">
                    <label for="estado">Estado de pago</label>
                    <select  id="estado" class="form-control select2" style="width: 100%"></select>
                </div>
                <div class="form-group">
                    <label for="proveedor">Proveedor</label>
                    <select  id="proveedor" class="form-control select2" style="width: 100%"></select>
                </div>
            </form>
          </div>
          <div class="card col-sm-12 p-3">
            <div class="card p-3">
              <div class="alert alert-success text-center" id="add-prod" style='display:none;'>
                  <span><i class="fas fa-check m-1"></i>Se agrego correctamente</span>
              </div>
              <div class="alert alert-danger text-center" id="noadd-prod" style='display:none;'>
                  <span id='error'><i class="fas fa-times m-1"></i>no se agrego</span>
              </div>
                  <div class="form-group">
                      <label for="producto">Producto</label>
                      <select  id="producto" class="form-control select2" style="width: 100%"></select>
                  </div>
                  <div class="form-group">
                      <label for="codigo_lote">Codigo</label>
                      <input id="codigo_lote"type="text" class="form-control" placeholder="Ingrese codigo de lote" required>
                  </div>
                  <div class="form-group">
                      <label for="cantidad">Cantidad</label>
                      <input id="cantidad"type="number" class="form-control" value='1' placeholder="Ingrese cantidad" required>
                  </div>
                  <div class="form-group ">
                      <label for="entrega">Fecha entrega: </label>
                      <input id="entrega" type="date" class="form-control" placeholder="Ingrese fecha de entrega" required>
                  </div>
                  <div class="form-group">
                      <label for="precio_compra">Precio de compra</label>
                      <input id="precio_compra"type="number" step="any" class="form-control" value='1' placeholder="Ingrese precio de compra" required>
                  </div>
                  <div class="form-group text-right">
                      <button class="agregar-producto btn btn-success ml-2">Agregar</button>
                  </div>
              </div>
          </div>
          <div class="card col-sm-12">
                <table class="table table-hover text-nowrap table-responsive">
                    <thead class='table-success'>
                        <tr>
                        
                            <th>Producto</th>
                            <th>Codigo</th>
                            <th>Cantidad</th>
                            <th>Fecha de Entrega</th>
                            <th>Precio de compra</th>
                            <th>Operacion</th>
                        </tr>
                    </thead>
                    <tbody id="registros_compra" class='table-active'>
                    </tbody>
                </table>
                <button class="crear-compra btn btn-info text-center">Crear compra</button>
        </div>
      </div>
      <div class="modal-footer">
        
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="crear-producto" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="card card-success">
                <div class="card-header">
                    <h3 class="card-title">Crear Vehiculo</h3>
                        <button data-dismiss="modal" aria-label="close" class="close">
                            <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="card-body">
                    <form id="form-crear-producto" enctype="multipart/form-data">
                        <div class="form-group">
                            <label for="codigo_vehiculo">Patente Vehiculo</label>
                            <input type="text" class="form-control" id="codigo_vehiculo" placeholder="Ingresar Codigo de Vehiculo" required>
                        </div>
                        <div class="form-group">
                            <label for="vehiculo">Vehiculo</label>
                            <input type="text" class="form-control" id="vehiculo" placeholder="Ingresar vehiculo" required>
                        </div>
                        <!-- AGREGAR OPCIONES -->
                        <div class="form-group">
                          <label for="registro">Elige lo que vas registrar</label>
                          <p class="text-muted text-sm">Podes elegir varias opciones</p>
                          <hr>
                          <div class="text-center">
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="checkbox" value="" id="motor-toggle">
                                <label class="form-check-label" for="motor-toggle">N° Motor</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="checkbox" value="" id="cedula-toggle">
                                <label class="form-check-label" for="cedula-toggle">Cedula</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="checkbox" value="" id="logistica-toggle">
                                <label class="form-check-label" for="logistica-toggle">R.U.T.A</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="checkbox" value="" id="vtv-toggle">
                                <label class="form-check-label" for="vtv-toggle">VTV</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="checkbox" value="" id="senasa-toggle">
                                <label class="form-check-label" for="senasa-toggle">SENASA</label>
                            </div>
                          </div>
                        </div>
                        <div class="form-group" id="vtv-input-group" style="display: none;">
                            <label for="vtv">VTV</label>
                            <input type="date" class="form-control" id="vencimiento_vtv" placeholder="Ingresar Vencimiento">
                        </div>
                        <div class="form-group" id="motor-input-group" style="display: none;">
                            <label for="motor">N° Motor</label>
                            <input type="text" class="form-control" id="motor" placeholder="Ingresar N° Motor">
                        </div>
                        <div class="form-group" id="cedula-input-group" style="display: none;">
                            <label for="cedula">N° Chasis</label>
                            <input type="text" class="form-control" id="cedula" placeholder="Ingresar N° Chasis">
                            
                            <label for="vencimiento_cedula">Vencimiento Cedula Verde</label>
                            <input type="date" class="form-control" id="vencimiento_cedula" placeholder="Ingresar Vencimiento">
                        </div>
                        <div class="form-group" id="ruta-input-group" style="display: none;">
                            <label for="logistica">Ruta Logistica</label>
                            <input type="date" class="form-control" id="vencimiento_logistica" placeholder="Ingresar vencimiento">
                        </div>
                        <div class="form-group" id="senasa-input-group" style="display: none;">
                            <label for="senasa">Senasa</label>
                            <input type="date" class="form-control" id="vencimiento_senasa" placeholder="Ingresar vencimiento">
                        </div>
                        <hr>
                        <hr>
                        <div class="form-group">
                          <div class="toggle-container form-check form-switch">
                            <input class="form-check-input" type="checkbox" role="switch" id="otros-datos-toggle">
                            <label for="otros-datos-toggle">Otros datos</label>
                            <span class="icon">></span>
                          </div>
                        </div>
                        
                        <div id="otros-datos" style="display: none;">
                          <div class="form-group">
                              <label for="vencimiento_matafuego">Venciminto Matafuego</label>
                              <input type="date" class="form-control" id="vencimiento_matafuego" placeholder="Ingresar vencimiento">
                          </div>
                          <div class="form-group">
                              <label for="vencimiento_seguro">Pago Seguro</label>
                              <input type="date" class="form-control" id="vencimiento_seguro" placeholder="Ingresar vencimiento">
                          </div>
                          <div class="form-group">
                              <label for="poliza">Poliza</label>
                              <input type="text" class="form-control" id="poliza" placeholder="Ingresar Numero de Poliza">
                              <b>Vencimiento Poliza</b>
                              <input type="date" class="form-control" id="vencimiento_poliza" placeholder="Ingresar vencimiento">
                          </div>
                        </div>
                        <input type="hidden" id="id_edit_prod">
                </div>
                <div class="card-footer">
                            <button type="submit" class="btn btn-primary float-right m-1">Guardar</button>
                            <button type="button" id="close" data-dismiss="modal" class="btn btn-outline-secondary float-right m-1">Cerrar</button>
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
            <h1>Panel Vehiculos</h1>
          </div>
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="#">Inicio</a></li>
              <li class="breadcrumb-item active">Panel Vehiculos</li>
            </ol>
          </div>
        </div>
      </div>
    </section>
    <section class="content" id="content_admin">
      <div class="container-fluid">
            <div class="row">
              <div class="col-md-7 card-notification" id="card_catalogo">
                    <!-- Contenido actual -->
                    <div class="card">
                      <div class="card-header">
                        <h3 class="card-title">Vehiculos
                          <a href="#" class="btn btn-primary ml-auto" type="button" data-toggle="modal" data-target="#crear-producto">Ingresar Datos</a>
                        </h3>
                      </div>
                      <div class="card-body">
                        <table id="datos_vehiculos" class="table table-hover">
                            <thead class="table-success">
                                <tr>
                                  <th class="text-center">Documentacion</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                      </div>
                      <div class="card-footer">
                        Busque los productos para agregar al carrito.
                      </div>
                    </div>
              </div>
              <div class="col-md-5 card-notification">
                <div class="card">
                    <div class="card-header text-center">
                        <h2 class="card-title">Resumen de la Actividad</h2>
                    </div>
                    <div class="card-body p-0 m-1">
                      <table id="obtener_resumen" class="table table-warning table-sm responsive table-hover">
                            <thead class="table-primary">
                                <tr>
                                    <th>#</th>
                                    <th>Patente</th>
                                    <th>Vehiculo</th>
                                    <th>Días para Vencer</th>
                                </tr>
                            </thead>
                            <tbody id="ver_resumen">
                            </tbody>
                      </table>
                    </div>
                    <div class="card-footer"></div>
                </div>
              </div>
            </div>
        </div>
    </section>
</div>
<?php 
include_once $_SERVER["DOCUMENT_ROOT"]."/filippi/Views/layouts/footer.php";
?>
<script src="/filippi/Views/Catalogo.js"></script>


