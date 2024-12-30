"use client";

import { Button } from "@/components/ui/button";
import { Menu, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const [geminiKey, setGeminiKey] = useState("");
  const [geminiVersion, setGeminiVersion] = useState("gemini 1.5 flash");
  const [preferredLanguage, setPreferredLanguage] = useState("javascript");
  const { setTheme } = useTheme();
  const { toast } = useToast();

  useEffect(() => {
    const savedKey = localStorage.getItem("gemini-key") || "";
    const savedVersion =
      localStorage.getItem("gemini-version") || "gemini 1.5 flash";
    const savedLanguage = localStorage.getItem("preferred-language") || "javascript";

    setGeminiKey(savedKey);
    setGeminiVersion(savedVersion);
    setPreferredLanguage(savedLanguage);
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem("gemini-key", geminiKey);
    localStorage.setItem("gemini-version", geminiVersion);
    localStorage.setItem("preferred-language", preferredLanguage);

    toast({
      title: "Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="border-b bg-black shadow-sm">
      <div className="flex items-center justify-between h-16 px-6 container mx-auto">
        {/* Logo with Text */}
        <div className="flex items-center space-x-0.5">
          <img
            src="/logo.png.png" // Updated to remove /public prefix as Next.js serves public folder files directly
            alt="Codemeter Logo"
            className="h-20 w-20"
          />
          <div className="font-bold text-2xl text-white-800">
            <Link href="/" className="hover:text-yellow-600">
              Codemeter
            </Link>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          {/* Settings Icon */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings className="h-6 w-6 hover:text-blue-500" /> {/* Replaced Select with an icon */}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mt-2 border dark:border-black">
              {/* Preferred Language */}
              <div className="space-y-2 px-4 py-2">
                <label className="text-sm font-medium">Preferred Language</label>
                <Select
                  value={preferredLanguage}
                  onValueChange={setPreferredLanguage}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="c">C</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Gemini Key */}
              <DropdownMenuSeparator />
              <div className="space-y-2 px-4 py-2">
                <label className="text-sm font-medium">Gemini API Key</label>
                <Input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="Enter Gemini API Key"
                />
              </div>

              {/* Gemini Version */}
              <div className="space-y-2 px-4 py-2">
                <label className="text-sm font-medium">Gemini Version</label>
                <Select
                  value={geminiVersion}
                  onValueChange={setGeminiVersion}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gemini Version" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini 1.5 flash">Gemini 1.5 Flash</SelectItem>
                    <SelectItem value="gemini 1.5 pro">Gemini 1.5 Pro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Theme Toggle */}
              <DropdownMenuSeparator />
              <div className="space-y-2 px-4 py-2">
                <label className="text-sm font-medium">Theme</label>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTheme("light")}
                  >
                    Light
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTheme("dark")}
                  >
                    Dark
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTheme("system")}
                  >
                    System
                  </Button>
                </div>
              </div>

              {/* Save Button */}
              <Button className="w-full mt-4" onClick={handleSaveSettings}>
                Save
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
