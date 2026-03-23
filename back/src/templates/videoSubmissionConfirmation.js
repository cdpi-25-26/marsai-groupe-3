export const videoSubmissionConfirmationTemplate = (
  username,
  videoTitle,
) => /* html */ `
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Confirmation de soumission</title>
  </head>
  <body style="margin:0;padding:24px;background:#0f1115;color:#f5f7ff;font-family:Arial,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#171a21;border:1px solid #262b37;border-radius:12px;">
      <tr>
        <td style="padding:28px;">
          <h1 style="margin:0 0 16px;font-size:24px;line-height:1.2;color:#ffffff;">Soumission bien recue</h1>
          <p style="margin:0 0 12px;font-size:16px;line-height:1.6;color:#dce2ff;">
            Bonjour ${username || ""},
          </p>
          <p style="margin:0 0 12px;font-size:16px;line-height:1.6;color:#dce2ff;">
            Nous confirmons que votre film <strong style="color:#ffffff;">${videoTitle}</strong> a bien ete publie sur la plateforme.
          </p>
          <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#dce2ff;">
            Votre dossier est maintenant en cours de traitement par notre equipe.
          </p>
          <p style="margin:0;font-size:14px;line-height:1.6;color:#9aa4c7;">
            Merci pour votre participation,
            <br />
            L'equipe MARS.AI
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
