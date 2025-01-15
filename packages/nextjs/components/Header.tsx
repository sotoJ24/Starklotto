"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { WalletIcon, UserIcon } from "@heroicons/react/24/outline";

const menuLinks = [
  { label: "Home", href: "/" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Play", href: "/play" },
  { label: "Prizes", href: "/prizes" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "About Us", href: "/about-us" },
];

export const Header = () => {
  return (
    <header className="w-full bg-transparent fixed top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between py-4 px-8">
        {/* Logo */}
        <Link href="/" passHref>
          <div className="flex items-center gap-2 cursor-pointer">
            <Image
              src="/Starklotto.png" // Asegúrate de tener tu logo en la carpeta /public
              alt="StarkLotto Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-white text-lg font-bold">STARKLOTTO</span>
          </div>
        </Link>

        {/* Menú de Navegación */}
        <ul className="hidden md:flex space-x-8">
          {menuLinks.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                passHref
                className="text-white hover:text-yellow-400 transition duration-300"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Iconos */}
        <div className="flex items-center space-x-4">
          <button className="p-2 bg-transparent hover:bg-gray-700 rounded-full transition">
            <WalletIcon className="h-6 w-6 text-white" />
          </button>
          <button className="p-2 bg-transparent hover:bg-gray-700 rounded-full transition">
            <UserIcon className="h-6 w-6 text-white" />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
