/** 
 * @module app/page
 * Landing Page – Virtual Campus TNUT
 *
 * Owned by AI-A.  Displays university branding, a registration form
 * (name + MSSV + outfit selection) and navigates to /play on submit.
 */
import { useState, useCallback, useId } from 'react'
import type { Outfit } from '@/src/contracts'
import {
  BRAND,
  UNIVERSITY,
  STORAGE_KEY,
  DEFAULT_OUTFIT,
  SHIRT_PRESETS,
  PANTS_PRESETS,
} from '@/src/campusConfig'
// ─── Types ───────────────────────────────────────────────────────────────────
interface StoredUser {
  id: string
  name: string
  mssvMasked: string
  outfit: Outfit
}
// ─── Helpers ─────────────────────────────────────────────────────────────────
/** Mask MSSV: keep first 4 chars, replace rest with '*' */
function maskMSSV(mssv: string): string {
  if (mssv.length <= 4) return mssv
  return mssv.slice(0, 4) + '*'.repeat(mssv.length - 4)
}
/** Simple unique ID generator for session */
function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}
//─── Sub-components ───────────────────────────────────────────────────────────
interface ColourSwatchProps {
  presets: ReadonlyArray<{ label: string; value: string }>
  selected: string
  onSelect: (value: string) => void
  label: string
}
function ColourSwatch({ presets, selected, onSelect, label }: ColourSwatchProps) {
  const id = useId()
  return (
    <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
      <legend
        id={id}
        style={{
          fontSize: '0.8rem',
          fontWeight: 600,
          color: BRAND.text,
          marginBottom: 8,
          opacity: 0.75,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        {label}
      </legend>
      <div
        role="radiogroup"
        aria-labelledby={id}
        style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}
      >
        {presets.map((p) => (
          <button
            key={p.value}
            type="button"
            title={p.label}
            aria-label={p.label}
            aria-pressed={selected === p.value}
            onClick={() => onSelect(p.value)}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: selected === p.value
                ? `3px solid ${BRAND.primary}`
                : `2px solid ${BRAND.border}`,
              background: p.value,
              cursor: 'pointer',
              outline: selected === p.value ? `2px solid ${BRAND.primary}` : 'none',
              outlineOffset: 2,
              transition: 'transform 0.15s',
              transform: selected === p.value ? 'scale(1.18)' : 'scale(1)',
            }}
          />
        ))}
      </div>
    </fieldset>
  )
}
//─── Main Page ────────────────────────────────────────────────────────────────
export function LandingPage() {
  const [name, setName] = useState('')
  const [mssv, setMssv] = useState('')
  const [shirt, setShirt] = useState<string>(DEFAULT_OUTFIT.shirt)
  const [pants, setPants] = useState<string>(DEFAULT_OUTFIT.pants)
  const [errors, setErrors] = useState<{ name?: string; mssv?: string }>({})
  const [submitting, setSubmitting] = useState(false)
  const validate = useCallback(() => {
    const errs: { name?: string; mssv?: string } = {}
    if (!name.trim()) errs.name = 'Vui lòng nhập họ và tên.'
    if (!mssv.trim()) {
      errs.mssv = 'Vui lòng nhập MSSV.'
    } else if (mssv.trim().length !== 13) {
      errs.mssv = `MSSV phải đúng 13 ký tự (hiện có ${mssv.trim().length} ký tự).`
    }
    return errs
  }, [name, mssv])
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const errs = validate()
      if (Object.keys(errs).length > 0) {
        setErrors(errs)
        return
      }
      setSubmitting(true)
      const mssvClean = mssv.trim()
      const user: StoredUser = {
        id: generateId(),
        name: name.trim(),
        mssvMasked: maskMSSV(mssvClean),
        outfit: { shirt, pants, skin: DEFAULT_OUTFIT.skin },
      }
       localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      // Navigate to play using hash routing
      window.location.hash = '#/play'
    },
    [name, mssv, shirt, pants, validate],
  )
  // ── Avatar preview ────────────────────────────────────────────────────────
  const avatarPreview = (
    <div
      aria-hidden
      style={{
        position: 'relative',
        width: 72,
        height: 120,
        margin: '0 auto',
        userSelect: 'none',
      }}
    >
      {/* Head */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 36, height: 36, borderRadius: 4,
        background: DEFAULT_OUTFIT.skin,
        boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.15)',
      }} />
      {/* Torso */}
      <div style={{
        position: 'absolute', top: 38, left: '50%', transform: 'translateX(-50%)',
        width: 48, height: 44, borderRadius: 4,
        background: shirt,
        boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.15)',
      }} />
      {/* Left arm */}
      <div style={{
        position: 'absolute', top: 38, left: 2,
        width: 16, height: 38, borderRadius: 3,
        background: shirt,
      }} />
      {/* Right arm */}
      <div style={{
        position: 'absolute', top: 38, right: 2,
        width: 16, height: 38, borderRadius: 3,
        background: shirt,
        }} />
      {/* Left leg */}
      <div style={{
        position: 'absolute', top: 84, left: '50%', marginLeft: -20,
        width: 18, height: 36, borderRadius: 3,
        background: pants,
      }} />
      {/* Right leg */}
      <div style={{
        position: 'absolute', top: 84, left: '50%', marginLeft: 2,
        width: 18, height: 36, borderRadius: 3,
        background: pants,
      }} />
    </div>
  )
  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: '100vh',
      minWidth: '100vw',
      background: BRAND.cream,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      overflowY: 'auto',
      overflowX: 'hidden',
    }}>
      {/* ── Header / Hero ─────────────────────────────────────────────── */}
      <header style={{
        background: BRAND.primary,
        color: BRAND.white,
        padding: '32px 24px 40px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background decoration */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, opacity: 0.07,
          backgroundImage: 'radial-gradient(circle at 20% 50%, #fff 0%, transparent 50%), radial-gradient(circle at 80% 20%, #fff 0%, transparent 40%)',
        }} />
        {/* Logo / Emblem placeholder */}
        <div style={{
          width: 80, height: 80,
          borderRadius: '50%',
          border: '3px solid rgba(255,255,255,0.6)',
          background: 'rgba(255,255,255,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
          fontSize: 32,
        }}>
          🏛️
        </div>
         <p style={{
          fontSize: '0.78rem',
          fontWeight: 500,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          opacity: 0.8,
          marginBottom: 6,
        }}>
          {UNIVERSITY.faculty}
        </p>
        <h1 style={{
          fontSize: 'clamp(1.1rem, 3vw, 1.6rem)',
          fontWeight: 700,
          lineHeight: 1.3,
          margin: '0 0 8px',
          letterSpacing: '-0.01em',
        }}>
          {UNIVERSITY.fullName}
        </h1>
        <p style={{
          fontSize: '0.9rem',
          opacity: 0.75,
          marginTop: 4,
        }}>
          Virtual Campus 3D — Khám phá không gian học tập
        </p>
      </header>
      {/* ── Main content ──────────────────────────────────────────────── */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '32px 16px 48px',
      }}>
        <div style={{
          background: BRAND.white,
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(0,85,165,0.10), 0 1px 4px rgba(0,0,0,0.06)',
          padding: '32px 28px',
          width: '100%',
          maxWidth: 440,
        }}>
          <h2 style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            color: BRAND.primary,
            marginBottom: 24,
            textAlign: 'center',
          }}>
            Đăng nhập vào Campus 3D
          </h2>
          <form onSubmit={handleSubmit} noValidate>
            {/* ── Name field ──────────────────────────────────── */}
            <div style={{ marginBottom: 20 }}>
              <label
                htmlFor="field-name"
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: BRAND.text,
                  marginBottom: 6,
                }}
              >
                Họ và tên <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                id="field-name"
                type="text"
                 autoComplete="name"
                placeholder="Nguyễn Văn A"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
                }}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: `1.5px solid ${errors.name ? '#DC2626' : BRAND.border}`,
                  fontSize: '0.95rem',
                  color: BRAND.text,
                  background: errors.name ? '#FEF2F2' : BRAND.cream,
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => { e.target.style.borderColor = BRAND.primary }}
                onBlur={(e) => { e.target.style.borderColor = errors.name ? '#DC2626' : BRAND.border }}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'err-name' : undefined}
              />
              {errors.name && (
                <p id="err-name" role="alert" style={{ color: '#DC2626', fontSize: '0.78rem', marginTop: 4 }}>
                  {errors.name}
                </p>
              )}
            </div>
            {/* ── MSSV field ──────────────────────────────────── */}
            <div style={{ marginBottom: 24 }}>
              <label
                htmlFor="field-mssv"
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: BRAND.text,
                  marginBottom: 6,
                }}
                >
                Mã số sinh viên (MSSV) <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                id="field-mssv"
                type="text"
                autoComplete="off"
                placeholder="K245520201001"
                maxLength={13}
                value={mssv}
                onChange={(e) => {
                  setMssv(e.target.value)
                  if (errors.mssv) setErrors((prev) => ({ ...prev, mssv: undefined }))
                }}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: `1.5px solid ${errors.mssv ? '#DC2626' : BRAND.border}`,
                  fontSize: '0.95rem',
                  fontFamily: 'monospace',
                  letterSpacing: '0.08em',
                  color: BRAND.text,
                  background: errors.mssv ? '#FEF2F2' : BRAND.cream,
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => { e.target.style.borderColor = BRAND.primary }}
                onBlur={(e) => { e.target.style.borderColor = errors.mssv ? '#DC2626' : BRAND.border }}
                aria-invalid={!!errors.mssv}
                aria-describedby={errors.mssv ? 'err-mssv' : 'hint-mssv'}
              />
              {errors.mssv ? (
                <p id="err-mssv" role="alert" style={{ color: '#DC2626', fontSize: '0.78rem', marginTop: 4 }}>
                  {errors.mssv}
                  </p>
              ) : (
                <p id="hint-mssv" style={{ color: '#6B7280', fontSize: '0.78rem', marginTop: 4 }}>
                  13 ký tự — ví dụ: K245520201001
                </p>
              )}
            </div>
            {/* ── Outfit section ───────────────────────────────── */}
            <div style={{
              background: BRAND.cream,
              borderRadius: 12,
              padding: '16px',
              marginBottom: 28,
              border: `1px solid ${BRAND.border}`,
            }}>
              <h3 style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: BRAND.primary,
                marginBottom: 16,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}>
                Trang phục avatar
              </h3>
              {/* Avatar preview */}
              <div style={{ marginBottom: 16 }}>
                {avatarPreview}
              </div>
              {/* Shirt colour */}
              <div style={{ marginBottom: 14 }}>
                <ColourSwatch
                  label="Màu áo"
                  presets={SHIRT_PRESETS}
                  selected={shirt}
                  onSelect={setShirt}
                />
              </div>
              {/* Pants colour */}
              <ColourSwatch
                label="Màu quần"
                presets={PANTS_PRESETS}
                selected={pants}
                onSelect={setPants}
              />
            </div>
             {/* ── Submit ───────────────────────────────────────── */}
            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: 10,
                border: 'none',
                background: submitting ? '#94A3B8' : BRAND.primary,
                color: BRAND.white,
                fontSize: '1rem',
                fontWeight: 700,
                cursor: submitting ? 'not-allowed' : 'pointer',
                letterSpacing: '0.02em',
                boxShadow: submitting ? 'none' : '0 4px 14px rgba(0,85,165,0.35)',
                transition: 'background 0.2s, box-shadow 0.2s, transform 0.1s',
              }}
              onMouseEnter={(e) => {
                if (!submitting) {
                  (e.target as HTMLButtonElement).style.background = '#0046A0'
                }
              }}
              onMouseLeave={(e) => {
                if (!submitting) {
                  (e.target as HTMLButtonElement).style.background = BRAND.primary
                }
              }}
            >
              🚀 Vào campus 3D
            </button>
          </form>
        </div>
      </main>
      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer style={{
        textAlign: 'center',
        padding: '16px',
        fontSize: '0.75rem',
        color: '#9CA3AF',
        borderTop: `1px solid ${BRAND.border}`,
        background: BRAND.white,
      }}>
        © {new Date().getFullYear()} {UNIVERSITY.abbrev} — Virtual Campus 3D
      </footer>
    </div>
  )
}
/**
 * @module app
 * Root application component – controlled by AI-A (not AI-C).
 * This stub exists so the project builds end-to-end for CI.
 * Root application component – controlled by AI-A.
 *
 * AI-C: DO NOT MODIFY THIS FILE.
 * Uses hash-based routing (no extra package required):
 *   #/      → LandingPage  (default)
 *   #/play  → PlayPage
 */
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense, useState } from 'react'
import { Avatar }    from '@/src/avatar'
import { NameLabel } from '@/src/avatar'
import type { PlayerState } from '@/src/contracts'
import { useState, useEffect } from 'react'
import { LandingPage } from '@/app/page'
import { PlayPage } from '@/app/play/page'
/** Demo player used only for local development / build verification */
const DEMO_PLAYER: PlayerState = {
  id:          'demo-001',
  name:        'Nguyễn Văn A',
  mssvMasked:  'K245*********',
  x: 0, y: 0, z: 0,
  rotY:        0,
  moving:      false,
  outfit: {
    shirt: '#3B82F6',   // blue
    pants: '#1E293B',   // dark slate
    skin:  '#FDBCB4',
  },
/** Derive route from window.location.hash */
function getRoute(): string {
  const hash = window.location.hash
  if (hash.startsWith('#/play')) return '/play'
  return '/'
}
export default function App() {
  const [moving, setMoving] = useState(false)
  const [route, setRoute] = useState<string>(getRoute)
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Toggle button for walk demo */}
      <button
        onClick={() => setMoving((m) => !m)}
        style={{
          position: 'absolute', top: 16, left: 16, zIndex: 10,
          padding: '8px 16px', borderRadius: 6, border: 'none',
          background: '#3B82F6', color: '#fff', cursor: 'pointer',
          fontWeight: 600,
        }}
      >
        {moving ? '🚶 Walking' : '🧍 Standing'} (click to toggle)
      </button>
  useEffect(() => {
    const onHashChange = () => setRoute(getRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])
  <Canvas
        camera={{ position: [0, 1.6, 5], fov: 60 }}
        shadows
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
        <Suspense fallback={null}>
          <group
            position={[DEMO_PLAYER.x, DEMO_PLAYER.y, DEMO_PLAYER.z]}
            rotation={[0, DEMO_PLAYER.rotY, 0]}
          >
            <Avatar
              outfit={DEMO_PLAYER.outfit}
              moving={moving}
            />
            <NameLabel
              name={DEMO_PLAYER.name}
              mssvMasked={DEMO_PLAYER.mssvMasked}
            />
          </group>
        </Suspense>
        {/* Ground grid */}
        <gridHelper args={[20, 20, '#444', '#222']} />
        <OrbitControls />
      </Canvas>
    </div>
  )
  if (route === '/play') return <PlayPage />
  return <LandingPage />
}
