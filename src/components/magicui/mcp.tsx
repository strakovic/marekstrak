"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface MCPNode {
  id: string;
  label: string;
  type: "client" | "server" | "tool" | "resource";
  x: number;
  y: number;
}

interface MCPConnection {
  from: string;
  to: string;
  type: "request" | "response" | "stream";
}

export interface MCPProps {
  className?: string;
  nodes?: MCPNode[];
  connections?: MCPConnection[];
  animated?: boolean;
  showLabels?: boolean;
  pulseDelay?: number;
  connectionDuration?: number;
}

const defaultNodes: MCPNode[] = [
  { id: "client", label: "MCP Client", type: "client", x: 20, y: 50 },
  { id: "server1", label: "File Server", type: "server", x: 180, y: 20 },
  { id: "server2", label: "Database Server", type: "server", x: 180, y: 80 },
  { id: "tool1", label: "Search Tool", type: "tool", x: 340, y: 20 },
  { id: "tool2", label: "Query Tool", type: "tool", x: 340, y: 50 },
  { id: "resource1", label: "Files", type: "resource", x: 340, y: 80 },
];

const defaultConnections: MCPConnection[] = [
  { from: "client", to: "server1", type: "request" },
  { from: "client", to: "server2", type: "request" },
  { from: "server1", to: "tool1", type: "stream" },
  { from: "server2", to: "tool2", type: "stream" },
  { from: "server2", to: "resource1", type: "response" },
];

const nodeColors = {
  client: "#3b82f6", // blue
  server: "#f59e0b", // amber
  tool: "#10b981", // emerald
  resource: "#8b5cf6", // violet
};

const connectionColors = {
  request: "#ef4444", // red
  response: "#10b981", // emerald
  stream: "#8b5cf6", // violet
};

export const MCP: React.FC<MCPProps> = ({
  className,
  nodes = defaultNodes,
  connections = defaultConnections,
  animated = true,
  showLabels = true,
  pulseDelay = 0.5,
  connectionDuration = 2,
}) => {
  const [activeConnections, setActiveConnections] = useState<string[]>([]);

  useEffect(() => {
    if (!animated) return;

    const interval = setInterval(() => {
      const randomConnection = connections[Math.floor(Math.random() * connections.length)];
      const connectionId = `${randomConnection.from}-${randomConnection.to}`;
      
      setActiveConnections(prev => [...prev, connectionId]);
      
      setTimeout(() => {
        setActiveConnections(prev => prev.filter(id => id !== connectionId));
      }, connectionDuration * 1000);
    }, pulseDelay * 1000);

    return () => clearInterval(interval);
  }, [animated, connections, pulseDelay, connectionDuration]);

  const getNodePosition = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  };

  return (
    <div className={cn("relative w-full h-full min-h-[200px]", className)}>
      <svg
        viewBox="0 0 400 120"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Render connections */}
        {connections.map((connection, index) => {
          const from = getNodePosition(connection.from);
          const to = getNodePosition(connection.to);
          const connectionId = `${connection.from}-${connection.to}`;
          const isActive = activeConnections.includes(connectionId);
          
          return (
            <g key={`connection-${index}`}>
              {/* Base connection line */}
              <motion.line
                x1={from.x + 15}
                y1={from.y + 15}
                x2={to.x + 15}
                y2={to.y + 15}
                stroke={connectionColors[connection.type]}
                strokeWidth="2"
                strokeOpacity="0.3"
                strokeDasharray={connection.type === "stream" ? "5,5" : "none"}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: index * 0.2 }}
              />
              
              {/* Active pulse line */}
              {isActive && (
                <motion.line
                  x1={from.x + 15}
                  y1={from.y + 15}
                  x2={to.x + 15}
                  y2={to.y + 15}
                  stroke={connectionColors[connection.type]}
                  strokeWidth="3"
                  strokeOpacity="0.8"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 1, 0] }}
                  transition={{ duration: connectionDuration, ease: "easeInOut" }}
                />
              )}
              
              {/* Connection direction arrow */}
              <motion.circle
                r="2"
                fill={connectionColors[connection.type]}
                initial={{
                  cx: from.x + 15,
                  cy: from.y + 15,
                }}
                animate={{
                  cx: isActive ? [from.x + 15, to.x + 15] : from.x + 15,
                  cy: isActive ? [from.y + 15, to.y + 15] : from.y + 15,
                }}
                transition={{
                  duration: isActive ? connectionDuration : 0,
                  ease: "easeInOut",
                }}
              />
            </g>
          );
        })}

        {/* Render nodes */}
        {nodes.map((node, index) => (
          <g key={`node-${node.id}`}>
            {/* Node circle */}
            <motion.circle
              cx={node.x + 15}
              cy={node.y + 15}
              r="12"
              fill={nodeColors[node.type]}
              stroke="white"
              strokeWidth="2"
              className="drop-shadow-sm"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 200,
                damping: 10
              }}
            />
            
            {/* Node pulse animation */}
            {animated && (
              <motion.circle
                cx={node.x + 15}
                cy={node.y + 15}
                r="12"
                fill="none"
                stroke={nodeColors[node.type]}
                strokeWidth="1"
                strokeOpacity="0.6"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ 
                  scale: [1, 1.5, 1], 
                  opacity: [0.6, 0, 0.6] 
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3,
                  ease: "easeInOut"
                }}
              />
            )}
            
            {/* Node label */}
            {showLabels && (
              <motion.text
                x={node.x + 15}
                y={node.y + 40}
                textAnchor="middle"
                className="text-xs font-neue-montreal-book fill-muted-foreground"
                initial={{ opacity: 0, y: node.y + 35 }}
                animate={{ opacity: 1, y: node.y + 40 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                {node.label}
              </motion.text>
            )}
          </g>
        ))}
      </svg>
      
      {/* Legend */}
      <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm rounded-lg p-2 space-y-1">
        <div className="flex items-center gap-2 text-xs font-neue-montreal-book">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span>Client</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-neue-montreal-book">
          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
          <span>Server</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-neue-montreal-book">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span>Tool</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-neue-montreal-book">
          <div className="w-2 h-2 rounded-full bg-violet-500"></div>
          <span>Resource</span>
        </div>
      </div>
    </div>
  );
};

export default MCP;
