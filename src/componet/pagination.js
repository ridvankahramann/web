import React, { Component } from 'react';

class Pagination extends Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
            aramaSorgusu: '',
            seciliBolum: null
        };
    }

    componentDidMount() {
        fetch("https://rickandmortyapi.com/api/episode")
        .then(res => res.json())
        .then(data => {
            this.setState({ results: data.results });
            const characterURLs = data.results.flatMap(result => result.characters);
            Promise.all(characterURLs.map(url => fetch(url)))
            .then(responses => Promise.all(responses.map(res => res.json())))
            .then(characters => {
                const updatedResults = this.state.results.map((result, index) => {
                    return { ...result, characters: characters.slice(index * 19, (index + 1) * 19) };
                });
                this.setState({ results: updatedResults });
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    }

    handleAramaSorgusuDegisikligi = (event) => {
        this.setState({ aramaSorgusu: event.target.value });
    }

    handleBolumDetaylariGetir = (bolumId) => {
        fetch(`https://rickandmortyapi.com/api/episode/${bolumId}`)
            .then(res => res.json())
            .then(data => {
                this.setState({ seciliBolum: data });
            })
            .catch(err => console.log(err));
    }

    render() {
        const { results, aramaSorgusu } = this.state;
        const filtrelenmisSonuclar = results.filter(res =>
            res.name.toLowerCase().includes(aramaSorgusu.toLowerCase()) ||
            res.characters.some(character =>
                character.name.toLowerCase().includes(aramaSorgusu.toLowerCase()) ||
                character.species.toLowerCase().includes(aramaSorgusu.toLowerCase()) ||
                character.status.toLowerCase().includes(aramaSorgusu.toLowerCase())
            )
        );

        return ( 
            <div className="episode-card">
                <input
                    type="text"
                    placeholder="Bölüm adı, karakter adı, tür veya durum ara..."
                    value={aramaSorgusu}
                    onChange={this.handleAramaSorgusuDegisikligi}
                />
                {filtrelenmisSonuclar.map((res, i) => (
                    <div key={i} className="episode-item">
                        <h2>{res.name}</h2>
                        <button onClick={() => this.handleBolumDetaylariGetir(res.id)}>Detayları Göster</button>
                        <p><strong>Air Date:</strong> {res.air_date}</p>
                        <p><strong>Episode:</strong> {res.episode}</p>
                        <h3>Characters</h3>
                        <ul className="character-list">
                            {res.characters.filter(character =>
                                character && character.species &&
                                (character.name.toLowerCase().includes(aramaSorgusu.toLowerCase()) ||
                                character.species.toLowerCase().includes(aramaSorgusu.toLowerCase()) ||
                                character.status.toLowerCase().includes(aramaSorgusu.toLowerCase()))
                            ).map((character, index) => (
                                <li key={index} className="character-item">
                                    <p><strong>Name:</strong> {character.name}</p>
                                    <p><strong>Species:</strong> {character.species}</p>
                                    <p><strong>Status:</strong> {character.status}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        );
    }
}

export default Pagination;
