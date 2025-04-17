const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

app.get("/moves/:pokemon", async (req, res) => {
    const pokemonName = req.params.pokemon.toLowerCase();

    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        const moves = response.data.moves;

        const levelUpMoves = [];

        moves.forEach(move => {
            move.version_group_details.forEach(detail => {
                if (detail.move_learn_method.name === "level-up") {
                    levelUpMoves.push({
                        name: move.move.name,
                        level: detail.level_learned_at
                    });
                }
            });
        });

        // Remove duplicatas mantendo o menor nível aprendido
        const uniqueMoves = {};
        levelUpMoves.forEach(move => {
            if (!uniqueMoves[move.name] || move.level < uniqueMoves[move.name]) {
                uniqueMoves[move.name] = move.level;
            }
        });

        // Ordena por nível e formata como "Move|Level|Move|Level|..."
        const sortedMoves = Object.entries(uniqueMoves)
            .sort((a, b) => a[1] - b[1])
            .map(([name, level]) => `${capitalize(name)}|${level}`); // Com inicial maiúscula

        const finalString = [sortedMoves.join("|")];

        res.json({
            pokemon: pokemonName,
            levelUpMoves: finalString
        });

    } catch (error) {
        res.status(404).json({ error: "Pokémon não encontrado ou erro ao buscar dados." });
    }
});

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
});
