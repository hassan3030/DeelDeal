'use client'
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast"
import {
  getReview,
  addReview
} from "@/callAPI/swap";


// Function to calculate average rating (range 1 to 5)


const SwapRating = ({ from_user_id , to_user_id , offer_id , userName ,userAvatar  }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  const [onClose, setOnClose] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast()



//   -------------------------------------------
// const handleGetBreviousRating = async (user_id) =>{
//  const response = await getReview(user_id);
//  if (!response) {
//   const rates = []
//  }
//  else{
//   const rates = response.map(({ rating }) => rating);
//  }
// }

const handleAddRating = async () =>{
 await addReview("c49a1579-f579-49dc-a5c1-4bda0de4059c" , "bfefbc56-574b-4a83-869f-1940f1aa1687" , '84b72db7-1d98-44ce-97a2-dc60b40efbb9' , 5 , 'message');
//  await addOffer(from_user_id , to_user_id , offer_id , rating , message);

}

// -------------------------------------------

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
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a star rating before submitting",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      
     await handleAddRating();
      await onSubmitRating(ratingData);

      toast({
        title: "Rating submitted",
        description: `Thank you for rating`
        // description: `Thank you for rating ${userName}!`
      });

      if (onClose) {
        setOnClose(true);
      }
    } catch (error) {
      toast({
        title: "Failed to submit rating",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingText = (rating) => {
    switch (rating) {
      case 1: return "Poor";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Very Good";
      case 5: return "Excellent";
      default: return "Select a rating";
    }
  };

  // Calculate average from previous reviews
//   const average = calculateAverageRating(previousReviews);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Rate Your Swap Partner
        </CardTitle>
        <div className="flex items-center justify-center gap-3 mt-4">
          {userAvatar && (
            <img 
              src={userAvatar} 
              alt={userName}
              className="w-12 h-12 rounded-full object-cover"
            />
          )}
          <div>
            {userName && (<p className="font-semibold text-lg">{userName}</p>)}
        
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Star Rating */}
        <div className="text-center">
          <div className="flex justify-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => handleStarHover(star)}
                onMouseLeave={handleStarLeave}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= (hoverRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            {getRatingText(hoverRating || rating)}
          </p>
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
            className="min-h-[80px] resize-none"
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {message.length}/500
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {onClose && (
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button 
            onClick={()=>{handleSubmit()}}
            disabled={isSubmitting || rating === 0}
            className="flex-1"
          >
            {isSubmitting ? (
              "Submitting..."
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Rating
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SwapRating;