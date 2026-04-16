"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Category } from "@/lib/types";

interface CategoryCardProps {
  category: Category;
  index?: number;
}

export default function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link
        href={`/treatments/${category.slug}`}
        className="block p-6 rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:border-orange/50 group"
      >
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col h-full"
        >
          <div
            className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${category.color}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={category.icon} />
            </svg>
          </div>
          <h3 className="font-heading font-semibold text-charcoal text-lg mb-2 group-hover:text-orange transition-colors">
            {category.name}
          </h3>
          <p className="text-body text-sm mb-4 flex-1">
            {category.description}
          </p>
          <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-charcoal/5 text-muted w-fit">
            {category.treatmentCount} treatment{category.treatmentCount !== 1 ? "s" : ""}
          </span>
        </motion.div>
      </Link>
    </motion.div>
  );
}
