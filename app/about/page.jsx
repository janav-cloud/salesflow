"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Cpu,
  Heart,
  Puzzle,
  TrendingUp,
  Users,
} from "lucide-react"; // Importing Lucide icons

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeInOut" },
};

const scaleUp = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.7, ease: "easeInOut" },
};

function Section({ title, children }) {
  const { ref, inView } = useInView({ triggerOnce: true });

  return (
    <motion.section
      ref={ref}
      variants={fadeIn}
      initial="initial"
      animate={inView ? "animate" : "initial"}
      className="mb-12"
    >
      <h2 className="text-2xl font-semibold text-slate-900 mb-4">{title}</h2>
      {children}
    </motion.section>
  );
}

function Benefit({ icon, text }) {
  const { ref, inView } = useInView({ triggerOnce: true });

  return (
    <motion.li
      ref={ref}
      variants={scaleUp}
      initial="initial"
      animate={inView ? "animate" : "initial"}
      className="mb-4 flex items-start gap-3 text-slate-700 text-lg"
    >
      {icon && <div className="w-6 h-6 text-emerald-600">{icon}</div>}
      <span>{text}</span>
    </motion.li>
  );
}

export default function AboutPageSeamlessLucideDirect() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-slate-50 py-16 px-6 md:px-24"
    >
      <div className="max-w-3xl mx-auto text-center">
        <Link href="/" className="inline-block mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeInOut" }}
          >
            <Image
              src="/assets/SF-green.svg"
              alt="SalesFlow Logo"
              width={80}
              height={80}
            />
          </motion.div>
        </Link>
        <motion.h1
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold text-emerald-700 mb-8"
        >
          More Than Just Automation, It's SalesFlow
        </motion.h1>
        <motion.p
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.4 }}
          className="text-slate-700 text-lg mb-10"
        >
          We're not just building tools; we're crafting seamless experiences that
          empower your sales team to thrive. Discover the philosophy behind our
          innovative approach.
        </motion.p>

        <Section title="Our Philosophy: Flow and Focus">
          <p className="text-slate-700 text-lg mb-6">
            We believe that a smooth, uninterrupted flow is essential for sales
            success. SalesFlow is designed to eliminate friction points, automate
            the mundane, and provide you with the clarity needed to focus on
            meaningful interactions.
          </p>
          <p className="text-slate-700 text-lg">
            Our approach centers around intuitive design and intelligent
            automation that works *with* your team, not against it. We're
            committed to building a platform that feels natural and enhances
            your existing workflow.
          </p>
        </Section>

        <Section title="The SalesFlow Difference">
          <ul className="list-none pl-0">
            <Benefit
              icon={<Cpu />}
              text="Intelligent Automation that Adapts to You."
            />
            <Benefit
              icon={<Heart />}
              text="Focus on Relationships, Not Just Transactions."
            />
            <Benefit
              icon={<Puzzle />}
              text="Seamless Integration with Your Existing Ecosystem."
            />
            <Benefit
              icon={<TrendingUp />}
              text="Data-Driven Insights for Continuous Improvement."
            />
            <Benefit
              icon={<Users />}
              text="Built for Collaboration and Team Success."
            />
          </ul>
        </Section>

        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <Link href="/signup">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-3xl text-lg transition-all">
              Let's Connect
            </button>
          </Link>
          <Link href="/features" className="ml-4">
            <button className="border border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-6 py-3 rounded-3xl text-lg transition-all">
              Explore the Flow
            </button>
          </Link>
        </motion.div>
      </div>
    </motion.main>
  );
}