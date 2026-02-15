import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { defaultState } from '@/lib/defaultState';

export async function GET() {
  const target = path.resolve(process.cwd(), '..', 'output', 'ghost_state.json');
  try {
    const raw = await readFile(target, 'utf-8');
    return NextResponse.json(JSON.parse(raw), { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json(defaultState, { headers: { 'Cache-Control': 'no-store' } });
  }
}
