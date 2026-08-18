// ==UserScript==
// @name         Mac Keyboard as Windows Keyboard
// @namespace    https://github.com/lattaamy828-bit/project
// @version      1.0.0
// @description  Trên macOS, remap Ctrl+<phim> sang hoạt động như Cmd+<phim> kiểu Windows (Ctrl+C copy, Ctrl+V paste, Ctrl+Z undo, ...)
// @author       lattaamy828
// @match        *://*/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function () {
  'use strict';

  // Chỉ cần chạy trên macOS - mục đích là biến Ctrl thành Cmd.
  const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform) ||
    (navigator.userAgentData && navigator.userAgentData.platform === 'macOS');
  if (!isMac) return;

  const STORAGE_KEY = 'mac2win-enabled';
  let enabled = typeof GM_getValue === 'function' ? GM_getValue(STORAGE_KEY, true) : true;
  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand(enabled ? 'Tắt Ctrl→Cmd remap' : 'Bật Ctrl→Cmd remap', () => {
      if (typeof GM_setValue === 'function') GM_setValue(STORAGE_KEY, !enabled);
      location.reload();
    });
  }
  if (!enabled) return;

  // Danh sách phím Ctrl+<phim> sẽ được remap. Thêm/bớt phím tại đây để tùy chỉnh.
  const REMAPPED_KEYS = new Set(['c', 'v', 'x', 'a', 'z', 'y', 's', 'f', 'b', 'i', 'u', 'k']);

  // execCommand xử lý sẵn các thao tác chỉnh sửa văn bản chuẩn, hoạt động
  // trên cả input/textarea/contenteditable lẫn text đã select ngoài trang.
  const EXEC_COMMANDS = { c: 'copy', x: 'cut', a: 'selectAll', b: 'bold', i: 'italic', u: 'underline' };

  function isEditable(el) {
    return !!el && (el.isContentEditable || el.tagName === 'INPUT' || el.tagName === 'TEXTAREA');
  }

  async function handlePaste(target) {
    try {
      const text = await navigator.clipboard.readText();
      if (isEditable(target)) {
        document.execCommand('insertText', false, text);
      }
    } catch (err) {
      // Không có quyền đọc clipboard (site chưa focus, http, hoặc user chưa cho phép)
      // -> thử execCommand('paste') như phương án dự phòng.
      document.execCommand('paste');
    }
  }

  function dispatchAsCmd(e) {
    const clone = new KeyboardEvent(e.type, {
      key: e.key,
      code: e.code,
      keyCode: e.keyCode,
      which: e.which,
      bubbles: true,
      cancelable: true,
      composed: true,
      metaKey: true,
      ctrlKey: false,
      shiftKey: e.shiftKey,
      altKey: e.altKey,
      repeat: e.repeat,
    });
    e.target.dispatchEvent(clone);
  }

  document.addEventListener('keydown', (e) => {
    if (e.isComposing || !e.ctrlKey || e.metaKey) return;

    const key = e.key.toLowerCase();
    if (!REMAPPED_KEYS.has(key)) return;

    e.preventDefault();
    e.stopImmediatePropagation();

    if (key === 'v') {
      handlePaste(e.target);
    } else if (key === 'z') {
      document.execCommand(e.shiftKey ? 'redo' : 'undo');
    } else if (key === 'y') {
      document.execCommand('redo');
    } else if (EXEC_COMMANDS[key]) {
      document.execCommand(EXEC_COMMANDS[key]);
    }

    // Với những trang/app tự bắt phím Cmd trong JS (Google Docs, Notion,
    // VS Code Web, Figma...) thay vì dùng execCommand, bắn thêm sự kiện
    // Cmd+<phim> giả để handler của họ vẫn nhận được.
    if (key !== 'v') dispatchAsCmd(e);
  }, true);
})();
