import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nawasanga Driver Log — Smart Fuel & Carbon Telemetry",
    short_name: "Nawasanga Log",
    description: "Pencatatan konsumsi bahan bakar dan foto struk kasir terverifikasi untuk pengemudi armada.",
    start_url: "/driver-log",
    display: "standalone",
    background_color: "#F7F5EF",
    theme_color: "#1D6B5A",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
