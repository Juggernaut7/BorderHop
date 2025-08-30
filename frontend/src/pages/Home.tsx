import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import { 
  ArrowRight, 
  Zap, 
  Shield, 
  Globe, 
  TrendingUp, 
  Users, 
  CheckCircle,
  Circle,
  ArrowUpRight,
  Sparkles,
  Star,
  Rocket,
  Target,
  Award,
  DollarSign,
  Clock,
  Lock
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Logo from '../components/ui/Logo';
import heroAnimation from '../assets/hero.json';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const handleStartTransfer = () => {
    navigate('/transfer');
  };

  const handleViewDemo = () => {
    navigate('/dashboard');
  };

  const handleGetStarted = () => {
    navigate('/transfer');
  };

  const handleViewDocs = () => {
    navigate('/analytics');
  };

  const features = [
    {
      icon: <Circle className="w-8 h-8 text-primary-500" />,
      title: "Circle CCTP V2 Integration",
      description: "Real-time cross-chain USDC transfers using Circle's cutting-edge Cross-Chain Transfer Protocol V2",
      color: "from-primary-500 to-secondary-500",
      delay: 0.1
    },
    {
      icon: <Zap className="w-8 h-8 text-accent-500" />,
      title: "AI-Powered Routing",
      description: "Intelligent chain selection based on fees, yields, and user intent for optimal transfer paths",
      color: "from-accent-500 to-primary-500",
      delay: 0.2
    },
    {
      icon: <Shield className="w-8 h-8 text-secondary-500" />,
      title: "CCTP V2 Hooks",
      description: "Post-transfer automation with DeFi deposits, yield farming, and treasury management",
      color: "from-secondary-500 to-accent-500",
      delay: 0.3
    },
    {
      icon: <Globe className="w-8 h-8 text-primary-500" />,
      title: "Multichain Treasury",
      description: "Seamless USDC management across Ethereum, Base, Arbitrum, and more supported chains",
      color: "from-primary-500 to-accent-500",
      delay: 0.4
    }
  ];

  const stats = [
    { number: "85%", label: "Fee Savings vs Traditional", icon: <TrendingUp className="w-6 h-6 text-green-500" />, delay: 0.1 },
    { number: "<5min", label: "Transfer Time", icon: <Zap className="w-6 h-6 text-accent-500" />, delay: 0.2 },
    { number: "6+", label: "Supported Chains", icon: <Globe className="w-6 h-6 text-primary-500" />, delay: 0.3 },
    { number: "100%", label: "Circle Compliant", icon: <CheckCircle className="w-6 h-6 text-green-500" />, delay: 0.4 }
  ];

  const useCases = [
    {
      name: "Cross-Border Remittances",
      role: "International Money Transfers",
      content: "Send USDC instantly across borders with minimal fees and maximum security using Circle's CCTP V2 technology.",
      avatar: "🌍",
      delay: 0.1
    },
    {
      name: "DeFi Yield Optimization",
      role: "Automated Investment",
      content: "Automatically route USDC to the highest-yielding protocols across multiple chains after transfers.",
      avatar: "📈",
      delay: 0.2
    },
    {
      name: "Business Treasury Management",
      role: "Enterprise Solution",
      content: "Manage corporate USDC across multiple chains with intelligent rebalancing and yield optimization.",
      avatar: "🏢",
      delay: 0.3
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-background via-surface to-background overflow-hidden">
      {/* Hero Section with Lottie */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: theme === 'dark' 
              ? "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)"
              : "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)"
          }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        />
        
        {/* Floating Particles */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-left space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-200/20 dark:border-primary-700/30 rounded-full px-6 py-3 backdrop-blur-sm"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Star className="w-5 h-5 text-primary-500" />
                </motion.div>
                <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
                  Powered by Circle CCTP V2
                </span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-6xl md:text-7xl lg:text-8xl font-black leading-tight"
              >
                <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
                  BorderHop
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-xl md:text-2xl text-text-secondary leading-relaxed max-w-2xl"
              >
                The Future of Cross-Chain USDC Transfers
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-lg text-text-secondary/80 leading-relaxed max-w-xl"
              >
                Revolutionizing cross-border remittances with intelligent routing, DeFi automation, 
                and Circle's cutting-edge cross-chain technology. Send USDC anywhere, instantly.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.button
                  onClick={handleStartTransfer}
                  className="group relative overflow-hidden bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-primary-500/25 transition-all duration-300 px-8 py-4"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Transfer
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-secondary-500 to-accent-500"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
                
                <motion.button
                  onClick={handleViewDemo}
                  className="group px-8 py-4 bg-transparent border-2 border-primary-500/30 text-primary-600 dark:text-primary-400 font-bold text-lg rounded-2xl hover:border-primary-500 hover:bg-primary-500/10 transition-all duration-300 backdrop-blur-sm"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center gap-2">
                    <Rocket className="w-5 h-5" />
                    View Demo
                  </span>
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right Lottie Animation */}
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative w-full h-96 lg:h-[500px]">
                <Lottie
                  animationData={heroAnimation}
                  loop={true}
                  autoplay={true}
                  className="w-full h-full"
                />
                {/* Glow effect behind Lottie */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-full blur-3xl"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-primary-500 rounded-full flex justify-center"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1 h-3 bg-primary-500 rounded-full mt-2"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-accent-500/10 to-primary-500/10 border border-accent-200/20 dark:border-accent-700/30 rounded-full px-6 py-3 mb-8"
            >
              <Target className="w-5 h-5 text-accent-500" />
              <span className="text-sm font-semibold text-accent-700 dark:text-accent-300">
                Built with Circle's Best
              </span>
            </motion.div>
            
            <h2 className="text-5xl md:text-6xl font-black mb-8">
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Revolutionary
              </span>{' '}
              <span className="bg-gradient-to-r from-accent-600 to-primary-600 bg-clip-text text-transparent">
                Features
              </span>
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              Leveraging Circle's CCTP V2, hooks, and APIs to create a truly innovative 
              multichain USDC payment system for the future of finance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: feature.delay }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative"
              >
                <div className="relative p-8 bg-gradient-to-br from-surface to-surface/50 border border-border/50 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 backdrop-blur-sm overflow-hidden">
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  {/* Icon container */}
                  <motion.div
                    className="relative mb-6 p-4 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 5 }}
                  >
                    {feature.icon}
                  </motion.div>
                  
                  <h3 className="text-xl font-bold text-text mb-4 group-hover:text-primary-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  
                  <motion.div
                    className="flex items-center text-primary-600 font-semibold group-hover:text-primary-700 transition-colors duration-300"
                    whileHover={{ x: 5 }}
                  >
                    Learn more
                    <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-r from-primary-500/5 to-secondary-500/5 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-accent-500/10 border border-green-200/20 dark:border-green-700/30 rounded-full px-6 py-3 mb-8"
            >
              <Award className="w-5 h-5 text-green-500" />
              <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                Industry Leading
              </span>
            </motion.div>
            
            <h2 className="text-5xl md:text-6xl font-black mb-8">
              <span className="bg-gradient-to-r from-green-600 to-accent-600 bg-clip-text text-transparent">
                Impressive
              </span>{' '}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Numbers
              </span>
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              BorderHop delivers real value with measurable improvements in cost, speed, and efficiency 
              for cross-chain USDC transfers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: stat.delay }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="group relative"
              >
                <div className="relative p-8 bg-gradient-to-br from-surface to-surface/50 border border-border/50 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 backdrop-blur-sm text-center overflow-hidden">
                  {/* Background glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <motion.div
                    className="flex justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 5 }}
                  >
                    {stat.icon}
                  </motion.div>
                  
                  <motion.div
                    className="text-4xl font-black text-primary-600 mb-3 group-hover:text-primary-700 transition-colors duration-300"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: stat.delay + 0.2, type: "spring" }}
                  >
                    {stat.number}
                  </motion.div>
                  
                  <div className="text-text font-semibold mb-2">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-8">
              Real-World <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Use Cases</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              BorderHop solves real problems for real users across different industries and use cases.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: useCase.delay }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative"
              >
                <div className="relative p-8 bg-gradient-to-br from-surface to-surface/50 border border-border/50 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 backdrop-blur-sm text-center overflow-hidden">
                  {/* Background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <motion.div
                    className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 5 }}
                  >
                    {useCase.avatar}
                  </motion.div>
                  
                  <p className="text-text-secondary mb-8 leading-relaxed text-lg">
                    "{useCase.content}"
                  </p>
                  
                  <div>
                    <div className="font-bold text-text text-xl mb-2">{useCase.name}</div>
                    <div className="text-primary-600 dark:text-primary-400 font-medium">{useCase.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary-600 to-secondary-600 relative overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-black text-white mb-8"
          >
            Ready to <span className="text-accent-300">Hop Borders</span>?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-xl text-primary-100 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Experience the future of cross-chain remittances with BorderHop. 
            Start sending USDC across chains today.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              onClick={handleGetStarted}
              className="bg-white text-primary-600 hover:bg-primary-50 font-bold py-5 px-10 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Now
            </motion.button>
            
            <motion.button
              onClick={handleViewDocs}
              className="border-2 border-white/30 text-white hover:bg-white/10 font-bold py-5 px-10 rounded-2xl transition-all duration-300 backdrop-blur-sm"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              View Documentation
            </motion.button>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home; 