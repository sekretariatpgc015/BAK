import React, { useState, useRef } from 'react';
import { Printer, Plus, Trash2, Camera, PenTool, X } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';

interface Item {
  id: string;
  jenisBarang: string;
  taksiranHarga: string;
}

interface Signatures {
  rw: string;
  keamanan: string;
  rt: string;
  pelapor: string;
}

interface FormData {
  nomor: string;
  bulan: string;
  hari: string;
  tanggal: string;
  namaPelapor: string;
  alamatPelapor: string;
  jenisBarang: string;
  items: Item[];
  waktuKehilangan: string;
  tempatKehilangan: string;
  kronologi: string;
  tanggalSurat: string;
  rt: string;
  namaKetuaRt: string;
  signatures: Signatures;
  photoTkp: string;
}

export default function App() {
  const [formData, setFormData] = useState<FormData>({
    nomor: '',
    bulan: '',
    hari: '',
    tanggal: '',
    namaPelapor: '',
    alamatPelapor: '',
    jenisBarang: '',
    items: [{ id: '1', jenisBarang: '', taksiranHarga: '' }],
    waktuKehilangan: '',
    tempatKehilangan: '',
    kronologi: '',
    tanggalSurat: '',
    rt: '',
    namaKetuaRt: '',
    signatures: { rw: '', keamanan: '', rt: '', pelapor: '' },
    photoTkp: '',
  });

  const [activeSignature, setActiveSignature] = useState<keyof Signatures | null>(null);
  const sigCanvas = useRef<SignatureCanvas>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { id: Date.now().toString(), jenisBarang: '', taksiranHarga: '' }],
    }));
  };

  const updateItem = (id: string, field: keyof Item, value: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const removeItem = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoTkp: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveSignature = () => {
    if (sigCanvas.current && activeSignature) {
      if (!sigCanvas.current.isEmpty()) {
        const dataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
        setFormData(prev => ({
          ...prev,
          signatures: { ...prev.signatures, [activeSignature]: dataUrl }
        }));
      }
      setActiveSignature(null);
    }
  };

  const clearSignature = () => {
    sigCanvas.current?.clear();
  };

  const removeSignature = (key: keyof Signatures) => {
    setFormData(prev => ({
      ...prev,
      signatures: { ...prev.signatures, [key]: '' }
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const totalKerugian = formData.items.reduce((sum, item) => {
    const price = parseFloat(item.taksiranHarga) || 0;
    return sum + price;
  }, 0);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      {/* Form Sidebar */}
      <div className="w-1/3 min-w-[400px] max-w-[500px] bg-white border-r border-gray-200 flex flex-col z-10 shadow-lg no-print">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center sticky top-0">
          <h2 className="text-lg font-semibold text-gray-800">Form Berita Acara</h2>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Printer size={18} />
            <span>Cetak PDF</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider border-b pb-2">Informasi Surat</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Nomor Surat</label>
                <input type="text" name="nomor" value={formData.nomor} onChange={handleChange} placeholder="Contoh: 01" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Bulan (Romawi)</label>
                <input type="text" name="bulan" value={formData.bulan} onChange={handleChange} placeholder="Contoh: IX" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Hari Kejadian</label>
                <input type="text" name="hari" value={formData.hari} onChange={handleChange} placeholder="Senin" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Tanggal Kejadian</label>
                <input type="text" name="tanggal" value={formData.tanggal} onChange={handleChange} placeholder="12 September 2026" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider border-b pb-2">Data Pelapor</h3>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Nama Pelapor</label>
              <input type="text" name="namaPelapor" value={formData.namaPelapor} onChange={handleChange} placeholder="Nama Lengkap" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Alamat Pelapor</label>
              <textarea name="alamatPelapor" value={formData.alamatPelapor} onChange={handleChange} placeholder="Alamat Lengkap" rows={2} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Kategori Barang Hilang</label>
              <input type="text" name="jenisBarang" value={formData.jenisBarang} onChange={handleChange} placeholder="Contoh: Elektronik, Kendaraan" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Daftar Barang</h3>
              <button type="button" onClick={addItem} className="text-sm text-blue-600 flex items-center gap-1 hover:text-blue-800 font-medium">
                <Plus size={16} /> Tambah
              </button>
            </div>
            {formData.items.map((item, index) => (
              <div key={item.id} className="flex gap-2 items-start bg-gray-50 p-3 rounded-md border border-gray-100">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={item.jenisBarang}
                    onChange={(e) => updateItem(item.id, 'jenisBarang', e.target.value)}
                    placeholder="Nama/Jenis Barang"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  />
                  <input
                    type="number"
                    value={item.taksiranHarga}
                    onChange={(e) => updateItem(item.id, 'taksiranHarga', e.target.value)}
                    placeholder="Taksiran Harga (Rp)"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  />
                </div>
                <button type="button" onClick={() => removeItem(item.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-md transition-colors mt-1">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider border-b pb-2">Detail Kejadian</h3>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Waktu Kehilangan</label>
              <input type="text" name="waktuKehilangan" value={formData.waktuKehilangan} onChange={handleChange} placeholder="Contoh: Sekitar pukul 14:00 WIB" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Tempat Kehilangan</label>
              <input type="text" name="tempatKehilangan" value={formData.tempatKehilangan} onChange={handleChange} placeholder="Contoh: Parkiran Blok C1" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Kronologi Kejadian</label>
              <textarea name="kronologi" value={formData.kronologi} onChange={handleChange} placeholder="Ceritakan kronologi singkat kejadian..." rows={4} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider border-b pb-2">Pengesahan</h3>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Tanggal Surat</label>
              <input type="text" name="tanggalSurat" value={formData.tanggalSurat} onChange={handleChange} placeholder="13 September 2026" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">RT</label>
                <input type="text" name="rt" value={formData.rt} onChange={handleChange} placeholder="01" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Nama Ketua RT</label>
                <input type="text" name="namaKetuaRt" value={formData.namaKetuaRt} onChange={handleChange} placeholder="Nama Ketua RT" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider border-b pb-2">Tanda Tangan & Lampiran</h3>
            
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setActiveSignature('rw')} className={`flex items-center justify-center gap-2 p-2 border rounded-md text-sm ${formData.signatures.rw ? 'bg-green-50 border-green-200 text-green-700' : 'hover:bg-gray-50'}`}>
                <PenTool size={16} /> TTD Ketua RW
              </button>
              <button type="button" onClick={() => setActiveSignature('keamanan')} className={`flex items-center justify-center gap-2 p-2 border rounded-md text-sm ${formData.signatures.keamanan ? 'bg-green-50 border-green-200 text-green-700' : 'hover:bg-gray-50'}`}>
                <PenTool size={16} /> TTD Keamanan
              </button>
              <button type="button" onClick={() => setActiveSignature('rt')} className={`flex items-center justify-center gap-2 p-2 border rounded-md text-sm ${formData.signatures.rt ? 'bg-green-50 border-green-200 text-green-700' : 'hover:bg-gray-50'}`}>
                <PenTool size={16} /> TTD Ketua RT
              </button>
              <button type="button" onClick={() => setActiveSignature('pelapor')} className={`flex items-center justify-center gap-2 p-2 border rounded-md text-sm ${formData.signatures.pelapor ? 'bg-green-50 border-green-200 text-green-700' : 'hover:bg-gray-50'}`}>
                <PenTool size={16} /> TTD Pelapor
              </button>
            </div>

            <div className="space-y-1 mt-4">
              <label className="block text-sm font-medium text-gray-700">Lampiran Foto TKP</label>
              <div className="flex items-center gap-2">
                <label className="flex-1 flex items-center justify-center gap-2 p-2 border border-gray-300 border-dashed rounded-md hover:bg-gray-50 cursor-pointer text-sm text-gray-600">
                  <Camera size={18} />
                  <span>Ambil / Pilih Foto</span>
                  <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoUpload} />
                </label>
                {formData.photoTkp && (
                  <button type="button" onClick={() => setFormData(prev => ({ ...prev, photoTkp: '' }))} className="p-2 text-red-500 hover:bg-red-50 border border-red-200 rounded-md">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              {formData.photoTkp && (
                <div className="mt-2 text-xs text-green-600 font-medium">Foto berhasil dilampirkan.</div>
              )}
            </div>
          </div>
          
          <div className="h-10"></div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-y-auto p-8 print:p-0 bg-gray-200 print:bg-white flex flex-col items-center print:items-stretch gap-8 print:gap-0">
        {/* Document Page */}
        <div className="print-area w-[210mm] min-h-[297mm] print:w-full print:min-h-0 bg-white p-[20mm] print:p-0 shadow-xl print:shadow-none text-black font-sans text-[13px] leading-relaxed relative">
          
          {/* Header */}
          <div className="flex justify-between items-center border-b-[3px] border-black pb-3 mb-5">
            <img 
              src="https://cdn.phototourl.com/uploads/2026-03-11-b5793c1c-f869-43f1-97b8-0f49e03463a8.png" 
              alt="Logo RW" 
              className="w-20 h-24 object-contain" 
              referrerPolicy="no-referrer" 
            />
            <div className="text-center flex-1 px-4">
              <h1 className="text-2xl font-bold text-blue-800 tracking-wide">KEAMANAN RW. 015</h1>
              <h2 className="text-lg text-blue-800 font-medium">PERUMAHAN PESONA GADING CIBITUNG</h2>
              <h3 className="text-lg text-blue-800 font-medium">DESA WANAJAYA KECAMATAN CIBITUNG</h3>
            </div>
            <img 
              src="https://cdn.phototourl.com/uploads/2026-03-17-d84ef409-9d97-4efb-a654-878d32c9cad8.png" 
              alt="Logo Keamanan" 
              className="w-20 h-24 object-contain" 
              referrerPolicy="no-referrer" 
            />
          </div>

          {/* Title */}
          <div className="text-center mb-5">
            <h4 className="font-bold text-lg underline tracking-wide">BERITA ACARA KEHILANGAN</h4>
            <p className="mt-1">Nomor : {formData.nomor || '(NO)'} /BAK/KEAMANAN/RW.015/{formData.bulan || '(BULAN)'}/2026</p>
          </div>

          {/* Body */}
          <div className="space-y-3">
            <p>Pada hari ini {formData.hari || '(hari)'} tanggal {formData.tanggal || '(tanggal)'} yang bertanda tangan dibawah ini :</p>
            
            <table className="w-full ml-4">
              <tbody>
                <tr><td className="w-48 align-top py-1">Nama</td><td className="w-4 align-top py-1">:</td><td className="py-1">HENDRA SOMANTRI</td></tr>
                <tr><td className="align-top py-1">Jabatan</td><td className="align-top py-1">:</td><td className="py-1">KOOORDINATOR KEAMANAN RW. 015</td></tr>
                <tr><td className="align-top py-1">Alamat</td><td className="align-top py-1">:</td><td className="py-1">Pesona Gading Cibitung Blok C1 No. 12</td></tr>
              </tbody>
            </table>

            <p className="mt-4">Menerangkan bahwa telah terjadi kehilangan barang milik warga dengan keterangan sebagai berikut :</p>

            <table className="w-full ml-4">
              <tbody>
                <tr><td className="w-48 align-top py-1">Nama pelapor</td><td className="w-4 align-top py-1">:</td><td className="py-1">{formData.namaPelapor || '(nama pelapor)'}</td></tr>
                <tr><td className="align-top py-1">Alamat</td><td className="align-top py-1">:</td><td className="py-1">{formData.alamatPelapor || '(alamat)'}</td></tr>
                <tr><td className="align-top py-1">Jenis barang</td><td className="align-top py-1">:</td><td className="py-1">{formData.jenisBarang || ''}</td></tr>
              </tbody>
            </table>

            {/* Table */}
            <table className="w-full border-collapse border border-blue-300 mt-4 mb-2">
              <thead>
                <tr className="bg-blue-100/50">
                  <th className="border border-blue-300 p-2 w-16 text-center font-bold">NO</th>
                  <th className="border border-blue-300 p-2 text-center font-bold">JENIS BARANG</th>
                  <th className="border border-blue-300 p-2 text-center font-bold w-48">TAKSIRAN HARGA</th>
                </tr>
              </thead>
              <tbody>
                {formData.items.length > 0 ? formData.items.map((item, index) => (
                  <tr key={item.id}>
                    <td className="border border-blue-300 p-1.5 text-center">{index + 1}</td>
                    <td className="border border-blue-300 p-1.5">{item.jenisBarang}</td>
                    <td className="border border-blue-300 p-1.5 text-right">
                      {item.taksiranHarga ? `Rp ${parseFloat(item.taksiranHarga).toLocaleString('id-ID')}` : ''}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td className="border border-blue-300 p-1.5 text-center">&nbsp;</td>
                    <td className="border border-blue-300 p-1.5"></td>
                    <td className="border border-blue-300 p-1.5"></td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="flex font-bold mt-1 mb-4">
              <div className="w-48">TOTAL KERUGIAN</div>
              <div className="w-4">:</div>
              <div>Rp {totalKerugian.toLocaleString('id-ID')}</div>
            </div>

            <table className="w-full ml-4">
              <tbody>
                <tr><td className="w-48 align-top py-1">Waktu kehilangan</td><td className="w-4 align-top py-1">:</td><td className="py-1">{formData.waktuKehilangan}</td></tr>
                <tr><td className="align-top py-1">Tempat kehilangan</td><td className="align-top py-1">:</td><td className="py-1">{formData.tempatKehilangan}</td></tr>
                <tr><td className="align-top py-1">Kronologi kejadian</td><td className="align-top py-1">:</td><td className="py-1 whitespace-pre-wrap">{formData.kronologi || '.....................................................................................................................................................................\n.....................................................................................................................................................................\n.....................................................................................................................................................................\n.....................................................................................................................................................................\n.....................................................................................................................................................................'}</td></tr>
              </tbody>
            </table>

            <p className="mt-5">Demikian Berita Acara Kehilangan ini dibuat dengan sebenar-benarnya untuk dipergunakan sebagaimana mestinya.</p>

            <div className="mt-5">
              <p>Cibitung : {formData.tanggalSurat || '......................................'}</p>
              <p className="mt-1">Mengetahui</p>
            </div>

            {/* Signatures Row */}
            <div className="grid grid-cols-4 gap-2 mt-4 text-center items-end">
              <div className="flex flex-col items-center justify-end h-28">
                <p className="mb-auto">Ketua RW. 015</p>
                {formData.signatures.rw && (
                  <img src={formData.signatures.rw} alt="TTD RW" className="h-14 object-contain mb-1" />
                )}
                <p className="font-bold underline">WARDIYANTO</p>
              </div>
              <div className="flex flex-col items-center justify-end h-28">
                <p className="mb-auto">Koord. Keamanan RW. 015</p>
                {formData.signatures.keamanan && (
                  <img src={formData.signatures.keamanan} alt="TTD Keamanan" className="h-14 object-contain mb-1" />
                )}
                <p className="font-bold underline">HENDRA SOMANTRI</p>
              </div>
              <div className="flex flex-col items-center justify-end h-28">
                <p className="mb-auto">KETUA RT. {formData.rt || '(RT)'}</p>
                {formData.signatures.rt && (
                  <img src={formData.signatures.rt} alt="TTD RT" className="h-14 object-contain mb-1" />
                )}
                <p className="font-bold underline">({formData.namaKetuaRt || 'KETUA RT'})</p>
              </div>
              <div className="flex flex-col items-center justify-end h-28">
                <p className="mb-auto">Pelapor</p>
                {formData.signatures.pelapor && (
                  <img src={formData.signatures.pelapor} alt="TTD Pelapor" className="h-14 object-contain mb-1" />
                )}
                <p className="font-bold underline">({formData.namaPelapor || 'PELAPOR'})</p>
              </div>
            </div>
          </div>
        </div>

        {/* Photo Attachment Page (if exists) */}
        {formData.photoTkp && (
          <div className="print-area w-[210mm] min-h-[297mm] print:w-full print:min-h-0 bg-white p-[20mm] print:p-0 shadow-xl print:shadow-none text-black font-sans text-[13px] leading-relaxed break-before-page print:break-before-page flex flex-col items-center">
            <h4 className="font-bold text-xl text-center mb-8 underline tracking-wide uppercase">Lampiran Foto TKP</h4>
            <div className="w-full flex-1 flex items-center justify-center border-2 border-dashed border-gray-300 p-4 rounded-lg">
              <img src={formData.photoTkp} alt="Foto TKP" className="max-w-full max-h-[200mm] object-contain shadow-md" />
            </div>
          </div>
        )}
      </div>

      {/* Signature Modal */}
      {activeSignature && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold text-gray-800">
                Tanda Tangan {
                  activeSignature === 'rw' ? 'Ketua RW. 015' :
                  activeSignature === 'keamanan' ? 'Koord. Keamanan' :
                  activeSignature === 'rt' ? 'Ketua RT' : 'Pelapor'
                }
              </h3>
              <button onClick={() => setActiveSignature(null)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 bg-gray-100 flex justify-center">
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                <SignatureCanvas 
                  ref={sigCanvas} 
                  canvasProps={{ width: 350, height: 200, className: 'signature-canvas' }} 
                />
              </div>
            </div>
            <div className="p-4 border-t flex justify-between bg-gray-50">
              <button onClick={clearSignature} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-md">
                Hapus
              </button>
              <div className="space-x-2">
                <button onClick={() => setActiveSignature(null)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-md">
                  Batal
                </button>
                <button onClick={saveSignature} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
