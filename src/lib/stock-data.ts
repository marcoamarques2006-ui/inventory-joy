export type Product = {
  id: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  cost: number;
  price: number;
  supplier: string;
  updatedAt: string;
};

export type Movement = {
  id: string;
  type: "entrada" | "saida";
  product: string;
  sku: string;
  qty: number;
  user: string;
  date: string;
};

export const products: Product[] = [
  { id: "1", sku: "ELT-001", name: "Teclado Mecânico TKL", category: "Periféricos", stock: 42, minStock: 15, cost: 189.9, price: 349.9, supplier: "KeyTech Brasil", updatedAt: "01/09/2026" },
  { id: "2", sku: "ELT-002", name: "Mouse Sem Fio Pro", category: "Periféricos", stock: 8, minStock: 20, cost: 79.9, price: 159.9, supplier: "KeyTech Brasil", updatedAt: "31/08/2026" },
  { id: "3", sku: "MON-014", name: "Monitor 27\" 165Hz", category: "Monitores", stock: 17, minStock: 8, cost: 899.0, price: 1499.0, supplier: "Visualltech", updatedAt: "30/08/2026" },
  { id: "4", sku: "AUD-031", name: "Headset Gamer 7.1", category: "Áudio", stock: 3, minStock: 10, cost: 220.0, price: 419.9, supplier: "SoundWave", updatedAt: "29/08/2026" },
  { id: "5", sku: "ELT-009", name: "Webcam Full HD", category: "Periféricos", stock: 25, minStock: 10, cost: 149.9, price: 289.9, supplier: "Visualltech", updatedAt: "28/08/2026" },
  { id: "6", sku: "CMP-101", name: "SSD NVMe 1TB", category: "Componentes", stock: 61, minStock: 25, cost: 389.0, price: 599.0, supplier: "DataStore", updatedAt: "01/09/2026" },
  { id: "7", sku: "CMP-102", name: "Memória RAM 16GB DDR5", category: "Componentes", stock: 34, minStock: 20, cost: 289.0, price: 459.0, supplier: "DataStore", updatedAt: "27/08/2026" },
  { id: "8", sku: "AUD-040", name: "Caixa de Som Bluetooth", category: "Áudio", stock: 12, minStock: 12, cost: 99.0, price: 199.9, supplier: "SoundWave", updatedAt: "26/08/2026" },
  { id: "9", sku: "MON-018", name: "Suporte Articulado p/ Monitor", category: "Acessórios", stock: 55, minStock: 15, cost: 69.9, price: 139.9, supplier: "ErgoLine", updatedAt: "25/08/2026" },
  { id: "10", sku: "CMP-110", name: "Fonte 650W 80 Plus", category: "Componentes", stock: 5, minStock: 10, cost: 349.0, price: 549.0, supplier: "DataStore", updatedAt: "01/09/2026" },
];

export const movements: Movement[] = [
  { id: "m1", type: "saida", product: "SSD NVMe 1TB", sku: "CMP-101", qty: 4, user: "Marco M.", date: "02/09/2026 14:32" },
  { id: "m2", type: "entrada", product: "Teclado Mecânico TKL", sku: "ELT-001", qty: 20, user: "Ana P.", date: "02/09/2026 11:15" },
  { id: "m3", type: "saida", product: "Mouse Sem Fio Pro", sku: "ELT-002", qty: 6, user: "Marco M.", date: "02/09/2026 09:48" },
  { id: "m4", type: "entrada", product: "Memória RAM 16GB DDR5", sku: "CMP-102", qty: 15, user: "Carlos S.", date: "01/09/2026 16:20" },
  { id: "m5", type: "saida", product: "Monitor 27\" 165Hz", sku: "MON-014", qty: 2, user: "Ana P.", date: "01/09/2026 15:05" },
  { id: "m6", type: "saida", product: "Headset Gamer 7.1", sku: "AUD-031", qty: 3, user: "Carlos S.", date: "01/09/2026 10:41" },
  { id: "m7", type: "entrada", product: "Fonte 650W 80 Plus", sku: "CMP-110", qty: 5, user: "Marco M.", date: "31/08/2026 17:12" },
];

export const categoryData = [
  { name: "Componentes", value: 100, color: "#3b5bdb" },
  { name: "Periféricos", value: 75, color: "#2f9e6e" },
  { name: "Monitores", value: 17, color: "#e8a13a" },
  { name: "Áudio", value: 15, color: "#e05252" },
  { name: "Acessórios", value: 55, color: "#9b5de5" },
];

export const weeklyFlow = [
  { day: "Qui", entradas: 18, saidas: 12 },
  { day: "Sex", entradas: 9, saidas: 21 },
  { day: "Sáb", entradas: 4, saidas: 15 },
  { day: "Dom", entradas: 0, saidas: 6 },
  { day: "Seg", entradas: 25, saidas: 14 },
  { day: "Ter", entradas: 20, saidas: 11 },
  { day: "Qua", entradas: 12, saidas: 19 },
];

export const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function stockStatus(p: Product): "ok" | "baixo" | "critico" {
  if (p.stock < p.minStock * 0.5) return "critico";
  if (p.stock < p.minStock) return "baixo";
  return "ok";
}
