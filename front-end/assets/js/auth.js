export function decodeJwt(token) {
  
  // Séparer le token en ses différentes parties
  const parts = token.split('.');
  if (parts.length !== 3) {
      throw new Error('Le JWT ne semble pas valide !');
  }

  // Fonction pour décoder les parties encodées en base64Url
  function base64UrlDecode(str) {
      // Remplacer les caractères spécifiques à base64Url par ceux de base64 standard
      let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
      // Ajouter des signes égal (=) pour compléter la chaîne si nécessaire
      while (base64.length % 4) {
          base64 += '=';
      }
      // Décoder la chaîne en base64 et convertir en chaîne UTF-8
      return decodeURIComponent(atob(base64).split('').map(c =>
          '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));
  }

  // Décoder l'en-tête et le payload
  const header = JSON.parse(base64UrlDecode(parts[0]));
  const payload = JSON.parse(base64UrlDecode(parts[1]));

  return { header, payload };
}

// Utiliser la fonction
// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJRCI6Ijc3NyIsIm1haWwiOiI3NzdAYWEuNzciLCJuYW1lIjoiNzc3IiwiaWF0IjoxNTE2MjM5MDIyfQ.Igt7BCacuKRfqkNzWjE8L_AsBrvH7iat0ykuqGXw-M4';
// console.log(token);
// const decoded = decodeJwt(token);
// console.log(decoded);