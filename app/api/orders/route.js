import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Helper function to generate order number
function generateNoOrderan(nama, counter = 1) {
  const now = new Date();
  const tahun = String(now.getFullYear()).slice(-2);
  const bulan = String(now.getMonth() + 1).padStart(2, '0');
  
  // Ambil 2 huruf pertama dari nama
  const words = nama.trim().split(' ');
  let initials = '';
  if (words.length >= 2) {
    initials = (words[0][0] + words[1][0]).toUpperCase();
  } else if (words.length === 1) {
    initials = words[0].substring(0, 2).toUpperCase();
  } else {
    initials = 'XX';
  }
  
  const kode = 'ML'; // Default product code
  const counterStr = String(counter).padStart(2, '0');
  
  return `${tahun}${bulan}${initials}${kode}${counterStr}`;
}

// GET - Fetch all orders
export async function GET() {
  try {
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase configuration missing' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new order
export async function POST(request) {
  try {
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase configuration missing' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await request.json();
    
    // Validasi input
    if (!body.nama || !body.nohp || !body.alamat) {
      return NextResponse.json({ error: 'Data pemesan tidak lengkap' }, { status: 400 });
    }

    if (!body.deadline) {
      return NextResponse.json({ error: 'Deadline harus diisi' }, { status: 400 });
    }

    // Count existing orders this month untuk generate nomor order
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const { count } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth);

    const counter = (count || 0) + 1;
    const no_orderan = generateNoOrderan(body.nama, counter);

    // Hitung total tagihan dan sisa
    const total_tagihan = body.total_tagihan || 0;
    const dp = parseFloat(body.dp) || 0;
    const sisa = total_tagihan - dp;

    // Extract jenis_produk from first item for dashboard display
    let jenis_produk = '';
    if (body.items_data && Array.isArray(body.items_data) && body.items_data.length > 0) {
      jenis_produk = body.items_data[0].kategori || '';
    }

    // Prepare order data
    const orderData = {
      no_orderan,
      nama: body.nama,
      nohp: body.nohp,
      alamat: body.alamat,
      jenis_produk,
      tanggal_pesan: body.tanggal_pesan || new Date().toISOString().split('T')[0],
      deadline: body.deadline,
      dp,
      total_tagihan,
      sisa,
      gambar_mockup: body.gambar_mockup || '',
      items_data: JSON.stringify(body.items_data || []),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Insert order
    const { data: orderResult, error: orderError } = await supabase
      .from('orders')
      .insert([orderData])
      .select();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    const orderId = orderResult[0].id;

    // Insert biaya produksi
    if (body.biaya_produksi && Array.isArray(body.biaya_produksi) && body.biaya_produksi.length > 0) {
      const biayaData = body.biaya_produksi.map(bp => ({
        order_id: orderId,
        kategori: bp.kategori,
        jenis: bp.jenis,
        harga: parseFloat(bp.harga) || 0,
        jumlah: parseFloat(bp.jumlah) || 0,
        total: (parseFloat(bp.harga) || 0) * (parseFloat(bp.jumlah) || 0)
      }));

      const { error: biayaError } = await supabase
        .from('biaya_produksi')
        .insert(biayaData);

      if (biayaError) {
        console.error('Error inserting biaya_produksi:', biayaError);
        // Don't fail the whole operation, just log the error
      }
    }

    return NextResponse.json({
      success: true,
      no_orderan,
      order_id: orderId,
      message: 'Order berhasil dibuat'
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error.message }, { status: 500 });
  }
}