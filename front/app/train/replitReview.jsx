'use client'

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { starAnimation, fadeIn, buttonHover } from "@/lib/animations";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

  const RatingSystem = ()=> {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { ref, isInView } = useScrollAnimation();

  const ratingTexts = {
    0: "Select a rating",
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };

  const handleStarClick = (starRating) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating) => {
    setHoverRating(starRating);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = async () => {
    if (rating === 0) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setRating(0);
      setMessage("");
    }, 3000);
  };

  return (
    <section className="py-16 bg-card" ref={ref}>
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          variants={fadeIn("up")}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <Card className="bg-muted/30 rounded-3xl shadow-lg border-0">
            <CardHeader className="text-center pb-6">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Star className="w-8 h-8 text-primary-foreground" />
              </motion.div>
              
              <CardTitle className="text-2xl font-bold mb-2">
                Rate Your Swap Partner
              </CardTitle>

              <motion.div
                variants={fadeIn("up", 0.4)}
                className="flex items-center justify-center gap-3 mt-4"
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                    alt="Sarah Johnson"
                  />
                  <AvatarFallback className="gradient-primary text-primary-foreground">
                    SJ
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="font-semibold text-lg">Sarah Johnson</p>
                  <p className="text-sm text-muted-foreground">@sarah_trades</p>
                </div>
              </motion.div>
            </CardHeader>

            <CardContent className="space-y-6">
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.div
                    key="rating-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    {/* Star Rating */}
                    <div className="text-center">
                      <div className="flex justify-center gap-2 mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <motion.button
                            key={star}
                            variants={starAnimation}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => handleStarClick(star)}
                            onMouseEnter={() => handleStarHover(star)}
                            onMouseLeave={handleStarLeave}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-10 h-10 transition-colors duration-200 ${
                                star <= (hoverRating || rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          </motion.button>
                        ))}
                      </div>
                      <motion.p
                        key={hoverRating || rating}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm font-medium text-muted-foreground"
                      >
                        {ratingTexts[hoverRating || rating]}
                      </motion.p>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Leave a message (optional)
                      </label>
                      <Textarea
                        placeholder="Share your experience with this swap partner..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="min-h-[100px] resize-none transition-colors duration-200"
                        maxLength={500}
                      />
                      <p className="text-xs text-muted-foreground mt-1 text-right">
                        {message.length}/500
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <motion.div
                        variants={buttonHover}
                        whileHover="hover"
                        whileTap="tap"
                        className="flex-1"
                      >
                        <Button
                          variant="outline"
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          Cancel
                        </Button>
                      </motion.div>
                      
                      <motion.div
                        variants={buttonHover}
                        whileHover={rating > 0 ? "hover" : "rest"}
                        whileTap={rating > 0 ? "tap" : "rest"}
                        className="flex-1"
                      >
                        <Button
                          onClick={handleSubmit}
                          disabled={isSubmitting || rating === 0}
                          className="w-full gradient-primary text-primary-foreground relative overflow-hidden"
                        >
                          <AnimatePresence mode="wait">
                            {isSubmitting ? (
                              <motion.div
                                key="submitting"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2"
                              >
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                                />
                                Submitting...
                              </motion.div>
                            ) : (
                              <motion.div
                                key="submit"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2"
                              >
                                <Send className="w-4 h-4" />
                                Submit Rating
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <Check className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-green-600 mb-2">
                      Review Submitted!
                    </h3>
                    <p className="text-muted-foreground">
                      Thank you for your feedback. It helps build trust in our community.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
export default RatingSystem;