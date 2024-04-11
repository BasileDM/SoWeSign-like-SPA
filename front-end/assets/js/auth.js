export function decodeJwt(token) {
  // Split token in different parts
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("JWT is invalid");
  }
  // Decode function for base64Url encoded strings
  function base64UrlDecode(str) {
    // Replace special characters in base64Url to those of standard base64
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    // Add equal signs (=) to complete the string if necessary
    while (base64.length % 4) {
      base64 += "=";
    }
    // Decode base64 and convert to UTF-8
    return decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  }

  // Decode header and payload
  const header = JSON.parse(base64UrlDecode(parts[0]));
  const payload = JSON.parse(base64UrlDecode(parts[1]));

  return { header, payload };
}

export function getToken() {
  return localStorage.getItem("token");
}
export function isTokenExpired() {
  const token = getToken();
  if (!token) {
    return true;
  }
  const { payload } = decodeJwt(token);
  const timeLeft = 3600000 - (Date.now() - payload.iat * 1000);
  if (timeLeft <= 0) {
    console.log(`token expired : ${timeLeft}ms`);
    return true;
  }
  console.log(`token time left : ${timeLeft}ms`);
  return false;
}
