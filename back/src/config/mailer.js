import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
host: process.env.SMTP_HOST,
port: Number(process.env.SMTP_PORT), // ⚠ Convertir en nombre
secure: false, // false pour port 587, true pour port 465
auth: {
user: process.env.SMTP_USER,
pass: process.env.SMTP_PASS,
},
});
// Vérifier la connexion au démarrage
transporter.verify((error, success) => {
if (error) {
console.error("❌ Erreur SMTP :", error);
} else {
console.log("✅ Serveur SMTP prêt !");
}
});
/**
* Envoie un email
* @param {string} to - Destinataire
* @param {string} subject - Sujet
* @param {string} html - Contenu HTML
* @returns {Promise<string>} - Réponse du serveur
*/
async function sendMail(to, subject, html) {
const info = await transporter.sendMail({
from: '"Mon App" <cdpi@sc2nmxa9527.universe.wf>',
to,
subject,
html,
});
console.log(`📨 Email envoyé à ${to} : ${info.response}
`);
return info.response;
}
export default { sendMail };