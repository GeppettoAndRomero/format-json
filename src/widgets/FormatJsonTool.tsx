/**
 * FormatJsonTool — the tool's only non-frozen widget.
 *
 * Two input methods (§15.3): paste/type into the textarea, or choose a
 * `.json` file (the frozen GlobalDropZone also lets a file be dropped
 * anywhere on the page, or pasted from the clipboard as a file — both funnel
 * into the same `loadFile`).
 *
 * Three user-selectable, mutually exclusive modes along the one "format" axis
 * (issue #69 — pretty-print and minify are the same whitespace operation;
 * validation is inherent to parsing):
 *   - format:   pretty-print with a chosen indent (2 / 4 spaces / tab)
 *   - minify:   strip all insignificant whitespace
 *   - validate: parse only, report OK or the error location
 *
 * All three run through `jsonEngine.ts`'s native `JSON.parse`/`JSON.stringify`
 * — no external JSON library, no Web Worker (parsing/stringifying plain JSON
 * text is fast, synchronous, main-thread work; there is no WASM/codec step to
 * offload here, unlike the image tools this was stamped from).
 *
 * The result is recomputed from (input, mode, indent) on every render — the
 * same "always re-derive, never cache stale state" pattern as the sibling
 * text tools (rename-images' plan preview, edit-markdown-table's serialized
 * Markdown) — so the output, byte sizes, and error location are always in
 * sync with what's on screen.
 */
import { useState, useEffect, useRef, useCallback, useMemo } from 'preact/hooks';
import { AppCard } from './AppCard';
import { AppButton } from './AppButton';
import { ErrorToast } from './ErrorToast';
import { isAcceptedJsonFile } from '@/utils/fileValidation';
import {
  formatJson,
  minifyJson,
  validateJson,
  byteSize,
  pointerSnippet,
  deriveOutputName,
  type IndentOption,
  type JsonResult,
} from '@/utils/jsonEngine';
import { ui } from '@/i18n/ui';

type Mode = 'format' | 'minify' | 'validate';

interface ErrorToastItem {
  id: string;
  message: string;
}

interface FormatJsonToolProps {
  locale?: string;
}

export function FormatJsonTool({ locale = 'en' }: FormatJsonToolProps) {
  const t = (ui as any)[locale] ?? ui.en;

  const [input, setInput] = useState('');
  const [fileName, setFileName] = useState<string | undefined>(undefined);
  const [mode, setMode] = useState<Mode>('format');
  const [indent, setIndent] = useState<IndentOption>('2');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const [errorToasts, setErrorToasts] = useState<ErrorToastItem[]>([]);

  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showErrorToast = useCallback((message: string) => {
    const id = `error-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    setErrorToasts((prev) => [...prev, { id, message }]);
  }, []);
  const removeErrorToast = useCallback((id: string) => {
    setErrorToasts((prev) => prev.filter((e) => e.id !== id));
  }, []);

  useEffect(() => {
    (globalThis as Record<string, unknown>).__toolReady = true;
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const isEmpty = input.trim() === '';

  // Recomputed on every relevant change, not stored in state — output can
  // never drift from (input, mode, indent).
  const result = useMemo<JsonResult<string | true> | null>(() => {
    if (isEmpty) return null;
    if (mode === 'format') return formatJson(input, indent);
    if (mode === 'minify') return minifyJson(input);
    return validateJson(input);
  }, [input, mode, indent, isEmpty]);

  const outputText = result && result.ok && typeof result.value === 'string' ? result.value : null;
  const inputBytes = byteSize(input);
  const outputBytes = outputText !== null ? byteSize(outputText) : null;

  // ---- load a file (file picker, or a drop/paste funneled through GlobalDropZone) ----

  const loadFile = useCallback(
    async (file: File) => {
      if (!isAcceptedJsonFile(file)) {
        showErrorToast(t.errUnsupportedFile.replace('{name}', file.name));
        return;
      }
      const text = await file.text();
      setInput(text);
      setFileName(file.name);
    },
    [showErrorToast, t]
  );

  useEffect(() => {
    const handler = (e: Event) => {
      const files = (e as CustomEvent<File[]>).detail ?? [];
      const file = files[0];
      if (file) void loadFile(file);
      window.dispatchEvent(new CustomEvent('filesProcessed'));
    };
    window.addEventListener('filesDropped', handler);
    return () => window.removeEventListener('filesDropped', handler);
  }, [loadFile]);

  const handleFileInputChange = (e: Event) => {
    const target = e.currentTarget as HTMLInputElement;
    const file = target.files?.[0];
    if (file) void loadFile(file);
    target.value = '';
  };

  const handleClear = () => {
    setInput('');
    setFileName(undefined);
  };

  // ---- copy / download (format & minify only — validate has no transformed output) ----

  const handleCopy = async () => {
    if (outputText === null) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('error');
    }
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopyStatus('idle'), 2000);
  };

  const handleDownload = () => {
    if (outputText === null || (mode !== 'format' && mode !== 'minify')) return;
    const blob = new Blob([outputText], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = deriveOutputName(mode, fileName);
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const errorLocationText = (line: number | undefined, column: number | undefined, message: string) =>
    line != null && column != null
      ? t.errorLocation.replace('{line}', String(line)).replace('{column}', String(column)).replace('{message}', message)
      : message;

  const sizeDeltaText = (before: number, after: number): string => {
    if (before === 0) return '';
    const pct = Math.round((1 - after / before) * 100);
    if (pct > 0) return t.sizeSmaller.replace('{percent}', String(pct));
    if (pct < 0) return t.sizeLarger.replace('{percent}', String(Math.abs(pct)));
    return t.sizeSame;
  };

  // Renders the output panel's body. A plain function (not inline JSX) so the
  // `!isEmpty` guard lets TypeScript narrow `result` from `JsonResult | null`
  // to `JsonResult`, and `r.ok` narrows the ok:true/ok:false union normally —
  // neither narrowing survives through optional chaining (`result?.ok`).
  const renderOutput = () => {
    if (isEmpty) return <p style="color: var(--color-subtle); font-size: var(--fs-2);">{t.outputEmptyHint}</p>;
    const r = result as NonNullable<typeof result>;

    if (!r.ok) {
      return (
        <div role="alert" class="fj-error" data-testid="json-error">
          <p style="margin: 0; color: var(--color-danger); font-weight: 500;">{t.errorHeading}</p>
          <p style="margin: var(--space-1) 0 0 0;">{errorLocationText(r.error.line, r.error.column, r.error.message)}</p>
          {r.error.line != null && r.error.column != null && (
            <pre class="fj-pointer" data-testid="json-error-pointer">
              {pointerSnippet(input, r.error.line, r.error.column)}
            </pre>
          )}
        </div>
      );
    }

    if (mode === 'validate') {
      return (
        <p role="status" class="fj-valid" data-testid="validate-status">
          <span aria-hidden="true">✓</span> {t.validOk}
        </p>
      );
    }

    return (
      <>
        <pre class="fj-output" data-testid="json-output">
          {outputText}
        </pre>
        <div style="display: flex; gap: var(--space-3); flex-wrap: wrap; margin-top: var(--space-2); font-size: var(--fs-1); color: var(--color-subtle);" class="num">
          <span data-testid="output-size">{t.sizeOutput.replace('{bytes}', (outputBytes ?? 0).toLocaleString())}</span>
          {outputBytes !== null && <span>{sizeDeltaText(inputBytes, outputBytes)}</span>}
        </div>
        <div style="display: flex; gap: var(--space-2); margin-top: var(--space-3); flex-wrap: wrap;">
          <button id="copy-action" type="button" class="app-button app-button--primary" onClick={handleCopy}>
            {copyStatus === 'copied' ? t.copied : t.copyOutput}
          </button>
          <button id="download-action" type="button" class="app-button app-button--secondary" onClick={handleDownload}>
            {t.downloadJson}
          </button>
        </div>
        {copyStatus === 'error' && (
          <p role="alert" style="color: var(--color-danger); font-size: var(--fs-2); margin: var(--space-2) 0 0 0;">
            {t.copyFailed}
          </p>
        )}
      </>
    );
  };

  return (
    <div>
      <AppCard>
        <div style="margin-bottom: var(--space-4);">
          <h2 style="margin: 0 0 var(--space-1) 0; font-size: var(--fs-4); font-weight: 600;">{t.inputHeading}</h2>
          <p style="margin: 0; font-size: var(--fs-2); color: var(--color-subtle);">{t.inputSubtitle}</p>
        </div>

        <textarea
          id="json-input"
          class="app-field__textarea"
          style="width: 100%; min-height: 220px; font-family: ui-monospace, monospace; font-size: var(--fs-2); box-sizing: border-box;"
          placeholder={t.inputPlaceholder}
          value={input}
          spellcheck={false}
          onInput={(e) => setInput((e.target as HTMLTextAreaElement).value)}
        />

        <div style="display: flex; justify-content: space-between; align-items: center; gap: var(--space-3); flex-wrap: wrap; margin-top: var(--space-2);">
          <span class="num" data-testid="input-size" style="font-size: var(--fs-1); color: var(--color-subtle);">
            {t.sizeInput.replace('{bytes}', inputBytes.toLocaleString())}
          </span>
          {fileName && (
            <span style="font-size: var(--fs-1); color: var(--color-subtle);" title={fileName}>
              {t.loadedFileLabel.replace('{name}', fileName)}
            </span>
          )}
        </div>

        <div style="display: flex; gap: var(--space-2); margin-top: var(--space-3); flex-wrap: wrap;">
          <button
            id="choose-file-action"
            type="button"
            class="app-button app-button--secondary"
            onClick={() => document.getElementById('file-input')?.click()}
          >
            {t.chooseFileButton}
          </button>
          <input
            id="file-input"
            type="file"
            accept=".json,application/json,text/plain,text/json"
            onChange={handleFileInputChange}
            style="display: none;"
          />
          {input && (
            <AppButton variant="ghost" onClick={handleClear}>
              {t.clearInput}
            </AppButton>
          )}
        </div>
      </AppCard>

      <AppCard className="mt-6">
        <fieldset style="border: none; padding: 0; margin: 0 0 var(--space-4) 0;">
          <legend style="font-size: var(--fs-2); font-weight: 500; margin-bottom: var(--space-2); padding: 0;">
            {t.modeLabel}
          </legend>
          <div style="display: flex; gap: var(--space-4); flex-wrap: wrap;">
            {(['format', 'minify', 'validate'] as Mode[]).map((m) => (
              <label key={m} style="display: flex; align-items: center; gap: var(--space-2); cursor: pointer; font-size: var(--fs-2);">
                <input
                  type="radio"
                  id={`mode-${m}`}
                  name="format-json-mode"
                  value={m}
                  checked={mode === m}
                  onChange={() => setMode(m)}
                />
                {t[`mode${m.charAt(0).toUpperCase()}${m.slice(1)}` as 'modeFormat' | 'modeMinify' | 'modeValidate']}
              </label>
            ))}
          </div>
        </fieldset>

        {mode === 'format' && (
          <div>
            <label class="app-field__label" for="indent-select" style="display: block; margin-bottom: var(--space-2);">
              {t.indentLabel}
            </label>
            <select
              id="indent-select"
              class="app-field__select"
              value={indent}
              onChange={(e) => setIndent((e.target as HTMLSelectElement).value as IndentOption)}
            >
              <option value="2">{t.indent2}</option>
              <option value="4">{t.indent4}</option>
              <option value="tab">{t.indentTab}</option>
            </select>
          </div>
        )}
      </AppCard>

      <AppCard className="mt-6">
        <div style="margin-bottom: var(--space-3);">
          <h2 style="margin: 0 0 var(--space-1) 0; font-size: var(--fs-4); font-weight: 600;">{t.outputHeading}</h2>
          <p style="margin: 0; font-size: var(--fs-2); color: var(--color-subtle);">
            {mode === 'format' ? t.outputHintFormat : mode === 'minify' ? t.outputHintMinify : t.outputHintValidate}
          </p>
        </div>

        {renderOutput()}
      </AppCard>

      {errorToasts.length > 0 && (
        <div className="error-toast-container" aria-label={t.notificationsAria}>
          {errorToasts.map((toast) => (
            <ErrorToast key={toast.id} id={toast.id} message={toast.message} onClose={removeErrorToast} locale={locale} />
          ))}
        </div>
      )}

      <style>{`
        .fj-output {
          white-space: pre;
          overflow-x: auto;
          max-height: 480px;
          overflow-y: auto;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: var(--space-3);
          font-family: ui-monospace, monospace;
          font-size: var(--fs-2);
          margin: 0;
        }
        .fj-error {
          padding: var(--space-3);
          background: color-mix(in srgb, var(--color-danger) 8%, var(--color-bg));
          border: 1px solid var(--color-danger);
          border-radius: var(--radius-sm);
          font-size: var(--fs-2);
        }
        .fj-pointer {
          white-space: pre;
          overflow-x: auto;
          margin: var(--space-2) 0 0 0;
          padding: var(--space-2) var(--space-3);
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xs);
          font-family: ui-monospace, monospace;
          font-size: var(--fs-2);
          color: var(--color-danger);
        }
        .fj-valid {
          margin: 0;
          padding: var(--space-3);
          background: color-mix(in srgb, var(--color-success) 10%, var(--color-bg));
          border: 1px solid var(--color-success);
          border-radius: var(--radius-sm);
          color: var(--color-success);
          font-weight: 500;
          font-size: var(--fs-3);
        }
      `}</style>
    </div>
  );
}
