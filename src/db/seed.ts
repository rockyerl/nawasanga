import { db } from "./index";
import {
  roles,
  permissions,
  rolePermissions,
  navigationMenus,
  organizations,
  users,
  fuelTypes,
  locations,
  drivers,
  vehicles,
  fuelLogs,
  subscriptions,
  billingInvoices,
  promos,
  tickets,
  vehicleTypes,
  articles,
} from "./schema";
import bcrypt from "bcryptjs";

export async function seed() {
  console.log("🌱 Seeding Fuel-Carbon Database (Turso / LibSQL)...");

  // 1. Permissions
  const permissionList = [
    // Client permissions
    { id: "perm_dash_read", code: "dashboard.read", name: "Lihat Dashboard", group: "Dashboard" },
    { id: "perm_oper_read", code: "operational.read", name: "Lihat Operasional", group: "Operasional" },
    { id: "perm_oper_write", code: "operational.write", name: "Kelola Operasional", group: "Operasional" },
    { id: "perm_driver_read", code: "driver.read", name: "Lihat Driver", group: "Driver" },
    { id: "perm_driver_write", code: "driver.write", name: "Kelola Driver", group: "Driver" },
    { id: "perm_loc_read", code: "location.read", name: "Lihat Lokasi", group: "Lokasi" },
    { id: "perm_loc_write", code: "location.write", name: "Kelola Lokasi", group: "Lokasi" },
    { id: "perm_log_read", code: "log.read", name: "Lihat Log BBM", group: "Log BBM" },
    { id: "perm_log_write", code: "log.write", name: "Catat Log BBM", group: "Log BBM" },
    { id: "perm_rep_read", code: "reports.read", name: "Lihat Laporan Emisi", group: "Laporan" },
    { id: "perm_bill_read", code: "billing.read", name: "Lihat Tagihan", group: "Billing" },
    { id: "perm_users_read", code: "users.read", name: "Lihat User Perusahaan", group: "User" },
    { id: "perm_users_write", code: "users.write", name: "Kelola User Perusahaan", group: "User" },
    { id: "perm_roles_read", code: "roles.read", name: "Lihat Role Perusahaan", group: "Role" },
    { id: "perm_roles_write", code: "roles.write", name: "Kelola Role Perusahaan", group: "Role" },

    // Internal admin permissions
    { id: "perm_int_dash", code: "internal.dashboard", name: "Internal Dashboard", group: "Internal" },
    { id: "perm_int_org", code: "internal.organizations", name: "Kelola Organisasi", group: "Internal" },
    { id: "perm_int_sub", code: "internal.subscriptions", name: "Kelola Langganan", group: "Internal" },
    { id: "perm_int_fuel", code: "internal.fuel_types", name: "Kelola Jenis BBM", group: "Internal" },
    { id: "perm_int_promo", code: "internal.promos", name: "Kelola Promo & Diskon", group: "Internal" },
    { id: "perm_int_tickets", code: "internal.tickets", name: "Kelola Tiket Bantuan", group: "Internal" },
    { id: "perm_int_mon", code: "internal.monitoring", name: "System Monitoring", group: "Internal" },
  ];

  for (const p of permissionList) {
    await db.insert(permissions).values(p).onConflictDoNothing();
  }

  // 2. Roles
  const now = new Date();
  const superAdminRole = {
    id: "role_superadmin",
    name: "Super Administrator",
    code: "SUPERADMIN",
    description: "Akses penuh platform internal Fuel Carbon",
    isSystem: true,
    createdAt: now,
    updatedAt: now,
  };

  const companyAdminRole = {
    id: "role_company_admin",
    name: "Company Admin",
    code: "COMPANY_ADMIN",
    description: "Admin operasional dan pelaporan emisi perusahaan",
    isSystem: false,
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(roles).values(superAdminRole).onConflictDoNothing();
  await db.insert(roles).values(companyAdminRole).onConflictDoNothing();

  // Assign permissions to roles
  for (const p of permissionList) {
    if (p.code.startsWith("internal.")) {
      await db
        .insert(rolePermissions)
        .values({
          id: `rp_${superAdminRole.id}_${p.id}`,
          roleId: superAdminRole.id,
          permissionId: p.id,
        })
        .onConflictDoNothing();
    } else {
      await db
        .insert(rolePermissions)
        .values({
          id: `rp_${companyAdminRole.id}_${p.id}`,
          roleId: companyAdminRole.id,
          permissionId: p.id,
        })
        .onConflictDoNothing();
    }
  }

  // 3. Dynamic Navigation Menus (Sundawa SEC-07 Dynamic Sidebar Access)
  const clientMenus = [
    {
      id: "menu_cl_dash",
      portal: "client",
      title: "Dashboard",
      path: "/dashboard",
      icon: "LayoutDashboard",
      requiredPermission: "dashboard.read",
      category: "Utama",
      sortOrder: 1,
    },
    {
      id: "menu_cl_oper",
      portal: "client",
      title: "Operasional Kendaraan",
      path: "/internals/operational",
      icon: "Truck",
      requiredPermission: "operational.read",
      category: "Manajemen Aset",
      sortOrder: 2,
    },
    {
      id: "menu_cl_driver",
      portal: "client",
      title: "Driver / Pengemudi",
      path: "/internals/driver",
      icon: "Users",
      requiredPermission: "driver.read",
      category: "Manajemen Aset",
      sortOrder: 3,
    },
    {
      id: "menu_cl_loc",
      portal: "client",
      title: "Lokasi & Pool",
      path: "/internals/location",
      icon: "MapPin",
      requiredPermission: "location.read",
      category: "Manajemen Aset",
      sortOrder: 4,
    },
    {
      id: "menu_cl_log",
      portal: "client",
      title: "Log Konsumsi BBM",
      path: "/internals/log",
      icon: "Fuel",
      requiredPermission: "log.read",
      category: "Operasional",
      sortOrder: 5,
    },
    {
      id: "menu_cl_rep_sum",
      portal: "client",
      title: "Ringkasan Emisi",
      path: "/internals/report-summary",
      icon: "FileSpreadsheet",
      requiredPermission: "reports.read",
      category: "Laporan & ESG",
      sortOrder: 6,
    },
    {
      id: "menu_cl_rep_asset",
      portal: "client",
      title: "Laporan Per Aset",
      path: "/internals/report-per-asset",
      icon: "Activity",
      requiredPermission: "reports.read",
      category: "Laporan & ESG",
      sortOrder: 7,
    },
    {
      id: "menu_cl_rep_trend",
      portal: "client",
      title: "Tren Emisi Karbon",
      path: "/internals/report-tren",
      icon: "TrendingUp",
      requiredPermission: "reports.read",
      category: "Laporan & ESG",
      sortOrder: 8,
    },
    {
      id: "menu_cl_rep_audit",
      portal: "client",
      title: "Audit Trail Emisi",
      path: "/internals/report-audit",
      icon: "ShieldCheck",
      requiredPermission: "reports.read",
      category: "Laporan & ESG",
      sortOrder: 9,
    },
    {
      id: "menu_cl_bill",
      portal: "client",
      title: "Tagihan & Paket",
      path: "/internals/billing",
      icon: "CreditCard",
      requiredPermission: "billing.read",
      category: "Pengaturan",
      sortOrder: 10,
    },
    {
      id: "menu_cl_users",
      portal: "client",
      title: "Pengguna",
      path: "/internals/users",
      icon: "UserCheck",
      requiredPermission: "users.read",
      category: "Pengaturan",
      sortOrder: 11,
    },
    {
      id: "menu_cl_roles",
      portal: "client",
      title: "Peran & Akses",
      path: "/internals/role",
      icon: "Key",
      requiredPermission: "roles.read",
      category: "Pengaturan",
      sortOrder: 12,
    },
  ];

  const internalMenus = [
    {
      id: "menu_in_dash",
      portal: "internal",
      title: "Overview Internal",
      path: "/dashboard",
      icon: "LayoutDashboard",
      requiredPermission: "internal.dashboard",
      category: "Supervisi",
      sortOrder: 1,
    },
    {
      id: "menu_in_org",
      portal: "internal",
      title: "Organisasi Klien",
      path: "/internals/organization",
      icon: "Building2",
      requiredPermission: "internal.organizations",
      category: "Klien & Akun",
      sortOrder: 2,
    },
    {
      id: "menu_in_sub",
      portal: "internal",
      title: "Paket Langganan",
      path: "/internals/subscription",
      icon: "Layers",
      requiredPermission: "internal.subscriptions",
      category: "Klien & Akun",
      sortOrder: 3,
    },
    {
      id: "menu_in_bill",
      portal: "internal",
      title: "Invoicing & Billing",
      path: "/internals/billing",
      icon: "Receipt",
      requiredPermission: "internal.subscriptions",
      category: "Keuangan",
      sortOrder: 4,
    },
    {
      id: "menu_in_fuel",
      portal: "internal",
      title: "Master Jenis BBM",
      path: "/internals/fuel-type",
      icon: "Fuel",
      requiredPermission: "internal.fuel_types",
      category: "Master Data",
      sortOrder: 5,
    },
    {
      id: "menu_in_promo",
      portal: "internal",
      title: "Promo & Kupon",
      path: "/internals/promo",
      icon: "Ticket",
      requiredPermission: "internal.promos",
      category: "Master Data",
      sortOrder: 6,
    },
    {
      id: "menu_in_tick",
      portal: "internal",
      title: "Support Tickets",
      path: "/internals/ticketing",
      icon: "LifeBuoy",
      requiredPermission: "internal.tickets",
      category: "Operasional",
      sortOrder: 7,
    },
    {
      id: "menu_in_mon",
      portal: "internal",
      title: "System Monitoring",
      path: "/internals/monitoring",
      icon: "Activity",
      requiredPermission: "internal.monitoring",
      category: "Sistem",
      sortOrder: 8,
    },
  ];

  for (const m of [...clientMenus, ...internalMenus]) {
    await db.insert(navigationMenus).values(m).onConflictDoNothing();
  }

  // 4. Master Fuel Types (Indonesian Standards & IPCC Factors)
  const fuels = [
    {
      id: "fuel_solar",
      name: "Bio Solar (B35)",
      category: "diesel",
      emissionFactorKgCo2PerLiter: 2.68,
      unitPriceIdr: 6800,
    },
    {
      id: "fuel_dexlite",
      name: "Dexlite",
      category: "diesel",
      emissionFactorKgCo2PerLiter: 2.65,
      unitPriceIdr: 14550,
    },
    {
      id: "fuel_pertdex",
      name: "Pertamina Dex",
      category: "diesel",
      emissionFactorKgCo2PerLiter: 2.62,
      unitPriceIdr: 15100,
    },
    {
      id: "fuel_pertalite",
      name: "Pertalite (RON 90)",
      category: "gasoline",
      emissionFactorKgCo2PerLiter: 2.31,
      unitPriceIdr: 10000,
    },
    {
      id: "fuel_pertamax",
      name: "Pertamax (RON 92)",
      category: "gasoline",
      emissionFactorKgCo2PerLiter: 2.29,
      unitPriceIdr: 12950,
    },
  ];

  for (const f of fuels) {
    await db.insert(fuelTypes).values(f).onConflictDoNothing();
  }

  // 5. Demo Organization
  const demoOrg = {
    id: "org_nusantara_logistik",
    name: "PT Nusantara Logistik Makmur",
    slug: "nusantara-logistik",
    industry: "Logistics & Supply Chain",
    contactEmail: "admin@nusantaralogistik.co.id",
    contactPhone: "+6281234567890",
    address: "Kawasan Industri MM2100, Cikarang Barat, Jawa Barat",
    plan: "pro",
    maxAssets: 30,
    status: "active",
    createdAt: now,
    updatedAt: now,
  };
  await db.insert(organizations).values(demoOrg).onConflictDoNothing();

  // 6. Users (Hashed Password)
  const passwordHash = await bcrypt.hash("Admin@12345", 10);

  const internalSuperAdmin = {
    id: "user_internal_admin",
    organizationId: null,
    name: "Sundawa Carbon Lead",
    email: "superadmin@fuelcarbon.id",
    passwordHash: passwordHash,
    roleId: superAdminRole.id,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };

  const clientAdmin = {
    id: "user_client_admin",
    organizationId: demoOrg.id,
    name: "Budi Santoso",
    email: "budi@nusantaralogistik.co.id",
    passwordHash: passwordHash,
    roleId: companyAdminRole.id,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(users).values(internalSuperAdmin).onConflictDoNothing();
  await db.insert(users).values(clientAdmin).onConflictDoNothing();

  // 7. Seed Pool Locations & Drivers
  const locList = [
    {
      id: "loc_pool_cikarang",
      organizationId: demoOrg.id,
      name: "Pool Utama Cikarang",
      type: "pool",
      address: "Blok C-12 Kawasan Industri MM2100",
      latitude: -6.3054,
      longitude: 107.0987,
      isActive: true,
    },
    {
      id: "loc_hub_priok",
      organizationId: demoOrg.id,
      name: "Hub Logistik Tanjung Priok",
      type: "depot",
      address: "Jl. Pelabuhan Nusantara No. 8, Jakarta Utara",
      latitude: -6.1038,
      longitude: 106.8821,
      isActive: true,
    },
    {
      id: "loc_hub_surabaya",
      organizationId: demoOrg.id,
      name: "Depot Distribusi Surabaya",
      type: "branch",
      address: "Jl. Margomulyo Industri No. 45, Surabaya",
      latitude: -7.2458,
      longitude: 112.6712,
      isActive: true,
    },
  ];
  for (const loc of locList) {
    await db.insert(locations).values(loc).onConflictDoNothing();
  }

  const driverList = [
    {
      id: "drv_demo_1",
      organizationId: demoOrg.id,
      name: "Ahmad Riyadi",
      licenseNumber: "B1234567890",
      phoneNumber: "081299887766",
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "drv_demo_2",
      organizationId: demoOrg.id,
      name: "Budi Santoso",
      licenseNumber: "B2345678901",
      phoneNumber: "081388776655",
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "drv_demo_3",
      organizationId: demoOrg.id,
      name: "Agus Pratama",
      licenseNumber: "D3456789012",
      phoneNumber: "081577665544",
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "drv_demo_4",
      organizationId: demoOrg.id,
      name: "Hendra Wijaya",
      licenseNumber: "L4567890123",
      phoneNumber: "081866554433",
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
  ];
  for (const drv of driverList) {
    await db.insert(drivers).values(drv).onConflictDoNothing();
  }

  const vehicleList = [
    {
      id: "veh_demo_1",
      organizationId: demoOrg.id,
      plateNumber: "B 9876 PQR",
      brandModel: "Hino Ranger 500 FL (Tronton)",
      vehicleType: "Heavy Truck",
      fuelTypeId: "fuel_solar",
      assignedDriverId: "drv_demo_1",
      locationId: "loc_pool_cikarang",
      year: 2022,
      status: "operational",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "veh_demo_2",
      organizationId: demoOrg.id,
      plateNumber: "B 9123 KLM",
      brandModel: "Mitsubishi Canter FE 74 HD",
      vehicleType: "Medium Truck",
      fuelTypeId: "fuel_dexlite",
      assignedDriverId: "drv_demo_2",
      locationId: "loc_pool_cikarang",
      year: 2023,
      status: "operational",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "veh_demo_3",
      organizationId: demoOrg.id,
      plateNumber: "D 4512 STU",
      brandModel: "Isuzu Giga FVR 34 P",
      vehicleType: "Heavy Truck",
      fuelTypeId: "fuel_solar",
      assignedDriverId: "drv_demo_3",
      locationId: "loc_hub_priok",
      year: 2021,
      status: "operational",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "veh_demo_4",
      organizationId: demoOrg.id,
      plateNumber: "L 7890 XYZ",
      brandModel: "Mercedes-Benz Axor 2528 C",
      vehicleType: "Heavy Truck",
      fuelTypeId: "fuel_pertdex",
      assignedDriverId: "drv_demo_4",
      locationId: "loc_hub_surabaya",
      year: 2024,
      status: "operational",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "veh_demo_5",
      organizationId: demoOrg.id,
      plateNumber: "B 3456 DEF",
      brandModel: "Toyota Hilux 2.4 D-Cab",
      vehicleType: "Light Vehicle",
      fuelTypeId: "fuel_dexlite",
      assignedDriverId: "drv_demo_1",
      locationId: "loc_pool_cikarang",
      year: 2023,
      status: "operational",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "veh_demo_6",
      organizationId: demoOrg.id,
      plateNumber: "AST-GEN-01",
      brandModel: "Genset Perkins 150 kVA",
      vehicleType: "Stationary Equipment",
      fuelTypeId: "fuel_solar",
      assignedDriverId: null,
      locationId: "loc_pool_cikarang",
      year: 2020,
      status: "operational",
      createdAt: now,
      updatedAt: now,
    },
  ];
  for (const veh of vehicleList) {
    await db.insert(vehicles).values(veh).onConflictDoNothing();
  }

  // 8. Vehicle Types
  const vTypes = [
    {
      id: "vt_heavy_truck",
      category: "heavy_truck",
      name: "Truk Tronton / Wingbox",
      defaultFuelTypeId: "fuel_solar",
      consumptionKm: 0.85,
      gvwMinTon: 24,
      description: "Armada logistik kargo berat antar provinsi",
      createdAt: now,
    },
    {
      id: "vt_light_truck",
      category: "light_truck",
      name: "Colt Diesel Double (CDD)",
      defaultFuelTypeId: "fuel_solar",
      consumptionKm: 0.42,
      gvwMinTon: 8,
      description: "Armada distribusi barang perkotaan dan regional",
      createdAt: now,
    },
    {
      id: "vt_pickup",
      category: "car",
      name: "Pick-up Muatan Ringan",
      defaultFuelTypeId: "fuel_pertalite",
      consumptionKm: 0.22,
      gvwMinTon: 2.5,
      description: "Armada last-mile delivery",
      createdAt: now,
    },
  ];
  for (const vt of vTypes) {
    await db.insert(vehicleTypes).values(vt).onConflictDoNothing();
  }

  // 9. Articles
  const articleList = [
    {
      id: "art_1",
      title: "Panduan Implementasi Standar IPCC Scope 1 untuk Armada Logistik",
      author: "Sundawa Sustainability Team",
      category: "Regulasi & ESG",
      content: "Penerapan penghitungan emisi gas rumah kaca (GRK) Scope 1 berbasis konsumsi bahan bakar...",
      publishedAt: "2026-05-01",
      status: "published",
      views: 342,
      createdAt: now,
    },
    {
      id: "art_2",
      title: "Optimalisasi Efisiensi BBM Bio Solar B35 pada Armada Angkutan Berat",
      author: "Pusat Riset Transportasi Hijau",
      category: "Teknis Armada",
      content: "Analisis teknis efisiensi pembakaran Bio Solar B35 dan perawatannya terhadap konsumsi km/liter...",
      publishedAt: "2026-05-10",
      status: "published",
      views: 215,
      createdAt: now,
    },
  ];
  for (const art of articleList) {
    await db.insert(articles).values(art).onConflictDoNothing();
  }

  // 10. Subscriptions & Billing Invoices
  const subDemo = {
    id: "sub_demo_1",
    organizationId: demoOrg.id,
    plan: "pro",
    priceIdr: 4500000,
    startsAt: now,
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    status: "active",
  };
  await db.insert(subscriptions).values(subDemo).onConflictDoNothing();

  const invDemo = {
    id: "inv_demo_1",
    organizationId: demoOrg.id,
    invoiceNumber: "INV-2026-001",
    amountIdr: 4500000,
    status: "paid",
    paymentMethod: "Bank Transfer BCA",
    paidAt: now,
    createdAt: now,
  };
  await db.insert(billingInvoices).values(invDemo).onConflictDoNothing();

  // 11. Promos
  const promoDemo = {
    id: "prm_hijau2026",
    code: "HIJAU2026",
    discountPercent: 15,
    maxDiscountIdr: 1000000,
    validUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    isActive: true,
  };
  await db.insert(promos).values(promoDemo).onConflictDoNothing();

  // 12. Tickets
  const ticketDemo = {
    id: "tkt_demo_1",
    organizationId: demoOrg.id,
    userId: clientAdmin.id,
    subject: "Integrasi Sensor Telematika GPS Fleet",
    description: "Mohon panduan integrasi API OBD-II ke dashboard emisi real-time.",
    priority: "medium",
    status: "in_progress",
    createdAt: now,
    updatedAt: now,
  };
  await db.insert(tickets).values(ticketDemo).onConflictDoNothing();

  // 13. Fuel Logs (Transactions across Jan - May 2026)
  const fuelLogData = [
    { id: "flog_01", vehicleId: "veh_demo_1", driverId: "drv_demo_1", fuelTypeId: "fuel_solar", liters: 150, costIdr: 150 * 6800, odometerKm: 42100, emissionCo2Kg: 150 * 2.68, fuelStation: "SPBU Pertamina 31.175.02 Cikarang", loggedAt: new Date("2026-01-15T08:30:00Z") },
    { id: "flog_02", vehicleId: "veh_demo_2", driverId: "drv_demo_2", fuelTypeId: "fuel_dexlite", liters: 90, costIdr: 90 * 14550, odometerKm: 18200, emissionCo2Kg: 90 * 2.68, fuelStation: "SPBU Pertamina 34.123.01 Cikarang", loggedAt: new Date("2026-01-22T09:15:00Z") },
    { id: "flog_03", vehicleId: "veh_demo_3", driverId: "drv_demo_3", fuelTypeId: "fuel_solar", liters: 180, costIdr: 180 * 6800, odometerKm: 65400, emissionCo2Kg: 180 * 2.68, fuelStation: "SPBU Shell Tanjung Priok", loggedAt: new Date("2026-02-05T07:45:00Z") },
    { id: "flog_04", vehicleId: "veh_demo_4", driverId: "drv_demo_4", fuelTypeId: "fuel_pertdex", liters: 140, costIdr: 140 * 15100, odometerKm: 12400, emissionCo2Kg: 140 * 2.68, fuelStation: "SPBU Margomulyo Surabaya", loggedAt: new Date("2026-02-18T11:00:00Z") },
    { id: "flog_05", vehicleId: "veh_demo_1", driverId: "drv_demo_1", fuelTypeId: "fuel_solar", liters: 160, costIdr: 160 * 6800, odometerKm: 43250, emissionCo2Kg: 160 * 2.68, fuelStation: "SPBU Pertamina 31.175.02 Cikarang", loggedAt: new Date("2026-02-27T10:20:00Z") },
    { id: "flog_06", vehicleId: "veh_demo_5", driverId: "drv_demo_1", fuelTypeId: "fuel_dexlite", liters: 65, costIdr: 65 * 14550, odometerKm: 28900, emissionCo2Kg: 65 * 2.68, fuelStation: "SPBU Pertamina Karawang Barat", loggedAt: new Date("2026-03-08T08:00:00Z") },
    { id: "flog_07", vehicleId: "veh_demo_6", driverId: null, fuelTypeId: "fuel_solar", liters: 200, costIdr: 200 * 6800, odometerKm: null, emissionCo2Kg: 200 * 2.68, fuelStation: "Tangki Genset Internal Cikarang", loggedAt: new Date("2026-03-14T14:00:00Z") },
    { id: "flog_08", vehicleId: "veh_demo_2", driverId: "drv_demo_2", fuelTypeId: "fuel_dexlite", liters: 85, costIdr: 85 * 14550, odometerKm: 19100, emissionCo2Kg: 85 * 2.68, fuelStation: "SPBU Cikarang Central", loggedAt: new Date("2026-03-25T16:30:00Z") },
    { id: "flog_09", vehicleId: "veh_demo_3", driverId: "drv_demo_3", fuelTypeId: "fuel_solar", liters: 190, costIdr: 190 * 6800, odometerKm: 66800, emissionCo2Kg: 190 * 2.68, fuelStation: "SPBU Tanjung Priok Gate 3", loggedAt: new Date("2026-04-04T07:10:00Z") },
    { id: "flog_10", vehicleId: "veh_demo_1", driverId: "drv_demo_1", fuelTypeId: "fuel_solar", liters: 170, costIdr: 170 * 6800, odometerKm: 44500, emissionCo2Kg: 170 * 2.68, fuelStation: "SPBU Tol Jakarta-Cikampek KM 19", loggedAt: new Date("2026-04-12T13:40:00Z") },
    { id: "flog_11", vehicleId: "veh_demo_4", driverId: "drv_demo_4", fuelTypeId: "fuel_pertdex", liters: 155, costIdr: 155 * 15100, odometerKm: 13900, emissionCo2Kg: 155 * 2.68, fuelStation: "SPBU Tol Trans Jawa KM 575", loggedAt: new Date("2026-04-22T19:20:00Z") },
    { id: "flog_12", vehicleId: "veh_demo_5", driverId: "drv_demo_1", fuelTypeId: "fuel_dexlite", liters: 70, costIdr: 70 * 14550, odometerKm: 29800, emissionCo2Kg: 70 * 2.68, fuelStation: "SPBU Pertamina Cikarang", loggedAt: new Date("2026-05-02T09:00:00Z") },
    { id: "flog_13", vehicleId: "veh_demo_6", driverId: null, fuelTypeId: "fuel_solar", liters: 220, costIdr: 220 * 6800, odometerKm: null, emissionCo2Kg: 220 * 2.68, fuelStation: "Tangki Genset Internal Cikarang", loggedAt: new Date("2026-05-09T15:15:00Z") },
    { id: "flog_14", vehicleId: "veh_demo_2", driverId: "drv_demo_2", fuelTypeId: "fuel_dexlite", liters: 95, costIdr: 95 * 14550, odometerKm: 20250, emissionCo2Kg: 95 * 2.68, fuelStation: "SPBU Tol Cikampek KM 39", loggedAt: new Date("2026-05-14T08:45:00Z") },
    { id: "flog_15", vehicleId: "veh_demo_1", driverId: "drv_demo_1", fuelTypeId: "fuel_solar", liters: 180, costIdr: 180 * 6800, odometerKm: 45800, emissionCo2Kg: 180 * 2.68, fuelStation: "SPBU Pertamina 31.175.02 Cikarang", loggedAt: new Date("2026-05-15T11:30:00Z") },
  ];

  for (const flog of fuelLogData) {
    await db.insert(fuelLogs).values({
      ...flog,
      organizationId: demoOrg.id,
      receiptImageUrl: null,
      createdAt: flog.loggedAt,
    }).onConflictDoNothing();
  }

  console.log("✅ Fuel-Carbon Seeding Completed Successfully.");
}

seed().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
