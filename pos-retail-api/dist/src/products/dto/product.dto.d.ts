export declare class CreateProductDto {
    nama: string;
    harga: number;
    stok: number;
    minStok: number;
    kategori: string;
    barcode?: string;
    gambar?: string;
}
export declare class UpdateProductDto {
    nama?: string;
    harga?: number;
    stok?: number;
    minStok?: number;
    kategori?: string;
    barcode?: string;
    gambar?: string;
}
