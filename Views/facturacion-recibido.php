<?php 
session_start();
include_once $_SERVER["DOCUMENT_ROOT"].'/filippi/Views/layouts/header.php';
?>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
<link rel="stylesheet" type="text/css" href="/filippi/Util/css/card-options-factura.css">
<title>Panel | Gestion Facturas Recibido</title>

<div class="modal fade" id="crear-factura" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
    <div class="card card-success">
                <div class="card-header">
                    <h3 class="card-title">Crear Factura</h3>
                        <button data-bs-dismiss="modal" aria-label="close" class="close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                </div>
                <div class="card-body">
                    <form id="form-crear-factura">
                        <div class="form-group">
                            <label for="razon_social">Razon Social</label>
                            <select name="razon_social" class="form-control select2" id="razon_social"></select>
                        </div>
                        <div class="form-group">
                            <label for="cuit">CUIT</label>
                            <input type="text" class="form-control" id="cuit">
                        </div>
                        <div class="form-group">
                            <label for="fecha">Fecha Recibido de Factura</label>
                            <input type="date" class="form-control" id="fecha">
                        </div>
                        <div class="form-group">
                            <label for="numero_factura">N° Factura</label>
                            <input type="text" class="form-control" id="numero_factura" placeholder="Ingresar N° Factura">
                        </div>
                        <div class="form-group">
                            <label for="comprobante">Tipo de Factura</label>
                            <select name="comprobante" class="form-control select2" id="comprobante"></select>
                        </div>
                        <div class="form-group">
                            <label for="punto_venta">Punto de venta</label>
                            <div class="input-group mb-3">
                                <div class="input-group-append">
                                    <span class="input-group-text">0</span>
                                </div>
                                <input type="text" name="punto_venta" class="form-control" id="punto_venta" value="00">
                                <p class="input-group-text text-sm text-muted">Agregar a partir del numero <b>"1"</b>  ya que los <b>"0"</b> registra automaticamente</p>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="equipo">Equipos</label>
                            <select name="equipo" class="form-control select2" id="equipo"></select>
                        </div>
                        <div class="form-group">
                            <label for="subtotal">Subtotal</label>
                            <input type="number" class="form-control" step="any" id="subtotal">
                        </div>

                        <!-- IMPUESTOS -->
                        <div class="form-group text-center">
                            <hr>
                                <div class="form-check form-check-inline">
                                    <label for="iva">IVA</label>
                                    <input class="form-check-input" type="checkbox" value="" id="iva-toggle">
                                </div>
                                
                                <div class="form-check form-check-inline">
                                <label for="itc">ITC</label>
                                    <input class="form-check-input" type="checkbox" value="" id="itc-toggle">
                                
                                </div>
                                    
                                <div class="form-check form-check-inline">
                                <label for="idc">IDC</label>
                                    <input class="form-check-input" type="checkbox" value="" id="idc-toggle">
                                
                                </div>
                                    
                                <div class="form-check form-check-inline">
                                <label for="perc_iibb">PERC IIBB</label>
                                    <input class="form-check-input" type="checkbox" value="" id="iibb-toggle">
                                
                                </div>
                                    
                                <div class="form-check form-check-inline">
                                    <label for="perc_iva">PERC IVA</label>
                                    <input class="form-check-input" type="checkbox" value="" id="periva-toggle">

                                </div>
                                    
                                <div class="form-check form-check-inline">
                                <label for="otros_imp">OTROS IMP</label>
                                    <input class="form-check-input" type="checkbox" value="" id="imp-toggle">
                                
                                </div>
                                    
                                <div class="form-check form-check-inline">
                                <label for="descuento">DESCUENTO</label>
                                    <input class="form-check-input" type="checkbox" value="" id="desc-toggle">
                                    
                                </div>

                                <!-- los inputs -->
                            <div class="form-group" id="iva-input-group" style="display: none;">
                                <hr>
                                <label for="iva">IVA</label>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <input type="number" class="form-control" id="iva" style="width: 75%;" step="any" placeholder="Ingresar IVA">
                                    </div>

                                    <div class="col-sm-6">
                                        <span>IVA: $</span>
                                        <span id="calc_iva"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group" id="itc-input-group" style="display: none;"> 
                                <hr>
                                <label for="itc">ITC</label>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <input type="number" class="form-control" id="itc" style="width: 75%;" step="any" placeholder="Ingresar ITC">
                                    </div>
                                    <div class="col-sm-6">
                                        <span>ITC: $</span>
                                        <span id="calc_itc"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group" id="idc-input-group" style="display: none;">
                                <hr>
                                <label for="idc">IDC</label>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <input type="number" class="form-control" id="idc" style="width: 75%;" step="any" placeholder="Ingresar IDC">
                                    </div>
                                    <div class="col-sm-6">
                                        <span>IDC: $</span>
                                        <span id="calc_idc"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group" id="iibb-input-group" style="display: none;">
                                <hr>
                                <label for="perc_iibb">PERC IIBB</label>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <input type="number" class="form-control" id="perc_iibb" style="width: 75%;" step="any" placeholder="Ingresar PERC IIBB">
                                    </div>
                                    <div class="col-sm-6">
                                        <span>PERC IIBB: $</span>
                                        <span id="calc_perc_iibb"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group" id="perciva-input-group" style="display: none;">
                                <hr>
                                <label for="perc-iva">PERC IVA</label>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <input type="number" class="form-control" id="perc_iva" style="width: 75%;" step="any" placeholder="Ingresar PERC IVA">
                                    </div>
                                    <div class="col-sm-6">
                                        <span>PERC IVA: $</span>
                                        <span id="calc_perc_iva"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group" id="otrosimp-input-group" style="display: none;">
                                <hr>
                                <label for="otros_impuestos">Otros IMP</label>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <input type="number" class="form-control" id="otros_impuestos" style="width: 75%;" step="any" placeholder="Ingresar Otros Impuestos">
                                    </div>
                                    <div class="col-sm-6">
                                        <span>IMP: $</span>
                                        <span id="calc_otro_impuestos"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group" id="descuento-input-group" style="display: none;">
                                <hr>
                                <label for="descuento">Descuento</label>
                                <p class="text-muted text-sm">Registrar numero <b>entero</b> ejemplo: "30" para representar el 30%</p>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <input type="number" class="form-control" id="descuento" style="width: 75%;" step="any" placeholder="Ingresar Descuento">
                                    </div>
                                    <div class="col-sm-6">
                                        <span>IMP: $</span>
                                        <span id="calc_descuento"></span>
                                    </div>
                                </div>
                            </div>
                            <hr>
                        </div>
                        <div class="form-group" id="tipo_registro_div" style="display: none;">
                            <label for="tipo_registro">Tipo de Registro</label>
                            <select name="tipo_registro" class="form-control" id="tipo_registro"></select>
                        </div>
                        
                        <!-- END IMPUESTOS -->
                        <!-- input para tipo registro -->
                        <input type="hidden" id="tipo_registro_id">
                        
                        <input type="hidden" id="editar_factura_id">
                        
                        <!-- TOTAL -->
                        <div class="form-group">
                            <span class="info-box-text text-left ">TOTAL:</span>
                            <span class="info-box-number" id="total"></span>
                        </div>
                </div>
                <div class="card-footer">
                    <button type="submit" class="btn btn-primary float-right m-1">Registrar</button>
                    <button type="button" id="close" data-bs-dismiss="modal" class="btn btn-outline-secondary float-right m-1">Cerrar</button>
                    </form>
                </div>
            </div>
    </div>
  </div>
</div>

<div class="modal modal-op-facturas fade" id="opciones-factura" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Seleccionar Tipo de Registro</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <div class="card-deck">
                <div class="row" id="opciones_factura">
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
        </div>
    </div>
  </div>
</div>
<!-- Inicio del cont principal -->
<div class="content-wrapper">
    <section class="content-header">
        <div class="container-fluid">
            <div class="card">
                <div class="card-header">
                    <div class="row mb-2">
                        <div class="col-sm-6">
                            <h1>Gestion Recibidos
                                <button class="btn btn-primary ml-auto text-center" type="button" data-toggle="modal" data-target="#opciones-factura">Crear Factura</button> 
                            </h1>
                        </div>
                        <div class="col-sm-6">
                            <ol class="breadcrumb float-sm-right">
                                <li class="breadcrumb-item"><a href="/filippi/Views/facturacion.php">Volver</a></li>
                                <li class="breadcrumb-item active">Recibidos</li>
                            </ol>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="container">
                        <div class="row d-flex">
                            <div class="col-lg-3 col-6">
                                <div class="small-box bg-success">
                                    <div class="inner">
                                        <h3><sup style="font-size: 20px"><b id="iva_compra">0</b></sup></h3>
                                        <p>IVA Compra</p>
                                    </div>
                                    <div class="icon">
                                        <i class="fas fa-file-invoice-dollar" style="color:white;"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-3 col-6">
                                <div class="small-box bg-info">
                                    <div class="inner">
                                        <h3><sup style="font-size: 20px"><b id="iva_venta">0</b></sup></h3>
                                        <p>IVA Venta</p>
                                    </div>
                                    <div class="icon">
                                        <i class="far fa-flag" style="color:white;"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-3 col-6">
                                <div class="small-box bg-warning">
                                    <div class="inner">
                                        <h3><sup style="font-size: 20px"><b id="situacion_fisco">0</b></sup></h3>
                                        <p>Situacion frente al Fisco</p>
                                    </div>
                                    <div class="icon">
                                        <i class="far fa-copy" style="color:white; font-size: 55px;" ></i>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-3 col-6">
                                <div class="small-box bg-danger">
                                <div class="inner">
                                    <h3><sup style="font-size: 20px"><b id="total_totales">0</b></sup></h3>
                                    <p>Total de totales</p>
                                </div>
                                <div class="icon">
                                    <i class="fas fa-medal"  style="color:white; font-size: 55px;"></i>
                                </div>
                                </div>
                            </div>
                            <div class="col-lg-3 col-6">
                                <div class="small-box bg-primary">
                                    <div class="inner" id="moreInfo">
                                    <h3><sup style="font-size: 20px">Gastos</sup></h3>
                                    <p>Calculador De Gastos</p>
                                    </div>
                                    <div class="icon">
                                        <i id="iconActual" class="fas fa-chart-pie" style="color:white; font-size: 55px;"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-3 col-6">
                                <div class="small-box bg-danger">
                                    <div class="inner" id="papelera">
                                    <h3><sup style="font-size: 20px">Papelera</sup></h3>
                                    <p>Papelera de reciclaje de Facturas</p>
                                    </div>
                                    <div class="icon">
                                        <i id="iconActual" class="fas fa-trash" style="color:white; font-size: 45px;"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
    </section>
    <section>
        <div class="container-fluid">
            <div class="card card-success">
                    <div class="card-header">
                        <div class="row">
                            <div class="col-sm-6">
                                <h4 class="card-title">Buscar Facturas Recibidas</h4>
                            </div>
                            <div class="col-sm-6">
                                <ol class="breadcrumb float-sm-right">
                                    <li class="breadcrumb-item active">
                                        <label for="filtroMes" style="color:white;">Filtrar por Mes:</label>
                                        <select class="form-control select2" id="filtroMes"></select>
                                    </li>
                                </ol>
                            </div>
                        </div>
                        
                    </div>
                    <div class="card-body table-responsive">
                        <table id="obtener-recibidas" class="table table-striped table-bordered responsive table-hover text-nowrap">
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Razon Social</th>
                                    <th>Factura</th>
                                    <th>Subtotal</th>
                                    <th>IVA</th>
                                    <th>ITC</th>
                                    <th>IDC</th>
                                    <th>PERC IIBB</th>
                                    <th>PERC IVA</th>
                                    <th>OTROS IMP</th>
                                    <th>DESCUENTO</th>
                                    <th>TOTAL</th>
                                    <th>EQUIPO</th>
                                    <th>TIPO GASTO</th>
                                    <th>ACCION</th>
                                </tr>
                            </thead>
                            <tbody>
                                
                            </tbody>
                        </table>
                    </div>
                    <div class="card-footer">
                    </div>
            </div>
        </div>
    </section>
</div>
<?php
include_once $_SERVER["DOCUMENT_ROOT"]."/filippi/Views/layouts/footer.php";
?>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js" integrity="sha384-BBtl+eGJRgqQAUMxJ7pMwbEyER4l1g+O15P+16Ep7Q9Q+zqX6gSbd85u4mG4QzX+" crossorigin="anonymous"></script>
<script src="Facturacion-recibido.js"></script>