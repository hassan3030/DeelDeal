'use client'
import React, { useState , useEffect} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast"
import {
  addReview,
  getReviewConditins
} from "@/callAPI/swap";
import {
 decodedToken
} from "@/callAPI/utiles";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/lib/use-translations";



const SwapRating = ({ from_user_id , to_user_id , offer_id , userName ,userAvatar  }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  const [onClose, setOnClose] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
const router = useRouter();
  const { toast } = useToast()
    const { t } = useTranslations();


const checkReview = async () => {
  try {
    const myId = await decodedToken();
    const rev = await getReviewConditins(myId.id, offer_id);
    // If rev is an array and has at least one review, setHasReviewed(true)
    if (Array.isArray(rev) && rev.length > 0) {
      setHasReviewed(false);
    } else {
       setHasReviewed(true);
    }
  } catch (error) {
    console.log("error", error);
    setHasReviewed(false); // Optionally set to false on error
  }
};


const handleAddRating = async () =>{
//  await addReview("c49a1579-f579-49dc-a5c1-4bda0de4059c" , "bfefbc56-574b-4a83-869f-1940f1aa1687" , '84b72db7-1d98-44ce-97a2-dc60b40efbb9' , 5 , 'message');
 await addReview(from_user_id , to_user_id , offer_id , rating , message);

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
        title: t("error")|| "Error",
        description: t("Pleaseselectastarratingbeforesubmitting")|| "Please select a star rating before submitting",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      
     await handleAddRating();
      toast({
        title: t("Ratingsubmitted")|| "Rating submitted",
        description:  t("Thankyouforrating")|| `Thank you for rating`
        // description: `Thank you for rating ${userName}!`
      });
router.push()
      
    } catch (error) {
      toast({
            title: t("error")|| "Error", 
        description:t("FailedtosubmitratingPleasetryagainlater")|| "Failed to submit rating Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingText = (rating) => {
    switch (rating) {
      case 1: return  t("Poor")||"Poor";
      case 2: return  t("Fair")||"Fair";
      case 3: return  t("Good")||"Good";
      case 4: return  t("VeryGood")||"Very Good";
      case 5: return  t("Excellent")||"Excellent";
      default: return  t("Selectarating")|| "Select a rating";
    }
  };
useEffect(() => {
 checkReview()
}, [hasReviewed]);

  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
           {t("RateYourSwapPartner")||"Rate Your Swap Partner"}
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
     {hasReviewed?( 
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
           {t("Leaveamessageoptional")||"Leave a message (optional)"}
            
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
           {t("Cancel")||"Cancel"}
              
            </Button>
          )}
          <Button 
            onClick={()=>{handleSubmit()}}
            disabled={isSubmitting || rating === 0}
            className="flex-1"
          >
            {isSubmitting ? (
              t("SubmitRating")||"Submit Rating"
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
           {t("SubmitRating")||"Submit Rating"}

              
              </>
            )}
          </Button>
        </div>
      </CardContent>):(<div className="p-4 rounded-lg bg-green-50 border border-green-200 flex items-center gap-3 mb-4">
    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
    <div>
      <div className="font-semibold text-green-700"> {t("ReviewSubmitted")||"Review Submitted"}</div>
      <div className="text-sm text-green-600"> {t("YouhavealreadyreviewedthisofferThankyouforyourfeedback")||"You have already reviewed this offer. Thank you for your feedback!"}</div>
    </div>
  </div>)} 
    
    </Card>
  );
};

export default SwapRating;