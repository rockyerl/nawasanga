"use client";

import { useState } from "react";
import { BookOpen, Calendar, Clock, Eye, Search, Share2, Tag, User, X, Check } from "lucide-react";

export interface ArticleItem {
  id: string;
  title: string;
  author: string;
  category: string;
  content: string;
  publishedAt: string;
  status: string;
  views: number;
}

interface Props {
  initialArticles: ArticleItem[];
}

export default function InteractiveArticles({ initialArticles }: Props) {
  const [articlesList] = useState<ArticleItem[]>(initialArticles);
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeArticle, setActiveArticle] = useState<ArticleItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    "Semua",
    "Regulasi & ESG",
    "Teknis Armada",
    "Efisiensi Energi",
  ];

  const filteredArticles = articlesList.filter((art) => {
    const matchCat =
      selectedCategory === "Semua" ||
      art.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchQuery =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  const handleCopyLink = (id: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/#artikel-${id}`);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <section id="artikel" className="py-24 relative border-t border-rimba/10 bg-[#F7F5EF]/60">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="font-ui text-xs text-rimba tracking-widest uppercase mb-3 font-semibold">
              — Wawasan & Regulasi Terkini —
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-normal tracking-tight text-arang leading-tight">
              Artikel & Panduan <span className="text-rimba font-semibold">Dekarbonisasi</span>
            </h2>
            <p className="font-ui text-sm text-abu mt-2 max-w-xl leading-relaxed">
              Kumpulan wawasan kepatuhan emisi Scope 1, standar taksonomi hijau, dan strategi mitigasi konsumsi BBM korporasi.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-abu w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari topik atau regulasi..."
              className="w-full pl-10 pr-4 py-2.5 bg-lontar border border-rimba/15 rounded-xl text-xs font-ui text-arang placeholder-abu/70 focus:outline-none focus:border-rimba transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-10 border-b border-rimba/10 pb-4">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-ui transition-all ${
                  isActive
                    ? "bg-rimba text-lontar font-medium shadow-sm"
                    : "bg-lontar/80 text-abu hover:text-arang hover:bg-lontar border border-rimba/10"
                }`}
              >
                {cat}
              </button>
            );
          })}
          <span className="ml-auto text-xs font-ui text-abu hidden sm:inline">
            Menampilkan {filteredArticles.length} artikel
          </span>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-lontar rounded-2xl border border-rimba/10">
            <BookOpen className="w-10 h-10 text-abu/50 mx-auto mb-3" />
            <p className="text-sm font-ui text-abu">Tidak ada artikel yang cocok dengan pencarian &quot;{searchQuery}&quot;.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((art) => {
              const readTime = Math.max(2, Math.ceil(art.content.split(" ").length / 50));
              return (
                <div
                  key={art.id}
                  id={`artikel-${art.id}`}
                  className="group bg-lontar rounded-2xl border border-rimba/10 hover:border-rimba/30 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-1 relative"
                >
                  <div>
                    {/* Category badge & Views */}
                    <div className="flex items-center justify-between mb-4 text-xs font-ui">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rimba/10 text-rimba font-medium text-[11px]">
                        <Tag className="w-3 h-3" />
                        {art.category}
                      </span>
                      <span className="flex items-center gap-1 text-abu text-[11px]">
                        <Eye className="w-3 h-3" />
                        {art.views.toLocaleString("id-ID")} pembaca
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => setActiveArticle(art)}
                      className="font-display text-lg font-semibold text-arang group-hover:text-rimba transition-colors leading-snug cursor-pointer line-clamp-2 mb-3"
                    >
                      {art.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="font-ui text-xs text-abu line-clamp-3 leading-relaxed mb-6">
                      {art.content}
                    </p>
                  </div>

                  {/* Footer metadata */}
                  <div className="border-t border-rimba/10 pt-4 flex items-center justify-between mt-auto">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-ui text-arang font-medium">
                        <User className="w-3 h-3 text-rimba" />
                        <span className="truncate max-w-[140px]">{art.author}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-ui text-abu">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {art.publishedAt}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {readTime} mnt
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveArticle(art)}
                      className="text-xs font-ui font-semibold text-rimba hover:text-jati transition-colors shrink-0 flex items-center gap-1"
                    >
                      Baca &rarr;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Banner */}
        <div className="mt-14 rounded-2xl bg-gradient-to-r from-rimba to-jati text-lontar p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div>
            <h4 className="font-display text-xl font-medium mb-1">
              Ingin Menghitung Emisi Scope 1 Armada Anda Sekarang?
            </h4>
            <p className="font-ui text-xs text-lontar/80 max-w-xl">
              Gunakan simulasi interaktif kami atau akses portal untuk mengelola data log konsumsi BBM secara akurat berbasis standar IPCC.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#kalkulator"
              className="px-5 py-2.5 rounded-xl bg-emas hover:bg-emas/90 text-arang font-semibold text-xs font-ui transition-colors shadow-sm"
            >
              Coba Kalkulator
            </a>
            <a
              href="/login"
              className="px-5 py-2.5 rounded-xl bg-lontar/10 hover:bg-lontar/20 text-lontar font-medium text-xs font-ui border border-lontar/20 transition-colors"
            >
              Masuk Portal
            </a>
          </div>
        </div>
      </div>

      {/* Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-arang/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-lontar rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-rimba/20 p-6 md:p-8 relative">
            {/* Close button */}
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-abu hover:text-arang hover:bg-rimba/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Tag & Date */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-ui mb-4">
              <span className="px-3 py-1 rounded-full bg-rimba/10 text-rimba font-medium">
                {activeArticle.category}
              </span>
              <span className="flex items-center gap-1 text-abu">
                <Calendar className="w-3.5 h-3.5" />
                {activeArticle.publishedAt}
              </span>
              <span className="flex items-center gap-1 text-abu">
                <Eye className="w-3.5 h-3.5" />
                {activeArticle.views} pembaca
              </span>
            </div>

            {/* Title */}
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-arang mb-4 leading-tight">
              {activeArticle.title}
            </h2>

            {/* Author */}
            <div className="flex items-center justify-between border-y border-rimba/10 py-3 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-rimba/15 flex items-center justify-center text-rimba font-bold text-xs">
                  {activeArticle.author.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-ui font-semibold text-arang">{activeArticle.author}</p>
                  <p className="text-[10px] font-ui text-abu">Kontributor Ahli Keberlanjutan</p>
                </div>
              </div>

              <button
                onClick={() => handleCopyLink(activeArticle.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rimba/15 text-xs font-ui text-abu hover:text-rimba transition-colors"
              >
                {copiedId === activeArticle.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-green-600">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Bagikan</span>
                  </>
                )}
              </button>
            </div>

            {/* Body */}
            <div className="prose prose-sm max-w-none text-arang/80 font-ui leading-relaxed space-y-4">
              <p className="text-sm font-ui leading-relaxed">
                {activeArticle.content}
              </p>
              <div className="p-4 rounded-xl bg-rimba/5 border border-rimba/15 my-4">
                <p className="text-xs font-ui text-rimba font-medium mb-1">
                  💡 Rekomendasi Teknis Nawasanga
                </p>
                <p className="text-xs font-ui text-arang/70 leading-relaxed">
                  Untuk menerapkan pelaporan emisi yang selaras dengan panduan ini, pastikan data konsumsi liter BBM per unit kendaraan tercatat lengkap beserta jenis bahan bakarnya (B35, Solar, Pertalite) untuk dihitung otomatis menggunakan faktor emisi IPCC 2006.
                </p>
              </div>
            </div>

            {/* Footer Modal Action */}
            <div className="mt-8 pt-4 border-t border-rimba/10 flex justify-end gap-3">
              <button
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2 rounded-xl border border-rimba/20 text-xs font-ui text-abu hover:text-arang transition-colors"
              >
                Tutup
              </button>
              <a
                href="/login"
                className="px-5 py-2 rounded-xl bg-rimba hover:bg-jati text-lontar text-xs font-ui font-medium transition-colors"
              >
                Terapkan di Dashboard &rarr;
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
