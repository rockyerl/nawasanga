import type { DriverData } from "@/types/features/driver.type";

export const mockDrivers: DriverData[] = [
    { id: "D001", employeeId: "EMP-2401", name: "Supardi",          licenseType: "SIM B2", licenseNumber: "1234567890123456", licenseExpiry: "2026-08-15", phone: "081311111001", locationId: "L001", locationName: "Jakarta Pusat",   status: "Aktif",       notes: "" },
    { id: "D002", employeeId: "EMP-2402", name: "Haryanto",         licenseType: "SIM B1", licenseNumber: "1234567890123457", licenseExpiry: "2025-12-01", phone: "081311111002", locationId: "L002", locationName: "Jakarta Selatan",  status: "Aktif",       notes: "Pengalaman 5 tahun" },
    { id: "D003", employeeId: "EMP-2403", name: "Bambang Irawan",   licenseType: "SIM A",  licenseNumber: "1234567890123458", licenseExpiry: "2027-03-20", phone: "081311111003", locationId: "L003", locationName: "Bandung",          status: "Aktif",       notes: "" },
    { id: "D004", employeeId: "EMP-2404", name: "Dedi Kurniawan",   licenseType: "SIM B2", licenseNumber: "1234567890123459", licenseExpiry: "2025-06-30", phone: "081311111004", locationId: "L004", locationName: "Surabaya",         status: "Tidak Aktif", notes: "SIM hampir kadaluarsa" },
    { id: "D005", employeeId: "EMP-2405", name: "Agus Salim",       licenseType: "SIM B1", licenseNumber: "1234567890123460", licenseExpiry: "2026-11-10", phone: "081311111005", locationId: "L001", locationName: "Jakarta Pusat",   status: "Aktif",       notes: "" },
    { id: "D006", employeeId: "EMP-2406", name: "Wawan Setiawan",   licenseType: "SIM A",  licenseNumber: "1234567890123461", licenseExpiry: "2027-07-25", phone: "081311111006", locationId: "L005", locationName: "Medan",           status: "Aktif",       notes: "" },
    { id: "D007", employeeId: "EMP-2407", name: "Roni Prasetyo",    licenseType: "SIM C",  licenseNumber: "1234567890123462", licenseExpiry: "2026-02-14", phone: "081311111007", locationId: "L003", locationName: "Bandung",          status: "Tidak Aktif", notes: "Sedang cuti" },
    { id: "D008", employeeId: "EMP-2408", name: "Guntur Wibowo",    licenseType: "SIM B2", licenseNumber: "1234567890123463", licenseExpiry: "2028-01-05", phone: "081311111008", locationId: "L002", locationName: "Jakarta Selatan",  status: "Aktif",       notes: "Driver senior" },
    { id: "D009", employeeId: "EMP-2409", name: "Andi Firmansyah",  licenseType: "SIM B1", licenseNumber: "1234567890123464", licenseExpiry: "2026-09-18", phone: "081311111009", locationId: "L004", locationName: "Surabaya",         status: "Aktif",       notes: "" },
    { id: "D010", employeeId: "EMP-2410", name: "Slamet Riyadi",    licenseType: "SIM A",  licenseNumber: "1234567890123465", licenseExpiry: "2025-10-22", phone: "081311111010", locationId: "L006", locationName: "Semarang",         status: "Tidak Aktif", notes: "Menunggu perpanjangan SIM" },
    { id: "D011", employeeId: "EMP-2411", name: "Fauzan Hakim",     licenseType: "SIM B2", licenseNumber: "1234567890123466", licenseExpiry: "2027-05-30", phone: "081311111011", locationId: "L005", locationName: "Medan",           status: "Aktif",       notes: "" },
    { id: "D012", employeeId: "EMP-2412", name: "Irfan Maulana",    licenseType: "SIM B1", licenseNumber: "1234567890123467", licenseExpiry: "2026-12-12", phone: "081311111012", locationId: "L006", locationName: "Semarang",         status: "Aktif",       notes: "" },
    { id: "D013", employeeId: "EMP-2413", name: "Tono Susanto",     licenseType: "SIM A",  licenseNumber: "1234567890123468", licenseExpiry: "2027-04-08", phone: "081311111013", locationId: "L001", locationName: "Jakarta Pusat",   status: "Aktif",       notes: "Terlatih angkutan BBM" },
    { id: "D014", employeeId: "EMP-2414", name: "Hendri Saputra",   licenseType: "SIM B2", licenseNumber: "1234567890123469", licenseExpiry: "2025-08-27", phone: "081311111014", locationId: "L002", locationName: "Jakarta Selatan",  status: "Tidak Aktif", notes: "" },
    { id: "D015", employeeId: "EMP-2415", name: "Mulyono",          licenseType: "SIM B1", licenseNumber: "1234567890123470", licenseExpiry: "2028-03-15", phone: "081311111015", locationId: "L003", locationName: "Bandung",          status: "Aktif",       notes: "" },
];

export const mockLocations = [
    { id: "L001", name: "Jakarta Pusat" },
    { id: "L002", name: "Jakarta Selatan" },
    { id: "L003", name: "Bandung" },
    { id: "L004", name: "Surabaya" },
    { id: "L005", name: "Medan" },
    { id: "L006", name: "Semarang" },
];