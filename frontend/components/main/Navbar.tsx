"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import ThemeToggle from "../sub/Toggle"; // Assuming this path is correct

// For Instagram - In a real app, this would come from "@/constants"
const socials = [ // You had this defined, but it wasn't used in the provided Navbar snippet. I'll add it back where it might logically go.
{}
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "#", label: "Home" },
    { href: "#events", label: "Events" },
    { href: "#blogs", label: "Blogs" },
    { href: "#gallery", label: "Gallery" },
    { href: "#team", label: "Team" },
    { href: "#alumni", label: "Alumni" },
    { href: "#iau", label: "IAU" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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

  // Updated to use theme gradient and text color
  const themedGradientHoverClasses = "text-foreground hover:text-transparent hover:bg-clip-text hover:bg-theme-gradient";
  // Updated to use theme gradient for background and appropriate text color
  const themedAdminButtonBaseClasses = "bg-theme-gradient text-primary-foreground font-medium transition-all duration-300";
  // Hover for gradient buttons can be a subtle opacity change or slight shadow enhancement
  const themedAdminButtonHoverClasses = "hover:opacity-90 hover:shadow-lg";


  return (
    <>
      {/* Main Navbar */}
      {/* Using themed background, shadow, and border */}
      <div className="w-full h-[65px] fixed top-0 
                      shadow-md dark:shadow-primary/20 {/* Themed shadow */}
                      bg-background/80 dark:bg-background/85 {/* Themed background with transparency */}
                      backdrop-blur-md z-50 px-4 sm:px-10 border-b border-border/30 dark:border-border/50"> {/* Themed border */}
        <div className="w-full h-full max-w-screen-xl mx-auto flex flex-row items-center justify-between">
          {/* Logo and Brand Name */}
          <a
            href="/" // Changed from #about-me
            className="h-auto w-auto flex flex-row items-center"
            onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}
          >
            <Image
              src="/STAClogo.png"
              alt="logo"
              width={50}
              height={50}
              className="cursor-pointer hover:animate-slowspin"
            />
            {/* Using themed text color */}
            <span className="font-bold ml-[10px] hidden md:block text-foreground text-xl">
              STAC
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex h-full flex-row items-center pl-[80px]"> {/* This pl-[80px] might need adjustment for centering */}
            {/* Using themed border, background, and text color */}
            <div className="flex items-center justify-between w-full h-auto 
                            border border-border bg-card/70 dark:bg-card/80 {/* Themed border and card background */}
                            px-[20px] py-[10px] rounded-full text-foreground {/* Themed text */}
                            space-x-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`cursor-pointer transition-colors ${themedGradientHoverClasses}`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Desktop: Admin Login, About & Instagram */}
          {/* Using themed text color */}
          <div className="hidden md:flex flex-row gap-4 items-center text-foreground"> {/* Reduced gap, added Instagram */}
            <a
              href="/about-us"
              className={`cursor-pointer transition-colors ${themedGradientHoverClasses}`}
            >
              About
            </a>
           
            <ThemeToggle/>
            <a
              href="http://127.0.0.1:8000/admin"
              className={`cursor-pointer px-4 py-2 rounded-full text-sm ${themedAdminButtonBaseClasses} ${themedAdminButtonHoverClasses}`}
            >
              Admin Login
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2"> {/* Added gap for spacing */}
            
           <ThemeToggle/>
            <button
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
              // Using themed text color and hover
              className="text-foreground/80 hover:text-primary focus:outline-none ml-2" // Added margin for spacing from toggle
            >
              {isMobileMenuOpen ? (
                <AiOutlineClose size={28} />
              ) : (
                <AiOutlineMenu size={28} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay with Animation */}
      <div
        className={`
          md:hidden fixed inset-0 top-[65px] z-40 
          bg-background/95 backdrop-blur-lg {/* Themed background */}
          flex flex-col items-center justify-center space-y-6 p-5
          transform transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}
        `}
      >
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            // Using themed text color and hover
            className={`cursor-pointer text-foreground text-2xl transition-colors ${themedGradientHoverClasses}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {link.label}
          </a>
        ))}
        <div className="pt-6 flex flex-col items-center space-y-6">
          <a
            href="/about-us"
            // Using themed text color and hover
            className={`cursor-pointer text-foreground text-2xl transition-colors ${themedGradientHoverClasses}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </a>
          <a
            href="http://127.0.0.1:8000/admin" // Changed from /admin-login to be consistent with desktop
            className={`cursor-pointer px-6 py-3 rounded-full text-lg ${themedAdminButtonBaseClasses} ${themedAdminButtonHoverClasses}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Admin Login
          </a>
        </div>
        {/* ThemeToggle was here, but it's usually better in the main header or consistently placed */}
        {/* If you want it at the bottom of the mobile menu, ensure its styling matches the context. */}
        {/* <ThemeToggle/> */}
      </div>
    </>
  );
};

export default Navbar;