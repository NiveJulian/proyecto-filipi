const allowedOrigins = "http://localhost:3000";

function getCompanyData() {
  const companyDataBase64 = localStorage.getItem("companyData");
  if (companyDataBase64) {
    // Decodificar Base64 y convertir a JSON
    const companyData = JSON.parse(atob(companyDataBase64));
    return companyData;
  }
  return null;
}

export { allowedOrigins, getCompanyData };
