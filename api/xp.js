import Redis from 'ioredis';

// Aiven for Valkey bağlantısı (SSL otomatik olarak rediss:// ile sağlanır)
const redis = new Redis(process.env.VALKEY_URL);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // 1. XP EKLEME (POST)
  if (req.method === 'POST') {
    const { userId, amount = 1 } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId gerekli' });

    try {
      let userData = await redis.get(`xp:${userId}`) || { xp: 0, level: 1 };
      userData = typeof userData === 'string' ? JSON.parse(userData) : userData;
      
      userData.xp += amount;
      userData.level = Math.floor(userData.xp / 100) + 1;

      await redis.set(`xp:${userId}`, JSON.stringify(userData));
      return res.status(200).json({ success: true, data: userData });
    } catch (error) {
      console.error("XP Kaydetme Hatası:", error);
      return res.status(500).json({ error: 'XP kaydedilemedi' });
    }
  }

  // 2. XP OKUMA (GET)
  if (req.method === 'GET') {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId gerekli' });

    try {
      let userData = await redis.get(`xp:${userId}`) || { xp: 0, level: 1 };
      userData = typeof userData === 'string' ? JSON.parse(userData) : userData;
      
      return res.status(200).json({ success: true, data: userData });
    } catch (error) {
      console.error("XP Okuma Hatası:", error);
      return res.status(500).json({ error: 'XP çekilemedi' });
    }
  }
}
