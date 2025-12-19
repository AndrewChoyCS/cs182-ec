
import { NextResponse } from 'next/server';
// Direct import ensures Vercel bundles this file at build time.
// This means the data is "static" per deployment.
// To update data, you must commit the new JSON file and re-deploy.
import data from '@/data/edapi_interactions.json';

export async function GET() {
    return NextResponse.json(data);
}
