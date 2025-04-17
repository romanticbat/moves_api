const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

app.get("/moves/:pokemon", async (req, res) => {
    const pokemonName = req.params.pokemon.toLowerCase();

    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        const moves = response.data.moves;

        const levelUpMoves = moves
            .filter(move =>
                move.version_group_details.some(detail =>
                    detail.move_learn_method.name === "level-up"
                )
            )
            .map(move => move.move.name) // mantém hífens
            .filter((value, index, self) => self.indexOf(value) === index) // remove duplicatas
            .sort();

        res.json({
            pokemon: pokemonName,
            levelUpMoves
        });
    } catch (error) {
        res.status(404).json({ error: "Pokémon não encontrado ou erro ao buscar dados." });
    }
});

app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
});
