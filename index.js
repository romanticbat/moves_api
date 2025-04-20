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
                    levelUpMoves.push(move.move.name);
                }
            });
        });

        // Remove duplicatas
        const uniqueMoves = [...new Set(levelUpMoves)];

        // Ordena por ordem alfabética (se preferir manter a ordem original, remova esta linha)
        uniqueMoves.sort();

        // Formata os nomes dos movimentos e junta com "|"
        const formattedMoves = uniqueMoves.map(formatMoveName).join(";");

        res.json({
            pokemon: pokemonName,
            levelUpMoves: [formattedMoves]
        });

    } catch (error) {
        res.status(404).json({ error: "Pokémon não encontrado ou erro ao buscar dados." });
    }
});

// Função para transformar "heal-pulse" em "Heal-Pulse"
function formatMoveName(name) {
    return name
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join("-");
}

app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
});
