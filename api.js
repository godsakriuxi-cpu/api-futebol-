const express = require('express');
const cors = require('cors');
const Parser = require('rss-parser');

const app = express();
const parser = new Parser();

app.use(cors());

app.get('/noticias', async (req, res) => {
    const feeds = [
        'https://ge.globo.com/dynamo/futebol/rss2.xml',
        'https://rss.uol.com.br/feed/esporte.xml',
        'https://www.espn.com.br/espn/rss/news'
    ];
    let todasNoticias = [];

    for (let url of feeds) {
        try {
            const feed = await parser.parseURL(url);
            const noticias = feed.items.slice(0, 10).map(item => ({
                titulo: item.title,
                link: item.link,
                data: item.pubDate,
                imagem: item.enclosure ? item.enclosure.url : 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
                site: feed.title
            }));
            todasNoticias = todasNoticias.concat(noticias);
        } catch (err) {
            console.log(`Erro ao buscar ${url}, continuando...`);
        }
    }

    todasNoticias.sort((a, b) => new Date(b.data) - new Date(a.data));
    res.json({ sucesso: true, noticias: todasNoticias });
});

app.listen(3000, () => console.log('API rodando em http://localhost:3000/noticias'));
