export default function handler(req, res) {
  // Parametreleri al
  const name = req.query.name || 'Kullanıcı';
  const avatar = (req.query.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png').replace(/"/g, '');
  const rank = req.query.rank || '1';
  const level = req.query.level || '1';
  const currentXp = parseInt(req.query.current) || 0;
  const maxXp = parseInt(req.query.max) || 100;

  // İlerleme çubuğu hesaplama (Maksimum 580px)
  let progressWidth = 580;
  if (maxXp > 0) {
    progressWidth = Math.min((currentXp / maxXp) * 580, 580); 
  }

  // SVG Görsel Kodları
  const svg = `
    <svg width="900" height="250" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="avatarClip">
          <circle cx="125" cy="125" r="90" />
        </clipPath>
      </defs>
      
      <!-- Arka Plan -->
      <rect width="100%" height="100%" fill="#2f3136" rx="16" />
      
      <!-- Avatar ve Çerçeve -->
      <circle cx="125" cy="125" r="90" fill="#ff0000" />
      <image href="${avatar}" x="35" y="35" width="180" height="180" clip-path="url(#avatarClip)" />
      <circle cx="125" cy="125" r="90" fill="none" stroke="#ff3333" stroke-width="6" />

      <!-- Üst Metinler -->
      <text x="350" y="65" font-family="Arial, sans-serif" font-size="34" font-weight="900" fill="#ffffff" letter-spacing="1" text-anchor="middle">
        RANK #${rank}
      </text>
      
      <text x="720" y="65" font-family="Arial, sans-serif" font-size="34" font-weight="900" fill="#ffffff" letter-spacing="1" text-anchor="middle">
        LEVEL ${level}
      </text>

      <!-- Kullanıcı Adı ve XP -->
      <text x="260" y="145" font-family="Arial, sans-serif" font-size="30" font-weight="bold" fill="#ffffff">
        ${name}
      </text>

      <text x="840" y="145" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="end">
        ${currentXp} / ${maxXp}
      </text>

      <!-- Bar Arka Planı -->
      <rect x="260" y="170" width="580" height="34" rx="17" fill="#72767d" />
      
      <!-- Bar Doluluk Kısmı -->
      <rect x="260" y="170" width="${progressWidth}" height="34" rx="17" fill="#ffffff" />
    </svg>
  `;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate');
  res.status(200).send(svg);
}
