/**
 * Script pour générer les icônes PWA
 * Utilise Canvas pour créer des icônes SVG en différentes tailles
 */

// Fonction pour créer une icône SVG
function createIcon(size) {
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
            <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#gradient)"/>
            <g transform="translate(${size * 0.2}, ${size * 0.2})">
                <path d="M${size * 0.1} ${size * 0.1}h${size * 0.5}v${size * 0.1}H${size * 0.1}z" fill="white" opacity="0.9"/>
                <path d="M${size * 0.1} ${size * 0.25}h${size * 0.4}v${size * 0.05}H${size * 0.1}z" fill="white" opacity="0.7"/>
                <path d="M${size * 0.1} ${size * 0.35}h${size * 0.3}v${size * 0.05}H${size * 0.1}z" fill="white" opacity="0.7"/>
                <path d="M${size * 0.1} ${size * 0.45}h${size * 0.35}v${size * 0.05}H${size * 0.1}z" fill="white" opacity="0.7"/>
            </g>
            <text x="${size * 0.5}" y="${size * 0.85}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${size * 0.08}" font-weight="bold">SF</text>
        </svg>
    `;
    return svg;
}

// Fonction pour convertir SVG en PNG (simulation)
function generateIconFiles() {
    const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
    
    sizes.forEach(size => {
        const svg = createIcon(size);
        console.log(`Icône ${size}x${size} générée:`);
        console.log(`Fichier: icon-${size}x${size}.png`);
        console.log(`SVG: ${svg}`);
        console.log('---');
    });
    
    console.log('Instructions pour générer les vraies icônes PNG:');
    console.log('1. Utilisez un outil comme Inkscape ou un service en ligne');
    console.log('2. Convertissez chaque SVG en PNG à la taille correspondante');
    console.log('3. Placez les fichiers dans le dossier src/icons/');
    console.log('4. Nommez-les: icon-72x72.png, icon-96x96.png, etc.');
}

// Générer les icônes
generateIconFiles();
