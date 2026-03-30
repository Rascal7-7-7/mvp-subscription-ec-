import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Product } from '@/lib/types';

export async function GET() {
  try {
    const products = await query<Product>('SELECT * FROM products ORDER BY id');
    return NextResponse.json(products);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
