<?php
header('Content-Type: application/json');
$host = 'localhost';
$db   = 'db_educambiental';
$user = 'root'; 
$pass = '';     

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Falha na conexão']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (isset($data['bioma_id']) && isset($data['texto']) && isset($data['nome'])) {
        $sql = "INSERT INTO dicas_usuarios (bioma_id, nome, texto) VALUES (?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$data['bioma_id'], $data['nome'], $data['texto']]);
        echo json_encode(['status' => 'sucesso']);
    } else {
        echo json_encode(['error' => 'Faltam dados']);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query("SELECT * FROM dicas_usuarios");
    $dicas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($dicas);
}
?>