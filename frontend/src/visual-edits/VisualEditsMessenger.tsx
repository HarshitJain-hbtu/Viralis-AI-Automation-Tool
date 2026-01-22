/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from "react";

export const CHANNEL = "ORCHIDS_HOVER_v1";

interface Box {
  top: number;
  left: number;
  width: number;
  height: number;
}

// Deduplicate helper for high-frequency traffic (HIT / FOCUS_MOVED / SCROLL)
let _orchidsLastMsg = "";
const postMessageDedup = (data: any) => {
  try {
    const key = JSON.stringify(data);
    if (key === _orchidsLastMsg) return;
    _orchidsLastMsg = key;
  } catch {
    // fall through
  }
  window.parent.postMessage(data, "*");
};

const BOX_PADDING = 4;

const isTextEditable = (element: HTMLElement) => {
  const tagName = element.tagName.toLowerCase();
  const editableTags = ["p", "h1", "h2", "h3", "h4", "h5", "h6", "span", "div", "li", "td", "th", "label", "a", "button"];
  if (element.contentEditable === "true" || tagName === "input" || tagName === "textarea") return true;
  if (editableTags.includes(tagName) && element.textContent?.trim()) {
    const hasDirectText = Array.from(element.childNodes).some(
      (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()
    );
    if (element.childElementCount === 0 || (element.childElementCount <= 1 && hasDirectText)) return true;
  }
  return false;
};

const extractDirectTextContent = (element: HTMLElement) => {
  let text = "";
  for (const node of element.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) text += node.textContent || "";
  }
  return text;
};

const parseOrchidsId = (orchidsId: string) => {
  const parts = orchidsId.split(":");
  if (parts.length < 3) return null;
  const column = parseInt(parts.pop() || "0");
  const line = parseInt(parts.pop() || "0");
  const filePath = parts.join(":");
  if (isNaN(line) || isNaN(column)) return null;
  return { filePath, line, column };
};

const getCurrentStyles = (element: HTMLElement) => {
  const computed = window.getComputedStyle(element);
  const styles: Record<string, string> = {};
  const props = [
    "fontSize", "color", "fontWeight", "fontStyle", "textDecoration", "textAlign", "lineHeight", "letterSpacing",
    "paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom",
    "backgroundColor", "backgroundImage", "borderRadius", "fontFamily", "opacity", "display", "flexDirection", "alignItems", "justifyContent", "gap"
  ];
  props.forEach(p => {
    let val = (computed as any)[p];
    if (p === "backgroundColor" && (val === "rgba(0, 0, 0, 0)" || val === "transparent")) val = "transparent";
    if (p === "backgroundImage" && val === "none") val = "none";
    if (p === "textDecoration" && val.includes("none")) val = "none";
    if (p === "fontWeight") val = String(parseInt(val) || val);
    styles[p] = val;
  });
  return styles;
};

const normalizeImageSrc = (input: string) => {
  if (!input) return "";
  try {
    const url = new URL(input, window.location.origin);
    if (url.pathname === "/_next/image") {
      const real = url.searchParams.get("url");
      if (real) return decodeURIComponent(real);
    }
    return url.href;
  } catch {
    return input;
  }
};

const wrapMultiline = (text: string) => {
  if (text.includes("\n")) {
    const escaped = text.replace(/\n/g, "\\n");
    return `{\`${escaped}\`}`;
  }
  return text;
};

export default function VisualEditsMessenger() {
  const [hoverBoxes, setHoverBoxes] = useState<Box[]>([]);
  const [focusBox, setFocusBox] = useState<Box | null>(null);
  const [focusedElementId, setFocusedElementId] = useState<string | null>(null);
  const [isVisualEditMode, setIsVisualEditMode] = useState(false);
  const [hoverTag, setHoverTag] = useState<string | null>(null);
  const [focusTag, setFocusTag] = useState<string | null>(null);
  const [isScrolling] = useState(false);

  const lastHitElementRef = useRef<HTMLElement | null>(null);
  const lastHitIdRef = useRef<string | null>(null);
  const focusedElementRef = useRef<HTMLElement | null>(null);
  const isVisualEditModeRef = useRef(false);
  const originalContentRef = useRef("");
  const originalSrcRef = useRef("");
  const focusedImageElementRef = useRef<HTMLImageElement | null>(null);
  const editingElementRef = useRef<HTMLElement | null>(null);
  const wasEditableRef = useRef(false);
  const hasStyleChangesRef = useRef(false);
  const appliedStylesRef = useRef(new Map<string, any>());

  useEffect(() => {
    isVisualEditModeRef.current = isVisualEditMode;
  }, [isVisualEditMode]);

  const expandBox = (rect: DOMRect): Box => ({
    top: rect.top - BOX_PADDING,
    left: rect.left - BOX_PADDING,
    width: rect.width + BOX_PADDING * 2,
    height: rect.height + BOX_PADDING * 2,
  });

  const handleTextChange = (element: HTMLElement) => {
    const orchidsId = element.getAttribute("data-orchids-id");
    if (!orchidsId) return;
    const newText = element.childElementCount > 0 ? extractDirectTextContent(element) : (element.innerText || element.textContent || "");
    const oldText = originalContentRef.current;
    if (newText !== oldText) {
      const parsed = parseOrchidsId(orchidsId);
      if (!parsed) return;
      postMessageDedup({
        type: CHANNEL, msg: "TEXT_CHANGED", id: orchidsId, oldText: wrapMultiline(oldText), newText: wrapMultiline(newText),
        filePath: parsed.filePath, line: parsed.line, column: parsed.column
      });
      originalContentRef.current = newText;
    }
  };

  const handleStyleBlur = (element: HTMLElement) => {
    if (!hasStyleChangesRef.current) return;
    const orchidsId = element.getAttribute("data-orchids-id");
    if (!orchidsId) return;
    const parsed = parseOrchidsId(orchidsId);
    if (!parsed) return;
    const styles = appliedStylesRef.current.get(orchidsId);
    if (!styles) return;
    postMessageDedup({
      type: CHANNEL, msg: "STYLE_BLUR", id: orchidsId, styles, className: element.className,
      filePath: parsed.filePath, line: parsed.line, column: parsed.column
    });
    hasStyleChangesRef.current = false;
  };

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (!isVisualEditModeRef.current || isScrolling) return;
      const hit = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>("[data-orchids-id]") ?? null;
      if (hit !== lastHitElementRef.current) {
        lastHitElementRef.current = hit;
        if (!hit) {
          setHoverBoxes([]); setHoverTag(null); lastHitIdRef.current = null;
          postMessageDedup({ type: CHANNEL, msg: "HIT", id: null, tag: null, rect: null });
          return;
        }
        const hitId = hit.getAttribute("data-orchids-id");
        if (hitId === lastHitIdRef.current) return;
        lastHitIdRef.current = hitId;
        const tag = hit.getAttribute("data-orchids-name") || hit.tagName.toLowerCase();
        const all = document.querySelectorAll(`[data-orchids-id="${hitId}"]`);
        const boxes: Box[] = [];
        all.forEach(el => { if (el.getAttribute("data-orchids-id") !== focusedElementId) boxes.push(expandBox(el.getBoundingClientRect())); });
        setHoverBoxes(boxes);
        setHoverTag(boxes.length > 0 ? tag : null);
        postMessageDedup({ type: CHANNEL, msg: "HIT", id: hitId, tag, rect: boxes[0] || null });
      }
    };

    const onClick = (e: MouseEvent) => {
      if (!isVisualEditModeRef.current) return;
      const hit = (e.target as HTMLElement).closest<HTMLElement>("[data-orchids-id]");
      if (hit) {
        e.preventDefault(); e.stopPropagation();
        const hitId = hit.getAttribute("data-orchids-id");
        const tag = hit.getAttribute("data-orchids-name") || hit.tagName.toLowerCase();
        if (focusedElementRef.current && focusedElementRef.current !== hit) {
          handleStyleBlur(focusedElementRef.current);
          if (editingElementRef.current === focusedElementRef.current) {
            handleTextChange(editingElementRef.current);
            editingElementRef.current.contentEditable = wasEditableRef.current ? "true" : "false";
            editingElementRef.current = null;
          }
        }
        focusedElementRef.current = hit;
        setFocusedElementId(hitId);
        setFocusTag(tag);
        setFocusBox(expandBox(hit.getBoundingClientRect()));
        setHoverBoxes([]);
        if (isTextEditable(hit)) {
          wasEditableRef.current = hit.contentEditable === "true";
          hit.contentEditable = "true";
          editingElementRef.current = hit;
          originalContentRef.current = hit.childElementCount > 0 ? extractDirectTextContent(hit) : (hit.innerText || hit.textContent || "");
        }
        if (hit.tagName.toLowerCase() === "img") {
          focusedImageElementRef.current = hit as HTMLImageElement;
          originalSrcRef.current = normalizeImageSrc(focusedImageElementRef.current.src);
        }
        postMessageDedup({
          type: CHANNEL, msg: "ELEMENT_CLICKED", id: hitId, tag, rect: expandBox(hit.getBoundingClientRect()),
          clickPosition: { x: e.clientX, y: e.clientY }, isEditable: isTextEditable(hit),
          currentStyles: getCurrentStyles(hit), className: hit.className, src: (hit as any).src
        });
      }
    };

    const onMsg = (e: MessageEvent) => {
      if (e.data?.type !== CHANNEL) return;
      if (e.data.msg === "VISUAL_EDIT_MODE") setIsVisualEditMode(e.data.active);
      if (e.data.msg === "SCROLL") window.scrollBy(e.data.dx, e.data.dy);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("click", onClick, true);
    window.addEventListener("message", onMsg);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("message", onMsg);
    };
  }, [focusedElementId, isScrolling]);

  if (!isVisualEditMode) return null;

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 99999 }}>
      {hoverBoxes.map((box, i) => (
        <div key={i} style={{
          position: "absolute", top: box.top, left: box.left, width: box.width, height: box.height,
          border: "2px dashed #10b981", borderRadius: "4px", backgroundColor: "rgba(16, 185, 129, 0.1)"
        }}>
          {i === 0 && hoverTag && (
            <div style={{
              position: "absolute", top: -20, left: 0, backgroundColor: "#10b981", color: "white",
              padding: "0 4px", fontSize: "10px", borderRadius: "2px", fontWeight: "bold", textTransform: "uppercase"
            }}>{hoverTag}</div>
          )}
        </div>
      ))}
      {focusBox && (
        <div style={{
          position: "absolute", top: focusBox.top, left: focusBox.left, width: focusBox.width, height: focusBox.height,
          border: "2px solid #3b82f6", borderRadius: "4px", backgroundColor: "rgba(59, 130, 246, 0.05)"
        }}>
          {focusTag && (
            <div style={{
              position: "absolute", top: -20, left: 0, backgroundColor: "#3b82f6", color: "white",
              padding: "0 4px", fontSize: "10px", borderRadius: "2px", fontWeight: "bold", textTransform: "uppercase"
            }}>{focusTag}</div>
          )}
        </div>
      )}
    </div>
  );
}