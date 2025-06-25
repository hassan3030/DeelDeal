'use client'

import { motion, useScroll, useTransform } from "framer-motion";
import { 
  fadeIn, 
  staggerContainer, 
  scaleIn, 
  premiumCardHover, 
  textReveal, 
  staggeredGrid, 
  gridItem,
  magneticButton,
  glowEffect
} from "@/lib/animations";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useRef  , useState} from "react";
import { TrendingUp, Star, Eye } from "lucide-react";
import { allowedCategories } from "@/lib/data";

const CategoriesSection=()=> {
  const { ref, isInView } = useScrollAnimation();
    const [categories , setCategories]= useState(allowedCategories||[])
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  // const categories = [
  //   {
  //     name: "Electronics",
  //     count: "1,234 items",
  //     trending: "+12%",
  //     image: "https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
  //     alt: "Professional camera equipment",
  //     color: "from-blue-500 to-cyan-500",
  //     bgColor: "bg-blue-500/10",
  //   },
  //   {
  //     name: "Fashion",
  //     count: "856 items",
  //     trending: "+8%",
  //     image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
  //     alt: "Fashion clothing rack",
  //     color: "from-pink-500 to-purple-500",
  //     bgColor: "bg-pink-500/10",
  //   },
  //   {
  //     name: "Home & Garden",
  //     count: "642 items",
  //     trending: "+15%",
  //     image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
  //     alt: "Home plants and decor",
  //     color: "from-green-500 to-emerald-500",
  //     bgColor: "bg-green-500/10",
  //   },
  //   {
  //     name: "Sports",
  //     count: "478 items",
  //     trending: "+5%",
  //     image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
  //     alt: "Sports equipment and fitness",
  //     color: "from-orange-500 to-red-500",
  //     bgColor: "bg-orange-500/10",
  //   },
  //   {
  //     name: "Books",
  //     count: "921 items",
  //     trending: "+3%",
  //     image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
  //     alt: "Books and literature collection",
  //     color: "from-amber-500 to-yellow-500",
  //     bgColor: "bg-amber-500/10",
  //   },
  //   {
  //     name: "Collectibles",
  //     count: "315 items",
  //     trending: "+20%",
  //     image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
  //     alt: "Vintage collectibles and antiques",
  //     color: "from-purple-500 to-indigo-500",
  //     bgColor: "bg-purple-500/10",
  //   },
  // ];

  return (
    <section 
      id="categories" 
      ref={sectionRef} 
      className="relative py-20 bg-gradient-to-br from-background via-accent/3 to-primary/3 overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          style={{ y }}
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-2xl"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], [-30, 30]) }}
          className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-2xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        {/* Enhanced Header */}
        <motion.div
          variants={textReveal}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.div
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
            className="inline-block"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              Browse Categories
            </h2>
          </motion.div>
          
          <motion.p
            variants={fadeIn("up", 0.2)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Discover amazing items across various categories and find exactly what you're looking for
          </motion.p>

          {/* Trending indicator */}
          <motion.div
            variants={fadeIn("up", 0.4)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="mt-8 flex items-center justify-center gap-2 text-sm text-primary"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <TrendingUp className="h-4 w-4" />
            </motion.div>
            <span className="font-medium">Trending categories this week</span>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Star className="h-4 w-4 fill-current" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Enhanced Categories Grid */}
        <motion.div
          variants={staggeredGrid(0.1)}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              variants={gridItem}
              className="group cursor-pointer"
            >
              <motion.div
                variants={premiumCardHover}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                className="relative overflow-hidden bg-background/80 backdrop-blur-md rounded-3xl p-6 text-center border border-border/50 shadow-lg group-hover:shadow-2xl transition-all duration-500"
              >
                {/* Background gradient overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className={`absolute inset-0 bg-gradient-to-br bg-purple-500/10 opacity-5 rounded-3xl transition-opacity duration-300`}
                />
                
                {/* Trending badge */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  className="absolute -top-2 -right-2 bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-bold px-2 py-1 rounded-full shadow-lg"
                >
                  {category.trending}
                </motion.div>

                {/* Enhanced image container */}
                <motion.div
                  whileHover={{ 
                    rotate: [0, -5, 5, 0],
                    scale: 1.15,
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="relative w-20 h-20 mx-auto mb-4"
                >
                  <div className={`absolute inset-0 bg-purple-500/10 rounded-2xl blur-xl opacity-50`} />
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg">
                    <img
                      // src={category.imageSrc}
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
                      alt={category.name}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                    />
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"
                    />
                  </div>
                </motion.div>

                {/* Enhanced text content */}
                <motion.h3
                  whileHover={{ scale: 1.05 }}
                  className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300 mb-2"
                >
                  {category.name}
                </motion.h3>
                
                <motion.p
                  className="text-sm text-muted-foreground font-medium mb-2"
                >
                  {1000}
                </motion.p>

                {/* View indicator */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-1 text-xs text-primary font-medium"
                >
                  <Eye className="h-3 w-3" />
                  <span>View All</span>
                </motion.div>

                {/* Hover glow effect */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  className={`absolute inset-0 bg-gradient-to-br bg-pink-500/10 opacity-10 rounded-3xl blur-sm`}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced CTA */}
        <motion.div
          variants={fadeIn("up", 0.6)}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mt-16"
        >
          <motion.div
            variants={magneticButton}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            className="inline-block"
          >
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-primary/20"
              variants={glowEffect}
              animate="animate"
            >
              <span className="flex items-center gap-2">
                Explore All Categories
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <TrendingUp className="h-5 w-5" />
                </motion.div>
              </span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}



export default CategoriesSection;