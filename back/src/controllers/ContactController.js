import { BrevoClient } from "@getbrevo/brevo";
import dotenv from "dotenv";
dotenv.config();
const brevoClient = new BrevoClient({
	apiKey: process.env.BREVO_API_KEY,
});

const addContact = async (req, res) => {
	const { email } = req.body || {};

	if (!email || typeof email !== "string") {
		return res.status(400).json({ error: "Email requis" });
	}

	try {
		await brevoClient.contacts.createContact({
			email: email.trim(),
			listIds: [3],
			updateEnabled: true,
		});

		return res.status(201).json({ success: true });
	} catch (error) {
		return res.status(500).json({
			error: "Impossible d'ajouter ce contact à la newsletter",
			details: error?.message,
		});
	}
};

export default { addContact };