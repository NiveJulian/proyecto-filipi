<?php 
define("KEY", "devjn");
define("CODE", "AES-128-ECB");

function encrypt($data) {
    return base64_encode(openssl_encrypt($data, CODE, KEY, 0, ""));
}

function decrypt($data) {
    return openssl_decrypt(base64_decode($data), CODE, KEY, 0, "");
}
?>