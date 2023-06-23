<?php
session_start();
session_destroy();
header('Location: /gasolero/index.php');
?>