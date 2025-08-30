import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, Globe } from 'lucide-react';
import Logo from '../ui/Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Transfer', href: '/transfer' },
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'Analytics', href: '/analytics' },
      { name: 'History', href: '/history' },
    ],
    support: [
      { name: 'Documentation', href: 'https://docs.borderhop.xyz' },
      { name: 'Help Center', href: '/help' },
      { name: 'Contact', href: 'mailto:support@borderhop.xyz' },
      { name: 'Status', href: '/status' },
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'GDPR', href: '/gdpr' },
    ],
  };

  const socialLinks = [
    { name: 'GitHub', href: 'https://github.com/borderhop', icon: Github },
    { name: 'Twitter', href: 'https://twitter.com/borderhop', icon: Twitter },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/borderhop', icon: Linkedin },
    { name: 'Email', href: 'mailto:hello@borderhop.xyz', icon: Mail },
  ];

  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <Logo size="xs" />
            </Link>
            <p className="text-text-secondary mb-6 max-w-md">
              AI-Powered Multichain USDC Remittance Gateway. Where borders disappear and money works smarter.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-tertiary hover:text-primary-600 transition-colors duration-200 p-2 rounded-lg hover:bg-surface/50"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="sr-only">{social.name}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-text tracking-wider uppercase mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-text-secondary hover:text-primary-600 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-text tracking-wider uppercase mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : '_self'}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : ''}
                    className="text-text-secondary hover:text-primary-600 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-text tracking-wider uppercase mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-text-secondary hover:text-primary-600 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-text tracking-wider uppercase mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-text-secondary hover:text-primary-600 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-text-tertiary">
              <Globe className="w-4 h-4" />
              <span className="text-sm">
                Built with ❤️ for the Circle Developer Bounties Hackathon
              </span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-text-tertiary">
              <span>© {currentYear} BorderHop. All rights reserved.</span>
              <span>•</span>
              <span>Version 1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 