import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET() {
  const target = path.resolve(process.cwd(), '..', 'output', 'sol_event.log');
  try {
    const raw = await readFile(target, 'utf-8');
    const lines = raw.split('\n').filter(Boolean);
    return NextResponse.json({ lines }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ lines: ['[SOL.AgentBus] Waiting for simulator logs...'] }, { headers: { 'Cache-Control': 'no-store' } });
  }
}
