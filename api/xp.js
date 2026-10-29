import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // 1. XP EKLEME (Bot her mesaj attığında buraya POST isteği atacak)
  if (req.method === 'POST') {
    const { userId, amount = 1 } = req.body;

    if (!userId) return res.status(400).json({ error: 'userId gerekli' });

    try {
      // Kullanıcının XP'sini çek, yoksa 0'dan başlat
      let userData = await redis.get(`xp:${userId}`) || { xp: 0, level: 1 };
      
      // XP'yi artır
      userData.xp += amount;

      // Seviye atlama mantığı (Her 100 XP'de 1 seviye)
      userData.level = Math.floor(userData.xp / 100) + 1;

      // Veritabanına geri kaydet
      await redis.set(`xp:${userId}`, userData);

      return res.status(200).json({ success: true, data: userData });
    } catch (error) {
      return res.status(500).json({ error: 'XP kaydedilemedi' });
    }
  }

  // 2. XP OKUMA (Kullanıcı !rank yazdığında buradan çekeceğiz)
  if (req.method === 'GET') {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId gerekli' });

    try {
      let userData = await redis.get(`xp:${userId}`) || { xp: 0, level: 1 };
      return res.status(200).json({ success: true, data: userData });
    } catch (error) {
      return res.status(500).json({ error: 'XP çekilemedi' });
    }
  }
}
