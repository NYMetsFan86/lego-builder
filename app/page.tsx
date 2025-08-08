"use client";
import { Suspense, useEffect } from "react";
import dynamic from "next/dynamic";
import "@/app/globals.css";
import Logo from "@/components/Logo";
import Palette from "@/components/Palette";
import { useBuilderStore } from "@/store/useBuilderStore";
import { loadFromLocalStorage } from "@/lib/io/serialize";

const Canvas3D = dynamic(() => import("@/components/Canvas3D"), { ssr: false });

export default function Page() {
  const load = useBuilderStore(s => s.loadScene);
  useEffect(() => { const saved = loadFromLocalStorage(); if (saved) load(saved); }, [load]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", height: "100dvh" }}>
      <aside style={{ 
        background: "var(--panel)", 
        borderRight: "1px solid var(--border)", 
        overflow: "auto",
        display: "flex",
        flexDirection: "column"
      }}>
        {/* Header */}
        <div style={{ 
          padding: "20px 24px", 
          borderBottom: "1px solid var(--border)",
          background: "var(--panel2)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Logo size={44} />
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>BrickBuilder 3D</h1>
              <p style={{ color: "var(--muted)", margin: 0, fontSize: 13 }}>Build amazing creations</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ flex: 1, padding: 24 }}>
          <Palette />
        </div>

        {/* Footer */}
        <div style={{ 
          padding: "16px 24px", 
          borderTop: "1px solid var(--border)",
          background: "var(--panel2)",
          fontSize: 12,
          color: "var(--muted)"
        }}>
          <div style={{ marginBottom: 8 }}>
            <strong>Controls:</strong>
          </div>
          <div style={{ display: "grid", gap: 4 }}>
            <div>🖱️ Left Click - Place brick</div>
            <div>🖱️ Right Click - Remove brick</div>
            <div>⌨️ R - Rotate brick</div>
            <div>🖱️ Scroll - Zoom in/out</div>
          </div>
        </div>
      </aside>
      
      <main style={{ position: "relative", background: "#0a0a14" }}>
        <Suspense fallback={
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            height: "100%",
            fontSize: 18,
            color: "var(--muted)"
          }}>
            Loading 3D environment...
          </div>
        }>
          <Canvas3D />
        </Suspense>
      </main>
    </div>
  );
}