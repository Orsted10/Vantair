import { NextRequest } from "next/server";
import { ProjectStore } from "@/core/storage/project_store";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params;
  const projectStore = ProjectStore.getInstance();

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;
      const sendEvent = (data: any) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch {
          closed = true;
        }
      };

      const interval = setInterval(() => {
        const project = projectStore.getProject(projectId);
        if (!project) {
          sendEvent({ type: "ERROR", message: "Project not found" });
          clearInterval(interval);
          controller.close();
          closed = true;
          return;
        }

        const run = project.latestAnalysisId
          ? projectStore.getAnalysisRun(project.latestAnalysisId)
          : undefined;

        if (run) {
          sendEvent({
            type: "PROGRESS",
            analysisId: run.id,
            status: run.status,
            progressPercent: run.progressPercent,
            message: run.currentPhaseMessage,
            fingerprint: run.fingerprint,
            timestamp: Date.now(),
          });

          if (run.status === "COMPLETED" || run.status === "FAILED") {
            clearInterval(interval);
            setTimeout(() => {
              try {
                controller.close();
              } catch {}
              closed = true;
            }, 1000);
          }
        } else {
          sendEvent({
            type: "IDLE",
            message: "No active analysis run",
            timestamp: Date.now(),
          });
        }
      }, 500);

      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        closed = true;
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
