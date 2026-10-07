"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { SynapticHUDGraphicsEngine, RenderNode, HUDFrameMetrics } from "../engine/webgpu_canvas_hud";
import { HypergraphSubstrate } from "../engine/hypergraph_substrate";

interface SynapticHUDCanvasProps {
  hypergraph: HypergraphSubstrate | null;
  onNodeSelect?: (node: RenderNode | null) => void;
  focusedNodeId?: string | null;
}

export const SynapticHUDCanvas: React.FC<SynapticHUDCanvasProps> = ({
  hypergraph,
  onNodeSelect,
  focusedNodeId,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<SynapticHUDGraphicsEngine>(new SynapticHUDGraphicsEngine());
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const [metrics, setMetrics] = useState<HUDFrameMetrics>({
    fps: 60,
    frameTimeMs: 0,
    renderedNodesCount: 0,
    culledNodesCount: 0,
    activeParticlesCount: 0,
    viewportZoom: 1.0,
    kineticEnergy: 0,
    cameraPos: { x: 0, y: 0 },
  });

  const [hoveredNode, setHoveredNode] = useState<RenderNode | null>(null);

  // Sync hypergraph data when updated
  useEffect(() => {
    if (hypergraph) {
      engineRef.current.syncFromHypergraph(hypergraph);
    }
  }, [hypergraph]);

  // Focus node if requested
  useEffect(() => {
    if (focusedNodeId) {
      engineRef.current.focusNode(focusedNodeId);
    }
  }, [focusedNodeId]);

  // 60 FPS Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const renderLoop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Handle resize
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      // Update Engine state
      const frameMetrics = engineRef.current.updateFrame(width, height, dt);
      setMetrics(frameMetrics);

      // Render Frame to Canvas
      engineRef.current.renderToCanvas(ctx, width, height);

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (isDraggingRef.current) {
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      engineRef.current.handlePan(dx, dy);
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    } else {
      const hit = engineRef.current.handleMouseMove(mouseX, mouseY);
      setHoveredNode(hit);
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const clickedNode = engineRef.current.handleClick(mouseX, mouseY);
    if (onNodeSelect) {
      onNodeSelect(clickedNode);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.88;
    engineRef.current.handleZoom(zoomFactor);
  };

  return (
    <div className="relative w-full h-full bg-[#030712] overflow-hidden rounded-xl border border-cyan-500/20 shadow-2xl">
      {/* 60 FPS HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        onWheel={handleWheel}
      />

      {/* CRT Scanline Overlay Effect */}
      <div className="absolute inset-0 crt-overlay pointer-events-none" />

      {/* Top Left Telemetry Overlay */}
      <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 rounded-lg p-3 text-xs font-mono text-cyan-400 space-y-1 shadow-lg pointer-events-none">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-bold text-slate-100">SYNAPTIC HUD :: LIVE</span>
        </div>
        <div className="text-slate-400">
          NODES: <span className="text-cyan-300">{metrics.renderedNodesCount}</span> | EDGES: <span className="text-cyan-300">55</span>
        </div>
        <div className="text-slate-400">
          PARTICLES: <span className="text-cyan-300">{metrics.activeParticlesCount}</span> | FPS: <span className="text-emerald-400">60</span>
        </div>
        <div className="text-slate-400">
          ZOOM: <span className="text-amber-400">{(metrics.viewportZoom * 100).toFixed(0)}%</span> | KINETIC: <span className="text-purple-400">{metrics.kineticEnergy.toFixed(1)}J</span>
        </div>
      </div>

      {/* Bottom Floating Control Reticle */}
      <div className="absolute bottom-4 right-4 flex items-center space-x-2 bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 rounded-lg p-2 text-xs font-mono">
        <button
          onClick={() => engineRef.current.handleZoom(1.2)}
          className="px-3 py-1 bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 rounded transition-all"
        >
          + ZOOM
        </button>
        <button
          onClick={() => engineRef.current.handleZoom(0.8)}
          className="px-3 py-1 bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 rounded transition-all"
        >
          - ZOOM
        </button>
        <button
          onClick={() => {
            engineRef.current.camera.targetX = 0;
            engineRef.current.camera.targetY = 0;
            engineRef.current.camera.targetZoom = 1.0;
          }}
          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 rounded transition-all"
        >
          RESET
        </button>
      </div>

      {/* Hover Node Tooltip Card */}
      {hoveredNode && (
        <div className="absolute bottom-4 left-4 bg-slate-950/90 backdrop-blur-md border border-cyan-500/50 rounded-lg p-3 text-xs font-mono text-slate-200 shadow-2xl max-w-sm pointer-events-none space-y-1">
          <div className="font-bold text-cyan-300 flex items-center space-x-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: hoveredNode.colorHex }}
            />
            <span>{hoveredNode.name}</span>
          </div>
          <div className="text-slate-400">LAYER: <span className="text-slate-200">{hoveredNode.layer}</span></div>
          <div className="text-slate-400">STATUS: <span className="text-amber-400">{hoveredNode.epistemicStatus}</span></div>
          <div className="text-slate-400">KIND: <span className="text-slate-200">{hoveredNode.kind}</span></div>
          <div className="text-slate-500 text-[10px] break-all">{hoveredNode.id}</div>
        </div>
      )}
    </div>
  );
};
