// src/templates/welcome.js
/**
* Template de bienvenue
* @param {string} username - Nom de l'utilisateur
*/
export const welcomeTemplate = (username) => /*html*/ `
<!doctype html>
<html lang="fr">
<head>
<meta name="viewport" content="width=device-width, init
ial-scale=1.0">
<meta http-equiv="Content-Type" content="text/html; cha
rset=UTF-8">
<title>Bienvenue !</title>
<style>
body {
font-family: Helvetica, sans-serif;
background-color: #f4f5f6;
margin: 0;
padding: 0;
}
.container {
max-width: 600px;
margin: 24px auto;
background: #ffffff;
border: 1px solid #eaebed;
border-radius: 16px;
padding: 24px;
}
.header {
text-align: center;
padding-bottom: 24px;
border-bottom: 2px solid #f4f5f6;
}
.header h1 {
color: #0867ec;
font-size: 24px;
margin: 0;
}
.emoji {
font-size: 48px;
display: block;
margin-bottom: 8px;
}
p {
font-size: 16px;
line-height: 1.6;
color: #4a5568;
margin-bottom: 16px;
}
.btn {
display: inline-block;
background-color: #0867ec;
color: #ffffff !important;
padding: 12px 24px;
border-radius: 4px;
text-decoration: none;
font-weight: bold;
margin: 16px 0;
}
.features {
background-color: #f7fafc;
border-radius: 8px;
padding: 16px;
margin: 16px 0;
}
.features li {
margin-bottom: 8px;
color: #4a5568;
}
.footer {
text-align: center;
padding-top: 24px;
border-top: 2px solid #f4f5f6;
color: #9a9ea6;
font-size: 14px;
}
</style>
</head>
<body>
<div class="container">
<!-- HEADER -->
<div class="header">
<span class="emoji">👋</span>
<h1>Bienvenue sur Mon App !</h1>
</div>
<!-- CONTENT -->
<div class="content" style="padding: 24px 0;">
<p>Bonjour <strong>${username}</strong>,</p>
<p>Nous sommes ravis de vous accueillir sur notre p
lateforme. Votre compte a été créé avec succès !</p>
<!-- Features -->
<div class="features">
<p><strong>🚀 Ce que vous pouvez faire :</strong>
</p>
<ul>
<li>📤 Uploader vos vidéos</li>
<li>👥 Suivre d'autres créateurs</li>
<li>💬 Commenter et interagir</li>
<li>📊 Suivre vos statistiques</li>
</ul>
</div>
<a href="http://monapp.com/dashboard" class="btn">
🎬 Commencer maintenant
</a>
<p>Si vous avez des questions, notre équipe est là
pour vous aider.</p>
<p>À bientôt,<br><strong>L'équipe Mon App</strong>
</p>
</div>
<!-- FOOTER -->
<div class="footer">
<p>© 2024 Mon App - Tous droits réservés</p>
</div>
</div>
</body>
</html>
`
;