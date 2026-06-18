erDiagram
    USERS ||--o{ SETORAN_PBB : "Mengelola (Petugas) / Memeriksa (Verifikator)"
    USERS ||--o{ KELOMPOK : "Mengelola"
    USERS ||--o{ WAJIB_PAJAK : "Memiliki (Petugas Lapangan)"
    KELOMPOK ||--o{ WAJIB_PAJAK : "Memiliki"
    KELOMPOK ||--o{ FORMULIR_TARIKAN : "Memiliki"
    WAJIB_PAJAK ||--o{ PBB : "Memiliki"
    SETORAN_PBB ||--o{ FORMULIR_TARIKAN : "Memiliki"
    FORMULIR_TARIKAN ||--o{ PBB_FORMULIR : "Mempunyai Detail"
    PBB ||--o{ PBB_FORMULIR : "Terdaftar Di"

    USERS {
        int id PK
        string username
        string password
        string email
        string nama
        text alamat
        string role
        string label_petugas
    }

    SETORAN_PBB {
        int id PK
        date tanggal_setor
        string status
        int id_verifikator FK
        int id_petugas FK
        decimal jumlah_setor
        text catatan
        year tahun
        string bukti
    }

    KELOMPOK {
        int id PK
        string nama_kelompok
        text alamat_wp
    }

    WAJIB_PAJAK {
        int id PK
        string nama_wp
        text alamat_wp
        int id_kelompok FK
        int id_petugas FK
        string bagian
        tinyint kepala_keluarga
    }

    PBB {
        int id PK
        string nop_wp
        int luas_bumi
        int luas_bng
        decimal pajak_terhutang
        string jenis
        string status
        int id_wp FK
        text alamat_op
        year tahun
    }

    FORMULIR_TARIKAN {
        int id PK
        int id_kelompok FK
        int id_petugas FK
        int id_setoran FK
        date jadwal_pembayaran
        date tgl_bayar
        string status
        decimal total
        string bukti
    }

    PBB_FORMULIR {
        int id PK
        int id_formulir FK
        int id_pbb FK
        year tahun
    }
