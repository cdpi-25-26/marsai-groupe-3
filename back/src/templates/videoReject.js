// src/templates/videoReject.js
/**
* Template de rejet de vidéo
* @param {string} username - Nom de l'utilisateur
* @param {string} videoTitle - Titre de la vidéo
* @param {string} reason - Raison du rejet
*/
export const videoRejectTemplate = (username, videoTitle, reason) => /*html*/ `
<!doctype html>
<html lang="fr">
<head>
<meta name="viewport" content="width=device-width, init
ial-scale=1.0">
<meta http-equiv="Content-Type" content="text/html; cha
rset=UTF-8">
<title>Vidéo refusée</title>
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
color: #e53e3e;
font-size: 24px;
margin: 0;
}
.emoji {
font-size: 48px;
display: block;
margin-bottom: 8px;
}
.content {
padding: 24px 0;
}
p {
font-size: 16px;
line-height: 1.6;
color: #4a5568;
margin-bottom: 16px;
}
.reason-box {
background-color: #fff5f5;
border-left: 4px solid #e53e3e;
border-radius: 4px;
padding: 16px;
margin: 16px 0;
}
.reason-box p {
color: #c53030;
margin: 0;
font-weight: bold;
}
.video-title {
background-color: #f7fafc;

border: 1px solid #eaebed;
border-radius: 8px;
padding: 12px 16px;
font-weight: bold;
color: #2d3748;
margin: 16px 0;
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
<span class="emoji">❌</span>
<h1>Vidéo refusée</h1>
</div>
<!-- CONTENT -->
<div class="content">
<p>Bonjour <strong>${username}</strong>,</p>
<p>Nous avons examiné votre vidéo et malheureusemen
t, elle ne répond pas à nos critères de publication.</p>
<!-- Titre de la vidéo -->
<div class="video-title">
🎬 ${videoTitle}
</div>
<!-- Raison du rejet -->
<p>Raison du refus :</p>
<div class="reason-box">
<p>⚠ ${reason}</p>
</div>
<p>Vous pouvez modifier votre vidéo et la soumettre
à nouveau en tenant compte des remarques ci-dessus.</p>
<!-- Bouton CTA -->
<a href="http://monapp.com/dashboard" class="btn">
Modifier ma vidéo
</a>
<p>Si vous avez des questions, n'hésitez pas à cont
acter notre équipe.</p>
<p>Cordialement,<br><strong>L'équipe de modération
</strong></p>
</div>
<!-- FOOTER -->
<div class="footer">
<p>© 2024 Mon App - Tous droits réservés</p>
<p>Vous recevez cet email car vous avez soumis une
vidéo sur notre plateforme.</p>
</div>
</div>
</body>

</html>
`
;