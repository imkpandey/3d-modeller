"use client";

import dynamic from "next/dynamic";
import UploadDialog from "@/components/UploadDialog";
import { EditorProvider } from "@/components/store";
import HierarchyPanel from "@/components/HierarchyPanel";
import Scene from "@/components/Scene";
import Navbar from "@/components/Navbar";
import RightPanel from "@/components/RightPanel";

// const Scene = dynamic(() => import("@/components/Scene"), {
//   ssr: false,
// });

export default function Home() {
  return (
    <EditorProvider>
      <main className="flex flex-col h-screen w-screen bg-[#191919] text-white overflow-hidden">
        <Navbar />
        <div className="relative flex h-full w-full bg-[#191919] text-white overflow-hidden">
          <Scene />
          <HierarchyPanel />
          <RightPanel />
          <UploadDialog />
        </div>
      </main>
    </EditorProvider>
  );
}
