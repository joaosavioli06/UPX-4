const {admin} = require("../config/firebase");

exports.protect = async (req, res, next) => {
  let token;

  // 1. Verifica se o token JWT foi enviado no cabeçalho Authorization
  if (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")) { // LINHA 7 CORRIGIDA
    try {
      // Pega o token: "Bearer xxxxx" -> "xxxxx"
      token = req.headers.authorization.split(" ")[1];

      // 2. Verifica, decodifica e valida o token usando o Firebase Admin SDK
      const decodedToken = await admin.auth().verifyIdToken(token);

      // 3. Injeta o ID do usuário (UID) no objeto 'req'
      req.userId = decodedToken.uid;

      // Prossegue para o controlador (ex: createDenuncia)
      next();
    } catch (error) {
      console.error("Erro na verificação do Token:", error.message);
      // 401 Unauthorized para token inválido ou expirado
      return res.status(401).json({
        // Use 'return' aqui para evitar erro de cabeçalho
        error: "Não autorizado, token inválido ou ausente.",
      });
    }
  }

  // Se não houver token ou cabeçalho de autenticação
  if (!token) {
    // Se já retornou no catch, não faz nada. Senão, retorna 401.
    if (!res.headersSent) {
      return res.status(401).json({
        // Use 'return' aqui para evitar erro de cabeçalho
        error: "Não autorizado, token de autenticação não fornecido.",
      });
    }
  }
};
