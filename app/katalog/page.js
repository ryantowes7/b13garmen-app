'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { formatRupiah } from '@/lib/helpers';
import {
  Package,
  Shirt,
  Printer,
  Wrench,
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  X,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function KatalogPage() {
  const [activeTab, setActiveTab] = useState('produk');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentItem, setCurrentItem] = useState(null);

  // Data states
  const [produkList, setProdukList] = useState([]);
  const [kainList, setKainList] = useState([]);
  const [percetakanList, setPercetakanList] = useState([]);
  const [jasaList, setJasaList] = useState([]);

  // Form states
  const [formData, setFormData] = useState({
    // Produk
    produk: '',
    jenis: '',
    model: '',
    tipe_desain: '',
    // Kain
    nama_toko: '',
    warna: '',
    harga: '',
    // Percetakan
    tipe_ukuran: '',
    // Jasa
    jasa: '',
    tipe: ''
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  async function fetchAllData() {
    setLoading(true);
    try {
      await Promise.all([
        fetchProduk(),
        fetchKain(),
        fetchPercetakan(),
        fetchJasa()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchProduk() {
    const { data, error } = await supabase
      .from('produk')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching produk:', error);
    } else {
      setProdukList(data || []);
    }
  }

  async function fetchKain() {
    const { data, error } = await supabase
      .from('bahan')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching kain:', error);
    } else {
      setKainList(data || []);
    }
  }

  async function fetchPercetakan() {
    const { data, error } = await supabase
      .from('percetakan')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching percetakan:', error);
    } else {
      setPercetakanList(data || []);
    }
  }

  async function fetchJasa() {
    const { data, error } = await supabase
      .from('jasa')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching jasa:', error);
    } else {
      setJasaList(data || []);
    }
  }

  function openAddModal(type) {
    setModalMode('add');
    setCurrentItem(null);
    setFormData({
      produk: '',
      jenis: '',
      model: '',
      tipe_desain: '',
      nama_toko: '',
      warna: '',
      harga: '',
      tipe_ukuran: '',
      jasa: '',
      tipe: ''
    });
    setIsModalOpen(true);
  }

  function openEditModal(item, type) {
    setModalMode('edit');
    setCurrentItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (modalMode === 'add') {
        await handleAdd();
      } else {
        await handleUpdate();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal menyimpan data: ' + error.message);
    }
  }

  async function handleAdd() {
    let tableName = '';
    let dataToInsert = {};

    if (activeTab === 'produk') {
      tableName = 'produk';
      const id = generateIdProduk();
      dataToInsert = {
        id,
        produk: formData.produk,
        jenis: formData.jenis,
        model: formData.model,
        tipe_desain: formData.tipe_desain || null
      };
    } else if (activeTab === 'kain') {
      tableName = 'bahan';
      const id = generateIdKain();
      dataToInsert = {
        id,
        nama_toko: formData.nama_toko,
        jenis: formData.jenis,
        warna: formData.warna,
        harga: parseFloat(formData.harga)
      };
    } else if (activeTab === 'percetakan') {
      tableName = 'percetakan';
      const id = generateIdPercetakan();
      dataToInsert = {
        id,
        jenis: formData.jenis,
        model: formData.model,
        tipe_ukuran: formData.tipe_ukuran,
        harga: parseFloat(formData.harga)
      };
    } else if (activeTab === 'jasa') {
      tableName = 'jasa';
      const id = generateIdJasa();
      dataToInsert = {
        id,
        jasa: formData.jasa,
        jenis: formData.jenis,
        tipe: formData.tipe,
        harga: parseFloat(formData.harga)
      };
    }

    const { error } = await supabase
      .from(tableName)
      .insert([dataToInsert]);

    if (error) throw error;

    setIsModalOpen(false);
    await fetchAllData();
    alert('Data berhasil ditambahkan!');
  }

  async function handleUpdate() {
    let tableName = '';
    let dataToUpdate = {};

    if (activeTab === 'produk') {
      tableName = 'produk';
      dataToUpdate = {
        produk: formData.produk,
        jenis: formData.jenis,
        model: formData.model,
        tipe_desain: formData.tipe_desain || null
      };
    } else if (activeTab === 'kain') {
      tableName = 'bahan';
      dataToUpdate = {
        nama_toko: formData.nama_toko,
        jenis: formData.jenis,
        warna: formData.warna,
        harga: parseFloat(formData.harga)
      };
    } else if (activeTab === 'percetakan') {
      tableName = 'percetakan';
      dataToUpdate = {
        jenis: formData.jenis,
        model: formData.model,
        tipe_ukuran: formData.tipe_ukuran,
        harga: parseFloat(formData.harga)
      };
    } else if (activeTab === 'jasa') {
      tableName = 'jasa';
      dataToUpdate = {
        jasa: formData.jasa,
        jenis: formData.jenis,
        tipe: formData.tipe,
        harga: parseFloat(formData.harga)
      };
    }

    const { error } = await supabase
      .from(tableName)
      .update(dataToUpdate)
      .eq('id', currentItem.id);

    if (error) throw error;

    setIsModalOpen(false);
    await fetchAllData();
    alert('Data berhasil diupdate!');
  }

  async function handleDelete(item, type) {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;

    let tableName = '';
    if (type === 'produk') tableName = 'produk';
    else if (type === 'kain') tableName = 'bahan';
    else if (type === 'percetakan') tableName = 'percetakan';
    else if (type === 'jasa') tableName = 'jasa';

    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', item.id);

    if (error) {
      alert('Gagal menghapus data: ' + error.message);
    } else {
      alert('Data berhasil dihapus!');
      await fetchAllData();
    }
  }

  // Generate ID functions
  function generateIdProduk() {
    let id = '';
    if (formData.produk) id += formData.produk[0].toUpperCase();
    if (formData.jenis) id += formData.jenis[0].toUpperCase();
    if (formData.model) id += formData.model[0].toUpperCase();
    if (formData.tipe_desain) id += formData.tipe_desain[0].toUpperCase();
    id += Date.now().toString().slice(-4);
    return id;
  }

  function generateIdKain() {
    let id = '';
    if (formData.nama_toko) id += formData.nama_toko[0].toUpperCase();
    if (formData.jenis) id += formData.jenis[0].toUpperCase();
    if (formData.warna) id += formData.warna[0].toUpperCase();
    id += Date.now().toString().slice(-4);
    return id;
  }

  function generateIdPercetakan() {
    let id = '';
    if (formData.jenis) id += formData.jenis[0].toUpperCase();
    if (formData.model) id += formData.model[0].toUpperCase();
    if (formData.tipe_ukuran) id += formData.tipe_ukuran[0].toUpperCase();
    id += Date.now().toString().slice(-4);
    return id;
  }

  function generateIdJasa() {
    let id = '';
    if (formData.jasa) id += formData.jasa[0].toUpperCase();
    if (formData.jenis) id += formData.jenis[0].toUpperCase();
    if (formData.tipe) id += formData.tipe[0].toUpperCase();
    id += Date.now().toString().slice(-4);
    return id;
  }

  // Filter data
  function filterData(list) {
    if (!searchQuery) return list;
    const query = searchQuery.toLowerCase();
    return list.filter(item => {
      return Object.values(item).some(val => 
        String(val).toLowerCase().includes(query)
      );
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin h-16 w-16 text-sky-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600 font-medium">Memuat data katalog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-sky-500 to-sky-600 rounded-lg">
            <Package className="text-white" size={28} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Katalog Bahan</h1>
        </div>
        <p className="text-gray-600">Kelola katalog produk, kain, percetakan, dan jasa</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-gray-200 px-6 pt-6">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl">
              <TabsTrigger value="produk" className="flex items-center gap-2">
                <Package size={18} />
                <span>Produk</span>
              </TabsTrigger>
              <TabsTrigger value="kain" className="flex items-center gap-2">
                <Shirt size={18} />
                <span>Kain</span>
              </TabsTrigger>
              <TabsTrigger value="percetakan" className="flex items-center gap-2">
                <Printer size={18} />
                <span>Percetakan</span>
              </TabsTrigger>
              <TabsTrigger value="jasa" className="flex items-center gap-2">
                <Wrench size={18} />
                <span>Jasa</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Search & Add Button */}
          <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Cari data..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              onClick={() => openAddModal(activeTab)}
              className="bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-700 hover:to-sky-600"
            >
              <Plus size={18} className="mr-2" />
              Tambah Data
            </Button>
          </div>

          {/* Tab Content - Produk */}
          <TabsContent value="produk" className="p-6">
            <ProdukTable
              data={filterData(produkList)}
              onEdit={(item) => openEditModal(item, 'produk')}
              onDelete={(item) => handleDelete(item, 'produk')}
            />
          </TabsContent>

          {/* Tab Content - Kain */}
          <TabsContent value="kain" className="p-6">
            <KainTable
              data={filterData(kainList)}
              onEdit={(item) => openEditModal(item, 'kain')}
              onDelete={(item) => handleDelete(item, 'kain')}
            />
          </TabsContent>

          {/* Tab Content - Percetakan */}
          <TabsContent value="percetakan" className="p-6">
            <PercetakanTable
              data={filterData(percetakanList)}
              onEdit={(item) => openEditModal(item, 'percetakan')}
              onDelete={(item) => handleDelete(item, 'percetakan')}
            />
          </TabsContent>

          {/* Tab Content - Jasa */}
          <TabsContent value="jasa" className="p-6">
            <JasaTable
              data={filterData(jasaList)}
              onEdit={(item) => openEditModal(item, 'jasa')}
              onDelete={(item) => handleDelete(item, 'jasa')}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal Form */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {modalMode === 'add' ? 'Tambah' : 'Edit'} {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </DialogTitle>
            <DialogDescription>
              Isi form di bawah untuk {modalMode === 'add' ? 'menambahkan' : 'mengupdate'} data
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'produk' && (
              <>
                <div>
                  <Label htmlFor="produk">Produk *</Label>
                  <Input
                    id="produk"
                    value={formData.produk}
                    onChange={(e) => setFormData({ ...formData, produk: e.target.value })}
                    required
                    placeholder="Contoh: Kaos"
                  />
                </div>
                <div>
                  <Label htmlFor="jenis">Jenis *</Label>
                  <Input
                    id="jenis"
                    value={formData.jenis}
                    onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}
                    required
                    placeholder="Contoh: Oblong"
                  />
                </div>
                <div>
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    required
                    placeholder="Contoh: Lengan Pendek"
                  />
                </div>
                <div>
                  <Label htmlFor="tipe_desain">Tipe/Desain</Label>
                  <Input
                    id="tipe_desain"
                    value={formData.tipe_desain}
                    onChange={(e) => setFormData({ ...formData, tipe_desain: e.target.value })}
                    placeholder="Opsional"
                  />
                </div>
              </>
            )}

            {activeTab === 'kain' && (
              <>
                <div>
                  <Label htmlFor="nama_toko">Nama Toko *</Label>
                  <Input
                    id="nama_toko"
                    value={formData.nama_toko}
                    onChange={(e) => setFormData({ ...formData, nama_toko: e.target.value })}
                    required
                    placeholder="Contoh: Toko Kain Sejahtera"
                  />
                </div>
                <div>
                  <Label htmlFor="jenis">Jenis Kain *</Label>
                  <Input
                    id="jenis"
                    value={formData.jenis}
                    onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}
                    required
                    placeholder="Contoh: Cotton Combed"
                  />
                </div>
                <div>
                  <Label htmlFor="warna">Warna *</Label>
                  <Input
                    id="warna"
                    value={formData.warna}
                    onChange={(e) => setFormData({ ...formData, warna: e.target.value })}
                    required
                    placeholder="Contoh: Hitam"
                  />
                </div>
                <div>
                  <Label htmlFor="harga">Harga per kg (Rp) *</Label>
                  <Input
                    id="harga"
                    type="number"
                    value={formData.harga}
                    onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
                    required
                    min="0"
                    step="100"
                    placeholder="Contoh: 50000"
                  />
                </div>
              </>
            )}

            {activeTab === 'percetakan' && (
              <>
                <div>
                  <Label htmlFor="jenis">Jenis *</Label>
                  <Input
                    id="jenis"
                    value={formData.jenis}
                    onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}
                    required
                    placeholder="Contoh: Sablon"
                  />
                </div>
                <div>
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    required
                    placeholder="Contoh: DTF"
                  />
                </div>
                <div>
                  <Label htmlFor="tipe_ukuran">Tipe/Ukuran *</Label>
                  <Input
                    id="tipe_ukuran"
                    value={formData.tipe_ukuran}
                    onChange={(e) => setFormData({ ...formData, tipe_ukuran: e.target.value })}
                    required
                    placeholder="Contoh: A4"
                  />
                </div>
                <div>
                  <Label htmlFor="harga">Harga (Rp) *</Label>
                  <Input
                    id="harga"
                    type="number"
                    value={formData.harga}
                    onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
                    required
                    min="0"
                    step="100"
                    placeholder="Contoh: 15000"
                  />
                </div>
              </>
            )}

            {activeTab === 'jasa' && (
              <>
                <div>
                  <Label htmlFor="jasa">Jasa *</Label>
                  <Input
                    id="jasa"
                    value={formData.jasa}
                    onChange={(e) => setFormData({ ...formData, jasa: e.target.value })}
                    required
                    placeholder="Contoh: Jahit"
                  />
                </div>
                <div>
                  <Label htmlFor="jenis">Jenis *</Label>
                  <Input
                    id="jenis"
                    value={formData.jenis}
                    onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}
                    required
                    placeholder="Contoh: Obras"
                  />
                </div>
                <div>
                  <Label htmlFor="tipe">Tipe *</Label>
                  <Input
                    id="tipe"
                    value={formData.tipe}
                    onChange={(e) => setFormData({ ...formData, tipe: e.target.value })}
                    required
                    placeholder="Contoh: Standar"
                  />
                </div>
                <div>
                  <Label htmlFor="harga">Harga (Rp) *</Label>
                  <Input
                    id="harga"
                    type="number"
                    value={formData.harga}
                    onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
                    required
                    min="0"
                    step="100"
                    placeholder="Contoh: 5000"
                  />
                </div>
              </>
            )}

            <div className="flex gap-2 justify-end pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                <X size={18} className="mr-2" />
                Batal
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-700 hover:to-sky-600">
                <Save size={18} className="mr-2" />
                Simpan
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Table Components
function ProdukTable({ data, onEdit, onDelete }) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <Package size={64} className="mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium">Belum ada data produk</p>
        <p className="text-sm mt-2">Klik tombol "Tambah Data" untuk menambahkan</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Produk</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Jenis</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Model</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tipe/Desain</th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900 font-mono">{item.id}</td>
              <td className="px-6 py-4 text-sm text-gray-900 font-medium">{item.produk}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{item.jenis}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{item.model}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{item.tipe_desain || '-'}</td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(item)}
                    className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                  >
                    <Edit size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(item)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function KainTable({ data, onEdit, onDelete }) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <Shirt size={64} className="mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium">Belum ada data kain</p>
        <p className="text-sm mt-2">Klik tombol "Tambah Data" untuk menambahkan</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Toko</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Jenis Kain</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Warna</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Harga/kg</th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900 font-mono">{item.id}</td>
              <td className="px-6 py-4 text-sm text-gray-900 font-medium">{item.nama_toko}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{item.jenis}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{item.warna}</td>
              <td className="px-6 py-4 text-sm text-gray-900 text-right font-semibold">
                {formatRupiah(item.harga)}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(item)}
                    className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                  >
                    <Edit size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(item)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PercetakanTable({ data, onEdit, onDelete }) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <Printer size={64} className="mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium">Belum ada data percetakan</p>
        <p className="text-sm mt-2">Klik tombol "Tambah Data" untuk menambahkan</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Jenis</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Model</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tipe/Ukuran</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Harga</th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900 font-mono">{item.id}</td>
              <td className="px-6 py-4 text-sm text-gray-900 font-medium">{item.jenis}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{item.model}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{item.tipe_ukuran}</td>
              <td className="px-6 py-4 text-sm text-gray-900 text-right font-semibold">
                {formatRupiah(item.harga)}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(item)}
                    className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                  >
                    <Edit size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(item)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function JasaTable({ data, onEdit, onDelete }) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <Wrench size={64} className="mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium">Belum ada data jasa</p>
        <p className="text-sm mt-2">Klik tombol "Tambah Data" untuk menambahkan</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Jasa</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Jenis</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tipe</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Harga</th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900 font-mono">{item.id}</td>
              <td className="px-6 py-4 text-sm text-gray-900 font-medium">{item.jasa}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{item.jenis}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{item.tipe}</td>
              <td className="px-6 py-4 text-sm text-gray-900 text-right font-semibold">
                {formatRupiah(item.harga)}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(item)}
                    className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                  >
                    <Edit size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(item)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}