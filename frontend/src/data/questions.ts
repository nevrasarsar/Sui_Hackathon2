export const ALL_QUESTIONS = [
    // --- BÖLÜM 1: Temel (1-15) ---
    {
        id: 1,
        q: "Sui ağı hangi programlama diliyle geliştirilmiştir?",
        options: ["Rust", "Move", "Solidity", "C++"],
        correct: 1 // B
    },
    {
        id: 2,
        q: "Sui blockchain’in temel amacı nedir?",
        options: ["Grafik oluşturmak", "Yüksek performanslı bir L1 altyapı sağlamak", "Video işlemek", "Veritabanı olmak"],
        correct: 1 // B
    },
    {
        id: 3,
        q: "Sui’de obje merkezli programlama modeline ne denir?",
        options: ["ObjectFlow", "Object-Oriented Storage", "Move Object Model", "Program Storage"],
        correct: 2 // C
    },
    {
        id: 4,
        q: "Sui’de işlem paralelliğini sağlayan temel teknoloji nedir?",
        options: ["Clustering", "Narwhal & Tusk", "Kafka", "Sharding"],
        correct: 1 // B
    },
    {
        id: 5,
        q: "Sui cüzdanları genelde hangi formatta çalışır?",
        options: ["Private Key", "JSON", "Mnemonic", "Hepsi"],
        correct: 3 // D
    },
    {
        id: 6,
        q: "Sui token’ın kısaltması nedir?",
        options: ["SUI", "SIU", "SU", "SUT"],
        correct: 0 // A
    },
    {
        id: 7,
        q: "Sui’de akıllı kontratlar nerede çalışır?",
        options: ["Off-chain", "Move VM", "EVM", "Container"],
        correct: 1 // B
    },
    {
        id: 8,
        q: "Sui’de bir NFT’nin benzersiz olmasını sağlayan şey nedir?",
        options: ["Sahibi", "ID’si", "Fiyatı", "Tarihi"],
        correct: 1 // B
    },
    {
        id: 9,
        q: "Sui ağında stake işlemleri nasıl yapılır?",
        options: ["Validator seçilerek", "Oylama ile", "Gas göndererek", "Ücretsiz"],
        correct: 0 // A
    },
    {
        id: 10,
        q: "Sui ağında gas ücretleri genelde nasıldır?",
        options: ["Çok yüksek", "Değişken ve pahalı", "Düşük ve stabil", "Ücretsiz"],
        correct: 2 // C
    },
    {
        id: 11,
        q: "Sui’de bir objeyi değiştiren fonksiyonlara ne denir?",
        options: ["view", "mutable (mut_)", "pure", "static"],
        correct: 1 // B
    },
    {
        id: 12,
        q: "Sui ağı aşağıdakilerden hangisine odaklanır?",
        options: ["Ölçeklenebilirlik", "Stabil coin üretmek", "Sadece DeFi", "Token yakmak"],
        correct: 0 // A
    },
    {
        id: 13,
        q: "Sui Move modülleri hangi uzantıyı kullanır?",
        options: [".sol", ".mv", ".move", ".sui"],
        correct: 2 // C
    },
    {
        id: 14,
        q: "Sui’de transaction göndermek için gerekli şey nedir?",
        options: ["Hardhat", "Gas", "MetaMask", "Docker"],
        correct: 1 // B
    },
    {
        id: 15,
        q: "Sui ağı hangi yapıyı destekler?",
        options: ["Tek katmanlı", "Layer 2", "Hybrid rollup", "DAG"],
        correct: 0 // A ??? Prompt says A (Tek katmanlı/L1), actually uses DAG but prompt says A. Wait, prompt says "Doğru: A" for "Tek katmanlı". Sui IS L1. DAG is consensus structure. I will stick to prompt's answer key.
    },

    // --- BÖLÜM 2: Orta (16-35) ---
    {
        id: 16,
        q: "Move dilinde değiştirilemeyen değişken tipi nedir?",
        options: ["let", "const", "immutable", "final"],
        correct: 0 // A (let is immutable by default unless mut)
    },
    {
        id: 17,
        q: "Sui’de shared object nedir?",
        options: ["Sadece sahibi olan obje", "Birden fazla kişinin erişebildiği obje", "Silinmiş obje", "Program hatası"],
        correct: 1 // B
    },
    {
        id: 18,
        q: "Bir Move modülü nasıl yayınlanır?",
        options: ["compile-run", "move publish", "sui client publish", "module.apply"],
        correct: 2 // C
    },
    {
        id: 19,
        q: "Sui’de event üretmek için hangi keyword kullanılır?",
        options: ["emit", "event", "log", "broadcast"],
        correct: 0 // A
    },
    {
        id: 20,
        q: "Move’da struct nedir?",
        options: ["Fonksiyon", "Veri modeli", "Blockchain adresi", "Private key"],
        correct: 1 // B
    },
    {
        id: 21,
        q: "Aşağıdakilerden hangisi Move dilinin özelliğidir?",
        options: ["Garbage collector", "Resource-based security", "Class inheritance", "Node.js modülleri"],
        correct: 1 // B
    },
    {
        id: 22,
        q: "Move’da resource silinmeden önce ne yapılmalıdır?",
        options: ["drop edilmelidir", "serialize edilmelidir", "hash yapılmalıdır", "transfer edilmelidir"],
        correct: 0 // A
    },
    {
        id: 23,
        q: "Sui’de object ID hangi tiptedir?",
        options: ["u8", "address", "hex string", "string"],
        correct: 2 // C (Strictly it's address/ID but represented as hex string usually. Prompt says C)
    },
    {
        id: 24,
        q: "Sui NFT’leri nerede saklanır?",
        options: ["Off-chain", "Blockchain üzerinde obje olarak", "Sadece cüzdanda", "BigQuery’da"],
        correct: 1 // B
    },
    {
        id: 25,
        q: "Move’da fonksiyon geri dönüş tipi hangi keyword ile tanımlanır?",
        options: ["fn", "fun", "return", "->"],
        correct: 3 // D
    },
    {
        id: 26,
        q: "Sui’de upgradeable package nasıl yapılır?",
        options: ["Yeniden yüklenir", "Immutable olur", "Upgrade policy ile", "Güncellenemez"],
        correct: 2 // C
    },
    {
        id: 27,
        q: "Sui blockchain'in konsensüsünde kullanılan DAG yapısı nedir?",
        options: ["Doğrusal zincir", "Akış diyagramı", "Directed Acyclic Graph", "Veri tabanı modeli"],
        correct: 2 // C
    },
    {
        id: 28,
        q: "Move’da address tanımlamak için kullanılan veri tipi nedir?",
        options: ["address", "signer", "addr", "key"],
        correct: 0 // A
    },
    {
        id: 29,
        q: "Sui’de transaction digest neyi ifade eder?",
        options: ["Private key", "İşlem özeti", "NFT metadata", "Kullanıcı bilgisi"],
        correct: 1 // B
    },
    {
        id: 30,
        q: "Sui’de package ID değişir mi?",
        options: ["Evet", "Hayır", "Her gün", "Validator’a göre"],
        correct: 1 // B
    },
    {
        id: 31,
        q: "Move’da vector ne için kullanılır?",
        options: ["Çizim", "Veri saklamak (Liste)", "Node listesi", "Gas ölçmek"],
        correct: 1 // B
    },
    {
        id: 32,
        q: "Sui cüzdanları hangi standartları destekler?",
        options: ["ERC", "SUI NS", "Sui Kiosk", "BIP-39"],
        correct: 3 // D
    },
    {
        id: 33,
        q: "Sui’de coin objeleri nasıl transfer edilir?",
        options: ["merge", "split", "transfer", "forge"],
        correct: 2 // C
    },
    {
        id: 34,
        q: "Move modülleri hangi ana başlık altında yazılır?",
        options: ["package", "script", "module", "contract"],
        correct: 2 // C
    },
    {
        id: 35,
        q: "Sui’de mint edilen bir NFT genelde hangi tür obje olur?",
        options: ["Resource", "Struct", "Shared object", "Owned object"],
        correct: 3 // D
    },

    // --- BÖLÜM 3: İleri (36-50) ---
    {
        id: 36,
        q: "Sui’de paralel işlem yürütmeyi mümkün kılan şey nedir?",
        options: ["Global state", "Object dependency graph", "Shared locks", "Static type checker"],
        correct: 1 // B
    },
    {
        id: 37,
        q: "Move’da phantom type parametresi ne işe yarar?",
        options: ["Belleği ürer", "Tür güvenliği arttırır", "Token mint eder", "NFT’ye özellik ekler"],
        correct: 1 // B
    },
    {
        id: 38,
        q: "Sui’nin Narwhal bileşeni ne yapar?",
        options: ["Konsensüs", "Transaction sequencing", "ZK proof", "Governance"],
        correct: 1 // B
    },
    {
        id: 39,
        q: "Bir package upgrade edilebilmesi için ne gerekir?",
        options: ["Owners", "Upgrade Cap", "Sponsor", "Miner"],
        correct: 1 // B
    },
    {
        id: 40,
        q: "Sui’de Kiosk sistemi hangi amaçla kullanılır?",
        options: ["Oyun motoru", "Marketplace altyapısı", "Konsensüs katmanı", "Wallet doğrulaması"],
        correct: 1 // B
    },
    {
        id: 41,
        q: "Move’da signer parametresi neyi temsil eder?",
        options: ["Kullanıcı adresi (ve yetkisi)", "Gas ödeyicisi", "Modül yazarı", "Private key"],
        correct: 0 // A
    },
    {
        id: 42,
        q: "Sui’de bir coin objesi nasıl parçalanır?",
        options: ["destroy", "split", "fork", "clone"],
        correct: 1 // B
    },
    {
        id: 43,
        q: "Sui’de gas budget aşılırsa ne olur?",
        options: ["Devam eder", "İşlem iptal olur", "Log’a yazılır", "Ücret artar"],
        correct: 1 // B
    },
    {
        id: 44,
        q: "Move’da friend keyword’ü ne sağlar?",
        options: ["Fonksiyon paylaşımı", "Modüller arası özel erişim", "Test verisi üretimi", "Kaynak transferi"],
        correct: 1 // B
    },
    {
        id: 45,
        q: "Sui’de stake ödülleri nasıl alınır?",
        options: ["Automatically", "Bir işlem göndererek", "Cüzdan kapanınca", "Yıllık olarak"],
        correct: 1 // B (Actually auto-compounded usually or claimed, prompt says B)
    },
    {
        id: 46,
        q: "Sui üzerinde zincir içi veri depolamanın bir dezavantajı nedir?",
        options: ["Yavaştır", "Kalıcıdır", "Gas maliyeti (Storage Fund)", "Kullanıcı sayısı"],
        correct: 2 // C
    },
    {
        id: 47,
        q: "Move’da borrow_global ne için kullanılır?",
        options: ["Rastgele sayı üretmek", "Global bir resource okumak", "NFT mint etmek", "Kullanıcı adresi hesaplamak"],
        correct: 1 // B
    },
    {
        id: 48,
        q: "Sui üzerinde smart contract testleri nasıl yapılır?",
        options: ["Sui Test Kit", "Move Prover / sui move test", "Jest", "SuiSim"],
        correct: 1 // B
    },
    {
        id: 49,
        q: "Sui Tx üzerinde sponsor mekanizması ne işe yarar?",
        options: ["NFT fiyatlandırma", "Başkasının gas’ını ödemek", "Validator değiştirmek", "Private key üretmek"],
        correct: 1 // B
    },
    {
        id: 50,
        q: "Sui Move’da capability nedir?",
        options: ["Modül adı", "Yetki nesnesi", "Gas hesaplayıcı", "Validator tipi"],
        correct: 1 // B
    }
];

export function getRandomQuestions(count: number) {
    const shuffled = [...ALL_QUESTIONS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}
