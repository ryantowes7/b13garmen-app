import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Helper functions
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

function jsonResponse(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: corsHeaders(),
  });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() });
}

// GET requests
export async function GET(request) {
  const { pathname, searchParams } = new URL(request.url);
  const path = pathname.replace('/api', '');

  try {
    // Katalog - Get all products
    if (path === '/katalog/produk') {
      const { data, error } = await supabase
        .from('produk')
        .select('*')
        .order('produk', { ascending: true });
      
      if (error) throw error;
      return jsonResponse(data);
    }

    // Katalog - Get all bahan (kain)
    if (path === '/katalog/bahan') {
      const { data, error } = await supabase
        .from('bahan')
        .select('*')
        .order('nama_toko', { ascending: true });
      
      if (error) throw error;
      return jsonResponse(data);
    }

    // Katalog - Get all percetakan
    if (path === '/katalog/percetakan') {
      const { data, error } = await supabase
        .from('percetakan')
        .select('*')
        .order('jenis', { ascending: true });
      
      if (error) throw error;
      return jsonResponse(data);
    }

    // Katalog - Get all jasa
    if (path === '/katalog/jasa') {
      const { data, error } = await supabase
        .from('jasa')
        .select('*')
        .order('jasa', { ascending: true });
      
      if (error) throw error;
      return jsonResponse(data);
    }

    // Cascading dropdowns untuk produk
    if (path.startsWith('/katalog/produk/kategori/')) {
      const kategori = path.split('/').pop();
      const { data, error } = await supabase
        .from('produk')
        .select('jenis')
        .eq('produk', kategori)
        .order('jenis');
      
      if (error) throw error;
      const uniqueJenis = [...new Set(data.map(item => item.jenis))];
      return jsonResponse(uniqueJenis);
    }

    if (path.startsWith('/katalog/produk/jenis/')) {
      const jenis = decodeURIComponent(path.split('/').pop());
      const { data, error } = await supabase
        .from('produk')
        .select('model')
        .eq('jenis', jenis)
        .order('model');
      
      if (error) throw error;
      const uniqueModel = [...new Set(data.map(item => item.model))];
      return jsonResponse(uniqueModel);
    }

    if (path.startsWith('/katalog/produk/model/')) {
      const model = decodeURIComponent(path.split('/').pop());
      const { data, error } = await supabase
        .from('produk')
        .select('tipe_desain')
        .eq('model', model)
        .order('tipe_desain');
      
      if (error) throw error;
      const uniqueTipe = [...new Set(data.map(item => item.tipe_desain).filter(Boolean))];
      return jsonResponse(uniqueTipe);
    }

    // Cascading dropdowns untuk bahan
    if (path === '/katalog/bahan/toko') {
      const { data, error } = await supabase
        .from('bahan')
        .select('nama_toko')
        .order('nama_toko');
      
      if (error) throw error;
      const uniqueToko = [...new Set(data.map(item => item.nama_toko))];
      return jsonResponse(uniqueToko);
    }

    if (path.startsWith('/katalog/bahan/toko/')) {
      const toko = decodeURIComponent(path.split('/').pop());
      const { data, error } = await supabase
        .from('bahan')
        .select('jenis')
        .eq('nama_toko', toko)
        .order('jenis');
      
      if (error) throw error;
      const uniqueJenis = [...new Set(data.map(item => item.jenis))];
      return jsonResponse(uniqueJenis);
    }

    if (path.startsWith('/katalog/bahan/warna/')) {
      const parts = path.split('/');
      const jenis = decodeURIComponent(parts[parts.length - 1]);
      const toko = decodeURIComponent(parts[parts.length - 2]);
      
      const { data, error } = await supabase
        .from('bahan')
        .select('warna, harga')
        .eq('nama_toko', toko)
        .eq('jenis', jenis)
        .order('warna');
      
      if (error) throw error;
      return jsonResponse(data);
    }

    // Cascading dropdowns untuk percetakan
    if (path === '/katalog/percetakan/jenis') {
      const { data, error } = await supabase
        .from('percetakan')
        .select('jenis')
        .order('jenis');
      
      if (error) throw error;
      const uniqueJenis = [...new Set(data.map(item => item.jenis))];
      return jsonResponse(uniqueJenis);
    }

    if (path.startsWith('/katalog/percetakan/jenis/')) {
      const jenis = decodeURIComponent(path.split('/').pop());
      const { data, error } = await supabase
        .from('percetakan')
        .select('model')
        .eq('jenis', jenis)
        .order('model');
      
      if (error) throw error;
      const uniqueModel = [...new Set(data.map(item => item.model))];
      return jsonResponse(uniqueModel);
    }

    if (path.startsWith('/katalog/percetakan/tipe/')) {
      const parts = path.split('/');
      const model = decodeURIComponent(parts[parts.length - 1]);
      const jenis = decodeURIComponent(parts[parts.length - 2]);
      
      const { data, error } = await supabase
        .from('percetakan')
        .select('tipe_ukuran, harga')
        .eq('jenis', jenis)
        .eq('model', model)
        .order('tipe_ukuran');
      
      if (error) throw error;
      return jsonResponse(data);
    }

    // Cascading dropdowns untuk jasa
    if (path === '/katalog/jasa/list') {
      const { data, error } = await supabase
        .from('jasa')
        .select('jasa')
        .order('jasa');
      
      if (error) throw error;
      const uniqueJasa = [...new Set(data.map(item => item.jasa))];
      return jsonResponse(uniqueJasa);
    }

    if (path.startsWith('/katalog/jasa/jenis/')) {
      const jasaName = decodeURIComponent(path.split('/').pop());
      const { data, error } = await supabase
        .from('jasa')
        .select('jenis')
        .eq('jasa', jasaName)
        .order('jenis');
      
      if (error) throw error;
      const uniqueJenis = [...new Set(data.map(item => item.jenis))];
      return jsonResponse(uniqueJenis);
    }

    if (path.startsWith('/katalog/jasa/tipe/')) {
      const parts = path.split('/');
      const jenis = decodeURIComponent(parts[parts.length - 1]);
      const jasaName = decodeURIComponent(parts[parts.length - 2]);
      
      const { data, error } = await supabase
        .from('jasa')
        .select('tipe, harga')
        .eq('jasa', jasaName)
        .eq('jenis', jenis)
        .order('tipe');
      
      if (error) throw error;
      return jsonResponse(data);
    }

    // Orders
    if (path === '/orders') {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return jsonResponse(data);
    }

    if (path.startsWith('/orders/')) {
      const id = path.split('/').pop();
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Get biaya produksi
      const { data: biayaData } = await supabase
        .from('biaya_produksi')
        .select('*')
        .eq('order_id', id);
      
      return jsonResponse({ ...data, biaya_produksi: biayaData || [] });
    }

    // Stats for dashboard
    if (path === '/stats') {
      const { count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });
      
      const { data: recentOrders } = await supabase
        .from('orders')
        .select('total_tagihan, dp')
        .order('created_at', { ascending: false })
        .limit(10);
      
      const totalRevenue = recentOrders?.reduce((sum, order) => sum + (parseFloat(order.total_tagihan) || 0), 0) || 0;
      const totalDP = recentOrders?.reduce((sum, order) => sum + (parseFloat(order.dp) || 0), 0) || 0;
      
      return jsonResponse({
        totalOrders: totalOrders || 0,
        totalRevenue,
        totalDP,
        pendingPayment: totalRevenue - totalDP
      });
    }

    return jsonResponse({ error: 'Endpoint not found' }, 404);

  } catch (error) {
    console.error('API Error:', error);
    return jsonResponse({ error: error.message }, 500);
  }
}

// POST requests
export async function POST(request) {
  const { pathname } = new URL(request.url);
  const path = pathname.replace('/api', '');

  try {
    const body = await request.json();

    // Create order
    if (path === '/orders') {
      // Generate no_orderan
      const now = new Date();
      const tahun = now.getFullYear().toString().slice(-2);
      const bulan = (now.getMonth() + 1).toString().padStart(2, '0');
      const initials = body.nama.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase().padEnd(2, 'X');
      
      const { count } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .like('no_orderan', `${tahun}${bulan}%`);
      
      const counter = ((count || 0) + 1).toString().padStart(2, '0');
      const no_orderan = `${tahun}${bulan}${initials}ML${counter}`;

      const orderData = {
        no_orderan,
        nama: body.nama,
        nohp: body.nohp,
        alamat: body.alamat,
        tanggal_pesan: body.tanggal_pesan,
        deadline: body.deadline,
        dp: parseFloat(body.dp) || 0,
        total_tagihan: parseFloat(body.total_tagihan) || 0,
        sisa: parseFloat(body.total_tagihan) - parseFloat(body.dp) || 0,
        items_data: body.items_data || [],
        gambar_mockup: body.gambar_mockup || ''
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert biaya produksi
      if (body.biaya_produksi && body.biaya_produksi.length > 0) {
        const biayaData = body.biaya_produksi.map(bp => ({
          order_id: order.id,
          kategori: bp.kategori,
          jenis: bp.jenis,
          harga: parseFloat(bp.harga) || 0,
          jumlah: parseFloat(bp.jumlah) || 0,
          total: (parseFloat(bp.harga) || 0) * (parseFloat(bp.jumlah) || 0)
        }));

        const { error: biayaError } = await supabase
          .from('biaya_produksi')
          .insert(biayaData);

        if (biayaError) throw biayaError;
      }

      return jsonResponse({ success: true, data: order, no_orderan });
    }

    // Add bahan
    if (path === '/katalog/bahan') {
      const { data, error } = await supabase
        .from('bahan')
        .insert([body])
        .select()
        .single();
      
      if (error) throw error;
      return jsonResponse({ success: true, data });
    }

    // Add produk
    if (path === '/katalog/produk') {
      const { data, error } = await supabase
        .from('produk')
        .insert([body])
        .select()
        .single();
      
      if (error) throw error;
      return jsonResponse({ success: true, data });
    }

    // Add percetakan
    if (path === '/katalog/percetakan') {
      const { data, error } = await supabase
        .from('percetakan')
        .insert([body])
        .select()
        .single();
      
      if (error) throw error;
      return jsonResponse({ success: true, data });
    }

    // Add jasa
    if (path === '/katalog/jasa') {
      const { data, error } = await supabase
        .from('jasa')
        .insert([body])
        .select()
        .single();
      
      if (error) throw error;
      return jsonResponse({ success: true, data });
    }

    return jsonResponse({ error: 'Endpoint not found' }, 404);

  } catch (error) {
    console.error('API POST Error:', error);
    return jsonResponse({ error: error.message }, 500);
  }
}

// PUT requests
export async function PUT(request) {
  const { pathname } = new URL(request.url);
  const path = pathname.replace('/api', '');

  try {
    const body = await request.json();

    // Update order
    if (path.startsWith('/orders/')) {
      const id = path.split('/').pop();
      
      const { data, error } = await supabase
        .from('orders')
        .update(body)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return jsonResponse({ success: true, data });
    }

    // Update bahan
    if (path.startsWith('/katalog/bahan/')) {
      const id = path.split('/').pop();
      
      const { data, error } = await supabase
        .from('bahan')
        .update(body)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return jsonResponse({ success: true, data });
    }

    return jsonResponse({ error: 'Endpoint not found' }, 404);

  } catch (error) {
    console.error('API PUT Error:', error);
    return jsonResponse({ error: error.message }, 500);
  }
}

// DELETE requests
export async function DELETE(request) {
  const { pathname } = new URL(request.url);
  const path = pathname.replace('/api', '');

  try {
    // Delete order
    if (path.startsWith('/orders/')) {
      const id = path.split('/').pop();
      
      // Delete biaya produksi first
      await supabase
        .from('biaya_produksi')
        .delete()
        .eq('order_id', id);
      
      // Delete order
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return jsonResponse({ success: true });
    }

    // Delete bahan
    if (path.startsWith('/katalog/bahan/')) {
      const id = path.split('/').pop();
      
      const { error } = await supabase
        .from('bahan')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return jsonResponse({ success: true });
    }

    return jsonResponse({ error: 'Endpoint not found' }, 404);

  } catch (error) {
    console.error('API DELETE Error:', error);
    return jsonResponse({ error: error.message }, 500);
  }
}