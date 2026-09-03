export type { Product } from "@/domain/product";
import type { Product } from "@/domain/product";

export type Movement = {
  id: string;
  type: "entrada" | "saida";
  product: string;
  sku: string;
  qty: number;
  user: string;
  date: string;
};

const seedProducts: Product[] = [
  { id: "1", sku: "ELT-001", name: "Teclado Mecânico TKL", category: "Periféricos", stock: 42, minStock: 15, cost: 189.9, price: 349.9, soldQuantity: 128, supplier: "KeyTech Brasil", updatedAt: "01/09/2026" },
  { id: "2", sku: "ELT-002", name: "Mouse Sem Fio Pro", category: "Periféricos", stock: 8, minStock: 20, cost: 79.9, price: 159.9, soldQuantity: 246, supplier: "KeyTech Brasil", updatedAt: "31/08/2026" },
  { id: "3", sku: "MON-014", name: "Monitor 27\" 165Hz", category: "Monitores", stock: 17, minStock: 8, cost: 899.0, price: 1499.0, soldQuantity: 74, supplier: "Visualltech", updatedAt: "30/08/2026" },
  { id: "4", sku: "AUD-031", name: "Headset Gamer 7.1", category: "Áudio", stock: 3, minStock: 10, cost: 220.0, price: 419.9, soldQuantity: 182, supplier: "SoundWave", updatedAt: "29/08/2026" },
  { id: "5", sku: "ELT-009", name: "Webcam Full HD", category: "Periféricos", stock: 25, minStock: 10, cost: 149.9, price: 289.9, soldQuantity: 91, supplier: "Visualltech", updatedAt: "28/08/2026" },
  { id: "6", sku: "CMP-101", name: "SSD NVMe 1TB", category: "Componentes", stock: 61, minStock: 25, cost: 389.0, price: 599.0, soldQuantity: 213, supplier: "DataStore", updatedAt: "01/09/2026" },
  { id: "7", sku: "CMP-102", name: "Memória RAM 16GB DDR5", category: "Componentes", stock: 34, minStock: 20, cost: 289.0, price: 459.0, soldQuantity: 156, supplier: "DataStore", updatedAt: "27/08/2026" },
  { id: "8", sku: "AUD-040", name: "Caixa de Som Bluetooth", category: "Áudio", stock: 12, minStock: 12, cost: 99.0, price: 199.9, soldQuantity: 67, supplier: "SoundWave", updatedAt: "26/08/2026" },
  { id: "9", sku: "MON-018", name: "Suporte Articulado p/ Monitor", category: "Acessórios", stock: 55, minStock: 15, cost: 69.9, price: 139.9, soldQuantity: 119, supplier: "ErgoLine", updatedAt: "25/08/2026" },
  { id: "10", sku: "CMP-110", name: "Fonte 650W 80 Plus", category: "Componentes", stock: 5, minStock: 10, cost: 349.0, price: 549.0, soldQuantity: 83, supplier: "DataStore", updatedAt: "01/09/2026" },
  { id: "11", sku: "ELT-015", name: "Teclado Compacto 60%", category: "Periféricos", stock: 29, minStock: 12, cost: 129.9, price: 239.9, soldQuantity: 104, supplier: "KeyTech Brasil", updatedAt: "24/08/2026" },
  { id: "12", sku: "ELT-021", name: "Mousepad Speed XL", category: "Acessórios", stock: 46, minStock: 18, cost: 59.9, price: 119.9, soldQuantity: 198, supplier: "ErgoLine", updatedAt: "23/08/2026" },
  { id: "13", sku: "MON-022", name: "Monitor Ultrawide 29\"", category: "Monitores", stock: 9, minStock: 7, cost: 1099.0, price: 1799.0, soldQuantity: 52, supplier: "Visualltech", updatedAt: "22/08/2026" },
  { id: "14", sku: "AUD-052", name: "Microfone USB Condensador", category: "Áudio", stock: 14, minStock: 8, cost: 279.0, price: 499.0, soldQuantity: 63, supplier: "SoundWave", updatedAt: "21/08/2026" },
  { id: "15", sku: "CMP-125", name: "Placa de Vídeo RTX 4060", category: "Componentes", stock: 7, minStock: 5, cost: 1899.0, price: 2699.0, soldQuantity: 38, supplier: "DataStore", updatedAt: "20/08/2026" },
  { id: "16", sku: "CMP-130", name: "Processador Ryzen 5", category: "Componentes", stock: 11, minStock: 8, cost: 899.0, price: 1299.0, soldQuantity: 71, supplier: "DataStore", updatedAt: "19/08/2026" },
  { id: "17", sku: "ELT-034", name: "Hub USB-C 7 em 1", category: "Acessórios", stock: 31, minStock: 10, cost: 89.9, price: 179.9, soldQuantity: 87, supplier: "ErgoLine", updatedAt: "18/08/2026" },
  { id: "18", sku: "AUD-061", name: "Fone Bluetooth ANC", category: "Áudio", stock: 19, minStock: 10, cost: 249.0, price: 449.0, soldQuantity: 143, supplier: "SoundWave", updatedAt: "17/08/2026" },
  { id: "19", sku: "CMP-140", name: "Gabinete Mid Tower", category: "Componentes", stock: 16, minStock: 8, cost: 299.0, price: 549.0, soldQuantity: 59, supplier: "DataStore", updatedAt: "16/08/2026" },
  { id: "20", sku: "ELT-042", name: "Cadeira Ergonômica", category: "Acessórios", stock: 6, minStock: 6, cost: 799.0, price: 1399.0, soldQuantity: 44, supplier: "ErgoLine", updatedAt: "15/08/2026" },
];

const generatedCategories = ["Periféricos", "Monitores", "Áudio", "Componentes", "Acessórios"];
const generatedSuppliers = ["KeyTech Brasil", "Visualltech", "SoundWave", "DataStore", "ErgoLine"];

const generatedProducts: Product[] = Array.from({ length: 130 }, (_, index) => {
  const number = index + 21;
  const categoryIndex = index % generatedCategories.length;
  const category = generatedCategories[categoryIndex];
  const cost = 49 + ((index * 37) % 1800);
  return {
    id: String(number),
    sku: `GEN-${String(number).padStart(3, "0")}`,
    name: `${category} Produto ${String(number).padStart(3, "0")}`,
    category,
    stock: 5 + ((index * 11) % 70),
    minStock: 5 + ((index * 3) % 25),
    cost,
    price: Number((cost * 1.35).toFixed(2)),
    soldQuantity: 20 + ((index * 29) % 260),
    supplier: generatedSuppliers[categoryIndex],
    updatedAt: "14/08/2026",
  };
});

export const products: Product[] = [...seedProducts, ...generatedProducts];

export const movements: Movement[] = [
  { id: "m1", type: "saida", product: "SSD NVMe 1TB", sku: "CMP-101", qty: 4, user: "Marco M.", date: "02/09/2026 14:32" },
  { id: "m2", type: "entrada", product: "Teclado Mecânico TKL", sku: "ELT-001", qty: 20, user: "Ana P.", date: "02/09/2026 11:15" },
  { id: "m3", type: "saida", product: "Mouse Sem Fio Pro", sku: "ELT-002", qty: 6, user: "Marco M.", date: "02/09/2026 09:48" },
  { id: "m4", type: "entrada", product: "Memória RAM 16GB DDR5", sku: "CMP-102", qty: 15, user: "Carlos S.", date: "01/09/2026 16:20" },
  { id: "m5", type: "saida", product: "Monitor 27\" 165Hz", sku: "MON-014", qty: 2, user: "Ana P.", date: "01/09/2026 15:05" },
  { id: "m6", type: "saida", product: "Headset Gamer 7.1", sku: "AUD-031", qty: 3, user: "Carlos S.", date: "01/09/2026 10:41" },
  { id: "m7", type: "entrada", product: "Fonte 650W 80 Plus", sku: "CMP-110", qty: 5, user: "Marco M.", date: "31/08/2026 17:12" },
];

const categoryColors = ["#3b5bdb", "#2f9e6e", "#e8a13a", "#e05252", "#9b5de5"];
export const categoryData = generatedCategories.map((name, index) => ({
  name,
  value: products.filter((product) => product.category === name).reduce((total, product) => total + product.stock, 0),
  color: categoryColors[index],
}));

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
