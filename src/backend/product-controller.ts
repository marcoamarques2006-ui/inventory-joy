import type { ProductInput, ProductQuery } from "@/domain/product";
import { InMemoryProductRepository } from "./product-repository";
import { ProductService } from "./product-service";

const productService = new ProductService(new InMemoryProductRepository());

function parseQuery(url: URL): ProductQuery {
  // Converte parâmetros externos para os valores aceitos pelo domínio.
  const sort = url.searchParams.get("sort");
  const order = url.searchParams.get("order");

  return {
    code: url.searchParams.get("code") ?? undefined,
    name: url.searchParams.get("name") ?? undefined,
    sort: sort === "price" || sort === "soldQuantity" || sort === "name" ? sort : "name",
    order: order === "desc" ? "desc" : "asc",
  };
}

export async function handleProductRequest(request: Request): Promise<Response | undefined> {
  // O controller traduz HTTP; as regras continuam concentradas no ProductService.
  const url = new URL(request.url);
  const pathParts = url.pathname.split("/").filter(Boolean);
  if (pathParts[0] !== "api" || pathParts[1] !== "products") return undefined;
  if (request.method === "GET" && pathParts.length === 2) return Response.json(productService.search(parseQuery(url)));

  if (!["POST", "PUT", "DELETE"].includes(request.method)) return undefined;
  try {
    if (request.method === "DELETE") {
      productService.delete(pathParts[2] ?? "");
      return new Response(null, { status: 204 });
    }
    const body = await request.json() as ProductInput;
    const product = request.method === "POST"
      ? productService.create(body)
      : productService.update(pathParts[2] ?? "", body);
    return Response.json(product, { status: request.method === "POST" ? 201 : 200 });
  } catch (error) {
    return Response.json({ message: error instanceof Error ? error.message : "Não foi possível concluir a operação." }, { status: 400 });
  }
}
