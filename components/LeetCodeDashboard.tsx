"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { capitalizeWords } from "@/utils/utils";
import { VideoDialog } from "@/components/VideoDialog";
import { SolutionDialog } from "@/components/SolutionDialog";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import TopicDropdown from "@/components/TopicDropdown";

interface Question {
  ID: string;
  Title: string;
  URL: string;
  company: string;
  Difficulty: string;
  "Acceptance %": string;
  "Frequency %": string;
  "Is Premium": string;
  Topics: string;
}

interface LeetCodeDashboardProps {
  questions: Question[];
  companies: string[];
}

const ITEMS_PER_PAGE = 10;

const LeetCodeDashboard: React.FC<LeetCodeDashboardProps> = ({
  questions = [],
  companies = [],
}) => {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const handleDashboardClick = () => {
    if (isSignedIn) {
      router.push("/dashboard");
    } else {
      router.push("/sign-in");
    }
  };

  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [premiumFilter, setPremiumFilter] = useState("all");
  const [selectedCompany] = useState("");
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [goToPage, setGoToPage] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  useEffect(() => {
    setIsClient(true);

    const savedItems = localStorage.getItem("leetcode-checked-items");
    if (savedItems) {
      try {
        const parsed = JSON.parse(savedItems);
        setCheckedItems(parsed);
      } catch (err) {
        console.error("Error parsing localStorage data:", err);
      }
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem(
        "leetcode-checked-items",
        JSON.stringify(checkedItems)
      );
    }
  }, [checkedItems, isClient]);

  const handleCheckboxChange = (id: string, value: boolean) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const totalQuestions = questions.length;

  const companyStats = useMemo(() => {
    return companies
      .map((company) => ({
        name: company,
        count: questions.filter((q) => q.company === company).length,
      }))
      .sort((a, b) => b.count - a.count);
  }, [questions, companies]);

  const uniqueTopics = useMemo(() => {
    const topicsSet = new Set<string>();
    questions.forEach((question) => {
      question.Topics.split(",").forEach((topic) => {
        const trimmedTopic = topic.trim();
        if (trimmedTopic) {
          topicsSet.add(trimmedTopic);
        }
      });
    });
    return Array.from(topicsSet);
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    const queryWords = searchQuery.trim().toLowerCase().split(/\s+/);
    return questions.filter((question) => {
      const matchesSearch = queryWords.every((word) =>
        question.Title.toLowerCase().includes(word) ||
        question.company.toLowerCase().includes(word) ||
        question.Topics.toLowerCase().split(',').some(topic => topic.trim().includes(word))
      );
      const matchesDifficulty =
        difficultyFilter === "all" || question.Difficulty === difficultyFilter;
      const matchesPremium =
        premiumFilter === "all" ||
        (premiumFilter === "free" && question["Is Premium"] === "N") ||
        (premiumFilter === "premium" && question["Is Premium"] === "Y");
      const matchesCompany =
        !selectedCompany || question.company === selectedCompany;
      const matchesTopic =
        selectedTopics.length === 0 ||
        selectedTopics.every((topic) =>
          question.Topics.split(",").map((t) => t.trim()).includes(topic)
        );

      return (
        matchesSearch &&
        matchesDifficulty &&
        matchesPremium &&
        matchesCompany &&
        matchesTopic
      );
    });
  }, [
    questions,
    searchQuery,
    difficultyFilter,
    premiumFilter,
    selectedCompany,
    selectedTopics,
  ]);

  const statistics = useMemo(() => {
    const uniqueQuestions = Array.from(new Set(filteredQuestions.map(q => q.ID)));
    const total = uniqueQuestions.length;

    const solvedQuestions = new Set(
      filteredQuestions
        .filter(q => checkedItems[q.ID])
        .map(q => q.ID)
    );

    const totalSolved = solvedQuestions.size;

    const easyQuestions = new Set(filteredQuestions.filter(q => q.Difficulty === "Easy").map(q => q.ID));
    const mediumQuestions = new Set(filteredQuestions.filter(q => q.Difficulty === "Medium").map(q => q.ID));
    const hardQuestions = new Set(filteredQuestions.filter(q => q.Difficulty === "Hard").map(q => q.ID));

    const easySolved = new Set(
      filteredQuestions
        .filter(q => q.Difficulty === "Easy" && checkedItems[q.ID])
        .map(q => q.ID)
    ).size;

    const mediumSolved = new Set(
      filteredQuestions
        .filter(q => q.Difficulty === "Medium" && checkedItems[q.ID])
        .map(q => q.ID)
    ).size;

    const hardSolved = new Set(
      filteredQuestions
        .filter(q => q.Difficulty === "Hard" && checkedItems[q.ID])
        .map(q => q.ID)
    ).size;

    return {
      total,
      totalSolved,
      easy: easyQuestions.size,
      easySolved,
      medium: mediumQuestions.size,
      mediumSolved,
      hard: hardQuestions.size,
      hardSolved,
    };
  }, [filteredQuestions, checkedItems]);

  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredQuestions.slice(startIndex, endIndex);
  }, [filteredQuestions, currentPage, itemsPerPage]);

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);

  const handleGoToPage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const pageNumber = parseInt(goToPage);
      if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
        setGoToPage("");
      }
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => {
      const nextPage = Math.min(prev + 1, totalPages);
      return nextPage > totalPages ? totalPages : nextPage;
    });
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages]);

  useEffect(() => {
    setCurrentPage(1); 
  }, [filteredQuestions]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="p-6 bg-black dark:bg-black">
  <Card className="w-full bg-white dark:bg-black ">
    <CardHeader>
      <CardTitle className="text-3xl font-extrabold text-white dark:text-white">
        Practice Questions
      </CardTitle>
      <CardDescription className="text-sm text-gray-500 dark:text-gray-300">
        Browse through {totalQuestions.toLocaleString()} LeetCode questions
        asked in technical interviews
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col gap-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-black rounded-md shadow-sm">
            <CardContent className="pt-6">
              <div className="flex justify-between items-baseline">
                <div className="text-2xl font-semibold text-transparent dark:text-blue-300">
                  {statistics.totalSolved}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">/ {statistics.total}</div>
              </div>
              <div className="text-sm text-gray-500 dark:text-white">Total Solved</div>
              <div className="mt-2">
                <Progress 
                  value={(statistics.totalSolved / statistics.total) * 100} 
                  className="h-2 rounded-full bg-blue-200 dark:bg-bg-white"
                />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-black rounded-md shadow-sm">
            <CardContent className="pt-6">
              <div className="flex justify-between items-baseline">
                <div className="text-2xl font-semibold text-green-600 dark:text-green-400">
                  {statistics.easySolved}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">/ {statistics.easy}</div>
              </div>
              <div className="text-sm text-gray-500 dark:text-white">Easy</div>
              <div className="mt-2">
                <Progress 
                  value={(statistics.easySolved / statistics.easy) * 100} 
                  className="h-2 rounded-full bg-green-200 dark:bg-white"
                />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-black rounded-md shadow-sm">
            <CardContent className="pt-6">
              <div className="flex justify-between items-baseline">
                <div className="text-2xl font-semibold text-violet-600 dark:text-violet-400">
                  {statistics.mediumSolved}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">/ {statistics.medium}</div>
              </div>
              <div className="text-sm text-gray-500 dark:text-white">Medium</div>
              <div className="mt-2">
                <Progress 
                  value={(statistics.mediumSolved / statistics.medium) * 100} 
                  className="h-2 rounded-full bg-violet-200 dark:bg-white"
                />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-black rounded-md shadow-sm">
            <CardContent className="pt-6">
              <div className="flex justify-between items-baseline">
                <div className="text-2xl font-semibold text-red-600 dark:text-red-400">
                  {statistics.hardSolved}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">/ {statistics.hard}</div>
              </div>
              <div className="text-sm text-gray-500 dark:text-white">Hard</div>
              <div className="mt-2">
                <Progress 
                  value={(statistics.hardSolved / statistics.hard) * 100} 
                  className="h-2 rounded-full bg-red-200 dark:bg-white"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-[250px]">
            <Input
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white dark:bg-transparent text-white dark:text-white"
            />
          </div>

          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-full md:w-52 bg-white dark:bg-transparent text-white dark:text-white">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>

          <Select value={premiumFilter} onValueChange={setPremiumFilter}>
            <SelectTrigger className="w-full md:w-40 bg-gray-100 dark:bg-transparent text-white dark:text-gray-300">
              <SelectValue placeholder="Premium Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Questions</SelectItem>
              <SelectItem value="free">Free Only</SelectItem>
              <SelectItem value="premium">Premium Only</SelectItem>
            </SelectContent>
          </Select>

          <TopicDropdown
            options={uniqueTopics}
            selectedOptions={selectedTopics}
            setSelectedOptions={setSelectedTopics}
          />
        </div>

        {/* Questions Table */}
        {filteredQuestions.length === 0 ? (
          <div className="p-4 text-center text-white dark:text-white">
            No questions found, try adjusting the filters.
          </div>
        ) : (
          <div className="rounded-md border bg-white dark:bg-black shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-4"></TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Topics</TableHead>
                  <TableHead className="text-right">Acceptance</TableHead>
                  <TableHead className="text-right">Frequency</TableHead>
                  <TableHead className="text-center">Premium</TableHead>
                  <TableHead className="text-left">Solution</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((question) => (
                  <TableRow key={`${question.ID}-${question.company}`}>
                    <TableCell className="w-4">
                      <Checkbox
                        checked={checkedItems[question.ID] || false}
                        onCheckedChange={(value: boolean) =>
                          handleCheckboxChange(question.ID, value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <a
                        href={`https://leetcode.com${question.URL}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-white dark:text-white dark:hover:text-blue-500"
                      >
                        {question.Title}
                      </a>
                    </TableCell>
                    <TableCell>
                      <div className="capitalize">{capitalizeWords(question.company)}</div>
                    </TableCell>
                    <TableCell>
                      <DifficultyBadge difficulty={question.Difficulty as "Easy" | "Medium" | "Hard"} />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {question.Topics.split(",").map((topic, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 rounded-full text-xs font-semibold bg-transparent text-yellow-800 dark:text-yellow-700"
                          >
                            {topic.trim()}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{question["Acceptance %"]}</TableCell>
                    <TableCell className="text-right">{question["Frequency %"]}</TableCell>
                    <TableCell className="text-center">
                      {question["Is Premium"] === "Y" ? (
                        <Check className="h-4 w-4 mx-auto text-green-600 dark:text-green-400" />
                      ) : (
                        <X className="h-4 w-4 mx-auto text-red-600 dark:text-red-600" />
                      )}
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      <VideoDialog id={question.ID} title={question.Title} />
                      <SolutionDialog questionId={question.ID} title={question.Title} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between py-4 px-2 bg-black dark:bg-black">
              <div className="flex items-center space-x-2">
                <p className="text-sm text-blue-600 dark:text-blue-300">Items per page</p>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={handleItemsPerPageChange}
                >
                  <SelectTrigger className="w-[70px] bg-gray-100 dark:bg-transparent text-white dark:text-white">
                    <SelectValue placeholder={itemsPerPage} />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 20, 50, 100].map((size) => (
                      <SelectItem key={size} value={size.toString()}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-600 dark:text-blue-300">Go to page</p>
                  <Input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={goToPage}
                    onChange={(e) => setGoToPage(e.target.value)}
                    onKeyDown={handleGoToPage}
                    className="w-[70px] bg-gray-100 dark:bg-transparent text-white dark:text-gray-300"
                    placeholder={currentPage.toString()}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                    className="text-white dark:text-blue-300"
                  >
                    <ChevronLeft className="h-8 w-6 mr-5" />
                    First
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="text-yellow-600 dark:text-gray-300"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <p className="text-sm text-blue-300 dark:text-blue-300">
                    Page {currentPage} of {totalPages}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="text-gray-600 dark:text-gray-300"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToLastPage}
                    disabled={currentPage === totalPages}
                    className="text-white dark:text-white"
                  >
                    Last
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
</div>

  );
};

export default LeetCodeDashboard;