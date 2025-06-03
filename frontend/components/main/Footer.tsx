// src/components/Footer.tsx
import React from "react";
import Image from 'next/image';
import {
  RxGithubLogo,
  RxInstagramLogo,
  RxTwitterLogo,
} from "react-icons/rx";
import { FaYoutube, FaFacebookF, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: "Facebook", icon: <FaFacebookF size={20} />, href: "https://www.facebook.com/stacIITMandi/" },
    { name: "GitHub", icon: <RxGithubLogo size={20} />, href: "https://github.com/STAC-IITMandi" },
    { name: "Instagram", icon: <RxInstagramLogo size={20} />, href: "https://instagram.com/stac_iitmandi" },
    { name: "YouTube", icon: <FaYoutube size={20} />, href: "https://www.youtube.com/channel/STACIITMandi" },
    { name: "Twitter", icon: <RxTwitterLogo size={20} />, href: "https://twitter.com/stac_iitmandi" },
  ];

  return (
      <div className="relative top-20 flex flex-col h-full w-full overflow-visible" id="about-me">
      <video
        autoPlay
        muted
        loop
        // KEY CHANGE:
        // - Changed h-full w-full to h-screen w-screen to make the video element viewport-sized.
        // - Ensured object-cover so the video content fills these dimensions.
        className="absolute top-[-400px] h-screen w-screen left-0 z-[-1] object-cover"
      >
        <source src="/blackhole.webm" type="video/webm" />
      </video>

    <div className="relative w-full bg-slate-900/70 backdrop-blur-md text-gray-300 shadow-2xl print:hidden">
      {/* 
        The padding comments here are related to the content layout over the video.
        With the video now potentially much larger (h-screen), its interaction with
        this padding might differ, but the padding itself is on the content overlay.
      */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 md:pt-32 pb-8 md:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start">
          
          {/* Column 1: Logo and STAC Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <a href="https://iitmandi.ac.in/" target="_blank" rel="noopener noreferrer" className="mb-4 inline-block">
              <Image
                src="/images/STAClogo.png"
                alt="STAC IIT Mandi"
                width={120}
                height={120}
                className="h-auto"
              />
            </a>
            <h3 className="font-bold text-xl text-white mb-2">STAC IIT Mandi</h3>
            <p className="text-sm">Space Technology and Astronomy Cell</p>
          </div>

          {/* Column 2: Follow Us */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="font-bold text-lg text-white mb-4">Follow Us</h3>
            <div className="flex flex-wrap justify-center md:justify-start gap-x-5 gap-y-3">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name}
                  className="text-gray-300 hover:text-cyan-400 transition-colors duration-200"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 3: Contact Information */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="font-bold text-lg text-white mb-4">Contact Us</h3>
            <div className="text-sm space-y-3">
              <p className="flex items-center justify-center md:justify-start">
                <FaMapMarkerAlt className="mr-3 flex-shrink-0" size={18} />
                <span>Gravity, SAC-001, North Campus, IIT Mandi, Kamand (H.P.) - 175005</span>
              </p>
              <a
                href="mailto:stac@students.iitmandi.ac.in"
                className="flex items-center justify-center md:justify-start text-gray-300 hover:text-cyan-400 transition-colors duration-200 group"
              >
                <FaEnvelope className="mr-3 flex-shrink-0 group-hover:text-cyan-400" size={16} />
                <span>stac@students.iitmandi.ac.in</span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 md:mt-12 pt-8 border-t border-gray-700 text-sm text-center text-gray-400">
          © {currentYear}.{" "}
          <a
            href="https://github.com/STAC-IITMandi"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:text-cyan-400 transition-colors duration-200"
          >
            STAC
          </a>{" "}
          Web-Development Team. All Rights Reserved.
        </div>
      </div>
      </div>
    </div>
  );
};

export default Footer;