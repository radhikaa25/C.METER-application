import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import Collapsible from "@/components/ui/collapsible";

interface FeedbackProps {
  params: {
    interviewId: string;
  };
}

interface FeedbackItem {
  id: number;
  question: string;
  userAns: string;
  correctAns: string;
  feedback: string;
  rating: string;
  mockIdRef: string;
}

const Feedback: React.FC<FeedbackProps> = ({ params }) => {
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [avgRating, setAvgRating] = useState<number | undefined>();
  const router = useRouter();

  useEffect(() => {
    GetFeedBack();
  }, []);

  const GetFeedBack = async () => {
    try {
      const result = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, params.interviewId))
        .orderBy(UserAnswer.id);

      setFeedbackList(result);

      if (result.length > 0) {
        const totalRating = result.reduce((sum: number, item: { rating: string }) => sum + Number(item.rating), 0);
        setAvgRating(Math.round(totalRating / result.length));
      }
    } catch (error) {
      console.error("Error fetching feedback data:", error);
    }
  };

  return (
    <div className="p-10">
      {feedbackList.length === 0 ? (
        <h2 className="font-bold text-xl text-gray-500">No Interview Feedback Record Found</h2>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-green-500">Congratulations!</h2>
          <h2 className="font-bold text-2xl">Here is your interview feedback</h2>
          <h2 className="text-primary text-lg my-3">
            Your overall interview rating{" "}
            <strong className={avgRating && avgRating < 6 ? "text-red-600" : "text-green-500"}>{avgRating}/10</strong>
          </h2>

          <h2 className="text-sm text-gray-200">
            Find below interview questions with the correct answers, your answers, and feedback for improvement.
          </h2>

          {feedbackList.map((item, index) => (
            <Collapsible key={index} title={item.question}>
              <div className="flex flex-col gap-2">
                <h2 className="text-red-600 p-2 rounded-lg">
                  <strong>Rating:</strong> {item.rating}
                </h2>
                <h2 className="p-2 border rounded-lg bg-red-50 text-sm text-red-900">
                  <strong>Your Answer:</strong> {item.userAns}
                </h2>
                <h2 className="p-2 border rounded-lg bg-green-50 text-sm text-green-900 mt-2">
                  <strong>Correct Answer:</strong> {item.correctAns}
                </h2>
                <h2 className="p-2 border rounded-lg bg-blue-50 text-sm text-primary mt-2">
                  <strong>Feedback:</strong> {item.feedback}
                </h2>
              </div>
            </Collapsible>
          ))}
        </>
      )}

      <Button onClick={() => router.replace("/dashboard")}>Go Home</Button>
    </div>
  );
};

export default Feedback;
