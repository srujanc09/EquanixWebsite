import { cn } from "@/lib/utils";
import {
  IconAdjustmentsBolt,
  IconCloud,
  IconCurrencyDollar,
  IconEaseInOut,
  IconHeart,
  IconHelp,
  IconRouteAltLeft,
  IconTerminal2,
} from "@tabler/icons-react";
import { useEffect } from "react";
import AOS from "aos";

export function FeaturesSectionWithHoverEffects() {
  useEffect(() => {
    AOS.refresh();
  }, []);

  const features = [
    {
      title: "AI-Powered Debugging",
      description: "Automatically detects and fixes code issues in real-time.",
      icon: <IconTerminal2 />,
    },
    {
      title: "Self-Learning System",
      description: "Continuously improves by learning from your codebase patterns.",
      icon: <IconEaseInOut />,
    },
    {
      title: "Security First",
      description: "Automatically patches vulnerabilities while maintaining compliance.",
      icon: <IconAdjustmentsBolt />,
    },
    {
      title: "Cloud Native",
      description: "Seamlessly integrates with your cloud infrastructure.",
      icon: <IconCloud />,
    },
    {
      title: "Multi-tenant Architecture",
      description: "Scalable solution for teams of all sizes.",
      icon: <IconRouteAltLeft />,
    },
    {
      title: "24/7 AI Support",
      description: "Our AI agents are always available to assist you.",
      icon: <IconHelp />,
    },
    {
      title: "Performance Optimized",
      description: "Keeps your applications running at peak efficiency.",
      icon: <IconCurrencyDollar />, // You might want to change this icon
    },
    {
      title: "Future Proof",
      description: "Continuously evolves with the latest technologies.",
      icon: <IconHeart />,
    },
  ];

  return (
    <section className="w-full py-20 bg-white dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-neutral-800 dark:text-neutral-100">
            Self Healing AI Features
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-neutral-600 dark:text-neutral-400">
            Powerful capabilities to transform your development workflow
          </p>
        </div>
        
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {features.map((feature, index) => (
            <Feature key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
      data-aos="fade-up"
      data-aos-delay={(index % 4) * 100 + 200}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};