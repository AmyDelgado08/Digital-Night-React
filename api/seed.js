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

        // 2. Crear 3 juegos de ejemplo con estado 'publicado'
        const sampleGames = [
            {
                title: 'Math Quest: El Reino de los Números',
                description: 'Aventura educativa donde los estudiantes resuelven acertijos matemáticos, operaciones combinadas y desafíos lógicos para salvar el reino.',
                subject: 'Matemática',
                grade: '3° a 5° Primaria',
                platforms: 'Web / Navegador',
                gameUrl: 'https://scratch.mit.edu',
                status: 'publicado',
                plays: 42,
                authorId: admin.id
            },
            {
                title: 'EcoPlaneta: Misión Verde',
                description: 'Videojuego de concienciación ecológica interactiva. Aprendé a clasificar residuos, proteger ecosistemas y cuidar los recursos naturales.',
                subject: 'Ciencias Naturales',
                grade: '4° a 6° Primaria',
                platforms: 'Web / PC',
                gameUrl: 'https://scratch.mit.edu',
                status: 'publicado',
                plays: 87,
                authorId: admin.id
            },
            {
                title: 'Cronos: Viajeros del Tiempo',
                description: 'Un viaje interactivo a través de los hitos y sucesos históricos más importantes, explorando biografías, líneas temporales y causas históricas.',
                subject: 'Ciencias Sociales e Historia',
                grade: 'Secundaria',
                platforms: 'Web / Multiplataforma',
                gameUrl: 'https://itch.io',
                status: 'publicado',
                plays: 115,
                authorId: admin.id
            }
        ];

        for (const gameData of sampleGames) {
            const existing = await Game.findOne({ where: { title: gameData.title } });
            if (!existing) {
                await Game.create(gameData);
                console.log(`Juego publicado creado: "${gameData.title}"`);
            } else {
                await existing.update({ status: 'publicado', authorId: admin.id });
                console.log(`Juego existente actualizado a publicado: "${gameData.title}"`);
            }
        }

        console.log('Seed completado con éxito: 1 usuario admin y 3 juegos de ejemplo publicados.');
        process.exit(0);
    } catch (error) {
        console.error('Error durante el seed:', error);
        process.exit(1);
    }
}

seed();
