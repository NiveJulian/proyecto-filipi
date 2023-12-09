<?php 
session_start();
include_once $_SERVER["DOCUMENT_ROOT"].'/filippi/Views/layouts/header.php';
?>

<link rel="stylesheet" type="text/css" href="/filippi/Util/css/facturation1.css">
<title>Admin | Gestion compras</title>

<!-- Inicio del cont principal -->
<div class="content-wrapper">
    <section class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1>Gestion Facturacion</h1>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="../Views/catalogo.php">Inicio</a></li>
                        <li class="breadcrumb-item active">Gestion compras</li>
                    </ol>
                </div>
            </div>
        </div>
    </section>
    <section class="content m-2" id="content_admin">
        
    <h6 class="text-center">Mis comprobantes</h6>
      <div class="container-fluid">
            <div class="row">
              <div class="col-md-12 card-notification">
                    <div class="container" id="registro_recibido">
                        <div class="left-side">
                            <div class="card">
                                <div class="card-line"></div>
                                    <div class="buttons"></div>
                                </div>
                                <div class="post">
                                    <div class="post-line"></div>
                                <div class="screen">
                                    <div class="dollar">$</div>
                                </div>
                                <div class="numbers"></div>
                                    <div class="numbers-line2"></div>
                                </div>
                            </div>
                        <div class="right-side">
                        <div class="new">Registro Recibidos</div>
                            
                            <svg viewBox="0 0 451.846 451.847" height="512" width="512" xmlns="http://www.w3.org/2000/svg" class="arrow"><path fill="#cfcfcf" data-old_color="#000000" class="active-path" data-original="#000000" d="M345.441 248.292L151.154 442.573c-12.359 12.365-32.397 12.365-44.75 0-12.354-12.354-12.354-32.391 0-44.744L278.318 225.92 106.409 54.017c-12.354-12.359-12.354-32.394 0-44.748 12.354-12.359 32.391-12.359 44.75 0l194.287 194.284c6.177 6.18 9.262 14.271 9.262 22.366 0 8.099-3.091 16.196-9.267 22.373z"></path></svg>
                            
                        </div>
                    </div>
              </div>
            </div>
        </div>
    </section>
    <section class="content">
      <div class="container-fluid">
            <div class="row">
              <div class="col-md-12 card-notification">
                    <div class="container" id="registro_emitido">
                        <div class="left-side">
                            <div class="card">
                                <div class="card-line"></div>
                                    <div class="buttons"></div>
                                </div>
                                <div class="post">
                                    <div class="post-line"></div>
                                <div class="screen">
                                    <div class="dollar">$</div>
                                </div>
                                <div class="numbers"></div>
                                    <div class="numbers-line2"></div>
                                </div>
                            </div>
                        <div class="right-side">
                        <div class="new">Registro Emitidos</div>
                            
                            <svg viewBox="0 0 451.846 451.847" height="512" width="512" xmlns="http://www.w3.org/2000/svg" class="arrow"><path fill="#cfcfcf" data-old_color="#000000" class="active-path" data-original="#000000" d="M345.441 248.292L151.154 442.573c-12.359 12.365-32.397 12.365-44.75 0-12.354-12.354-12.354-32.391 0-44.744L278.318 225.92 106.409 54.017c-12.354-12.359-12.354-32.394 0-44.748 12.354-12.359 32.391-12.359 44.75 0l194.287 194.284c6.177 6.18 9.262 14.271 9.262 22.366 0 8.099-3.091 16.196-9.267 22.373z"></path></svg>
                            
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
<script src="Facturacion.js"></script>
