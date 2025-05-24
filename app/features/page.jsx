// pages/features.js
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Cpu,
  Target,
  Mail,
  BarChart,
  Puzzle,
  Users,
  Zap, // For Automation
  Lightbulb, // For AI/Intelligence
  Share2, // For Integration
  TrendingUp, // For Forecasting
  UserPlus, // For Lead Generation,
} from "lucide-react";
import { useEffect, useRef } from "react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeInOut" },
};

function FeatureItem({ feature }) {
  return (
    <div className="flex flex-col items-center gap-4 p-6 rounded-lg shadow-md bg-white w-80 md:w-96 flex-shrink-0">
      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl">
        {feature.icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
      <p className="text-slate-700 text-center">{feature.description}</p>
    </div>
  );
}

export default function FeaturesMarqueePage() {
  const featuresFlow = [
    {
      icon: <UserPlus />,
      title: "Lead Generation",
      description: "Attract potential customers with targeted strategies.",
    },
    {
      icon: <Target />,
      title: "AI Lead Scoring",
      description: "Identify and prioritize your most promising prospects.",
    },
    {
      icon: <Cpu />,
      title: "Automation",
      description: "Automate follow-ups and repetitive tasks to save time.",
    },
    {
      icon: <Mail />,
      title: "Smart Emails",
      description: "Send personalized and engaging emails that convert.",
    },
    {
      icon: <BarChart />,
      title: "Analytics & Forecasting",
      description: "Track performance and predict future sales trends.",
    },
    {
      icon: <Users />,
      title: "Collaboration",
      description: "Enable seamless teamwork and shared insights.",
    },
    {
      icon: <UserPlus />,
      title: "Lead Generation",
      description: "Attract potential customers with targeted strategies.",
    },
    {
      icon: <Target />,
      title: "AI Lead Scoring",
      description: "Identify and prioritize your most promising prospects.",
    },
    {
      icon: <Cpu />,
      title: "Automation",
      description: "Automate follow-ups and repetitive tasks to save time.",
    },
    {
      icon: <Mail />,
      title: "Smart Emails",
      description: "Send personalized and engaging emails that convert.",
    },
    {
      icon: <BarChart />,
      title: "Analytics & Forecasting",
      description: "Track performance and predict future sales trends.",
    },
    {
      icon: <Users />,
      title: "Collaboration",
      description: "Enable seamless teamwork and shared insights.",
    },
    {
      icon: <UserPlus />,
      title: "Lead Generation",
      description: "Attract potential customers with targeted strategies.",
    },
    {
      icon: <Target />,
      title: "AI Lead Scoring",
      description: "Identify and prioritize your most promising prospects.",
    },
    {
      icon: <Cpu />,
      title: "Automation",
      description: "Automate follow-ups and repetitive tasks to save time.",
    },
    {
      icon: <Mail />,
      title: "Smart Emails",
      description: "Send personalized and engaging emails that convert.",
    },
    {
      icon: <BarChart />,
      title: "Analytics & Forecasting",
      description: "Track performance and predict future sales trends.",
    },
    {
      icon: <Users />,
      title: "Collaboration",
      description: "Enable seamless teamwork and shared insights.",
    },
    {
      icon: <UserPlus />,
      title: "Lead Generation",
      description: "Attract potential customers with targeted strategies.",
    },
    {
      icon: <Target />,
      title: "AI Lead Scoring",
      description: "Identify and prioritize your most promising prospects.",
    },
    {
      icon: <Cpu />,
      title: "Automation",
      description: "Automate follow-ups and repetitive tasks to save time.",
    },
    {
      icon: <Mail />,
      title: "Smart Emails",
      description: "Send personalized and engaging emails that convert.",
    },
    {
      icon: <BarChart />,
      title: "Analytics & Forecasting",
      description: "Track performance and predict future sales trends.",
    },
    {
      icon: <Users />,
      title: "Collaboration",
      description: "Enable seamless teamwork and shared insights.",
    },
    {
      icon: <UserPlus />,
      title: "Lead Generation",
      description: "Attract potential customers with targeted strategies.",
    },
    {
      icon: <Target />,
      title: "AI Lead Scoring",
      description: "Identify and prioritize your most promising prospects.",
    },
    {
      icon: <Cpu />,
      title: "Automation",
      description: "Automate follow-ups and repetitive tasks to save time.",
    },
    {
      icon: <Mail />,
      title: "Smart Emails",
      description: "Send personalized and engaging emails that convert.",
    },
    {
      icon: <BarChart />,
      title: "Analytics & Forecasting",
      description: "Track performance and predict future sales trends.",
    },
    {
      icon: <Users />,
      title: "Collaboration",
      description: "Enable seamless teamwork and shared insights.",
    },
    // Duplicate the array to create a seamless loop
    ...[
      {
        icon: <UserPlus />,
        title: "Lead Generation",
        description: "Attract potential customers with targeted strategies.",
      },
      {
        icon: <Target />,
        title: "AI Lead Scoring",
        description: "Identify and prioritize your most promising prospects.",
      },
      {
        icon: <Cpu />,
        title: "Automation",
        description: "Automate follow-ups and repetitive tasks to save time.",
      },
      {
        icon: <Mail />,
        title: "Smart Emails",
        description: "Send personalized and engaging emails that convert.",
      },
      {
        icon: <BarChart />,
        title: "Analytics & Forecasting",
        description: "Track performance and predict future sales trends.",
      },
      {
        icon: <Users />,
        title: "Collaboration",
        description: "Enable seamless teamwork and shared insights.",
      },
    ],
  ];

  const marqueeRef = useRef(null);

  useEffect(() => {
    const marqueeElement = marqueeRef.current;
    if (marqueeElement) {
      const duration = featuresFlow.length * 0.5; // Adjust speed by changing the multiplier
      const animation = marqueeElement.animate(
        [{ transform: 'translateX(0%)' }, { transform: `translateX(-${100 / featuresFlow.length * (featuresFlow.length / 2)}%)` }],
        {
          duration: duration * 1000, // Convert to milliseconds
          iterations: Infinity,
          easing: 'linear',
        }
      );

      return () => {
        animation.cancel();
      };
    }
  }, [featuresFlow]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-slate-100 py-16 px-6 md:px-24"
    >
      <div className="max-w-5xl mx-auto text-center mb-12">
        <Link href="/" className="inline-block mb-8">
          <Image
            src="/assets/SF-green.svg"
            alt="SalesFlow Logo"
            width={80}
            height={80}
          />
        </Link>
        <motion.h1
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
        >
          Experience the SalesFlow: A Continuous Journey
        </motion.h1>
        <motion.p
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
          className="text-slate-700 text-lg"
        >
          See the seamless flow of SalesFlow features in action.
        </motion.p>
      </div>

      <div className="overflow-hidden">
        <motion.div
          ref={marqueeRef}
          className="flex flex-row gap-8 will-change-transform"
        >
          {featuresFlow.map((feature, index) => (
            <FeatureItem key={index} feature={feature} />
          ))}
        </motion.div>
      </div>

      <motion.div
        variants={fadeIn}
        initial="initial"
        animate="animate"
        className="mt-16 text-center"
      >
        <Link href="/signup">
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-3xl text-lg transition-all">
            Start Your Seamless Journey
          </button>
        </Link>
        <p className="mt-4 text-slate-600">
          Dive into the continuous flow of SalesFlow.
        </p>
      </motion.div>
    </motion.main>
  );
}