export const formatPrice = (price: number | null) => {
  if (price === null || price === undefined) return "Consulte";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(price);
};
export const formatKm = (km: number | null) => {
  if (km === null || km === undefined) return "0 km";
  return new Intl.NumberFormat("pt-BR").format(km) + " km";
};
export const categoryLabel = (cat: string) => ({
  van: "Van", furgao: "Furgão", caminhao: "Caminhão", pickup: "Pickup", escolar: "Escolar", outro: "Outro",
}[cat] || cat);
