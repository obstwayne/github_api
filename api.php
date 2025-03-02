<?php
header('Content-Type: application/json');

if (!isset($_GET['user'])) {
    echo json_encode($username);
    exit;
}
$username = htmlspecialchars($_GET['user']);

$url = "https://api.github.com/users/$username/repos";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_USERAGENT, 'GitApiClient');
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
//cacert.pem for SSL certificate
curl_setopt($ch, CURLOPT_CAINFO, 'D:/VS_projects/apis/cacert.pem');
$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error = curl_error($ch);
curl_close($ch);

if ($response === false) {
    echo json_encode(['error' => 'cURL error: ' . $curl_error]);
} elseif ($http_code !== 200) {
    echo json_encode(['error' => 'HTTP error: ' . $http_code, 'response' => $response]);
} else {
    echo $response;
}
