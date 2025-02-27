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
<link rel="stylesheet" type="text/css" href="../Util/css/facturation1.css">

<title>Admin | Gestion compras</title>

<!-- Modal -->
<div class="modal fade" id="integration-modal" tabindex="-1" role="dialog" aria-labelledby="integrationModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header bg-primary">
                <h5 class="modal-title" id="integrationModalLabel">Integrar Factura Electrónica</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="integration-form">
                    <!-- Paso 1: Información básica -->
                    <div class="step" id="step-1">
                        <div class="form-group">
                            <label for="company-name">Nombre de la empresa:</label>
                            <input type="text" class="form-control" id="company-name" name="company-name" required>
                        </div>
                        <button type="button" class="btn btn-primary next-step">Siguiente</button>
                    </div>

                    <!-- Paso 2: Datos fiscales -->
                    <div class="step" id="step-2" style="display: none;">
                        <div class="form-group">
                            <label for="tax-id">CUIT/CUIL:</label>
                            <input type="text" class="form-control" id="tax-id" name="tax-id" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Clave fiscal de A.R.C.A</label>
                            <input type="text" class="form-control" id="password" name="password" required>
                        </div>
                        <button type="button" class="btn btn-secondary prev-step">Anterior</button>
                        <button type="button" class="btn btn-primary next-step">Siguiente</button>
                    </div>

                    <!-- Paso 3: Generar certificados -->
                    <div class="step" id="step-3" style="display: none;">
                        <p>Haz clic en "Generar Certificados" para crear los archivos necesarios.</p>
                        <button type="button" class="btn btn-success" id="generate-certificates">Generar Certificados</button>
                        <button type="button" class="btn btn-secondary prev-step">Anterior</button>
                    </div>

                    <!-- Paso 4: Descargar certificados -->
                    <div class="step" id="step-4" style="display: none;">
                        <p>Los certificados han sido generados. Haz clic en "Descargar" para obtenerlos.</p>
                        <a id="download-link" href="#" class="btn btn-primary" download>Descargar Certificados</a>
                        <button type="button" class="btn btn-secondary prev-step">Anterior</button>
                        <button type="button" class="btn btn-success" id="finish-process">Finalizar</button>
                    </div>
                </form>
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
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1>Gestion Facturacion</h1>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="../Views/dashboard.php">Inicio</a></li>
                        <li class="breadcrumb-item active">Gestion compras</li>
                    </ol>
                </div>
            </div>
        </div>
    </section>
    <section class="content m-2" id="content_admin">
        <h6 class="text-center">Mis comprobantes</h6>
        <div class="row"> <!-- Contenedor principal con sistema de grillas -->
            <!-- Primera carta -->
            <div class="col-md-6 col-12 mb-3"> <!-- 6 columnas en pantallas grandes, 12 en pequeñas -->
                <div class="card-notification">
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
                            <div class="new">Registro Egresos</div>
                            <svg viewBox="0 0 451.846 451.847" height="512" width="512" xmlns="http://www.w3.org/2000/svg" class="arrow">
                                <path fill="#cfcfcf" data-old_color="#000000" class="active-path" data-original="#000000" d="M345.441 248.292L151.154 442.573c-12.359 12.365-32.397 12.365-44.75 0-12.354-12.354-12.354-32.391 0-44.744L278.318 225.92 106.409 54.017c-12.354-12.359-12.354-32.394 0-44.748 12.354-12.359 32.391-12.359 44.75 0l194.287 194.284c6.177 6.18 9.262 14.271 9.262 22.366 0 8.099-3.091 16.196-9.267 22.373z"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Segunda carta -->
            <div class="col-md-6 col-12 mb-3"> <!-- 6 columnas en pantallas grandes, 12 en pequeñas -->
                <div class="card-notification">
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
                            <div class="new">Registro Ingresos</div>
                            <svg viewBox="0 0 451.846 451.847" height="512" width="512" xmlns="http://www.w3.org/2000/svg" class="arrow">
                                <path fill="#cfcfcf" data-old_color="#000000" class="active-path" data-original="#000000" d="M345.441 248.292L151.154 442.573c-12.359 12.365-32.397 12.365-44.75 0-12.354-12.354-12.354-32.391 0-44.744L278.318 225.92 106.409 54.017c-12.354-12.359-12.354-32.394 0-44.748 12.354-12.359 32.391-12.359 44.75 0l194.287 194.284c6.177 6.18 9.262 14.271 9.262 22.366 0 8.099-3.091 16.196-9.267 22.373z"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section class="content mt-8" id="content_admin">
        <h6 class="text-center">Conectá ARCA</h6>
        <div class="card-notification" id="open-modal">
            <div class="container">
                <div class="left-side">
                    <div class="card">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-3 text-white">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                        </svg>
                    </div>
                </div>
                <div class="right-side">
                    <div class="new">Integrar factura electronica</div>
                    <svg viewBox="0 0 451.846 451.847" height="512" width="512" xmlns="http://www.w3.org/2000/svg" class="arrow">
                        <path fill="#cfcfcf" data-old_color="#000000" class="active-path" data-original="#000000" d="M345.441 248.292L151.154 442.573c-12.359 12.365-32.397 12.365-44.75 0-12.354-12.354-12.354-32.391 0-44.744L278.318 225.92 106.409 54.017c-12.354-12.359-12.354-32.394 0-44.748 12.354-12.359 32.391-12.359 44.75 0l194.287 194.284c6.177 6.18 9.262 14.271 9.262 22.366 0 8.099-3.091 16.196-9.267 22.373z"></path>
                    </svg>
                </div>
            </div>
        </div>
    </section>
</div>
<?php
include_once "./layouts/footer.php";
?>

<script type="module" src="Facturacion.js"></script>