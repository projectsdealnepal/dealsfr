"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import CustomerProductCard from "./productCard";

// Gaming store inventory data (same as in web view)
const gamingProducts = [
  {
    id: 1,
    name: "ASUS ROG Strix RTX 4090",
    price: 1599.99,
    category: "Graphics Cards",
    stock: 12,
    rating: 4.9,
    image: "/placeholder.svg?height=300&width=400&text=RTX+4090",
    description: "High-end gaming graphics card with 24GB GDDR6X memory.",
    sku: "GPU-RTX4090-001",
    status: "In Stock",
  },
  {
    id: 2,
    name: "Razer DeathAdder V3 Pro",
    price: 149.99,
    category: "Gaming Mice",
    stock: 45,
    rating: 4.8,
    image: "/placeholder.svg?height=300&width=400&text=Gaming+Mouse",
    description: "Wireless gaming mouse with Focus Pro 30K sensor.",
    sku: "MSE-RZR-DA3P",
    status: "In Stock",
  },
  {
    id: 3,
    name: "SteelSeries Apex Pro TKL",
    price: 199.99,
    category: "Gaming Keyboards",
    stock: 23,
    rating: 4.7,
    image: "/placeholder.svg?height=300&width=400&text=Gaming+Keyboard",
    description: "Mechanical gaming keyboard with adjustable switches.",
    sku: "KBD-SS-APTK",
    status: "In Stock",
  },
  {
    id: 4,
    name: "HyperX Cloud Alpha S",
    price: 129.99,
    category: "Gaming Headsets",
    stock: 8,
    rating: 4.6,
    image: "/placeholder.svg?height=300&width=400&text=Gaming+Headset",
    description: "7.1 surround sound gaming headset with dual chamber drivers.",
    sku: "HDS-HX-CAS",
    status: "Low Stock",
  },
  {
    id: 5,
    name: "Corsair K95 RGB Platinum",
    price: 199.99,
    category: "Gaming Keyboards",
    stock: 0,
    rating: 4.5,
    image: "/placeholder.svg?height=300&width=400&text=RGB+Keyboard",
    description: "Premium mechanical gaming keyboard with Cherry MX switches.",
    sku: "KBD-COR-K95",
    status: "Out of Stock",
  },
  {
    id: 6,
    name: "NVIDIA GeForce RTX 4070",
    price: 599.99,
    category: "Graphics Cards",
    stock: 18,
    rating: 4.7,
    image: "/placeholder.svg?height=300&width=400&text=RTX+4070",
    description: "Mid-range gaming GPU with excellent 1440p performance.",
    sku: "GPU-NV-4070",
    status: "In Stock",
  },
  {
    id: 7,
    name: "Logitech G Pro X Superlight",
    price: 149.99,
    category: "Gaming Mice",
    stock: 31,
    rating: 4.8,
    image: "/placeholder.svg?height=300&width=400&text=Pro+Gaming+Mouse",
    description: "Ultra-lightweight wireless gaming mouse for esports.",
    sku: "MSE-LOG-GPXS",
    status: "In Stock",
  },
  {
    id: 8,
    name: "AMD Ryzen 9 7900X",
    price: 549.99,
    category: "Processors",
    stock: 15,
    rating: 4.8,
    image: "/placeholder.svg?height=300&width=400&text=AMD+Processor",
    description: "12-core, 24-thread processor for high-end gaming builds.",
    sku: "CPU-AMD-R97X",
    status: "In Stock",
  },
  {
    id: 9,
    name: "ASUS ROG Swift PG279QM",
    price: 699.99,
    category: "Gaming Monitors",
    stock: 6,
    rating: 4.9,
    image: "/placeholder.svg?height=300&width=400&text=Gaming+Monitor",
    description: "27-inch 1440p 240Hz gaming monitor with G-Sync.",
    sku: "MON-AS-PG279",
    status: "Low Stock",
  },
  {
    id: 10,
    name: "Corsair Vengeance RGB Pro",
    price: 159.99,
    category: "Memory",
    stock: 42,
    rating: 4.6,
    image: "/placeholder.svg?height=300&width=400&text=RGB+Memory",
    description: "32GB (2x16GB) DDR4-3200 RGB gaming memory kit.",
    sku: "RAM-COR-VRGB",
    status: "In Stock",
  },
  {
    id: 11,
    name: "Xbox Wireless Controller",
    price: 59.99,
    category: "Controllers",
    stock: 67,
    rating: 4.5,
    image: "/placeholder.svg?height=300&width=400&text=Xbox+Controller",
    description: "Official Xbox wireless controller for PC and Xbox.",
    sku: "CTL-XBX-WRL",
    status: "In Stock",
  },
  {
    id: 12,
    name: "PlayStation 5 DualSense",
    price: 69.99,
    category: "Controllers",
    stock: 34,
    rating: 4.7,
    image: "/placeholder.svg?height=300&width=400&text=PS5+Controller",
    description: "PS5 DualSense wireless controller with haptic feedback.",
    sku: "CTL-PS5-DS",
    status: "In Stock",
  },
];

export default function CustomerMobileView({ pattern }: { pattern: number[] }) {
  const organizeProductsIntoRows = (
    products: typeof gamingProducts,
    viewPattern: number[]
  ) => {
    const rows = [];
    let currentIndex = 0;
    const mobilePattern = viewPattern.map((count) => Math.min(count, 3));

    while (currentIndex < products.length) {
      for (const count of mobilePattern) {
        if (currentIndex >= products.length) break;
        const rowProducts = products.slice(currentIndex, currentIndex + count);
        rows.push({ count, products: rowProducts });
        currentIndex += count;
      }
    }
    return rows;
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(gamingProducts);

  useEffect(() => {
    const filtered = gamingProducts.filter((product) => {
      const term = searchTerm.toLowerCase();
      return (
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.sku?.toLowerCase().includes(term)
      );
    });
    setFilteredProducts(filtered);
  }, [searchTerm]);

  return (
    <div className="w-full h-full bg-muted">
      <div className="max-w-sm mx-auto p-6">
        <header className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">GameZone Store</h1>
            <p className="text-muted-foreground">Premium Gaming Equipment & Accessories</p>
          </div>
        </header>

        <div className="space-y-8">
          {organizeProductsIntoRows(filteredProducts, pattern).map(
            (row, rowIndex) => (
              <div
                key={rowIndex}
                className="grid gap-4"
                style={{ gridTemplateColumns: `repeat(${row.count}, 1fr)` }}
              >
                {row.products.map((product) => (
                  <CustomerProductCard
                    key={product.id}
                    product={product}
                    columnSpan={row.count}
                    isMobile
                  />
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
