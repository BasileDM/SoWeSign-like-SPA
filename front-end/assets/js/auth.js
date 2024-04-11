export function decodeJwt(token) {
  // Séparer le token en ses différentes parties
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("JWT is invalid");
  }
  // Fonction pour décoder les parties encodées en base64Url
  function base64UrlDecode(str) {
    // Remplacer les caractères spécifiques à base64Url par ceux de base64 standard
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    // Ajouter des signes égal (=) pour compléter la chaîne si nécessaire
    while (base64.length % 4) {
      base64 += "=";
    }
    // Décoder la chaîne en base64 et convertir en chaîne UTF-8
    return decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  }

  // Décoder l'en-tête et le payload
  const header = JSON.parse(base64UrlDecode(parts[0]));
  const payload = JSON.parse(base64UrlDecode(parts[1]));

  return { header, payload };
}

export function getToken() {
  return localStorage.getItem("token");
}
export function checkTokenTimeLeft() {
  const token = getToken();
  if (!token) {
    return false;
  }
  const { payload } = decodeJwt(token);
  const timeLeft = payload.iat * 1000 - Date.now();
  if (timeLeft <= 0) {
    console.log(payload);
  }
  console.log(payload);
}
