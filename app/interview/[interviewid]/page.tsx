"use client";

import { Button } from "@/components/ui/button";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Lightbulb, WebcamIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";

// Define the type for the props
interface InterviewProps {
  params: {
    interviewId: string;
  };
}

// Define the type for the interview data
interface InterviewData {
  jobPosition: string;
  jobDesc: string;
  jobExperience: string;
}

const Interview: React.FC<InterviewProps> = ({ params }) => {
  const [interviewData, setInterviewData] = useState<InterviewData | null>(null);
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  useEffect(() => {
    getInterviewDetail();
  }, []);

  /**
   * Fetches interview details using the provided interview ID.
   */
  const getInterviewDetail = async () => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId));

      if (result && result.length > 0) {
        setInterviewData(result[0]);
      } else {
        console.error("No interview data found.");
      }
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };

  return (
    <div className="my-10">
      <h2 className="font-bold text-2xl">Let's Get Started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col my-5 gap-5">
          {/* Interview Details Section */}
          <div className="flex flex-col p-5 rounded-lg border gap-5">
            <h2>
              <strong>Job Role/Job Position:</strong> {interviewData?.jobPosition || "Loading..."}
            </h2>
            <h2>
              <strong>Job Description:</strong> {interviewData?.jobDesc || "Loading..."}
            </h2>
            <h2>
              <strong>Years of Experience:</strong> {interviewData?.jobExperience || "Loading..."}
            </h2>
          </div>
          {/* Information Section */}
          <div className="p-5 border rounded-lg border-yellow-300 bg-yellow-100">
            <h2 className="flex gap-2 items-center text-yellow-500">
              <Lightbulb /> <strong>Information</strong>
            </h2>
            <h2 className="mt-3 text-yellow-500">
              {process.env.NEXT_PUBLIC_INFORMATION || "No information available."}
            </h2>
          </div>
        </div>
        {/* Webcam Section */}
        <div>
          {webCamEnabled ? (
            <Webcam
              mirrored
              style={{ height: 300, width: 300 }}
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={() => setWebCamEnabled(false)}
            />
          ) : (
            <>
              <WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary rounded-lg border" />
              <Button variant="ghost" onClick={() => setWebCamEnabled(true)}>
                Enable Web Cam and Microphone
              </Button>
            </>
          )}
        </div>
      </div>
      {/* Start Interview Button */}
      <div className="flex justify-end items-end">
        <Link href={`/dashboard/interview/${params.interviewId}/start`}>
          <Button>Start Interview</Button>
        </Link>
      </div>
    </div>
  );
};

export default Interview;
