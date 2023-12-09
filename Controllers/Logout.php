<?php
session_start();
session_destroy();
header('Location: /filippi/index.php');
?>