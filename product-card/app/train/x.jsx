
"use client"
import { useState } from "react";
import Link from "next/link"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Moon, Sun, Search, Filter, Eye, Trash2 } from "lucide-react";

const Products = () => {
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [products] = useState([
    {
      id: 1,
      name: "Vintage Camera",
      category: "Electronics",
      condition: "Good",
      value: "$250",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop",
      description: "Classic film camera in working condition"
    },
    {
      id: 2,
      name: "Designer Handbag",
      category: "Fashion",
      condition: "Excellent",
      value: "$180",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
      description: "Authentic leather handbag, barely used"
    },
    {
      id: 3,
      name: "Board Game Collection",
      category: "Games",
      condition: "Good",
      value: "$75",
      image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop",
      description: "Set of 5 popular board games"
    },
    {
      id: 4,
      name: "Fitness Equipment",
      category: "Sports",
      condition: "Very Good",
      value: "$120",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      description: "Home workout equipment set"
    },
    {
      id: 5,
      name: "Smartphone",
      category: "Electronics",
      condition: "Good",
      value: "$300",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
      description: "Unlocked smartphone with accessories"
    },
    {
      id: 6,
      name: "Winter Jacket",
      category: "Fashion",
      condition: "Excellent",
      value: "$90",
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop",
      description: "Warm winter jacket, like new"
    },
    {
      id: 7,
      name: "Guitar",
      category: "Music",
      condition: "Good",
      value: "$200",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
      description: "Acoustic guitar with case"
    },
    {
      id: 8,
      name: "Laptop",
      category: "Electronics",
      condition: "Very Good",
      value: "$450",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
      description: "Lightweight laptop for work or study"
    },
    {
      id: 9,
      name: "Sneakers",
      category: "Fashion",
      condition: "Good",
      value: "$65",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop",
      description: "Comfortable running sneakers"
    },
    {
      id: 10,
      name: "Kitchen Appliance",
      category: "Home",
      condition: "Excellent",
      value: "$80",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      description: "Multi-function kitchen appliance"
    },
    {
      id: 11,
      name: "Book Collection",
      category: "Books",
      condition: "Good",
      value: "$40",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
      description: "Collection of bestseller novels"
    },
    {
      id: 12,
      name: "Art Supplies",
      category: "Art",
      condition: "Very Good",
      value: "$55",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
      description: "Professional art supplies set"
    }
  ]);

  const categories = ["all", "Electronics", "Fashion", "Games", "Sports", "Music", "Home", "Books", "Art"];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getConditionColor = (condition) => {
    switch (condition) {
      case "Excellent": return "bg-green-100 text-green-800";
      case "Very Good": return "bg-blue-100 text-blue-800";
      case "Good": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-primary">
                SwapSpace
              </Link>
              <Badge variant="outline" className="hidden sm:inline-flex">
                Products
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
             
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <h1 className="text-3xl font-bold">All Products</h1>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <CardHeader className="p-0">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge 
                    className={`absolute top-2 right-2 ${getConditionColor(product.condition)}`}
                  >
                    {product.condition}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-4">
                <CardTitle className="text-lg mb-2 line-clamp-1">{product.name}</CardTitle>
                <Badge variant="secondary" className="mb-2">
                  {product.category}
                </Badge>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="text-lg font-bold text-primary">
                  {product.value}
                </div>
              </CardContent>
              
              <CardFooter className="p-4 pt-0 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button variant="destructive" size="sm" className="flex-1">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
