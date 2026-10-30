const sequelize = require("../config/db");
const { DataTypes } = require('sequelize')

const Game = sequelize.define('Game', {
    title: { type: DataTypes.STRING, allowNull: false },
    platforms: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT, allowNull: false },
    authorId: { type: DataTypes.INTEGER, allowNull: false },
    plays: { type: DataTypes.INTEGER, defaultValue: 0 },
    videoUrl: { type: DataTypes.STRING },

    // --- Campos nuevos ---
    subject: { type: DataTypes.STRING },
    grade: { type: DataTypes.STRING },
    gameUrl: { type: DataTypes.STRING(500) },
    coverImage: { type: DataTypes.STRING },
    screenshots: {
        type: DataTypes.TEXT,
        get() {
            const raw = this.getDataValue('screenshots')
            return raw ? JSON.parse(raw) : []
        },
        set(value) {
            this.setDataValue('screenshots', JSON.stringify(value || []))
        }
    },
    gameFile: { type: DataTypes.STRING },
    status: {
        type: DataTypes.ENUM('pendiente', 'publicado', 'rechazado'),
        allowNull: false,
        defaultValue: 'pendiente'
    },
    rejectionReason: { type: DataTypes.TEXT, allowNull: true },
}, {
    timestamps: true,
    modelName: 'Game'
})

module.exports = Game