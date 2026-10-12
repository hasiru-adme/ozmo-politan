// lib/flowStages.ts

export type FlowNode = {
  id: string;
  x: number; // 0-100, % of viewBox
  y: number;
  r: number; // radius
  label?: string;
};

export type FlowConnection = { from: string; to: string };

// STAGE 1 — HERO: one central node, satellites orbiting close
export const heroStage: { nodes: FlowNode[]; connections: FlowConnection[] } = {
  nodes: [
    { id: "core", x: 50, y: 50, r: 5 },
    { id: "n1", x: 68, y: 32, r: 2.6 },
    { id: "n2", x: 30, y: 34, r: 2.2 },
    { id: "n3", x: 66, y: 68, r: 2.2 },
    { id: "n4", x: 32, y: 66, r: 2.6 },
  ],
  connections: [
    { from: "core", to: "n1" },
    { from: "core", to: "n2" },
    { from: "core", to: "n3" },
    { from: "core", to: "n4" },
  ],
};

// STAGE 2 — reserved for Problem section (next step): nodes will
// scatter apart and connections will fade to 0 before this handoff.