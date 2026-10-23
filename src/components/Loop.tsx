"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type HTMLMotionProps,
  type TargetAndTransition,
  type Transition,
} from "framer-motion";

type LoopProps = Omit<HTMLMotionProps<"div">, "animate" | "transition"> & {
  animate: TargetAndTransition; // loop වෙන keyframes
  rest: TargetAndTransition; // නවත්තද්දී පෙන්නන static state එක
  transition: Transition; // repeat: Infinity තියෙන එක
};

export default function Loop({ animate, rest, transition, ...props }: LoopProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "100px" });
  const reduce = useReducedMotion();
  const play = inView && !reduce;

  return (
    <motion.div
      ref={ref}
      {...props}
      animate={play ? animate : rest}
      transition={play ? transition : { duration: 0 }}
    />
  );
}