export function getCompletePageHTML(): string {
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contos para Dormir - Histórias Mágicas</title>
  <meta name="description" content="Embarque em uma jornada através de contos encantadores, embalados por músicas suaves e uma atmosfera de noite estrelada.">
  
  <!-- Open Graph Tags -->
  <meta property="og:title" content="Contos para Dormir - Histórias Mágicas">
  <meta property="og:description" content="Embarque em uma jornada através de contos encantadores, embalados por músicas suaves e uma atmosfera de noite estrelada.">
  <meta property="og:type" content="website">
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;700&family=Merriweather:wght@400;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>`;
  
  return html;
}
