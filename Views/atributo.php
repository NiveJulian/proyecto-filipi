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
<title>Panel | Gestion Atributo</title>

<div class="modal fade" id="crearproveedor" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="card card-light">
                <div class="card-header">
                    <h3 class="card-title">Crear Proveedor</h3>
                    <button data-dismiss="modal" aria-label="close" class="close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="card-body">
                    <form id="form-crear">
                        <div class="form-group">
                            <div class="form-group">
                                <label for="razonsocial">Razon social</label>
                                <input type="text" class="form-control" id="razonsocial" placeholder="Ingresar Razon Social">
                            </div>
                            <label for="nombre">Nombre Fantasia</label>
                            <input type="text" class="form-control" id="nombre" placeholder="Ingresar Nombre" required>
                        </div>
                        <div class="form-group" id="telefonos-group">
                            <label for="telefonos">Teléfonos</label>
                            <div id="telefonos-container">
                                <div class="input-group mb-2">
                                    <input type="text" class="form-control" name="telefonos[]" placeholder="Ingresar teléfono">
                                    <div class="input-group-append">
                                        <button class="btn btn-primary agregar-telefono" type="button">Agregar Teléfono</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="direccion">Direccion</label>
                            <input type="text" class="form-control" id="direccion" placeholder="Ingresar Direccion">
                        </div>
                        <div class="form-group">
                            <label for="cuit">Cuit</label>
                            <input type="text" class="form-control" id="cuit" placeholder="Ingresar CUIT sin - ni espacios ">
                        </div>
                        <div class="form-group">
                            <label for="condicion_iva">Condicion Frente Al IVA</label>
                            <input type="text" class="form-control" id="condicion_iva" placeholder="Ingresar Condicion frente al Iva">
                        </div>
                        <div class="form-group">
                            <label for="registro">Elige lo que vas registrar</label>
                            <p class="text-muted text-sm">Podes elegir las 2 opciones</p>
                            <hr>
                            <div class="text-center">
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" value="" id="cbu-toggle">
                                    <label class="form-check-label" for="cbu-toggle">CBU</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" value="" id="cvu-toggle">
                                    <label class="form-check-label" for="cvu-toggle">CVU</label>
                                </div>
                            </div>
                        </div>
                        <div class="form-group" id="cbu-input-group" style="display: none;">
                            <label for="cbu">CBU</label>
                            <input type="number" class="form-control" id="cbu" placeholder="Ingresar CBU">
                        </div>
                        <div class="form-group" id="cvu-input-group" style="display: none;">
                            <label for="CVU">CVU</label>
                            <input type="number" class="form-control" id="cvu" placeholder="Ingresar CVU">
                        </div>
                        <input type="hidden" id="id_edit_prov">
                </div>
                <div class="card-footer">
                    <button type="submit" class="btn btn-primary float-right m-1">Guardar</button>
                    <button type="button" id="close-prov" data-dismiss="modal" class="btn btn-outline-secondary float-right m-1">Cerrar</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="crearcliente" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="card card-light">
                <div class="card-header">
                    <h3 class="card-title">Crear cliente</h3>
                    <button data-dismiss="modal" aria-label="close" class="close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="card-body">
                    <form id="form-crear-cliente">
                        <div class="form-group">
                            <label for="razon_social">Razon social</label>
                            <input type="text" class="form-control" id="razon_social_cliente" placeholder="Ingresar Nombre" required>
                        </div>
                        <div class="form-group">
                            <label for="nombre">Nombre</label>
                            <input type="text" class="form-control" id="nombre_cliente" placeholder="Ingresar apellido" required>
                        </div>
                        <div class="form-group">
                            <label for="telefono">Telefono</label>
                            <input type="number" class="form-control" id="telefono_cliente" placeholder="Ingresar telefono" require>
                        </div>
                        <div class="form-group">
                            <label for="direccion">Direccion</label>
                            <input type="text" class="form-control" id="direccion_cliente" placeholder="Ingresar direccion">
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" class="form-control" id="email_cliente" placeholder="Ingresar correo">
                        </div>
                        <div class="form-group">
                            <label for="cuit">Cuit / Cuil</label>
                            <input type="text" class="form-control" id="cuit_cliente" placeholder="Ingresar razon social">
                        </div>
                        <div class="form-group">
                            <label for="condicion_iva">Condicion frente al IVA</label>
                            <input type="text" class="form-control" id="condicion_iva_cliente" placeholder="Ingresar adicional">
                        </div>
                        <input type="hidden" id="id_edit_cliente">
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

<div class="content-wrapper">
    <section class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1>Gestion de Atributos</h1>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="../Views/dashboard.php">Inicio</a></li>
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
                                <li class="nav-item"><a href="#proveedor" class="nav-link active" data-toggle="tab">Proveedor</a></li>
                                <li class="nav-item"><a href="#cliente" class="nav-link" data-toggle="tab">Clientes</a></li>
                            </ul>
                        </div>
                        <div class="card-body">
                            <div class="tab-content">
                                <div class="tab-pane active" id="proveedor">
                                    <div class="card card-light">
                                        <div class="card-header">
                                            <div class="card-title">
                                                <h3 class="text-lg">
                                                    Buscar proveedor
                                                </h3>
                                            </div>
                                            <div class="input-group">
                                                <input id="buscar-proveedor" type="text" class="form-control" placeholder="Ingresar Nombre">
                                                <div class="input-group-append p-0 text-align-center">
                                                    <button class="btn btn-default py-0 text-center" type="button">
                                                        <i class="fas fa-search"></i>
                                                    </button>
                                                    <button type="button" class="btn btn-primary py-0 text-center" data-toggle="modal" data-target="#crearproveedor">
                                                        Crear proveedor
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card-body p-0 bg-secondary" id="cardBody">
                                            <table class="table table-responsive">
                                                <tbody id="proveedores">

                                                </tbody>
                                            </table>
                                        </div>
                                        <div class="card-footer">
                                            <div class="row" id="all_proveedores">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="tab-pane" id="cliente">
                                    <div class="card card-light">
                                        <div class="card-header">
                                            <div class="card-title">Busca clientes</div>
                                            <div class="input-group">
                                                <input id="buscar-clientes" type="text" class="form-control float-left" placeholder="Ingresar Nombre">
                                                <div class="input-group-append">
                                                    <button class="btn btn-default py-0 text-center"><i class="fas fa-search"></i></button>
                                                    <button type="button" data-toggle="modal" data-target="#crearcliente" class="btn btn-primary btn-sm rigth py-0 text-center">Crear clientes</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card-body p-0 bg-secondary">
                                            <div class="row" id="clientes">
                                            </div>
                                        </div>
                                        <div class="card-footer">
                                            <div class="row" id="all_clientes">
                                            </div>
                                        </div>
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
<?php
include_once "./layouts/footer.php";
?>
<script type="module" src="proveedores.js"></script>
<script type="module" src="clientes.js"></script>