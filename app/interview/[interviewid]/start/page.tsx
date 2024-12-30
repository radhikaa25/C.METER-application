"use client";

import React, { useEffect, useState } from "react";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import QuestionsSections from './components/QuestionsSections';
import RecordAnswerSection from './components/RecordAnswerSection';

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Params {
  interviewId: string;
}

interface StartInterviewProps {
  params: Params;
}

interface InterviewData {
  mockId: string;
  jsonMockResp: string;
}

interface Question {
  question: string;
  id: number;
}

const StartInterview: React.FC<StartInterviewProps> = ({ params }) => {
  const [interviewData, setInterviewData] = useState<InterviewData | null>(null);
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState<Question[] | null>(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);

  useEffect(() => {
    GetInterviewDetail();
  }, []);

  const GetInterviewDetail = async () => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId));

      if (result && result[0]) {
        const jsonMockResp = JSON.parse(result[0].jsonMockResp) as Question[];
        setMockInterviewQuestion(jsonMockResp);
        setInterviewData(result[0]);
      }
    } catch (error) {
      console.error("Failed to fetch interview details:", error);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Questions Section */}
        <QuestionsSections
          activeQuestionIndex={activeQuestionIndex}
          mockInterViewQuestion={mockInterviewQuestion || []}
        />
        {/* Video/Audio Recording Section */}
        <RecordAnswerSection
          activeQuestionIndex={activeQuestionIndex}
          mockInterViewQuestion={mockInterviewQuestion || []}
          interviewData={interviewData}
        />
      </div>

      <div className="flex justify-end gap-6 mt-6">
        {/* Previous Question Button */}
        {activeQuestionIndex > 0 && (
          <Button
            disabled={activeQuestionIndex === 0}
            onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
          >
            Previous Question
          </Button>
        )}

        {/* Next Question Button */}
        {mockInterviewQuestion &&
          activeQuestionIndex !== mockInterviewQuestion.length - 1 && (
            <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>
              Next Question
            </Button>
          )}

        {/* End Interview Button */}
        {mockInterviewQuestion &&
          activeQuestionIndex === mockInterviewQuestion.length - 1 &&
          interviewData && (
            <Link href={`/dashboard/interview/${interviewData.mockId}/feedback`}>
              <Button>End Interview</Button>
            </Link>
          )}
      </div>
    </div>
  );
};

export default StartInterview;
