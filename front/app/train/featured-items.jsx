'use client'
import { motion } from "framer-motion";
import { Heart, Star, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fadeIn, staggerContainer, cardHover } from "@/lib/animations";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const FeaturedItems = ()=> {
  const { ref, isInView } = useScrollAnimation();

  const featuredItems = [
    {
      id: 1,
      title: "Professional DSLR Camera",
      description: "Canon EOS 5D Mark IV with lens kit, perfect for photography enthusiasts",
      price: "$1,200",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      alt: "Professional DSLR camera equipment",
      status: "Available",
      statusColor: "bg-green-500",
      liked: false,
    },
    {
      id: 2,
      title: "Designer Handbag",
      description: "Authentic leather designer handbag in excellent condition",
      price: "$450",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      alt: "Designer leather handbag",
      status: "Pending",
      statusColor: "bg-yellow-500",
      liked: true,
    },
    {
      id: 3,
      title: "Electric Bicycle",
      description: "Eco-friendly e-bike with long battery life, perfect for city commuting",
      price: "$800",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      alt: "Electric bicycle for commuting",
      status: "Available",
      statusColor: "bg-green-500",
      liked: false,
    },
    {
      id: 4,
      title: "Gaming Keyboard Set",
      description: "Mechanical gaming keyboard with RGB lighting and premium switches",
      price: "$150",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      alt: "Gaming mechanical keyboard setup",
      status: "Available",
      statusColor: "bg-green-500",
      liked: false,
    },
  ];

  return (
    <section id="items" className="py-16 bg-muted/30" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          variants={fadeIn("up")}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured Items
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the most popular items available for swap right now
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {featuredItems.map((item, index) => (
            <motion.div
              key={item.id}
              variants={fadeIn("up", index * 0.1)}
              whileHover="hover"
              initial="rest"
              animate="rest"
              className="group"
            >
              <motion.div
                variants={cardHover}
                className="bg-card rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative">
                  <div className="aspect-square overflow-hidden">
                    <motion.img
                      src={item.image}
                      alt={item.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      whileHover={{ scale: 1.1 }}
                    />
                  </div>

                  {/* Heart/Wishlist Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-3 right-3 w-8 h-8 bg-background/90 rounded-full flex items-center justify-center hover:bg-background transition-colors duration-200"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors duration-200 ${
                        item.liked 
                          ? "text-red-500 fill-current" 
                          : "text-muted-foreground hover:text-red-500"
                      }`}
                    />
                  </motion.button>

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge
                      className={`${item.statusColor} text-white text-xs px-2 py-1 font-medium`}
                    >
                      {item.status}
                    </Badge>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-primary">
                      {item.price}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-muted-foreground">
                        {item.rating}
                      </span>
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="w-full gradient-primary text-primary-foreground py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2">
                      <Repeat className="w-4 h-4" />
                      Make Swap
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={fadeIn("up", 0.5)}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mt-12"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-primary text-primary hover:bg-primary/10 px-8 py-4 text-lg font-medium"
            >
              View All Items
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
export default FeaturedItems;