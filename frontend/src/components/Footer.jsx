import { Link } from "react-router-dom";
import { 
  JhuniIcon, 
  TwitterIcon, 
  GithubIcon, 
  InstagramIcon 
} from "../components/icons";
import { useTheme } from '../providers/ThemeProvider';
import { siteConfig } from "../config/site";

const Footer = () => {
  const { theme } = useTheme();
  
  return (
    <footer className="max-w-full bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-emerald-800 py-6">
      <div className="container mx-auto px-4">
        {/* Footer Grid Layout - Modified for better mobile responsiveness */}
        <div className="flex flex-col sm:flex-row flex-wrap">
          
          {/* Column 1: Brand and About - Takes full width on mobile */}
          <div className="w-full mb-6 sm:mb-0 sm:w-full md:w-1/2 lg:w-1/4 pr-4">
            <Link to="/" className="flex items-center gap-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">
              <JhuniIcon />
              <span>Jhuni</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
              Bringing creative ideas to life through modern web development and design.
            </p>
          </div>
          
          {/* Right side columns for mobile that stack horizontally */}
          <div className="flex flex-row flex-wrap w-full sm:w-full md:w-1/2 lg:w-3/4">
            {/* Column 2: Navigation Links */}
            <div className="w-1/2 pr-2 sm:w-1/2 md:w-1/3 lg:w-1/3 mb-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Main</h3>
              <div className="flex flex-col space-y-1">
                {siteConfig.footItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition duration-300 text-sm"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Column 3: Resources */}
            <div className="w-1/2 pl-2 sm:w-1/2 md:w-1/3 lg:w-1/3 mb-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Resources</h3>
              <div className="flex flex-col space-y-1">
                {/* <Link to="/notes" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition duration-300 text-sm">
                  Learn with Notes
                </Link>
                <Link to="/tutorials" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition duration-300 text-sm">
                  Tutorials
                </Link>
                <Link to="/cheatsheets" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition duration-300 text-sm">
                  Cheatsheets
                </Link>
                <Link to="/challenges" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition duration-300 text-sm">
                  Challenges
                </Link> */}
                <Link to="/blog" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition duration-300 text-sm">
                  Blog
                </Link>
                <Link to="/projects" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition duration-300 text-sm">
                  Projects
                </Link>
              </div>
            </div>
            
            {/* Column 4: Connect */}
            <div className="w-full sm:w-full md:w-1/3 lg:w-1/3 mb-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Connect</h3>
              
              {/* Social Links */}
              <div className="flex space-x-4 mb-3">
                <Link
                  to={siteConfig.links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition duration-300"
                >
                  <TwitterIcon className="text-default-500" />
                </Link>
                <Link
                  to={siteConfig.links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition duration-300"
                >
                  <InstagramIcon className="text-default-500" />
                </Link>
                <Link
                  to={siteConfig.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Github"
                  className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition duration-300"
                >
                  <GithubIcon className="text-default-500" />
                </Link>
              </div>
              
              <div className="text-sm">
                <p className="text-gray-600 dark:text-gray-300">
                  Contact me at: <br />
                  <a href="mailto:piyushbhul3024@gmail.com" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                  piyushbhul3024@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Copyright and Policy Links */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-4 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            &copy; {new Date().getFullYear()} Piyush Bhul. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-3 sm:mt-0">
            <Link
              to="/privacy-policy"
              className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm transition duration-300"
            >
              Privacy Policy
            </Link>
            {/* <Link
              to="/terms"
              className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm transition duration-300"
            >
              Terms of Service
            </Link> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;