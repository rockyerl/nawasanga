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
  const poolJakarta = {
    id: "loc_pool_cikarang",
    organizationId: demoOrg.id,
    name: "Pool Utama Cikarang",
    type: "pool",
    address: "Blok C-12 Kawasan Industri MM2100",
    latitude: -6.3054,
    longitude: 107.0987,
    isActive: true,
  };
  await db.insert(locations).values(poolJakarta).onConflictDoNothing();

  const driverDemo = {
    id: "drv_demo_1",
    organizationId: demoOrg.id,
    name: "Ahmad Riyadi",
    licenseNumber: "B1234567890",
    phoneNumber: "081299887766",
    status: "active",
    createdAt: now,
    updatedAt: now,
  };
  await db.insert(drivers).values(driverDemo).onConflictDoNothing();

  const vehicleDemo = {
    id: "veh_demo_1",
    organizationId: demoOrg.id,
    plateNumber: "B 9876 PQR",
    brandModel: "Hino Ranger 500 FL",
    vehicleType: "Heavy Truck",
    fuelTypeId: "fuel_solar",
    assignedDriverId: driverDemo.id,
    locationId: poolJakarta.id,
    year: 2022,
    status: "operational",
    createdAt: now,
    updatedAt: now,
  };
  await db.insert(vehicles).values(vehicleDemo).onConflictDoNothing();

  console.log("✅ Fuel-Carbon Seeding Completed Successfully.");
}

seed().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
