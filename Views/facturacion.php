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
<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />

<title>Admin | Gestion compras</title>

<!-- Modal -->

<div class="modal fade" id="crearClienteModal" tabindex="-1" role="dialog" aria-labelledby="crearClienteLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Crear cliente</h3>
                <button data-dismiss="modal" aria-label="close" class="close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="form-crear-cliente">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="razon_social">Razon social</label>
                                <input type="text" class="form-control" id="razon_social_cliente"
                                    placeholder="Ingresar Nombre" required>
                            </div>
                            <div class="form-group">
                                <label for="nombre">Nombre</label>
                                <input type="text" class="form-control" id="nombre_cliente"
                                    placeholder="Ingresar apellido" required>
                            </div>
                            <div class="form-group">
                                <label for="telefono">Telefono</label>
                                <input type="number" class="form-control" id="telefono_cliente"
                                    placeholder="Ingresar telefono" require>
                            </div>
                            <div class="form-group">
                                <label for="direccion">Direccion</label>
                                <input type="text" class="form-control" id="direccion_cliente"
                                    placeholder="Ingresar direccion">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" class="form-control" id="email_cliente"
                                    placeholder="Ingresar correo">
                            </div>
                            <div class="form-group">
                                <label for="cuit">Cuit / Cuil</label>
                                <input type="text" class="form-control" id="cuit_cliente"
                                    placeholder="Ingresar razon social">
                            </div>
                            <div class="form-group">
                                <label for="condicion_iva">Condicion frente al IVA</label>
                                <input type="text" class="form-control" id="condicion_iva_cliente"
                                    placeholder="Ingresar adicional">
                            </div>
                        </div>
                    </div>
                    <input type="hidden" id="id_edit_cliente">
            </div>
            <div class="modal-footer">
                <button type="submit" class="btn btn-primary float-right m-1">Guardar</button>
                <button type="button" id="close" data-dismiss="modal"
                    class="btn btn-outline-secondary float-right m-1">Cerrar</button>
            </div>
            </form>
        </div>
    </div>
</div>

<div class="modal fade" id="crearFacturaModal" tabindex="-1" role="dialog" aria-labelledby="crearFacturaModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header bg-primary">
                <h5 class="modal-title" id="crearFacturaModalLabel">Crear Factura Electrónica</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="facturaForm">
                    <div class="form-group">
                        <label for="tipoComprobante">Tipo de Comprobante</label>
                        <select class="form-control" id="tipoComprobante" required>
                            <option value="">Seleccionar factura</option>
                            <option value="A">Factura A</option>
                            <option value="B">Factura B</option>
                            <option value="C">Factura C</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="concepto">Concepto</label>
                        <select class="form-control" id="concepto" required>
                            <option value="">Seleccionar Concepto</option>
                            <option value="1">Productos</option>
                            <option value="2">Servicios</option>
                            <option value="3">Productos y servicios</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="cuitCliente">CUIT del Cliente</label>
                        <div class="row">
                            <div class="col-md-6">
                                <input type="text" class="form-control" id="searchClient"
                                    placeholder="Buscarlo por nombre">
                            </div>
                            <div class="col-md-6 d-flex">
                                <select class="form-control" id="cuitCliente" required>
                                    <option value="">Seleccione un cliente</option>
                                </select>
                                <button type="button" id="add-client-modal" class="btn btn-sm btn-secondary"
                                    title="Crear nuevo cliente">
                                    <i class="fas fa-plus text-white"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="condicion_venta">Metodo de pago</label>
                        <select class="form-control" id="condicion_venta" required>
                            <option value="">Seleccionar condicion venta</option>
                            <option value="Contado">Contado</option>
                            <option value="Tarjeta de Débito">Tarjeta de Débito</option>
                            <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                            <option value="Cuenta Corriente">Cuenta Corriente</option>
                            <option value="Cheque">Cheque</option>
                            <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                            <option value="Otra">Otra</option>
                            <option value="Otros medios de pago electrónico">Otros medios de pago electrónico</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="productos">Seleccionar producto</label>
                        <select class="form-control" id="productos" required>
                        </select>
                    </div>

                    <div class="form-group table-responsive">
                        <label>Productos/Servicios</label>
                        <table class="table table-bordered" id="tablaProductos">
                            <thead>
                                <tr>
                                    <th>COD</th>
                                    <th>PROD</th>
                                    <th>U. MED</th>
                                    <th>CANT</th>
                                    <th>UND</th>
                                    <th>SUB</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="productosTable">
                                <!-- Filas de productos se agregarán aquí -->
                            </tbody>
                        </table>
                    </div>

                    <!-- Totales -->
                    <div class="form-group">
                        <label for="subtotal">Subtotal</label>
                        <input type="text" class="form-control" id="subtotal" readonly>
                    </div>
                    <div class="form-group">
                        <label for="iva">IVA</label>
                        <input type="text" class="form-control" id="iva" readonly>
                    </div>
                    <div class="form-group">
                        <label for="total">Total</label>
                        <input type="text" class="form-control" id="total" readonly>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                <button type="button" class="btn btn-primary" id="crearFactura">Crear Factura</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="integration-modal" tabindex="-1" role="dialog" aria-labelledby="integrationModalLabel"
    aria-hidden="true">
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
                            <input type="text" class="form-control" id="company-name" name="company-name" required
                                data-toggle="tooltip" title="Ingresa el nombre de tu empresa">
                        </div>
                    </div>

                    <!-- Paso 2: Datos fiscales -->
                    <div class="step" id="step-2" style="display: none;">
                        <div class="form-group">
                            <label for="tax-id">CUIT/CUIL:</label>
                            <input type="text" class="form-control" id="tax-id" name="tax-id" required
                                data-toggle="tooltip" title="Sin guiones(-) ni espacios, por ejemplo: 20123456784">
                        </div>
                        <div class="form-group">
                            <div class="row">
                                <div class="col-md-10 d-flex mb-2">
                                    <label for="point-sale-id mr-2">Punto de venta</label>
                                    <button type="button" class="icon-link icon-link-hover link-success btn btn-sm"
                                        data-toggle="modal" data-target="#modal-punto-venta">¿Cómo crear un punto de
                                        venta?</button>
                                </div>
                            </div>
                            <input type="number" class="form-control" id="point-sale-id" name="point-sale-id" required
                                data-toggle="tooltip"
                                title="Verifica si existe el punto de venta para facturación electrónica">
                        </div>
                        <div class="form-group">
                            <label for="password">Clave fiscal de A.R.C.A</label>
                            <input type="password" class="form-control" id="password" name="password" required
                                data-toggle="tooltip" title="Ingresa tu clave fiscal de A.R.C.A">
                        </div>
                    </div>

                    <!-- Paso 3: Generar certificados -->
                    <div class="step" id="step-3" style="display: none;">
                        <p>Haz clic en "Generar Certificados" para crear los archivos necesarios.</p>
                        <button type="button" class="btn btn-success" id="generate-certificates">Generar
                            Certificados</button>
                    </div>

                    <!-- Paso 4: Descargar certificados -->
                    <div class="step" id="step-4" style="display: none;">
                        <button type="button" class="btn btn-info" data-toggle="modal"
                            data-target="#modal-certificados">¿Cómo habilitar administrador de certificados?</button>
                        <p>El certificado temporal ha sido generado. Haz clic en "Descargar" para obtenerlo.</p>
                        <div class="row mb-2">
                            <div class="col-md-12 d-flex gap-2">
                                <a id="download-link" href="#" class="btn btn-primary" download>Descargar
                                    Certificados</a>
                                <button type="button" class="icon-link icon-link-hover link-info btn btn-sm"
                                    data-toggle="modal" data-target="#modal-generate-cert">Siguientes pasos que deberá
                                    de hacer en ARCA</button>
                            </div>
                        </div>
                    </div>

                    <div class="step" id="step-5" style="display: none;">
                        <p>Ahora, mandenos el certificado (.cert) generado en A.R.C.A a nuestro sistema así poder
                            finalizar</p>
                        <input type="file" name="crtFile" id="upload-crt" class="form-control">
                    </div>
                </form>
            </div>
            <div class="modal-footer footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-certificados" tabindex="-1" role="dialog" aria-labelledby="modal-certificados-label"
    aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modal-certificados-label">Habilitar Administrador de Certificados</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <!-- Contenido del modal -->
                <div class="step">
                    <h4>Paso 1: Ingresar al Administrador de Relaciones de Clave Fiscal</h4>
                    <p>Para agregar la aplicación «Administración de Certificados Digitales» a nuestro escritorio de
                        ARCA, primero debemos ingresar en «Administrador de Relaciones de Clave Fiscal».</p>
                    <img src="../Util/img/arca-integration/paso1.avif" alt="Paso 1" class="img-fluid">
                </div>

                <div class="step">
                    <h4>Paso 2: Seleccionar el Contribuyente</h4>
                    <p>En caso de tener permiso para administrar las relaciones de otros contribuyentes, deberemos
                        elegir el que queremos administrar. Caso contrario, se elegirá el nuestro automáticamente.</p>
                    <img src="../Util/img/arca-integration/paso2.avif" alt="Paso 2" class="img-fluid">
                </div>

                <div class="step">
                    <h4>Paso 3: Adherir Servicio</h4>
                    <p>Luego elegimos «Adherir servicio».</p>
                    <img src="../Util/img/arca-integration/paso3.avif" alt="Paso 3" class="img-fluid">
                </div>

                <div class="step">
                    <h4>Paso 4: Elegir Administración de Certificados Digitales</h4>
                    <p>Allí dentro elegimos «ARCA > Servicios interactivos > Administración de Certificados Digitales».
                    </p>
                    <img src="../Util/img/arca-integration/paso4.avif" alt="Paso 4" class="img-fluid">
                </div>

                <div class="step">
                    <h4>Paso 5: Confirmar</h4>
                    <p>Le damos a confirmar y ya tendremos acceso a la aplicación desde nuestro escritorio de ARCA.</p>
                    <img src="../Util/img/arca-integration/paso5.avif" alt="Paso 5" class="img-fluid">
                </div>
            </div>
            <div class="modal-footer footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-punto-venta" tabindex="-1" role="dialog" aria-labelledby="modal-punto-venta-label"
    aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modal-punto-venta-label">
                    💳Crear punto de venta
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <!-- Contenido del modal -->
                <div class="step">
                    <p>En caso de emitir facturas electrónicas debes disponer de un punto de venta compatible. Podes
                        darlo de alta darlo de alta a través del servicio «Administración de puntos de venta y
                        domicilios».</p>
                    <img src="../Util/img/arca-integration/punto_venta/paso1.avif" alt="Paso 1" class="img-fluid">
                </div>

                <div class="step">
                    <p>Ingresar en la opción "A/B/M de puntos de venta". Hacé click en agregar nuevo punto de venta y
                        elegir la opción correspondiente para tu caso:</p>
                    <img src="../Util/img/arca-integration/punto_venta/paso2.png" alt="Paso 2" class="img-fluid">
                </div>

                <div class="step">
                    <h4 class="text-muted">Para monotributista "Factura Electronica - Monotributo - Web Service".</h4>
                    <img src="../Util/img/arca-integration/punto_venta/paso3.avif" alt="Paso 3" class="img-fluid">
                </div>

                <div class="step">
                    <h4>Confirmar</h4>
                    <p>Le das a «Aceptar» y listo, ya podes utilizar el web service de facturación electronica con dicho
                        punto de venta</p>
                    <img src="../Util/img/arca-integration/paso5.avif" alt="Paso 5" class="img-fluid">
                </div>
            </div>
            <div class="modal-footer footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-generate-cert" tabindex="-1" role="dialog" aria-labelledby="modal-generate-cert-label"
    aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modal-generate-cert-label">
                    📑 Generar el certificado (cert) en A.R.C.A
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <!-- Contenido del modal -->
                <div class="step">
                    <p>Dentro de nuestro escritorio de AFIP debemos ingresar en «Administración de Certificados
                        Digitales»</p>
                    <img src="../Util/img/arca-integration/cert/paso1.avif" alt="Paso 1" class="img-fluid">
                </div>

                <div class="step">
                    <p>En caso de no tener esta aplicación en tu escritorio debes ver el tutorial Habilitar
                        administrador de certificados << Boton celeste arriba del descargar>>
                            En caso de tener permiso para administrar las relaciones de otros contribuyentes nos hará
                            elegir el de quien queremos administrar.</p>
                    <img src="../Util/img/arca-integration/cert/paso2.avif" alt="Paso 2" class="img-fluid">
                </div>

                <div class="step">
                    <p>Dentro de esta aplicación debemos ir a «Agregar alias»</p>
                    <img src="../Util/img/arca-integration/cert/paso3.avif" alt="Paso 3" class="img-fluid">
                </div>

                <div class="step">
                    <p>Allí en «Alias» debemos colocar el nombre de su empresa tal y como lo registró en el primer paso.

                        Luego presionamos examinar y elegimos el CSR que generamos y descargamos anteriormente.

                        Por ultimo presionamos «Agregar Alias» y ya tenemos nuestro certificado</p>
                    <img src="../Util/img/arca-integration/cert/paso4.avif" alt="Paso 4" class="img-fluid">
                </div>

                <div class="step">
                    <p>Ahora en la lista de Alias presionamos «ver»</p>
                    <img src="../Util/img/arca-integration/cert/paso5.avif" alt="Paso 5" class="img-fluid">
                </div>

                <div class="step">
                    <h4>Y allí presionamos el boton debajo de «descargar»</h4>
                    <img src="../Util/img/arca-integration/cert/paso6.avif" alt="Paso 6" class="img-fluid">
                    <p>Y eso es todo ya tenemos nuestro certificado y la key para usarlos en Nexus.</p>
                    <hr>
                    <p>Ahora ese certificado lo subis en Nexus en el siguiente paso -></p>
                </div>
            </div>
            <div class="modal-footer footer">
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
        <div class="row" id="content_card_facturation"> <!-- Contenedor principal con sistema de grillas -->

        </div>
    </section>
    <!-- <section class="content mt-8" id="content_admin">
        <h6 class="text-center">Conectá ARCA</h6>
        <div id="arca-integration">

        </div>
    </section> -->
</div>
<?php
include_once "./layouts/footer.php";
?>

<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
<script type="module" src="Facturacion.js"></script>