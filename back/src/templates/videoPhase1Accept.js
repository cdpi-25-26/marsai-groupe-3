export const videoPhase1AcceptTemplate = (username, videoTitle) => /* html */ `
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Film retenu - Phase 2</title>
  </head>
  <body style="margin:0;padding:24px;background:#0f1115;color:#f5f7ff;font-family:Arial,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#171a21;border:1px solid #262b37;border-radius:12px;">
      <tr>
        <td style="padding:28px;">
          <p style="margin:0 0 6px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#7ba6ff;">MARS.AI — PHASE 1</p>
          <h1 style="margin:0 0 20px;font-size:22px;color:#5de3b0;">✅ Votre film est retenu !</h1>
          <p style="margin:0 0 12px;font-size:16px;line-height:1.6;color:#dce2ff;">
            Bonjour ${username || ""},
          </p>
          <p style="margin:0 0 12px;font-size:16px;line-height:1.6;color:#dce2ff;">
            Nous avons le plaisir de vous annoncer que votre film
            <strong style="color:#ffffff;">${videoTitle}</strong>
            a été retenu lors de la sélection de la Phase 1 et passe en
            <strong style="color:#5de3b0;">Phase 2 — Évaluation par le jury</strong>.
          </p>
          <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#dce2ff;">
            Notre jury va maintenant examiner votre oeuvre. Vous serez informé(e) de la suite du processus.
          </p>
          <p style="margin:0;font-size:14px;line-height:1.6;color:#9aa4c7;">
            Merci pour votre participation,<br />
            L'equipe MARS.AI
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
