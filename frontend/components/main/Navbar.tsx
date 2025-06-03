"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

// For Instagram - In a real app, this would come from "@/constants"
const socials = [
  {
    name: "Instagram",
    src: "/instagram.svg", // Make sure you have instagram.svg in your /public folder
    link: "https://www.instagram.com/yourprofile", // Replace with your actual Instagram link
  },
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

  const gradientHoverClasses = "hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-500 hover:to-cyan-500";
  const adminButtonBaseClasses = "bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-medium transition-all duration-300";
  const adminButtonHoverClasses = "hover:from-purple-600 hover:to-cyan-600 hover:shadow-lg";


  return (
    <>
      {/* Main Navbar */}
      <div className="w-full h-[65px] fixed top-0 shadow-lg shadow-[#2A0E61]/50 bg-[#03001417] backdrop-blur-md z-50 px-4 sm:px-10">
        <div className="w-full h-full max-w-screen-xl mx-auto flex flex-row items-center justify-between">
          {/* Logo and Brand Name */}
          <a
            href="#about-me"
            className="h-auto w-auto flex flex-row items-center"
            onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}
          >
            <Image
              src="/NavLogo.png"
              alt="logo"
              width={50}
              height={50}
              className="cursor-pointer hover:animate-slowspin"
            />
            <span className="font-bold ml-[10px] hidden md:block text-gray-300 text-xl">
              STAC
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex h-full flex-row items-center pl-[80px]">

            <div className="flex items-center justify-between w-full h-auto border border-[#7042f861] bg-[#0300145e] px-[20px] py-[10px] rounded-full text-gray-200 space-x-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`cursor-pointer transition-colors ${gradientHoverClasses}`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Desktop: Admin Login, About & Instagram */}
          <div className="hidden md:flex flex-row gap-5 items-center text-gray-200">
            <a
              href="/about-us"
              className={`cursor-pointer transition-colors ${gradientHoverClasses}`}
            >
              About
            </a>
            {socials.map((social) => (
              <a
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                key={social.name}
                title={social.name}
                className="hover:opacity-75 transition-opacity"
              >
                <Image
                  src={social.src}
                  alt={social.name}
                  width={24}
                  height={24}
                />
              </a>
            ))}
            <a
              href="/admin-login"
              className={`cursor-pointer px-4 py-2 rounded-full text-sm ${adminButtonBaseClasses} ${adminButtonHoverClasses}`}
            >
              Admin Login
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            {/* If only instagram, place it here before hamburger for mobile view */}
            {socials.map((social) => (
              <a
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                key={social.name + "-mobile-header"} // Unique key
                title={social.name}
                className="text-gray-300 hover:opacity-75 transition-opacity mr-4" // Added margin
              >
                <Image
                  src={social.src}
                  alt={social.name}
                  width={26} // Slightly larger for mobile
                  height={26}
                />
              </a>
            ))}
            <button
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
              className="text-gray-300 hover:text-white focus:outline-none"
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
          md:hidden fixed inset-0 top-[65px] z-40 bg-[#030014f0] backdrop-blur-lg 
          flex flex-col items-center justify-center space-y-6 p-5
          transform transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}
        `}
      >
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={`cursor-pointer text-gray-200 text-2xl transition-colors ${gradientHoverClasses}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {link.label}
          </a>
        ))}
        <div className="pt-6 flex flex-col items-center space-y-6">
          <a
            href="/about-us"
            className={`cursor-pointer text-gray-200 text-2xl transition-colors ${gradientHoverClasses}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </a>
          {/* Removed Instagram from here as it's in the header now, but you can add it back if preferred */}
          {/* {socials.map((social) => (
            <a
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              key={social.name + "-mobile-menu"}
              className="hover:opacity-75 transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Image
                src={social.src}
                alt={social.name}
                width={30}
                height={30}
              />
            </a>
          ))} */}
          <a
            href="/admin-login"
            className={`cursor-pointer px-6 py-3 rounded-full text-lg ${adminButtonBaseClasses} ${adminButtonHoverClasses}`}
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