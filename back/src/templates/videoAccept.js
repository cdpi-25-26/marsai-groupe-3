// src/templates/videoAccept.js
/**
* Template d'acceptation de vidéo
* @param {string} username - Nom de l'utilisateur
* @param {string} videoTitle - Titre de la vidéo
* @param {string} videoUrl - URL de la vidéo publiée
*/
export const videoAcceptTemplate = (username, videoTitle, videoUrl) => /*html*/ `
<!doctype html>
<html lang="fr">
<head>
<meta name="viewport" content="width=device-width, init
ial-scale=1.0">
<meta http-equiv="Content-Type" content="text/html; cha
rset=UTF-8">
<title>Vidéo acceptée</title>
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
color: #38a169;
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
.success-box {
background-color: #f0fff4;
border-left: 4px solid #38a169;
border-radius: 4px;
padding: 16px;
margin: 16px 0;
}
.success-box p {
color: #276749;
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
background-color: #38a169;
color: #ffffff !important;
padding: 12px 24px;
border-radius: 4px;
text-decoration: none;
font-weight: bold;
margin: 16px 0;
}
.stats {
display: flex;
gap: 16px;
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
<span class="emoji">🎉</span>
<h1>Vidéo publiée !</h1>
</div>
<!-- CONTENT -->
<div class="content">
<p>Bonjour <strong>${username}</strong>,</p>
<p>Bonne nouvelle ! Votre vidéo a été <strong>accep
tée</strong> et est maintenant disponible sur notre platefo
rme.</p>
<!-- Titre de la vidéo -->
<div class="video-title">
🎬 ${videoTitle}
</div>
<!-- Message de succès -->
<div class="success-box">
<p>✅ Votre vidéo est en ligne et visible par tou
s les utilisateurs !</p>
</div>
<p>Partagez votre vidéo avec vos amis et votre comm
unauté pour maximiser vos vues !</p>
<!-- Bouton CTA -->
<a href="${videoUrl}" class="btn">
👀 Voir ma vidéo
</a>
<p>Merci pour votre contribution à notre plateform
e.</p>
<p>Continuez comme ça ! 🚀</p>
<p>Cordialement,<br><strong>L'équipe de modération
</strong></p>
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