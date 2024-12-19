const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.updateUserPassword = functions.https.onCall(async (data, context) => {
    if (!context.auth || !context.auth.token.admin) {
        throw new functions.https.HttpsError("permission-denied", "Usuário não autorizado.");
    }

    const { email, newPassword } = data;

    try {
        await admin.auth().updateUser(email, { password: newPassword });
        return { message: "Senha alterada com sucesso!" };
    } catch (error) {
        throw new functions.https.HttpsError("internal", "Erro ao alterar senha.", error);
    }
});
