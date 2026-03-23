export const videoAwardedTemplate = (username, videoTitle) => /* html */ `
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Film primé - MARS.AI</title>
  </head>
  <body style="margin:0;padding:24px;background:#0f1115;color:#f5f7ff;font-family:Arial,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#171a21;border:1px solid #ad46ff;border-radius:12px;box-shadow:0 0 40px rgba(173,70,255,.25);">
      <tr>
        <td style="padding:28px;">
          <p style="margin:0 0 6px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#ad46ff;">MARS.AI — PRIX</p>
          <h1 style="margin:0 0 20px;font-size:24px;background:linear-gradient(90deg,#51a2ff,#ad46ff,#ff2b7f);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">🌟 Votre film est primé !</h1>
          <p style="margin:0 0 12px;font-size:16px;line-height:1.6;color:#dce2ff;">
            Bonjour ${username || ""},
          </p>
          <p style="margin:0 0 12px;font-size:16px;line-height:1.6;color:#dce2ff;">
            C'est avec une immense fierté que nous vous annonçons que votre film
            <strong style="color:#ffffff;">${videoTitle}</strong>
            a été désigné comme <strong style="color:#ad46ff;">film primé</strong> lors de l'édition MARS.AI.
          </p>
          <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#dce2ff;">
            Votre créativité et votre vision ont retenu toute l'attention du jury. Toutes nos félicitations !
          </p>
          <p style="margin:0;font-size:14px;line-height:1.6;color:#9aa4c7;">
            Avec toute notre admiration,<br />
            L'equipe MARS.AI
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
