require('dotenv').config();
const bcrypt = require('bcrypt');
const sequelize = require('./config/db');
const { User, Game } = require('./models');

async function seed() {
    try {
        console.log('Iniciando seed de la base de datos...');
        await sequelize.authenticate();
        await sequelize.sync({ force: false });

        // 1. Crear o asegurar un usuario administrador
        const adminEmail = 'admin@digitalnight.com';
        let admin = await User.findOne({ where: { email: adminEmail } });

        const hashedPassword = await bcrypt.hash('Admin1234!', 10);

        if (!admin) {
            admin = await User.create({
                firstName: 'Admin',
                lastName: 'DigitalNight',
                email: adminEmail,
                password: hashedPassword,
                bio: 'Administrador oficial de la plataforma educativa DigitalNight.',
                rol: 'admin',
                isPublic: true,
                showEmail: true
            });
            console.log(`Usuario admin creado: ${admin.email}`);
        } else {
            await admin.update({
                rol: 'admin',
                password: hashedPassword
            });
            console.log(`Usuario admin existente actualizado: ${admin.email}`);
        }

        // 2. Sacar los juegos de ejemplo viejos (ya no se usan en la pagina)
        const ejemplosViejos = ['Math Quest: El Reino de los Números', 'EcoPlaneta: Misión Verde', 'Cronos: Viajeros del Tiempo'];
        const borrados = await Game.destroy({ where: { title: ejemplosViejos } });
        if (borrados) console.log(`Juegos de ejemplo viejos borrados: ${borrados}`);

        // 3. Los juegos que hay en la pagina publicada. Se juegan en el navegador (WebAssembly) desde /games/...
        //    Sus carpetas, portadas y capturas estan solo en el server: en otra PC aparecen en el catalogo,
        //    pero para jugarlos hay que entrar a https://digitalnight-react.duckdns.org
        const juegos = [
            {
                title: 'Bad Ice Cream',
                description: 'Sos un helado que tiene que abrirse camino por laberintos congelados y juntar todas las frutas antes de que te atrapen los enemigos. Podés crear y romper bloques de hielo para cerrar o abrir caminos. Tiene 40 niveles y se juega de a 1 o 2 personas en la misma compu. Controles: el jugador 1 camina con las WASD y tira hielo con ESPACIO; el jugador 2 camina con las flechitas y tira hielo con ENTER.',
                subject: 'Programación Orientada a Objetos',
                grade: '5°10°',
                platforms: 'Web / PC',
                gameUrl: '/games/bad-ice-cream/index.html?save=/api/partidas/6&auth=token',
                status: 'publicado',
                authorId: admin.id
            },
            {
                title: 'Entropy Atrophy',
                description: 'Juego de pelea 1 contra 1 en 2D, estilo arcade. Dos luchadores se enfrentan en rondas de 99 segundos: gana la ronda el que deja al otro sin vida, o el que tiene más vida cuando se termina el tiempo, y gana la partida el primero que gana 2 rondas. Hay golpe rápido, patada fuerte, bloqueo y salto, con varios personajes para elegir. Controles: el jugador 1 se mueve con A y D, salta con W, se agacha con S, golpea con F, patea con G y bloquea con H (elige personaje con A/D y confirma con F); el jugador 2 usa las flechas, golpea con N, patea con M y bloquea con ESPACIO (elige con las flechas y confirma con N). Hecho por Hyun Chacon, Lionel Aluci y Jose Luis Mendoza.',
                subject: 'Programación Orientada a Objetos',
                grade: '5°10°',
                platforms: 'Web / PC',
                gameUrl: '/games/entropy-atrophy/index.html',
                status: 'publicado',
                authorId: admin.id
            }
        ];

        for (const gameData of juegos) {
            const existing = await Game.findOne({ where: { title: gameData.title } });
            if (!existing) {
                const juego = await Game.create(gameData);
                // El progreso de Bad Ice Cream se guarda en /api/partidas/<id del juego>: usamos el id real
                if (juego.gameUrl.includes('/api/partidas/')) {
                    await juego.update({ gameUrl: juego.gameUrl.replace(/\/api\/partidas\/\d+/, `/api/partidas/${juego.id}`) });
                }
                console.log(`Juego publicado creado: "${gameData.title}"`);
            } else {
                await existing.update({ status: 'publicado' });
                console.log(`Juego existente actualizado a publicado: "${gameData.title}"`);
            }
        }

        console.log('Seed completado con éxito: 1 usuario admin, Bad Ice Cream y Entropy Atrophy publicados.');
        process.exit(0);
    } catch (error) {
        console.error('Error durante el seed:', error);
        process.exit(1);
    }
}

seed();
