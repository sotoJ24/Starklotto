import React from 'react';

const socialLinks = [
  {
    name: 'Telegram',
    icon: '/telegramIcon.svg',
    url: 'https://t.me/+-Xnyt6x4Eys2YWQx',
  },
  {
    name: 'GitHub',
    icon: '/githubIcon.svg',
    url: 'https://github.com/future-minds7',
  },
  {
    name: 'X',
    icon: '/xIcon.svg',
    url: 'https://x.com/futureminds_7',
  },
];

const SocialLinks = () => {
  return (
    <div className="flex space-x-4">
      {socialLinks.map((link) => (
        <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer">
          <img src={link.icon} alt={link.name} className="w-6 h-6" />
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;