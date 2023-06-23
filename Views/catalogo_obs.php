<?php 
    require_once $_SERVER["DOCUMENT_ROOT"]."/gasolero/layouts/header.php";
?>
<title>Admin | Catalogo</title>

<!-- Inicio del cont principal -->
<div class="content-wrapper">
    <section class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1>Catalogo</h1>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="../vistas/adm_catalogo.php">Home</a></li>
                        <li class="breadcrumb-item active">Catalogo</li>
                    </ol>
                </div>
            </div>
        </div>
    </section>
    <section>
        <div class="container-fluid">
            <div class="card card-success">
                    <div class="card-header bg-danger">
                        <h4 class="card-title ">Notificador de Stock</h4>
                    </div>
                    <div class="card-body table-responsive p-0">
                        <table class="table table-hover text-nowrap">
                            <thead class="table-success">
                                <tr>
                                    <th>Cod</th>
                                    <th>Producto</th>
                                    <th>Stock</th>
                                    <th>Proveedor</th>
                                    <th>Presentacion</th>
                                    <th>Descripcion</th>
                                </tr>
                            </thead>
                            <tbody id="lotes" class="table-active">

                            </tbody>
                        </table>
                    </div>
                    <div class="card-footer"></div>
                </div>
            </div>
        </div>
    </section>
    <section>
        <div class="container-fluid">
            <div class="card card-success">
                    <div class="card-header">
                        <h4 class="card-title">Buscar producto</h4>
                            <div class="input-group">
                                <input id="buscar-producto" type="text" class="form-control float-left" placeholder="Ingresar Nombre">
                                <div class="input-group-append">
                                    <button class="btn btn-default"><i class="fas fa-search"></i></button>
                                </div>
                            </div>
                    </div>
                    <div class="card-body p-0 m-2">
                    </div>
                    <div class="card-footer"></div>
                </div>
            </div>
        </div>
    </section>
</div>
<!-- Fin del cont principal -->

<?php 
require_once $_SERVER["DOCUMENT_ROOT"]."/gasolero/layouts/footer.php";
?>
