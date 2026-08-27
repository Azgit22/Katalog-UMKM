import { Product } from '../types';

/**
 * Format angka ke format Rupiah Indonesia (contoh: Rp 26.000)
 */
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Bersihkan nomor WhatsApp agar berformat angka internasional yang valid
 * Contoh: "0812-3456-789" -> "628123456789"
 */
export function sanitizeWhatsAppNumber(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  }
  return cleaned;
}

/**
 * Generate Link WhatsApp untuk pemesanan produk spesifik
 */
export function createWhatsAppOrderLink(
  phoneNumber: string,
  businessName: string,
  product: Product,
  quantity: number = 1,
  customerNote: string = ''
): string {
  const sanitizedNumber = sanitizeWhatsAppNumber(phoneNumber);
  const totalPrice = product.price * quantity;
  const unitLabel = product.unit ? ` ${product.unit}` : '';

  let message = `Halo *${businessName}*,\nSaya ingin memesan:\n\n` +
    `📌 *Produk:* ${product.name}\n` +
    `🔢 *Jumlah:* ${quantity}${unitLabel}\n` +
    `💰 *Harga Satuan:* ${formatIDR(product.price)}\n` +
    `💵 *Total Estimasi:* ${formatIDR(totalPrice)}`;

  if (customerNote && customerNote.trim().length > 0) {
    message += `\n📝 *Catatan:* ${customerNote.trim()}`;
  }

  message += `\n\nApakah pesanan ini masih tersedia dan bisa diproses? Terima kasih!`;

  return `https://wa.me/${sanitizedNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate Link WhatsApp untuk chat umum / tanya-tanya
 */
export function createWhatsAppGeneralLink(
  phoneNumber: string,
  defaultMessage: string
): string {
  const sanitizedNumber = sanitizeWhatsAppNumber(phoneNumber);
  return `https://wa.me/${sanitizedNumber}?text=${encodeURIComponent(defaultMessage)}`;
}
