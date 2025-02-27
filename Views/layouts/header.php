<!DOCTYPE html>
<html lang="en" style="height: auto;">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="apple-touch-icon" sizes="180x180" href="../Assets/favicon/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="../Assets/favicon/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="../Assets/favicon/favicon-16x16.png">
  <link rel="manifest" href="../Assets/favicon/site.webmanifest">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&amp;display=fallback">
  <link rel="stylesheet" href="../Util/css/adminlte.min.css">
  <!-- DataTables CSS -->
  <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.21/css/jquery.dataTables.css">
  <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/buttons/1.6.2/css/buttons.dataTables.min.css">

  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
  <link rel="stylesheet" href="../Util/css/style.css">
  <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
  <link rel="stylesheet" type="text/css" href="../Util/css/sweetalert2.min.css">
  <link rel="stylesheet" type="text/css" href="../Util/css/toastr.min.css">
  <link rel="stylesheet" type="text/css" href="../Util/css/custom.css">
  <link rel="stylesheet" type="text/css" href="../Util/css/carrito.css">

</head>
<style>
  body {
    height: 120vh;
    width: 100%;
    overflow: hidden;
  }

  .btn-circle {
    width: 30px;
    height: 30px;
    text-align: center;
    padding: 6px 0;
    font-size: 12px;
    line-height: 1.428571429;
    border-radius: 15px;
  }

  .btn-circle.btn-lg {
    width: 50px;
    height: 50px;
    padding: 10px 16px;
    font-size: 18px;
    line-height: 1.33;
    border-radius: 25px;
  }

  .btn-circle.btn-xl {
    width: 70px;
    height: 70px;
    padding: 10px 16px;
    font-size: 24px;
    line-height: 1.33;
    border-radius: 35px;
  }

  .image-logo {
    width: 150%;
    height: 100px;
    object-fit: contain;
    margin-top: -55px;
    margin-bottom: -35px;
  }

  .brand-link {
    padding: 10px;
    /* Ajusta el padding según sea necesario */
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .main-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 250px;
    /* Ajusta el ancho del sidebar */
    height: 120vh;
    display: flex;
    flex-direction: column;
    /* Asegura que esté sobre otros elementos */
  }

  #menu_lateral {
    flex-grow: 1;
    overflow-y: auto;
    /* Asegura el scroll vertical */
    overflow-x: hidden;
    /* Oculta el scroll horizontal */
    max-height: calc(100vh - 120px);
    /* Ajusta la altura (restando logo y espaciado) */
    padding-bottom: 20px;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
    /* Scroll en Firefox */
  }

  /* Scrollbar para navegadores WebKit (Chrome, Edge, Safari) */
  #menu_lateral::-webkit-scrollbar {
    width: 5px;
  }

  #menu_lateral::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 10px;
  }

  #menu_lateral:hover::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.5);
  }
</style>

<body class="sidebar-mini sidebar-closed sidebar-collapse" style="height: auto;">
  <div class="wrapper">
    <nav class="main-header navbar navbar-expand navbar-white navbar-light" id="menu_superior">
      <div class="text-center">
        <i class="fas fa-2x fa-sync-alt fa-spin"></i>
      </div>
    </nav>
    <!-- /.navbar -->

    <aside class="main-sidebar sidebar-dark-primary elevation-4">
      <a href="../Views/catalogo.php" class="brand-link d-flex link-underline link-underline-opacity-0 justify-content-center align-items-center position-relative mt-5">
        <img src="../Util/img/logo.svg" class="image-logo">
      </a>
      <!-- Sidebar -->
      <div class="sidebar sticky-top overflow-scroll-y h-100" id="menu_lateral">
        <div class="text-center">
          <i class="fas fa-2x fa-sync-alt fa-spin" style="color:#fff;"></i>
        </div>
      </div>
    </aside>