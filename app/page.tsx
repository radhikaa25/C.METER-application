"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.5 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const featureVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.6, type: "spring", stiffness: 200 } },
};

export default function Home() {
  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center text-white relative">
      {/* Gradient Background */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black via-gray-900 to-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />

      {/* Main Content */}
      <main className="relative z-10 px-6 py-12 text-center">
        {/* Hero Section */}
        <motion.div
          className="relative flex flex-col items-center space-y-6 px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Title */}
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold tracking-tight max-w-3xl leading-tight"
            style={{ color: "" }} // Gold color
            variants={itemVariants}
          >
            Achieve Excellence with Mock Interviews & Challenges
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg max-w-xl text-gray-300"
            variants={itemVariants}
          >
            Hone your skills with tailored experiences and step confidently into your career.
          </motion.p>

          {/* Call-to-Action Buttons */}
          <motion.div variants={itemVariants} className="space-x-4">
            <Link href="/dashboard1">
              <button
                className="px-8 py-4 font-semibold text-lg rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:bg-yellow-700 transition-shadow shadow-lg hover:shadow-2xl"
              >
                Get Started
              </button>
            </Link>
            <Link href="https://mock-app-interview.vercel.app/">
              <button
                className="px-8 py-4 font-semibold text-lg rounded-full bg-gray-800 text-gold hover:bg-gray-700 transition-shadow shadow-lg hover:shadow-2xl" >
                Take Mock Interview
              </button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          id="why-choose-us"
          className="mt-24 text-center px-6 py-12 bg-gray-800 rounded-xl shadow-xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2
            className="text-3xl font-semibold text-gold mb-6"
            variants={itemVariants}>
            Why Choose Us?
          </motion.h2>

          <motion.p
            className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            {/*text(para)*/}
          </motion.p>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="p-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-xl text-center text-white"
              variants={featureVariants}
            >
              <h3 className="text-2xl font-bold mb-4">Expert Interviewers</h3>
              <p className="text-lg">Get valuable insights and feedback from industry professionals who understand what hiring managers are looking for.</p>
            </motion.div>

            <motion.div
              className="p-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg shadow-xl text-center text-white"
              variants={featureVariants}
            >
              <h3 className="text-2xl font-bold mb-4">Real-Time Feedback</h3>
              <p className="text-lg">Receive instant feedback on your performance, helping you identify areas for improvement and grow quickly.</p>
            </motion.div>

            <motion.div
              className="p-8 bg-gradient-to-r from-yellow-500 to-red-500 rounded-lg shadow-xl text-center text-white"
              variants={featureVariants}
            >
              <h3 className="text-2xl font-bold mb-4">Tailored Challenges</h3>
              <p className="text-lg">Work on challenges designed specifically for your desired job role and level of experience, ensuring you're prepared for real-world scenarios.</p>
            </motion.div>

            <motion.div
              className="p-8 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-lg shadow-xl text-center text-white"
              variants={featureVariants}
            >
              <h3 className="text-2xl font-bold mb-4">Comprehensive Analytics</h3>
              <p className="text-lg">Track your progress with detailed performance analytics that help you refine your skills and boost your confidence.</p>
            </motion.div>

            <motion.div
              className="p-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-xl text-center text-white"
              variants={featureVariants}
            >
              <h3 className="text-2xl font-bold mb-4">Flexible Scheduling</h3>
              <p className="text-lg">Take interviews at your convenience with flexible scheduling, so you can fit mock interviews into your busy life.</p>
            </motion.div>

            <motion.div
              className="p-8 bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg shadow-xl text-center text-white"
              variants={featureVariants}
            >
              <h3 className="text-2xl font-bold mb-4">Job Role Customization</h3>
              <p className="text-lg">Choose your job role, skill level, and experience, ensuring that your mock interviews are perfectly aligned with your career goals.</p>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-20 text-center text-sm text-gray-400"
          variants={itemVariants}>
          Elevate your future with every step you take today.
        </motion.div>
      </main>
    </div>
  );
}
