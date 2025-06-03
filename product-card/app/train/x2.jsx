"use client"
import  { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
// import { useTheme } from "@/components/ThemeProvider.jsx";
import { Moon, Sun, ArrowLeftRight, Package, Users, Info } from "lucide-react";
import Link from "next/link";

const Swapp = () => {
  // const { theme, setTheme } = useTheme();
  const [selectedMyItems, setSelectedMyItems] = useState([]);
  const [selectedOtherItems, setSelectedOtherItems] = useState([]);
  const [allowedCategories, setAllowedCategories] = useState([]);
  const [showHint, setShowHint] = useState(false);

  const myProducts = [
    {
      id: 1,
      name: "Vintage Camera",
      category: "Electronics",
      condition: "Good",
      value: "$250",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      name: "Designer Handbag",
      category: "Fashion",
      condition: "Excellent",
      value: "$180",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      name: "Board Game Collection",
      category: "Games",
      condition: "Good",
      value: "$75",
      image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop"
    }
  ];

  const otherUsersProducts = [
    {
      id: 4,
      name: "Fitness Equipment",
      category: "Sports",
      condition: "Very Good",
      value: "$120",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      owner: "Sarah M."
    },
    {
      id: 5,
      name: "Smartphone",
      category: "Electronics",
      condition: "Good",
      value: "$300",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
      owner: "John D."
    },
    {
      id: 6,
      name: "Winter Jacket",
      category: "Fashion",
      condition: "Excellent",
      value: "$90",
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop",
      owner: "Mike L."
    },
    {
      id: 7,
      name: "Guitar",
      category: "Music",
      condition: "Good",
      value: "$200",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
      owner: "Emily R."
    },
    {
      id: 8,
      name: "Laptop",
      category: "Electronics",
      condition: "Very Good",
      value: "$450",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
      owner: "Alex K."
    }
  ];

  // Update allowed categories when my items are selected
  useEffect(() => {
    if (selectedMyItems.length > 0) {
      const selectedCategories = selectedMyItems.map(itemId => {
        const item = myProducts.find(p => p.id === itemId);
        return item?.category;
      }).filter(Boolean);
      
      setAllowedCategories([...new Set(selectedCategories)]);
      setShowHint(true);
    } else {
      setAllowedCategories([]);
      setShowHint(false);
      // Clear other items selection when no my items are selected
      setSelectedOtherItems([]);
    }
  }, [selectedMyItems]);

  const handleMyItemSelect = (itemId) => {
    setSelectedMyItems(prev => {
      const newSelection = prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId];
      
      // If unchecking items, clear other items selection
      if (prev.includes(itemId)) {
        setSelectedOtherItems([]);
      }
      
      return newSelection;
    });
  };

  const handleOtherItemSelect = (itemId) => {
    // Don't allow selection if no my items are selected
    if (selectedMyItems.length === 0) {
      return;
    }

    const item = otherUsersProducts.find(p => p.id === itemId);
    const isAllowedCategory = allowedCategories.includes(item?.category);

    // Only allow selection if category matches or show all categories
    if (isAllowedCategory || allowedCategories.length === 0) {
      setSelectedOtherItems(prev => 
        prev.includes(itemId) 
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      );
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case "Excellent": return "bg-green-100 text-green-800";
      case "Very Good": return "bg-blue-100 text-blue-800";
      case "Good": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTotalValue = (items, products) => {
    return items.reduce((total, itemId) => {
      const item = products.find(p => p.id === itemId);
      return total + parseInt(item?.value.replace('$', '') || 0);
    }, 0);
  };

  const isOtherItemSelectable = (item) => {
    if (selectedMyItems.length === 0) return false;
    return allowedCategories.includes(item.category) || allowedCategories.length === 0;
  };

  const mySelectedValue = getTotalValue(selectedMyItems, myProducts);
  const otherSelectedValue = getTotalValue(selectedOtherItems, otherUsersProducts);

  const canCreateSwap = selectedMyItems.length > 0 && selectedOtherItems.length > 0;

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
                Swap
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              {/* <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button> */}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Create a Swap</h1>
          <p className="text-muted-foreground">
            Select items from your collection first, then choose matching items from other users
          </p>
        </div>

        {/* Category Hint */}
        {showHint && allowedCategories.length > 0 && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Info className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Available categories for swapping:
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {allowedCategories.map(category => (
                      <Badge key={category} variant="secondary" className="bg-blue-100 text-blue-800">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Selection Rules Info */}
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-2">
              <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Swap Rules:</p>
                <ul className="space-y-1 text-xs">
                  <li>• First select your items to see available categories</li>
                  <li>• You can only select items from matching categories</li>
                  <li>• Unchecking your items will clear other selections</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Swap Summary */}
        {canCreateSwap && (
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{selectedMyItems.length}</div>
                  <div className="text-sm text-muted-foreground">Your Items</div>
                  <div className="text-lg font-semibold">${mySelectedValue}</div>
                </div>
                
                <div className="flex items-center">
                  <ArrowLeftRight className="h-8 w-8 text-primary" />
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{selectedOtherItems.length}</div>
                  <div className="text-sm text-muted-foreground">Their Items</div>
                  <div className="text-lg font-semibold">${otherSelectedValue}</div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <Button size="lg" className="px-8">
                  Propose Swap
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* My Products */}
          <div>
            <div className="flex items-center mb-6">
              <Package className="h-6 w-6 mr-3 text-primary" />
              <h2 className="text-2xl font-bold">Your Products</h2>
              <Badge variant="secondary" className="ml-3">
                {selectedMyItems.length} selected
              </Badge>
            </div>
            
            <div className="space-y-4">
              {myProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className={`transition-all duration-200 ${
                    selectedMyItems.includes(product.id) 
                      ? 'ring-2 ring-primary shadow-lg' 
                      : 'hover:shadow-md'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex items-center">
                        <Checkbox
                          checked={selectedMyItems.includes(product.id)}
                          onCheckedChange={() => handleMyItemSelect(product.id)}
                          className="mr-3"
                        />
                      </div>
                      
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="secondary">{product.category}</Badge>
                          <Badge className={getConditionColor(product.condition)}>
                            {product.condition}
                          </Badge>
                        </div>
                        <div className="text-xl font-bold text-primary">{product.value}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Other Users' Products */}
          <div>
            <div className="flex items-center mb-6">
              <Users className="h-6 w-6 mr-3 text-primary" />
              <h2 className="text-2xl font-bold">Available Products</h2>
              <Badge variant="secondary" className="ml-3">
                {selectedOtherItems.length} selected
              </Badge>
            </div>
            
            <div className="space-y-4">
              {otherUsersProducts.map((product) => {
                const isSelectable = isOtherItemSelectable(product);
                const isSelected = selectedOtherItems.includes(product.id);
                
                return (
                  <Card 
                    key={product.id} 
                    className={`transition-all duration-200 ${
                      isSelected
                        ? 'ring-2 ring-primary shadow-lg' 
                        : isSelectable 
                          ? 'hover:shadow-md' 
                          : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex items-center">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleOtherItemSelect(product.id)}
                            disabled={!isSelectable}
                            className="mr-3"
                          />
                        </div>
                        
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                          <div className="text-sm text-muted-foreground mb-2">by {product.owner}</div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge 
                              variant="secondary" 
                              className={!isSelectable ? 'opacity-60' : ''}
                            >
                              {product.category}
                            </Badge>
                            <Badge className={getConditionColor(product.condition)}>
                              {product.condition}
                            </Badge>
                          </div>
                          <div className="text-xl font-bold text-primary">{product.value}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Swapp;
