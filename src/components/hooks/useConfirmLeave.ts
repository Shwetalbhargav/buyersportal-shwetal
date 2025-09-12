import { useEffect } from "react";
export function useConfirmLeave(enabled: boolean) {
useEffect(() => {
if (!enabled) return;
const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
window.addEventListener("beforeunload", handler);
return () => window.removeEventListener("beforeunload", handler);
}, [enabled]);
}