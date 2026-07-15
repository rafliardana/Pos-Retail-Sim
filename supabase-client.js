// ============================================================
// supabase-client.js — RetailSIM Shared Supabase Client
// Include file ini di setiap halaman HTML SETELAH script Supabase CDN
// ============================================================

const SUPABASE_URL = 'https://iylcydvmjebuifzlbvtz.supabase.co';
// GANTI NILAI INI: Supabase Dashboard → Settings → API → anon/public key
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5bGN5ZHZtamVidWlmemxidnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwOTI0ODEsImV4cCI6MjA5OTY2ODQ4MX0.GE5fx7cFrH1MSZ9g4B2MTN4iR8aZKnpA3ssU0527Y3g';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- AUTH (hardcoded, cocokkan dengan tabel pengguna) ---
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
}

// --- BARANG ---
async function getBarang(search = '') {
    let q = db.from('barang').select('*').order('nama');
    if (search) q = q.ilike('nama', `%${search}%`);
    const { data, error } = await q;
    if (error) throw error;
    return data;
}

async function createBarang(payload) {
    const { data, error } = await db.from('barang').insert(payload).select().single();
    if (error) throw error;
    return data;
}

async function updateBarang(id, payload) {
    const { data, error } = await db.from('barang').update(payload).eq('id', id).select().single();
    if (error) throw error;
    return data;
}

async function deleteBarang(id) {
    const { error } = await db.from('barang').delete().eq('id', id);
    if (error) throw error;
}

async function getLowStock() {
    const { data, error } = await db.from('barang').select('*').filter('stok', 'lte', db.from('barang').select('"minStok"'));
    // ponytail: Supabase tidak support cross-column filter langsung, pakai RPC atau filter di client
    const { data: all, error: err } = await db.from('barang').select('*');
    if (err) throw err;
    return all.filter(b => b.stok <= b.minStok);
}

// --- TRANSAKSI ---
async function getTransaksi(limit = 20) {
    const { data, error } = await db
        .from('transaksi')
        .select(`*, pengguna(nama, role), detail_transaksi(*, barang(nama))`)
        .order('createdAt', { ascending: false })
        .limit(limit);
    if (error) throw error;
    return data;
}

// Buat transaksi atomic via PostgreSQL RPC
async function createTransaksi(penggunaId, items) {
    const { data, error } = await db.rpc('buat_transaksi', {
        p_pengguna_id: penggunaId,
        p_items: items // [{barangId: int, jumlah: int}]
    });
    if (error) throw error;
    return data;
}

// --- MUTASI STOK ---
async function getMutasiStok(limit = 30) {
    const { data, error } = await db
        .from('mutasi_stok')
        .select(`*, barang(nama), pengguna(nama)`)
        .order('createdAt', { ascending: false })
        .limit(limit);
    if (error) throw error;
    return data;
}

async function addMutasiStok(barangId, penggunaId, tipe, jumlah, keterangan = '') {
    // Insert mutasi log
    const { error: me } = await db.from('mutasi_stok').insert({
        barangId, penggunaId, tipe, jumlah, keterangan
    });
    if (me) throw me;

    // Update stok barang
    const { data: barang, error: be } = await db.from('barang').select('stok').eq('id', barangId).single();
    if (be) throw be;
    const newStok = tipe === 'masuk' ? barang.stok + jumlah : barang.stok - jumlah;
    if (newStok < 0) throw new Error('Stok tidak cukup!');

    const { error: ue } = await db.from('barang').update({ stok: newStok }).eq('id', barangId);
    if (ue) throw ue;
}

// --- PENGGUNA ---
async function getPengguna() {
    const { data, error } = await db
        .from('pengguna')
        .select('id, username, nama, role, status, "createdAt"');
    if (error) throw error;
    return data;
}

// --- UTIL ---
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(amount);
}

function showToast(message, type = 'info') {
    const colors = { success: '#27AE60', error: '#E74C3C', info: '#3498DB', warning: '#F39C12' };
    const el = document.createElement('div');
    el.style.cssText = `position:fixed;top:1rem;right:1rem;z-index:9999;padding:.75rem 1.25rem;border-radius:10px;color:white;font-weight:600;background:${colors[type] || colors.info};box-shadow:0 4px 12px rgba(0,0,0,.2);max-width:320px;transition:opacity .3s`;
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, 3000);
}
