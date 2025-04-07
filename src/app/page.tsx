import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { Brain, Code, Image, MessageSquare } from 'lucide-react';

const features = [
  {
    title: 'AI Chat Assistant',
    description: 'Engage in natural conversations with our advanced AI chatbot',
    icon: MessageSquare,
    color: 'text-blue-500',
  },
  {
    title: 'Text to Image',
    description: 'Transform your ideas into stunning visual artwork',
    icon: Image,
    color: 'text-purple-500',
  },
  {
    title: 'Image to Image',
    description: 'Modify and enhance images with AI-powered editing',
    icon: Image,
    color: 'text-pink-500',
  },
  {
    title: 'Text to Code',
    description: 'Convert natural language into production-ready code',
    icon: Code,
    color: 'text-green-500',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
        
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center mb-6">
              <Brain className="w-12 h-12 text-primary animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 mb-6">
              Next-Generation AI Platform
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Harness the power of artificial intelligence to transform your ideas into reality.
              Experience the future of creation, today.
            </p>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Get Started Free
            </Button>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="group relative bg-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-border"
              >
                <div className={`${feature.color} mb-4`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </main>
  );
}