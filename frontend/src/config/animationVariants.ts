import type { Variants } from "framer-motion";

// Variantes para fade-in con movimiento vertical
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (index?: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: (index ?? 0) * 0.1,
      ease: "easeOut",
    },
  }),
};

// Variantes para fade-in con movimiento downward
export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: (index?: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: (index ?? 0) * 0.1,
      ease: "easeOut",
    },
  }),
};

// Variantes para scale-in
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (index?: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: (index ?? 0) * 0.1,
      ease: "easeOut",
    },
  }),
};

// Variantes para slide-in desde la izquierda
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: (index?: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      delay: (index ?? 0) * 0.1,
      ease: "easeOut",
    },
  }),
};

// Variantes para slide-in desde la derecha
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: (index?: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      delay: (index ?? 0) * 0.1,
      ease: "easeOut",
    },
  }),
};

// Variantes para container (lista de elementos)
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Variantes para badge o etiqueta
export const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: -20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

// Variantes para heading
export const headingVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.2,
      ease: "easeOut",
    },
  },
};

// Variantes para párrafo
export const paragraphVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.4,
      ease: "easeOut",
    },
  },
};

// Variantes para botón CTA
export const ctaButtonVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.6,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.05,
    boxShadow: "0 20px 40px rgba(37, 99, 235, 0.3)",
  },
  tap: {
    scale: 0.95,
  },
};

// Variantes para card/tarjeta con efecto hover
export const cardHoverVariants: Variants = {
  rest: {
    y: 0,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  hover: {
    y: -8,
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
  },
};

// Variantes para el grid con stagger
export const gridContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

// Animación de entrada para stats
export const statsVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index?: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.8 + (index ?? 0) * 0.1,
      ease: "easeOut",
    },
  }),
};

// Animación pulsante para elementos
export const pulseVariants: Variants = {
  initial: { opacity: 1 },
  animate: {
    opacity: [1, 0.5, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};
