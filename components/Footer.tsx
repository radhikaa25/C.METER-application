import { BsTwitterX, BsSuitHeartFill } from "react-icons/bs";
import { AiFillLinkedin } from "react-icons/ai";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black  text-white">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6">
        {/* Left Side */}
        <p className="text-sm">
          © {new Date().getFullYear()} Code-Master. All rights reserved.
        </p>

        {/* Right Side */}
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <p className="text-sm flex items-center">
            Made with <BsSuitHeartFill className="mx-1 text-white" size={16} /> by Radhika
          </p>
          <a
            href="https://twitter.com/radhikaas25"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400"
          >
            <BsTwitterX size={20} />
          </a>
          <a
            href="http://www.linkedin.com/in/radhika-sharma-30403623b"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500"
          >
            <AiFillLinkedin size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
