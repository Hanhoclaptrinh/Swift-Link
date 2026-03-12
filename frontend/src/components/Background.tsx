import { motion } from 'framer-motion';

export const Background = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-agent-900">
      {/* Dynamic ambient gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-glow-cyan blur-[120px] opacity-70 animate-pulse-slow"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-glow-purple blur-[150px] opacity-60 animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>

      {/* Futuristic floating orbs */}
      <motion.div 
        className="absolute top-[20%] right-[20%] w-[8px] h-[8px] bg-agent-accent rounded-full shadow-[0_0_15px_#00d2ff]"
        animate={{ y: [0, 40, 0], x: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-[30%] left-[15%] w-[12px] h-[12px] bg-agent-purple rounded-full shadow-[0_0_20px_#b026ff]"
        animate={{ y: [0, -60, 0], x: [0, 30, 0], opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div 
        className="absolute top-[40%] left-[40%] w-[5px] h-[5px] bg-white rounded-full shadow-[0_0_10px_#fff]"
        animate={{ scale: [1, 2, 1], opacity: [0.1, 0.5, 0.1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};
