import { json, jsonParseLinter } from '@codemirror/lang-json'
import { indentUnit } from '@codemirror/language'
import { linter, lintGutter } from '@codemirror/lint'
import { EditorView } from '@codemirror/view'
import CodeMirror, { Prec } from '@uiw/react-codemirror'
import { useId, useMemo } from 'react'
import { type JsonKind, jsonError, parseStructuredJson } from '../json-validation.ts'
import { Button } from './primitives.tsx'

const studioTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: 'var(--color-base-100)',
      color: 'var(--color-base-content)',
      fontSize: 'var(--text-body)',
    },
    '.cm-scroller': { fontFamily: 'var(--font-mono)' },
    '.cm-gutters': {
      backgroundColor: 'var(--color-base-200)',
      color: 'var(--color-muted)',
      border: 'none',
    },
    '.cm-activeLine, .cm-activeLineGutter': {
      backgroundColor: 'var(--color-base-300)',
    },
    '.cm-cursor': { borderLeftColor: 'var(--color-base-content)' },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground': {
      backgroundColor: 'color-mix(in srgb, var(--color-primary) 30%, transparent)',
    },
  },
  { dark: true },
)
const baseExtensions = [
  json(),
  indentUnit.of('  '),
  linter(jsonParseLinter()),
  lintGutter(),
  EditorView.lineWrapping,
  Prec.high(studioTheme),
]

export function JsonEditor({
  label,
  value,
  onChange,
  kind,
  disabled = false,
  large = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  kind: JsonKind
  disabled?: boolean
  large?: boolean
}) {
  const id = useId()
  // Validation runs on every keystroke; Ajv is only asked again when the text really changed.
  const error = useMemo(() => jsonError(value, kind), [value, kind])
  const extensions = useMemo(
    () => [
      ...baseExtensions,
      EditorView.contentAttributes.of({
        'aria-label': label,
        'aria-describedby': `${id}-help${error ? ` ${id}-error` : ''}`,
        'aria-invalid': String(!!error),
      }),
    ],
    [id, label, error],
  )
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs">{label}</span>
        <Button
          disabled={disabled || !!error}
          onClick={() => onChange(JSON.stringify(parseStructuredJson(value, kind), null, 2))}
        >
          Indenter
        </Button>
      </div>
      <CodeMirror
        value={value}
        onChange={onChange}
        extensions={extensions}
        theme="dark"
        editable={!disabled}
        readOnly={disabled}
        indentWithTab={false}
        minHeight={large ? '22rem' : '8rem'}
        maxHeight={large ? '36rem' : '22rem'}
        className="min-w-0 overflow-hidden rounded-field border border-neutral"
      />
      <p id={`${id}-help`} className="text-xs text-muted">
        JSON · Ctrl/⌘ + Z pour annuler · Tab pour sortir de l’éditeur.
      </p>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-error">
          {error}
        </p>
      )}
    </div>
  )
}
