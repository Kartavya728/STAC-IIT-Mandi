"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FiChevronDown } from "react-icons/fi"; // For dropdown indicators
import ThemeToggle from "../sub/Toggle";

interface NavLinkItem {
  href?: string;
  label: string;
  subLinks?: NavLinkItem[];
  target?: string;
}

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileSubmenusOpen, setMobileSubmenusOpen] = useState<Record<string, boolean>>({});
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const navLinks: NavLinkItem[] = [
    { href: "/", label: "Home" },
    {
      label: "Events",
      href: "#events",
      subLinks: [
        { href: "\astrax", label: "ASTRAX" },
        { href: "#zenith", label: "ZENITH" },
        { href: "#utkarsh", label: "UTKARSH" },
        { href: "#pleiades", label: "PLEIADES" },
      ],
    },
    { href: "#notifications", label: "Notifications" },
    { href: "http://stac.iitmandi.co.in/blog/", label: "Blogs", target: "_blank" },
    {
      label: "Gallery",
      href: "#gallery",
      subLinks: [
        { href: "#photos", label: "Photos" },
        { href: "#videos", label: "Videos" },
      ],
    },
    { href: "#team", label: "Team" },
    { href: "#alumni", label: "Alumni" },
    { href: "#iau", label: "IAU" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      setMobileSubmenusOpen({});
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 100);
  };
  
  const handleDropdownMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
  };

  const toggleMobileSubmenu = (label: string) => {
    setMobileSubmenusOpen(prev => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  // Link classes for main nav items inside the pill (no specific py, pill handles it)
  const themedLinkInPillClasses = "text-foreground hover:text-orange-500 dark:hover:text-yellow-400 transition-colors duration-200";
  // Link classes for dropdown items and other standalone links (like "About")
  const themedDropdownLinkClasses = `block px-4 py-2 text-sm text-foreground hover:text-orange-500 dark:hover:text-yellow-400 hover:bg-muted/50 w-full text-left transition-colors duration-200`;
  const themedStandaloneLinkClasses = "text-foreground hover:text-orange-500 dark:hover:text-yellow-400 transition-colors duration-200 py-2";


  const themedAdminButtonBaseClasses = "bg-theme-gradient text-primary-foreground font-medium transition-all duration-300";
  const themedAdminButtonHoverClasses = "hover:opacity-90 hover:shadow-lg";

  return (
    <>
      {/* Main Navbar */}
      <div className="w-full h-[65px] fixed top-0
                      shadow-md dark:shadow-primary/20
                      bg-background/80 dark:bg-background/85
                      backdrop-blur-md z-50 px-4 sm:px-10 border-b border-border/30 dark:border-border/50">
        <div className="w-full h-full max-w-screen-xl mx-auto flex flex-row items-center justify-between">
          {/* Logo and Brand Name */}
          <a
            href="/"
            className="h-auto w-auto flex flex-row items-center"
            onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}
          >
            <Image
              src="/STAClogo.png"
              alt="logo"
              width={45}
              height={45}
              className="cursor-pointer hover:animate-slowspin"
            />
            <span className="font-bold ml-[10px] hidden md:block text-foreground text-xl">
              STAC
            </span>
          </a>

          {/* Desktop Navigation Links - WITH PILL BACKGROUND */}
          <nav className="hidden md:flex h-full flex-row items-center pl-[60px] lg:pl-[80px]"> {/* Adjusted padding slightly */}
            <div className="flex items-center h-auto 
                            border border-border bg-card/70 dark:bg-card/80
                            px-[20px] py-[10px] rounded-full text-foreground
                            space-x-4 lg:space-x-5"> {/* Adjusted space between items */}
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative flex items-center" // Wrapper for each link + its dropdown
                  onMouseEnter={() => link.subLinks && handleMouseEnter(link.label)}
                  onMouseLeave={() => link.subLinks && handleMouseLeave()}
                >
                  <a
                    href={link.href || "#"}
                    target={link.target}
                    rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
                    className={`cursor-pointer flex items-center ${themedLinkInPillClasses}`}
                    onClick={(e) => {
                      if (link.subLinks && !link.href) e.preventDefault();
                      if (isMobileMenuOpen) setIsMobileMenuOpen(false);
                    }}
                  >
                    {link.label}
                    {link.subLinks && (
                      <FiChevronDown
                        className={`ml-1 transition-transform duration-200 ${
                          activeDropdown === link.label ? "rotate-180" : ""
                        }`}
                        size={16}
                      />
                    )}
                  </a>
                  {link.subLinks && activeDropdown === link.label && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-card shadow-xl rounded-md py-1 z-50 border border-border/50" // mt-2 to clear pill, py-1 for dropdown items
                      onMouseEnter={handleDropdownMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      {link.subLinks.map((subLink) => (
                        <a
                          key={subLink.label}
                          href={subLink.href}
                          target={subLink.target}
                          rel={subLink.target === "_blank" ? "noopener noreferrer" : undefined}
                          className={themedDropdownLinkClasses} // Use specific class for dropdown items
                          onClick={() => {
                            setActiveDropdown(null);
                            if (isMobileMenuOpen) setIsMobileMenuOpen(false);
                          }}
                        >
                          {subLink.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* Desktop: About, Notifications, ThemeToggle, Admin Login */}
          <div className="hidden md:flex flex-row gap-2 sm:gap-3 items-center text-foreground">
            <a
              href="/about-us"
              className={`cursor-pointer ${themedStandaloneLinkClasses}`} // Uses standalone link class with py-2
            >
              About
            </a>
            <button
              aria-label="View notifications"
              className="p-1.5 text-foreground/80 hover:text-primary focus:outline-none rounded-full hover:bg-muted/50"
            >
              <IoMdNotificationsOutline size={22} />
            </button>
            <ThemeToggle/>
            <a
              href="http://127.0.0.1:8000/admin"
              className={`cursor-pointer px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm ${themedAdminButtonBaseClasses} ${themedAdminButtonHoverClasses}`}
            >
              Admin Login
            </a>
          </div>

          {/* Mobile Menu Button and other icons */}
          <div className="md:hidden flex items-center gap-2 sm:gap-3">
            <button
              aria-label="View notifications"
              className="p-1.5 text-foreground/80 hover:text-primary focus:outline-none rounded-full hover:bg-muted/50"
            >
              <IoMdNotificationsOutline size={24} />
            </button>
            <ThemeToggle/>
            <button
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
              className="p-1.5 text-foreground/80 hover:text-primary focus:outline-none rounded-full hover:bg-muted/50"
            >
              {isMobileMenuOpen ? (
                <AiOutlineClose size={24} />
              ) : (
                <AiOutlineMenu size={24} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay with Animation and Dropdowns */}
      <div
        className={`
          md:hidden fixed inset-0 top-[65px] z-40
          bg-background/95 backdrop-blur-lg
          overflow-y-auto 
          flex flex-col items-center pt-8 pb-16 px-5 space-y-3
          transform transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}
        `}
      >
        {navLinks.map((link) => (
          <div key={link.label} className="w-full text-center">
            <a
              href={link.subLinks ? "#" : link.href}
              target={link.target}
              rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
              className={`w-full inline-flex items-center justify-center py-3 text-2xl ${themedLinkInPillClasses}`} // Reuse for mobile main links
              onClick={(e) => {
                if (link.subLinks) {
                  e.preventDefault();
                  toggleMobileSubmenu(link.label);
                } else {
                  setIsMobileMenuOpen(false);
                }
              }}
            >
              {link.label}
              {link.subLinks && (
                <FiChevronDown
                  className={`ml-2 transition-transform duration-200 ${
                    mobileSubmenusOpen[link.label] ? "rotate-180" : ""
                  }`}
                  size={20}
                />
              )}
            </a>
            {link.subLinks && mobileSubmenusOpen[link.label] && (
              <div className="mt-2 space-y-2 pl-4">
                {link.subLinks.map((subLink) => (
                  <a
                    key={subLink.label}
                    href={subLink.href}
                    target={subLink.target}
                    rel={subLink.target === "_blank" ? "noopener noreferrer" : undefined}
                    // Mobile sublinks, can use a slightly different styling or reuse themedDropdownLinkClasses if adapted
                    className={`block py-2 text-xl ${themedLinkInPillClasses} hover:bg-muted/20 rounded`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {subLink.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
        <div className="pt-8 flex flex-col items-center space-y-6 w-full">
          <a
            href="/about-us"
            className={`py-3 text-2xl ${themedLinkInPillClasses}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </a>
          <a
            href="http://127.0.0.1:8000/admin"
            className={`cursor-pointer px-6 py-3 rounded-full text-lg ${themedAdminButtonBaseClasses} ${themedAdminButtonHoverClasses}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Admin Login
          </a>
        </div>
      </div>
    </>
  );
};

export default Navbar;