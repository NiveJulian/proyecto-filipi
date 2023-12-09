<?php
session_start();
include_once $_SERVER["DOCUMENT_ROOT"].'/filippi/Views/layouts/header.php';
?>
<link rel="stylesheet" href="../Util/css/imprimir.css">
<title>Orden de Compra</title>


<div class="content-wrapper" style="min-height: 2838.44px;">
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1>Personal 
                    <span class="badge badge-warning right" title="No puedes acceder a las funcionalidades de este panel porque se encuentra en Construcción">
                        En Construcción <i class="fas fa-tools"></i> <i class="fas fa-exclamation-triangle"></i>
                    </span>
                    <button type="button" data-toggle="modal" data-target="#crear-personal" class="btn btn-primary btn-sm ml-1">Crear Nuevo</button>
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
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Orden Compra</h3>
                        </div>

                        <div class="card-body">
                        <div class="orden">
                                <div class="titulo">ORDEN DE COMPRA</div>
                                <div class="fecha">
                                    <div>3/11/2023</div>
                                    <div>MATERIALES - COMBUSTIBLE</div>
                                </div>

                                <div class="seccion">
                                    <div class="etiqueta">FECHA</div>
                                    <div>ORIGINAL</div>
                                </div>

                                <div class="seccion">
                                    <div class="etiqueta">N°</div>
                                    <div>001</div>
                                    <div>00001</div>
                                </div>

                                <div class="seccion">
                                    <div>Se autoriza a</div>
                                    <div>Emilio Ditella</div>
                                </div>

                                <div class="seccion">
                                    <div>A la compra en el establecimiento</div>
                                    <div>Anguilante</div>
                                </div>

                                <div class="seccion">
                                    <div>De los siguientes materiales o insumos</div>
                                    <table class="tabla">
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
                                            <tr>
                                                <td>2</td>
                                                <td>Rulemans - 32218</td>
                                                <td></td>
                                                <td>ESZ 387</td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div class="seccion">
                                    <div>Observación:</div>
                                    <div>...</div>
                                </div>

                                <div class="total">
                                    <div>TOTAL $</div>
                                </div>

                                <div class="firma">
                                    <label for="firma">..............................</label>
                                    <div>FIRMA AUTORIZADOR</div>
                                </div>
                            </div>
                        </div>

                        <div class="card-footer clearfix">
                            <ul class="pagination pagination-sm m-0 float-right">
                                <li class="page-item"><a class="page-link" href="#">«</a></li>
                                <li class="page-item"><a class="page-link" href="#">1</a></li>
                                <li class="page-item"><a class="page-link" href="#">2</a></li>
                                <li class="page-item"><a class="page-link" href="#">3</a></li>
                                <li class="page-item"><a class="page-link" href="#">»</a></li>
                            </ul>
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

<script src="/filippi/Views/orden_compra.js"></script>