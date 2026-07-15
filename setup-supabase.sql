-- ============================================================
-- RetailSIM - Supabase Setup Script
-- Jalankan ini di Supabase Dashboard → SQL Editor
-- ============================================================

-- ===================== ENUM TYPES ========================
DO $$ BEGIN
  CREATE TYPE role_enum AS ENUM ('kasir', 'gudang', 'admin', 'owner');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE status_user_enum AS ENUM ('aktif', 'nonaktif');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE tipe_mutasi_enum AS ENUM ('masuk', 'keluar');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE status_transaksi_enum AS ENUM ('pending', 'selesai', 'dibatalkan');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ===================== TABLES ============================

CREATE TABLE IF NOT EXISTS pengguna (
  id          SERIAL PRIMARY KEY,
  username    TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,
  nama        TEXT NOT NULL,
  role        role_enum NOT NULL,
  status      status_user_enum NOT NULL DEFAULT 'aktif',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS barang (
  id          SERIAL PRIMARY KEY,
  nama        TEXT NOT NULL,
  harga       INTEGER NOT NULL,
  stok        INTEGER NOT NULL DEFAULT 0,
  "minStok"   INTEGER NOT NULL DEFAULT 5,
  kategori    TEXT NOT NULL,
  barcode     TEXT UNIQUE,
  gambar      TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transaksi (
  id           SERIAL PRIMARY KEY,
  kode         TEXT UNIQUE NOT NULL,
  "penggunaId" INTEGER NOT NULL REFERENCES pengguna(id),
  "totalHarga" INTEGER NOT NULL,
  ppn          INTEGER NOT NULL,
  "grandTotal" INTEGER NOT NULL,
  status       status_transaksi_enum NOT NULL DEFAULT 'pending',
  "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS detail_transaksi (
  id            SERIAL PRIMARY KEY,
  "transaksiId" INTEGER NOT NULL REFERENCES transaksi(id) ON DELETE CASCADE,
  "barangId"    INTEGER NOT NULL REFERENCES barang(id),
  jumlah        INTEGER NOT NULL,
  "hargaSatuan" INTEGER NOT NULL,
  subtotal      INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS mutasi_stok (
  id           SERIAL PRIMARY KEY,
  "barangId"   INTEGER NOT NULL REFERENCES barang(id),
  "penggunaId" INTEGER NOT NULL REFERENCES pengguna(id),
  tipe         tipe_mutasi_enum NOT NULL,
  jumlah       INTEGER NOT NULL,
  keterangan   TEXT,
  "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===================== UPDATED AT TRIGGER ================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW."updatedAt" = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS barang_updated_at ON barang;
CREATE TRIGGER barang_updated_at
  BEFORE UPDATE ON barang
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ===================== SEED DATA =========================

-- Users (password plaintext disimpan — ini sistem simulasi/demo)
INSERT INTO pengguna (username, password, nama, role) VALUES
  ('devi',  'password', 'Devi',  'kasir'),
  ('rafli', 'password', 'Rafli', 'gudang'),
  ('okta',  'password', 'Okta',  'admin'),
  ('alif',  'password', 'Alif',  'owner')
ON CONFLICT (username) DO NOTHING;

-- Produk awal
INSERT INTO barang (nama, harga, stok, "minStok", kategori, gambar) VALUES
  ('Indomie Goreng',   3500,  150, 20, 'Makanan',    'resources/indomie-goreng.jpg'),
  ('Teh Botol Sosro',  5000,  200, 30, 'Minuman',    'resources/teh-sosro.jpg'),
  ('Sabun Lifebuoy',   8000,   80, 10, 'Kebersihan', 'resources/sabun-lifebuoy.jpg'),
  ('Shampoo Sunsilk',  15000,  60, 10, 'Kebersihan', null),
  ('Beras 5kg',       45000,   40,  5, 'Sembako',    'resources/beras-5-kg.jpg'),
  ('Minyak Goreng 1L',18000,   90, 15, 'Sembako',    'resources/minyak-bimoli.jpg'),
  ('Gula 1kg',        12000,  120, 20, 'Sembako',    null),
  ('Roti Tawar',      15000,   30, 10, 'Makanan',    null),
  ('Susu UHT',         8000,  100, 20, 'Minuman',    null),
  ('Detergen Rinso',  25000,   50, 10, 'Kebersihan', null)
ON CONFLICT DO NOTHING;

-- ===================== RPC: BUAT TRANSAKSI (ATOMIC) ======
-- Membuat transaksi, detail, dan kurangi stok dalam satu DB transaction
CREATE OR REPLACE FUNCTION buat_transaksi(
  p_pengguna_id INTEGER,
  p_items JSONB  -- [{barangId: int, jumlah: int}]
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total_harga INTEGER := 0;
  v_ppn         INTEGER;
  v_grand_total INTEGER;
  v_kode        TEXT;
  v_transaksi_id INTEGER;
  item          JSONB;
  v_barang      RECORD;
  v_subtotal    INTEGER;
BEGIN
  -- Hitung total dan validasi stok
  FOR item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    SELECT id, nama, harga, stok INTO v_barang
      FROM barang WHERE id = (item->>'barangId')::INTEGER;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Barang ID % tidak ditemukan', item->>'barangId';
    END IF;

    IF v_barang.stok < (item->>'jumlah')::INTEGER THEN
      RAISE EXCEPTION 'Stok % tidak cukup (tersedia: %)', v_barang.nama, v_barang.stok;
    END IF;

    v_subtotal := v_barang.harga * (item->>'jumlah')::INTEGER;
    v_total_harga := v_total_harga + v_subtotal;
  END LOOP;

  v_ppn := ROUND(v_total_harga * 0.1);
  v_grand_total := v_total_harga + v_ppn;
  v_kode := 'TRX' || EXTRACT(EPOCH FROM NOW())::BIGINT;

  -- Insert transaksi
  INSERT INTO transaksi ("penggunaId", kode, "totalHarga", ppn, "grandTotal", status)
  VALUES (p_pengguna_id, v_kode, v_total_harga, v_ppn, v_grand_total, 'selesai')
  RETURNING id INTO v_transaksi_id;

  -- Insert detail & update stok
  FOR item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    SELECT id, harga INTO v_barang FROM barang WHERE id = (item->>'barangId')::INTEGER;
    v_subtotal := v_barang.harga * (item->>'jumlah')::INTEGER;

    INSERT INTO detail_transaksi ("transaksiId", "barangId", jumlah, "hargaSatuan", subtotal)
    VALUES (v_transaksi_id, v_barang.id, (item->>'jumlah')::INTEGER, v_barang.harga, v_subtotal);

    UPDATE barang SET stok = stok - (item->>'jumlah')::INTEGER WHERE id = v_barang.id;
  END LOOP;

  RETURN jsonb_build_object(
    'id', v_transaksi_id,
    'kode', v_kode,
    'grandTotal', v_grand_total,
    'ppn', v_ppn,
    'totalHarga', v_total_harga
  );
END;
$$;

-- ===================== ROW LEVEL SECURITY ================
ALTER TABLE pengguna       ENABLE ROW LEVEL SECURITY;
ALTER TABLE barang         ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaksi      ENABLE ROW LEVEL SECURITY;
ALTER TABLE detail_transaksi ENABLE ROW LEVEL SECURITY;
ALTER TABLE mutasi_stok    ENABLE ROW LEVEL SECURITY;

-- Allow anon (public frontend) to read/write semua tabel
-- (Untuk sistem simulasi/demo — di produksi real, batasi lebih ketat)
CREATE POLICY "anon_read_pengguna"       ON pengguna         FOR SELECT USING (true);
CREATE POLICY "anon_read_barang"         ON barang           FOR SELECT USING (true);
CREATE POLICY "anon_write_barang"        ON barang           FOR ALL    USING (true);
CREATE POLICY "anon_read_transaksi"      ON transaksi        FOR SELECT USING (true);
CREATE POLICY "anon_write_transaksi"     ON transaksi        FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_update_transaksi"    ON transaksi        FOR UPDATE USING (true);
CREATE POLICY "anon_read_detail"         ON detail_transaksi FOR SELECT USING (true);
CREATE POLICY "anon_write_detail"        ON detail_transaksi FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_read_mutasi"         ON mutasi_stok      FOR SELECT USING (true);
CREATE POLICY "anon_write_mutasi"        ON mutasi_stok      FOR INSERT WITH CHECK (true);
